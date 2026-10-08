/**
 * MedSafe AI Clinical Assistant & Prescription Safety Bot
 * Context-aware chatbot powered by RxNorm, openFDA, and active patient profile data.
 * Features voice read-out (TTS), prompt chips, and real-time clinical answers.
 */

import React, { useState, useRef, useEffect } from "react";
import { useMedSafe } from "../context/MedSafeContext";
import { DRUG_DATABASE, INTERACTION_RULES } from "../data/drugDatabase";
import { askGeminiClinicalAI, getGeminiStatus } from "../utils/geminiAI";
import { 
  Bot, 
  Send, 
  Volume2, 
  Sparkles, 
  User, 
  ShieldCheck, 
  AlertTriangle, 
  Pill, 
  RotateCcw,
  Info,
  Cpu
} from "lucide-react";

export default function AIBotView() {
  const { 
    activeProfile, 
    medications, 
    interactions, 
    duplicateWarnings, 
    speak, 
    language,
    setCurrentTab,
    t
  } = useMedSafe();

  const getBotGreeting = () => {
    if (language === "hi") {
      return `नमस्ते! मैं आपका मेडो-सेफ एआई क्लिनिकल सहायक हूँ। मैं ${activeProfile.name} की ${medications.length} दवाइयों की सुरक्षा की निगरानी कर रहा हूँ। आज मैं आपकी दवाओं, सुरक्षा जांच या खुराक के समय के बारे में क्या सहायता कर सकता हूँ?`;
    } else if (language === "mr") {
      return `नमस्कार! मी आपला मेडो-सेफ एआई क्लिनिकल सहाय्यक आहे. मी ${activeProfile.name} यांच्या ${medications.length} औषधांची सुरक्षितता तपासत आहे. मी कशी मदत करू?`;
    } else if (language === "ta") {
      return `வணக்கம்! நான் உங்கள் MedSafe AI மருத்துவ உதவியாளர். நான் ${activeProfile.name}-ன் ${medications.length} மருந்துகளை கண்காணிக்கிறேன். உங்களுக்கு எவ்வாறு உதவ முடியும்?`;
    } else if (language === "te") {
      return `నమస్కారం! నేను మీ MedSafe AI క్లినికల్ అసిస్టెంట్‌ని. నేను ${activeProfile.name} యొక్క ${medications.length} మందులను పర్యవేక్షిస్తున్నాను. మీకు ఎలా సహాయం చేయగలను?`;
    }
    return `Hello! I am your MedSafe Clinical AI Assistant. I am actively monitoring ${medications.length} medications for ${activeProfile.name} (${activeProfile.age} yrs). How can I assist you with your prescriptions, safety contraindications, or dose timings today?`;
  };

  const [messages, setMessages] = useState([
    {
      id: "msg-1",
      sender: "bot",
      text: getBotGreeting(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const QUICK_PROMPTS = language === "hi" ? [
    "💬 आज आप कैसे हैं?",
    "💊 क्या मेरी वर्तमान दवाइयां एक साथ सुरक्षित हैं?",
    "🤕 सिरदर्द के लिए क्या करना चाहिए?",
    "🥗 ब्लड प्रेशर के लिए खान-पान सलाह",
    "⏰ अगर कोई खुराक छूट जाए तो क्या करें?",
    "💧 दवा के साथ कितना पानी पीना चाहिए?",
    "🌙 अच्छी नींद और विश्राम के उपाय"
  ] : language === "mr" ? [
    "💬 आज कसे आहात?",
    "💊 माझी औषधे एकत्र घेणे सुरक्षित आहे का?",
    "🤕 डोकेदुखीसाठी काय करावे?",
    "🥗 बीपी नियंत्रणासाठी आहाराचे नियम",
    "⏰ डोस चुकला तर काय करावे?",
    "💧 औषधासोबत किती पाणी प्यावे?"
  ] : language === "ta" ? [
    "💬 நலமாக இருக்கிறீர்களா?",
    "💊 என் மருந்துகள் பாதுகாப்பானவையா?",
    "🤕 தலைவலிக்கு என்ன செய்ய வேண்டும்?",
    "🥗 இரத்த அழுத்தத்திற்கான உணவு குறிப்புகள்",
    "⏰ மருந்து தவறினால் என்ன செய்வது?"
  ] : language === "te" ? [
    "💬 ఈ రోజు ఎలా ఉన్నారు?",
    "💊 నా మందులు సురక్షితమైనవేనా?",
    "🤕 తలనొప్పికి ఏమి చేయాలి?",
    "🥗 రక్తపోటుకు ఆహార చిట్కాలు",
    "⏰ డోస్ మిస్సయితే ఏమి చేయాలి?"
  ] : [
    "💬 How are you doing today?",
    "💊 Are my current prescriptions safe together?",
    "🤕 What should I do for a mild headache?",
    "🥗 What diet tips help with blood pressure?",
    "⏰ What should I do if I miss a dose?",
    "💧 How much water should I drink with pills?",
    "🌙 Tips for better sleep and relaxation"
  ];

  /**
   * Conversational & Clinical AI Response Engine
   * Understands natural chit-chat, symptoms, wellness advice, and prescription safety.
   */
  const generateAIResponse = (userText) => {
    const text = userText.toLowerCase().trim();

    // HINDI RESPONSES
    if (language === "hi") {
      if (text === "hi" || text === "hello" || text === "hey" || text.includes("namaste") || text.includes("नमस्ते") || text.includes("शुभ प्रभात")) {
        return `नमस्ते! आपसे बात करके बहुत अच्छा लगा। मैं आपका मेडो-सेफ स्वास्थ्य एवं दवा सहायक हूँ। मैं ${activeProfile.name} की दवाओं और स्वास्थ्य पर सक्रिय निगरानी रख रहा हूँ। आज आपकी सेहत कैसी है? मुझसे अपनी दवाओं या स्वास्थ्य के बारे में बेझिझक पूछें!`;
      }
      if (text.includes("how are you") || text.includes("kaise ho") || text.includes("kya haal") || text.includes("कैसे हो") || text.includes("कैसे हैं")) {
        return `मैं बहुत अच्छा हूँ, पूछने के लिए धन्यवाद! 😊 मैं 24/7 आपकी दवा सुरक्षा की निगरानी के लिए तैयार हूँ। आपका दिन कैसा बीत रहा है? क्या आप किसी दवा या लक्षण के बारे में जानना चाहते हैं?`;
      }
      if (text.includes("headache") || text.includes("sir dard") || text.includes("सिर दर्द") || text.includes("दर्द")) {
        return `हल्के सिरदर्द के लिए: 1) एक बड़ा गिलास पानी पिएं (पानी की कमी सिरदर्द का मुख्य कारण है), 2) शांत और हल्के प्रकाश वाले कमरे में आराम करें, 3) माथे पर ठंडी पट्टी रखें। यदि आप खून पतला करने वाली दवा (जैसे वारफेरिन/एस्पिरिन) ले रहे हैं, तो डॉक्टर की सलाह के बिना कॉम्बीफ्लेम न लें; सादा पैरासिटामोल अधिक सुरक्षित है। यदि सिरदर्द अचानक और बहुत तेज हो, तो तुरंत डॉक्टर को दिखाएं।`;
      }
      if (text.includes("fever") || text.includes("bukhar") || text.includes("बुखार") || text.includes("सर्दी") || text.includes("जुकाम")) {
        return `बुखार और सर्दी के लिए: पर्याप्त मात्रा में गुनगुना पानी, हर्बल काढ़ा या सूप लें और पूरा आराम करें। बुखार कम करने के लिए सादा पैरासिटामोल (500mg-650mg) लिया जा सकता है। ध्यान रखें कि एक साथ कई दवाओं में पैरासिटामोल का दोहराव न हो ताकि लिवर पर दबाव न पड़े। यदि बुखार 3 दिन से अधिक रहे, तो डॉक्टर से परामर्श लें।`;
      }
      if (text.includes("dizzy") || text.includes("chakkar") || text.includes("चक्कर")) {
        return `⚠️ यदि आपको चक्कर आ रहे हैं: तुरंत बैठ या लेट जाएं ताकि गिरने का खतरा न हो। धीरे-धीरे एक गिलास पानी पिएं और झटके से खड़े न हों। दवा लेने के बाद अचानक बीपी कम होने या शुगर कम होने से चक्कर आ सकते हैं। यदि यह बार-बार हो, तो अपने डॉक्टर को तुरंत बताएं।`;
      }
      if (text.includes("blood pressure") || text.includes("bp") || text.includes("ब्लड प्रेशर") || text.includes("बीपी") || text.includes("हार्ट")) {
        return `स्वस्थ ब्लड प्रेशर प्रबंधन हेतु:\n\n• नमक नियंत्रण: दिनभर में नमक 1 छोटी चम्मच (2000mg) से कम रखें।\n• दैनिक टहलना: 20-30 मिनट की हल्की सैर दिल को मजबूत रखती है।\n• समय की पाबंदी: अपनी बीपी की दवा प्रतिदिन एक ही निश्चित समय पर लें।\n• तनाव मुक्ति: तनाव महसूस होने पर 5 मिनट गहरी सांस लेने का अभ्यास करें।`;
      }
      if (text.includes("miss") || text.includes("छूट") || text.includes("भूल") || text.includes("देर")) {
        return `यदि कोई खुराक छूट जाए: याद आते ही दवा लें, बशर्ते अगली खुराक का समय नजदीक न हो। कभी भी एक साथ दो खुराक न लें। मेडो-सेफ का दैनिक टाइमलाइन सुरक्षित अंतर बनाए रखने के लिए अगली खुराक का समय अपने आप आगे बढ़ा देता है।`;
      }
      if (text.includes("safe") || text.includes("सुरक्षित") || text.includes("टकराव") || text.includes("खतरा")) {
        if (medications.length === 0) {
          return `वर्तमान में आपकी सक्रिय सूची में कोई दवा नहीं है। आप 'स्कैन व सत्यापन' टैब से दवाइयों की फोटो जोड़ सकते हैं ताकि मैं उनकी सुरक्षा जांच कर सकूं।`;
        }
        if (interactions.length > 0) {
          return `⚠️ सावधानी: आपकी दवाओं में ${interactions.length} टकराव पाया गया है। कृपया सुरक्षा जांच टैब देखें और डॉक्टर से परामर्श लें।`;
        }
        return `✅ आपकी सभी ${medications.length} सक्रिय दवाइयां सुरक्षित पाई गई हैं और कोई गंभीर टकराव नहीं मिला है।`;
      }
      return `यह आपके स्वास्थ्य से जुड़ा बहुत महत्वपूर्ण प्रश्न है! ${activeProfile.name} के लिए नियमित रूप से समय पर दवाइयां लेना, पर्याप्त पानी पीना और स्वस्थ आहार बनाए रखना दीर्घकालिक स्वास्थ्य की कुंजी है। आप मुझसे किसी भी लक्षण, खुराक या दवा के बारे में और पूछ सकते हैं!`;
    }

    // ENGLISH & DEFAULT RESPONSES
    // 1. GREETINGS & CASUAL CONVERSATION
    if (text === "hi" || text === "hello" || text === "hey" || text.includes("namaste") || text.includes("good morning") || text.includes("good evening")) {
      return `Hello! It is wonderful to chat with you today. I am your MedSafe Clinical & Health Assistant. I am actively keeping track of prescriptions for ${activeProfile.name}. How are you feeling today? Feel free to ask me anything about your health, daily habits, or medicines!`;
    }

    if (text.includes("how are you") || text.includes("kaise ho") || text.includes("kya haal") || text.includes("how r u")) {
      return `I'm doing great, thank you so much for asking! 😊 I'm right here 24/7 monitoring prescription safety and ready to chat. How is your day going? Are you experiencing any health symptoms or feeling well?`;
    }

    if (text.includes("who are you") || text.includes("what can you do") || text.includes("aap kaun") || text.includes("introduce")) {
      return `I am your MedSafe AI Assistant! Here is what we can discuss:\n\n1. 💊 Prescription Safety: Check interactions and duplicate overdoses.\n2. 🏥 Health & Symptoms: Guidance for headaches, acidity, dizziness, fever, BP, or diabetes.\n3. 🥗 Diet & Lifestyle: Nutrition tips, water intake, safe exercise, and sleep hygiene.\n4. 💬 Friendly Chat: I'm here to listen, answer your everyday wellness questions, and keep you safe.\n\nWhat would you like to talk about?`;
    }

    if (text.includes("thank") || text.includes("thanks") || text.includes("shukriya") || text.includes("dhanyawad")) {
      return `You are very welcome! 😊 I'm always here to support your health journey. Please don't hesitate to reach out whenever you have questions or just want to check on your wellness.`;
    }

    // 2. HEADACHE & PAIN
    if (text.includes("headache") || text.includes("sir dard") || text.includes("head ache") || text.includes("migraine")) {
      return "For a mild headache: 1) Drink a large glass of water (mild dehydration is the #1 trigger), 2) Rest in a quiet, dimly lit room, 3) Apply a cool compress to your forehead. If you are taking blood thinners like Warfarin or Aspirin, avoid NSAIDs like Combiflam/Ibuprofen without doctor approval. Plain low-dose Paracetamol is generally safer. If your headache is unusually sudden, severe, or accompanied by blurred vision, seek immediate medical care.";
    }

    // 3. FEVER & COLD
    if (text.includes("fever") || text.includes("bukhar") || text.includes("cold") || text.includes("cough") || text.includes("khansi")) {
      return "For fever and cold symptoms: Stay well-hydrated with warm fluids (herbal teas, warm water, broths) and get plenty of rest. Plain Paracetamol (500mg - 650mg) is commonly used to lower fever. Make sure you don't take multiple combination cold syrups containing hidden Paracetamol to avoid liver strain. If your temperature exceeds 102°F or lasts more than 3 days, please consult your doctor.";
    }

    // 4. DIZZINESS & FAINTING
    if (text.includes("dizzy") || text.includes("dizziness") || text.includes("chakkar") || text.includes("faint")) {
      return "⚠️ If you are feeling dizzy: Sit or lie down immediately to avoid falls. Drink a glass of water slowly and avoid standing up rapidly (orthostatic hypotension). Dizziness can happen if blood pressure drops too quickly after medication or if blood sugar is low. If this happens frequently, let your caregiver or doctor know so they can check your dosage.";
    }

    // 5. ACIDITY, GAS & STOMACH ISSUES
    if (text.includes("acidity") || text.includes("gas") || text.includes("heartburn") || text.includes("stomach") || text.includes("pet dard") || text.includes("constipation")) {
      return "For acidity and digestive comfort: 1) Avoid heavy, spicy, fried foods and caffeine, 2) Do not lie down immediately after eating, 3) If you are prescribed antacids or PPIs (like Pantoprazole/Omeprazole), take them 30-60 minutes before your morning meal on an empty stomach for maximum protection. Gentle walks after meals also assist digestion.";
    }

    // 6. BLOOD PRESSURE & HEART HEALTH
    if (text.includes("blood pressure") || text.includes("bp") || text.includes("hypertension") || text.includes("heart")) {
      return `For healthy blood pressure management (especially for ${activeProfile.name}):\n\n• Sodium Control: Keep daily salt intake under 2,000 mg (about 1 teaspoon).\n• Regular Activity: 20-30 minutes of gentle daily walking strengthens cardiac muscles.\n• Timing: Take your blood pressure medications consistently at the exact same hour each day.\n• Stress Relief: Practice 5 minutes of slow, rhythmic breathing when feeling tense.`;
    }

    // 7. DIABETES & BLOOD SUGAR
    if (text.includes("diabetes") || text.includes("sugar") || text.includes("glucose") || text.includes("insulin")) {
      return "For balanced blood sugar: 1) Eat complex, high-fiber carbs (whole grains, oats, green vegetables), 2) Avoid sugary sodas and fruit juices which spike insulin, 3) Take medications like Metformin with meals to reduce gastrointestinal upset, 4) Keep a light healthy snack nearby if you ever experience shakiness or cold sweats from low sugar.";
    }

    // 8. SLEEP & RELAXATION
    if (text.includes("sleep") || text.includes("insomnia") || text.includes("neend") || text.includes("tired") || text.includes("fatigue")) {
      return "Tips for deeper, restorative sleep: 1) Keep your bedroom cool, quiet, and dark, 2) Stop looking at mobile screens 30-45 minutes before sleeping, 3) Avoid caffeine after 3 PM, 4) Practice gentle diaphragmatic breathing (inhale 4s, exhale 6s) while lying down to calm the nervous system.";
    }

    // 9. WATER & HYDRATION
    if (text.includes("water") || text.includes("hydration") || text.includes("paani") || text.includes("drink")) {
      return "General recommendation is 2 to 2.5 liters (8-10 glasses) of water daily. Hydration keeps kidneys healthy, helps medicines metabolize smoothly, and prevents lightheadedness. Always swallow whole tablets with a full glass of room-temperature water rather than just a tiny sip.";
    }

    // 10. ANXIETY, STRESS & EMOTIONAL WELLNESS
    if (text.includes("stress") || text.includes("anxious") || text.includes("anxiety") || text.includes("scared") || text.includes("worried") || text.includes("tension") || text.includes("sad")) {
      return "I hear you. Managing health and daily prescriptions can feel overwhelming at times, and it is completely normal to feel this way. Take a slow, comforting breath. You are taking great care of yourself by staying informed, and MedSafe is actively looking out for your safety. Is there a specific medicine or symptom that is worrying you?";
    }

    // 11. PRESCRIPTION SAFETY CROSS-CHECKS
    if (text.includes("safe") || text.includes("conflict") || text.includes("interaction") || text.includes("together")) {
      if (medications.length === 0) {
        return "You currently have no medications in your active pool. You can upload prescription photos in the 'Scan & Verify' tab or add them from 'Drug Knowledge' so I can analyze pairwise interactions for you.";
      }
      if (interactions.length > 0 || duplicateWarnings.length > 0) {
        const crit = interactions.filter(i => i.severity === "critical");
        if (crit.length > 0) {
          return `⚠️ CAUTION: I detected ${crit.length} Critical Contraindication(s) in your active pool: ${crit.map(c => `${c.drugA} + ${c.drugB} (${c.titleEn})`).join("; ")}. Please consult your cardiologist or doctor before taking these together.`;
        }
        return `I found moderate cautions in your prescription list. Review the Safety Checks tab to see specific timing and meal separation recommendations.`;
      }
      return `✅ All your ${medications.length} active prescriptions (${medications.map(m => m.brandName).join(", ")}) have been cross-checked against the RxNorm interaction database and no severe contraindications were detected.`;
    }

    if (text.includes("warfarin") || text.includes("aspirin") || text.includes("blood thinner")) {
      return "Warfarin and Aspirin (or NSAIDs like Combiflam/Ibuprofen) both thin the blood through different biological pathways. Taking them together significantly increases the risk of serious gastrointestinal bleeding and brain hemorrhage. For mild pain or fever, doctors typically recommend low-dose plain Paracetamol (under 2,000 mg/day) with medical supervision.";
    }

    if (text.includes("miss") || text.includes("forgot") || text.includes("late")) {
      return "If you miss a dose: Take it as soon as you remember, unless it is almost time for your next scheduled dose. Never take two doses at the same time to make up for a missed dose. MedSafe's Daily Timeline dynamically shifts subsequent doses to maintain your required 6 to 8-hour safety window.";
    }

    if (text.includes("pantoprazole") || text.includes("empty stomach") || text.includes("pan 40") || text.includes("pan-d")) {
      return "Pantoprazole and PPI antacids must be taken on an empty stomach 30 to 60 minutes before your morning meal. They require active gastric acid pumps during meals to bind effectively and provide all-day acid suppression.";
    }

    if (text.includes("ciprofloxacin") || text.includes("milk") || text.includes("calcium") || text.includes("dairy")) {
      return "Calcium in dairy products (milk, yogurt) and minerals in antacids bind to Ciprofloxacin, reducing antibiotic absorption in your gut by up to 75%. Always separate dairy or antacids by at least 2 hours before or after taking Ciprofloxacin.";
    }

    // 12. GENERAL HEALTHCARE & OPEN-ENDED ADVICE
    return `That's a thoughtful question regarding your health! For ${activeProfile.name} (${activeProfile.age} yrs), maintaining consistent daily habits, staying hydrated, taking medicines on time, and regular checkups are key to long-term wellness. Feel free to ask me more specific questions about symptoms, diet, or prescription timing!`;
  };

  const handleSendMessage = async (textToSend = null) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery("");
    setIsTyping(true);

    try {
      // Call Google Gemini 3.5 AI live endpoint with patient context
      const geminiResult = await askGeminiClinicalAI({
        userQuery: query,
        activeProfile,
        medications,
        interactions,
        duplicateWarnings,
        language
      });

      const responseText = geminiResult.success && geminiResult.text
        ? geminiResult.text
        : generateAIResponse(query);

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: responseText,
        source: geminiResult.success ? "Google Gemini 3.5 AI" : "MedSafe Clinical Engine",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      const fallbackResponse = generateAIResponse(query);
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: fallbackResponse,
        source: "MedSafe Clinical Engine",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceListen = (text) => {
    speak(text, language);
  };

  return (
    <div className="dashboard-page-container" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <h2 className="section-headline-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <Bot size={28} style={{ color: "var(--teal-accent)" }} />
            <span>{t.aiBotTitle || "MedSafe AI Clinical Assistant"}</span>
            <span style={{ 
              fontSize: "0.72rem", 
              background: "rgba(14, 165, 233, 0.12)", 
              color: "#0284c7", 
              padding: "2px 8px", 
              borderRadius: "12px", 
              border: "1px solid rgba(14, 165, 233, 0.3)",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: "4px"
            }}>
              <Sparkles size={12} />
              Google Gemini 3.5 Connected
            </span>
            <span style={{ 
              fontSize: "0.72rem", 
              background: "rgba(13, 148, 136, 0.1)", 
              color: "var(--teal-accent)", 
              padding: "2px 8px", 
              borderRadius: "12px", 
              border: "1px solid rgba(13, 148, 136, 0.25)",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: "4px"
            }}>
              <Volume2 size={12} />
              {t.voiceActiveBadge || "ElevenLabs AI Voice Active"}
            </span>
          </h2>
          <p className="section-headline-sub">
            {t.aiBotSub || "Real-time prescription safety Q&A, contraindication insights, and dosage guidance"} for {activeProfile.name}.
          </p>
        </div>

        <button
          className="control-btn"
          onClick={() => {
            setMessages([
              {
                id: `msg-${Date.now()}`,
                sender: "bot",
                text: `Conversation reset. How can I assist you with your prescriptions?`,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              }
            ]);
          }}
          title="Reset chat"
        >
          <RotateCcw size={15} />
          <span>{t.resetChatBtn || "Reset Chat"}</span>
        </button>
      </div>

      {/* Suggested Prompt Chips */}
      <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.5rem", marginBottom: "0.75rem" }}>
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            className="control-btn"
            style={{ fontSize: "0.78rem", whiteSpace: "nowrap", background: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}
            onClick={() => handleSendMessage(prompt)}
          >
            <Sparkles size={13} style={{ color: "var(--teal-accent)" }} />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div 
        className="card-container" 
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginBottom: "1rem",
          background: "var(--bg-page)"
        }}
      >
        {messages.map(msg => {
          const isBot = msg.sender === "bot";
          return (
            <div
              key={msg.id}
              style={{
                display: "flex",
                gap: "0.75rem",
                alignItems: "flex-start",
                alignSelf: isBot ? "flex-start" : "flex-end",
                maxWidth: "80%"
              }}
            >
              {isBot && (
                <div style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: "var(--primary)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  <Bot size={18} />
                </div>
              )}

              <div style={{
                background: isBot ? "var(--bg-surface)" : "var(--primary)",
                color: isBot ? "var(--text-main)" : "#ffffff",
                padding: "0.85rem 1rem",
                borderRadius: "12px",
                borderTopLeftRadius: isBot ? "2px" : "12px",
                borderTopRightRadius: isBot ? "12px" : "2px",
                boxShadow: "var(--shadow-sm)",
                border: isBot ? "1.5px solid var(--border-subtle)" : "none"
              }}>
                <div style={{ fontSize: "0.92rem", lineHeight: 1.5, color: isBot ? "var(--text-main)" : "#ffffff" }}>
                  {msg.text}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.4rem", paddingTop: "0.3rem", borderTop: isBot ? "1px solid var(--border-subtle)" : "1px solid rgba(255,255,255,0.2)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "0.7rem", opacity: 0.7, color: isBot ? "var(--text-muted)" : "rgba(255,255,255,0.8)" }}>
                      {msg.timestamp}
                    </span>
                    {isBot && msg.source && (
                      <span style={{ fontSize: "0.65rem", background: "rgba(14, 165, 233, 0.12)", color: "#0284c7", padding: "1px 5px", borderRadius: "4px", fontWeight: 700 }}>
                        ✨ {msg.source}
                      </span>
                    )}
                  </div>

                  {isBot && (
                    <button
                      onClick={() => handleVoiceListen(msg.text)}
                      style={{ background: "none", border: "none", color: "var(--teal-accent)", padding: "2px", cursor: "pointer", display: "flex", alignItems: "center", gap: "3px", fontSize: "0.72rem", fontWeight: 700 }}
                      title="Listen to this answer"
                    >
                      <Volume2 size={13} />
                      <span>{t.readAloud || "Listen"}</span>
                    </button>
                  )}
                </div>
              </div>

              {!isBot && (
                <div style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: "var(--teal-accent)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  <User size={18} />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bot size={18} />
            </div>
            <div style={{ background: "var(--bg-surface)", padding: "0.6rem 1rem", borderRadius: "12px", border: "1.5px solid var(--border-subtle)", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Analyzing RxNorm clinical database...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        style={{ display: "flex", gap: "0.75rem", background: "var(--bg-surface)", padding: "0.5rem", borderRadius: "10px", border: "1.5px solid var(--border-medium)" }}
      >
        <input
          type="text"
          placeholder={t.askAIPlaceholder || "Ask a question about your medicines, dosages, side effects, or safety..."}
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: "0.95rem",
            padding: "0.4rem 0.6rem",
            background: "transparent",
            color: "var(--text-main)"
          }}
        />
        <button
          type="submit"
          className="btn-primary"
          style={{ minHeight: "auto", padding: "0.6rem 1.25rem" }}
        >
          <Send size={16} />
          <span>{t.askAIBtn || "Ask AI"}</span>
        </button>
      </form>
    </div>
  );
}
