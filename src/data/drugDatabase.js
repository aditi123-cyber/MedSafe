/**
 * MedSafe Clinical Knowledge Base
 * Drug Database, Indian Brand-to-Generic Mappings, Interaction Graph & Rules
 * Adheres to SIH PRD specifications, RxNorm, and openFDA datasets.
 */

export const DRUG_DATABASE = [
  {
    brandName: "Warf 5",
    genericName: "Warfarin",
    strength: "5 mg",
    form: "Tablet",
    therapeuticClass: "Anticoagulant (Blood Thinner)",
    defaultFrequency: "0-0-1", // Once daily at bedtime
    defaultTiming: "Night (Before Bed)",
    mealInstruction: "Same time every evening, avoid vitamin K fluctuations",
    minGapHours: 24,
    maxDailyDoseMg: 10,
    tags: ["cardiac", "critical-care", "narrow-therapeutic-index"],
  },
  {
    brandName: "Ecosprin 75",
    genericName: "Aspirin",
    strength: "75 mg",
    form: "Tablet",
    therapeuticClass: "Antiplatelet / NSAID",
    defaultFrequency: "1-0-0",
    defaultTiming: "Morning",
    mealInstruction: "After food to prevent stomach irritation",
    minGapHours: 24,
    maxDailyDoseMg: 325,
    tags: ["cardiac", "nsaid"],
  },
  {
    brandName: "Dolo 650",
    genericName: "Paracetamol",
    strength: "650 mg",
    form: "Tablet",
    therapeuticClass: "Antipyretic / Analgesic",
    defaultFrequency: "1-0-1",
    defaultTiming: "Morning & Night",
    mealInstruction: "With or after food",
    minGapHours: 6,
    maxDailyDoseMg: 4000,
    tags: ["pain", "fever", "otc"],
  },
  {
    brandName: "Crocin Advance",
    genericName: "Paracetamol",
    strength: "500 mg",
    form: "Tablet",
    therapeuticClass: "Antipyretic / Analgesic",
    defaultFrequency: "1-0-1",
    defaultTiming: "Morning & Night",
    mealInstruction: "With or after food",
    minGapHours: 6,
    maxDailyDoseMg: 4000,
    tags: ["pain", "fever", "otc"],
  },
  {
    brandName: "Combiflam",
    genericName: "Ibuprofen + Paracetamol",
    strength: "400 mg + 325 mg",
    form: "Tablet",
    therapeuticClass: "NSAID + Analgesic Combination",
    defaultFrequency: "1-0-1",
    defaultTiming: "Morning & Night",
    mealInstruction: "Strictly after food with a full glass of water",
    minGapHours: 8,
    maxDailyDoseMg: 1200, // Ibuprofen component
    tags: ["pain", "nsaid", "duplicate-risk"],
  },
  {
    brandName: "Glycomet 500",
    genericName: "Metformin",
    strength: "500 mg",
    form: "Tablet",
    therapeuticClass: "Antidiabetic (Biguanide)",
    defaultFrequency: "1-0-1",
    defaultTiming: "Morning & Night",
    mealInstruction: "With meals to reduce gastrointestinal upset",
    minGapHours: 10,
    maxDailyDoseMg: 2000,
    tags: ["diabetes", "chronic"],
  },
  {
    brandName: "Atorva 20",
    genericName: "Atorvastatin",
    strength: "20 mg",
    form: "Tablet",
    therapeuticClass: "HMG-CoA Reductase Inhibitor (Statin)",
    defaultFrequency: "0-0-1",
    defaultTiming: "Night",
    mealInstruction: "At bedtime, with or without food",
    minGapHours: 24,
    maxDailyDoseMg: 80,
    tags: ["cardiac", "cholesterol"],
  },
  {
    brandName: "Telma 40",
    genericName: "Telmisartan",
    strength: "40 mg",
    form: "Tablet",
    therapeuticClass: "Angiotensin II Receptor Blocker (ARB)",
    defaultFrequency: "1-0-0",
    defaultTiming: "Morning",
    mealInstruction: "Consistent time each day with water",
    minGapHours: 24,
    maxDailyDoseMg: 80,
    tags: ["hypertension", "cardiac"],
  },
  {
    brandName: "Augmentin 625 Duo",
    genericName: "Amoxicillin + Clavulanic Acid",
    strength: "625 mg",
    form: "Tablet",
    therapeuticClass: "Broad Spectrum Antibiotic",
    defaultFrequency: "1-0-1",
    defaultTiming: "Morning & Night",
    mealInstruction: "At the start of a meal for optimal absorption",
    minGapHours: 12,
    maxDailyDoseMg: 2000,
    tags: ["antibiotic", "infection"],
  },
  {
    brandName: "Pan 40",
    genericName: "Pantoprazole",
    strength: "40 mg",
    form: "Tablet",
    therapeuticClass: "Proton Pump Inhibitor (Antacid)",
    defaultFrequency: "1-0-0",
    defaultTiming: "Morning (Empty Stomach)",
    mealInstruction: "30-60 minutes before breakfast",
    minGapHours: 24,
    maxDailyDoseMg: 80,
    tags: ["gastro", "antacid"],
  },
  {
    brandName: "Pan-D",
    genericName: "Pantoprazole + Domperidone",
    strength: "40 mg + 30 mg",
    form: "Capsule",
    therapeuticClass: "PPI + Prokinetic",
    defaultFrequency: "1-0-0",
    defaultTiming: "Morning (Empty Stomach)",
    mealInstruction: "30 minutes before first meal",
    minGapHours: 24,
    maxDailyDoseMg: 80,
    tags: ["gastro", "acid-reflux"],
  },
  {
    brandName: "Sorbitrate 10",
    genericName: "Isosorbide Dinitrate",
    strength: "10 mg",
    form: "Tablet",
    therapeuticClass: "Vasodilator / Nitrate",
    defaultFrequency: "1-0-1",
    defaultTiming: "Morning & Evening",
    mealInstruction: "On empty stomach or 1 hr before meals",
    minGapHours: 8,
    maxDailyDoseMg: 120,
    tags: ["cardiac", "angina", "nitrate"],
  },
  {
    brandName: "Manforce 50",
    genericName: "Sildenafil",
    strength: "50 mg",
    form: "Tablet",
    therapeuticClass: "PDE5 Inhibitor",
    defaultFrequency: "PRN (As Needed)",
    defaultTiming: "As needed",
    mealInstruction: "30-60 minutes before planned activity",
    minGapHours: 24,
    maxDailyDoseMg: 100,
    tags: ["pde5-inhibitor"],
  },
  {
    brandName: "Folitrax 10",
    genericName: "Methotrexate",
    strength: "10 mg",
    form: "Tablet",
    therapeuticClass: "DMARD / Immunosuppressant",
    defaultFrequency: "Weekly (Once a week)",
    defaultTiming: "Designated Day",
    mealInstruction: "Take with food on the same designated day each week",
    minGapHours: 168, // 7 days
    maxDailyDoseMg: 25,
    tags: ["rheumatology", "high-alert"],
  },
  {
    brandName: "Deplatt 75",
    genericName: "Clopidogrel",
    strength: "75 mg",
    form: "Tablet",
    therapeuticClass: "Antiplatelet",
    defaultFrequency: "1-0-0",
    defaultTiming: "Morning",
    mealInstruction: "With or without food",
    minGapHours: 24,
    maxDailyDoseMg: 75,
    tags: ["cardiac", "antiplatelet"],
  },
  {
    brandName: "Thyronorm 50",
    genericName: "Levothyroxine",
    strength: "50 mcg",
    form: "Tablet",
    therapeuticClass: "Thyroid Hormone",
    defaultFrequency: "1-0-0",
    defaultTiming: "Early Morning",
    mealInstruction: "Strictly empty stomach with plain water, 45 mins before tea/breakfast",
    minGapHours: 24,
    maxDailyDoseMg: 200,
    tags: ["thyroid", "empty-stomach"],
  },
  {
    brandName: "Ciplox 500",
    genericName: "Ciprofloxacin",
    strength: "500 mg",
    form: "Tablet",
    therapeuticClass: "Fluoroquinolone Antibiotic",
    defaultFrequency: "1-0-1",
    defaultTiming: "Morning & Night",
    mealInstruction: "2 hours before or after dairy, antacids, or iron supplements",
    minGapHours: 12,
    maxDailyDoseMg: 1500,
    tags: ["antibiotic", "infection"],
  },
  {
    brandName: "Potklor Syrup",
    genericName: "Potassium Chloride",
    strength: "1.5 g / 15 ml",
    form: "Syrup",
    therapeuticClass: "Electrolyte Replenisher",
    defaultFrequency: "1-0-0",
    defaultTiming: "Afternoon",
    mealInstruction: "Dilute in a full glass of water or juice after meals",
    minGapHours: 24,
    maxDailyDoseMg: 3000,
    tags: ["electrolyte", "potassium"],
  },
  {
    brandName: "Aldactone 25",
    genericName: "Spironolactone",
    strength: "25 mg",
    form: "Tablet",
    therapeuticClass: "Potassium-Sparing Diuretic",
    defaultFrequency: "1-0-0",
    defaultTiming: "Morning",
    mealInstruction: "With food in the morning to avoid nighttime urination",
    minGapHours: 24,
    maxDailyDoseMg: 100,
    tags: ["cardiac", "diuretic"],
  },
  {
    brandName: "Ultracet",
    genericName: "Tramadol + Paracetamol",
    strength: "37.5 mg + 325 mg",
    form: "Tablet",
    therapeuticClass: "Opioid Analgesic Combination",
    defaultFrequency: "1-0-1",
    defaultTiming: "Morning & Night",
    mealInstruction: "With or after food",
    minGapHours: 6,
    maxDailyDoseMg: 300,
    tags: ["pain", "opioid", "controlled"],
  },
  {
    brandName: "Daxid 50",
    genericName: "Sertraline",
    strength: "50 mg",
    form: "Tablet",
    therapeuticClass: "SSRI Antidepressant",
    defaultFrequency: "1-0-0",
    defaultTiming: "Morning",
    mealInstruction: "With morning breakfast",
    minGapHours: 24,
    maxDailyDoseMg: 200,
    tags: ["psychiatry", "ssri"],
  }
];

/**
 * Drug-Drug Interaction Knowledge Engine
 * Pairwise interactions categorized by clinical severity.
 */
export const INTERACTION_RULES = [
  {
    id: "INT-001",
    drugA: "Warfarin",
    drugB: "Aspirin",
    severity: "critical",
    titleEn: "Extreme Internal Bleeding Hazard",
    titleHi: "गंभीर आंतरिक रक्तस्राव का बड़ा खतरा",
    titleMr: "तीव्र अंतर्गत रक्तस्रावाचा मोठा धोका",
    titleTa: "தீவிர உள் ரத்தக்கசிவு ஆபத்து",
    titleTe: "తీవ్రమైన అంతర్గత రక్తస్రావం ప్రమాదం",
    explanationEn: "Warfarin and Aspirin both thin the blood through different pathways. Combining them dramatically increases the risk of severe gastrointestinal hemorrhage and brain bleeding.",
    explanationHi: "वारफेरिन और एस्पिरिन दोनों खून को पतला करते हैं। इन्हें एक साथ लेने से पेट में भारी खून बहने और जानलेवा स्थिति का खतरा बहुत बढ़ जाता है।",
    mechanism: "Synergistic anticoagulant and antiplatelet inhibition + gastric mucosal injury.",
    actionEn: "DO NOT take together without direct authorization from your cardiologist or prescribing doctor.",
    actionHi: "अपने डॉक्टर से तुरंत परामर्श किए बिना दोनों दवाइयां साथ में बिल्कुल न लें।",
    source: "NIH RxNorm / openFDA Drug Safety Warnings / CDSCO Clinical Guide"
  },
  {
    id: "INT-002",
    drugA: "Warfarin",
    drugB: "Ibuprofen + Paracetamol",
    severity: "critical",
    titleEn: "Severe Bleeding & Stomach Ulcer Hazard",
    titleHi: "रक्तस्राव और पेट के अल्सर का गंभीर जोखिम",
    explanationEn: "Ibuprofen is an NSAID that damages the stomach lining and hinders platelet function, while Warfarin stops blood clotting, leading to dangerous bleeding.",
    explanationHi: "कॉम्बीफ्लेम (इबुप्रोफेन) पेट की परत को नुकसान पहुंचाता है और वारफेरिन खून का थक्का जमने से रोकता है, जिससे खतरनाक ब्लीडिंग हो सकती है।",
    mechanism: "NSAID-induced platelet impairment and gastric erosion combined with vitamin K antagonism.",
    actionEn: "Avoid NSAID painkillers. Consult your doctor for safe alternatives like plain low-dose Paracetamol.",
    actionHi: "पेनकिलर लेने से बचें। डॉक्टर से सुरक्षित विकल्प के बारे में पूछें।",
    source: "openFDA Contraindication Catalog"
  },
  {
    id: "INT-003",
    drugA: "Isosorbide Dinitrate",
    drugB: "Sildenafil",
    severity: "critical",
    titleEn: "Fatal Blood Pressure Drop (Cardiovascular Collapse)",
    titleHi: "घातक रक्तचाप गिरावट (जानलेवा ब्लड प्रेशर फॉल)",
    explanationEn: "Taking Nitrates (like Sorbitrate) with Sildenafil causes sudden, massive blood vessel dilation leading to catastrophic hypotension, loss of consciousness, or heart attack.",
    explanationHi: "नाइट्रेट (सोरबिट्रेट) और सिल्डेनाफिल को साथ लेने से ब्लड प्रेशर अचानक बहुत नीचे गिर सकता है, जो जानलेवा हो सकता है।",
    mechanism: "Synergistic cGMP accumulation causing profound systemic vasodilation.",
    actionEn: "STRICTLY CONTRAINDICATED. Never take these medicines within 24-48 hours of each other.",
    actionHi: "सख्त मना है। इन दवाओं को एक साथ कभी न लें।",
    source: "US FDA Black Box Warning / RxNorm"
  },
  {
    id: "INT-004",
    drugA: "Methotrexate",
    drugB: "Aspirin",
    severity: "critical",
    titleEn: "Methotrexate Toxicity & Bone Marrow Suppression",
    titleHi: "मेथोट्रेक्सेट विषाक्तता और अस्थि मज्जा दमन का खतरा",
    explanationEn: "Aspirin reduces the kidney clearance of Methotrexate, causing toxic levels to accumulate in your blood, risking severe bone marrow damage and kidney failure.",
    explanationHi: "एस्पिरिन शरीर से मेथोट्रेक्सेट को बाहर निकलने से रोकता है, जिससे खून में इसका स्तर विषैला हो जाता है।",
    mechanism: "Decreased renal tubular secretion and protein displacement of methotrexate by salicylates.",
    actionEn: "Contact your rheumatologist immediately before taking any aspirin or NSAIDs.",
    actionHi: "बिना डॉक्टर की सलाह के कोई भी दर्द निवारक न लें।",
    source: "openFDA / British National Formulary"
  },
  {
    id: "INT-005",
    drugA: "Spironolactone",
    drugB: "Potassium Chloride",
    severity: "critical",
    titleEn: "Dangerous High Potassium (Cardiac Arrhythmia Risk)",
    titleHi: "पोटेशियम का खतरनाक स्तर (हार्ट रिदम बिगड़ने का खतरा)",
    explanationEn: "Spironolactone prevents the kidneys from excreting potassium. Taking potassium supplements (Potklor) at the same time can trigger life-threatening cardiac arrest.",
    explanationHi: "एल्डेक्टोन शरीर में पोटेशियम रोकता है। साथ में पोटेशियम सिरप लेने से दिल की धड़कन खतरनाक रूप से असामान्य हो सकती है।",
    mechanism: "Additive hyperkalemia leading to cardiac conduction abnormalities.",
    actionEn: "Do not start potassium supplements while taking Spironolactone without regular blood potassium monitoring.",
    actionHi: "पोटेशियम सिरप और यह दवा साथ लेने से पहले ब्लड टेस्ट और डॉक्टर की मंजूरी जरूरी है।",
    source: "CDSCO India & RxNorm Clinical Guidelines"
  },
  {
    id: "INT-006",
    drugA: "Tramadol + Paracetamol",
    drugB: "Sertraline",
    severity: "critical",
    titleEn: "Serotonin Syndrome & Seizure Risk",
    titleHi: "सेरोटोनिन सिंड्रोम और दौरे का गंभीर खतरा",
    explanationEn: "Both Tramadol and Sertraline increase serotonin levels in the brain. Together, they can cause Serotonin Syndrome (high fever, agitation, muscle tremors, seizures).",
    explanationHi: "दोनों दवाएं दिमाग में सेरोटोनिन बढ़ाती हैं, जिससे तेज बुखार, कंपकंपी और दौरे पड़ने का खतरा रहता है।",
    mechanism: "Additive serotonergic neurotransmission and lowered seizure threshold.",
    actionEn: "Seek medical advice immediately if experiencing muscle stiffness, rapid heart rate, or confusion.",
    actionHi: "यदि शरीर में अकड़न या बेचैनी हो, तो तुरंत डॉक्टर से संपर्क करें।",
    source: "FDA Drug Safety Communication"
  },
  {
    id: "INT-007",
    drugA: "Atorvastatin",
    drugB: "Clarithromycin",
    severity: "moderate",
    titleEn: "Muscle Breakdown Risk (Rhabdomyolysis)",
    titleHi: "मांसपेशियों के टूटने का खतरा (रैबडोमायोलिसिस)",
    explanationEn: "Macrolide antibiotics block the breakdown of Atorvastatin, multiplying statin levels in the blood and risking severe muscle pain or kidney injury.",
    explanationHi: "यह एंटीबायोटिक कोलेस्ट्रॉल दवा का स्तर खून में बहुत बढ़ा देता है, जिससे मांसपेशियों में गंभीर दर्द हो सकता है।",
    mechanism: "CYP3A4 enzyme inhibition increases atorvastatin AUC by over 300%.",
    actionEn: "Temporarily pause your statin while taking this antibiotic course if advised by your doctor.",
    actionHi: "एंटीबायोटिक कोर्स के दौरान कोलेस्ट्रॉल दवा को डॉक्टर की सलाह से कुछ दिन रोकें।",
    source: "openFDA Clinical Pharmacology"
  },
  {
    id: "INT-008",
    drugA: "Clopidogrel",
    drugB: "Pantoprazole",
    severity: "moderate",
    titleEn: "Reduced Blood Thinner Efficacy",
    titleHi: "खून पतला करने वाली दवा का असर कम होना",
    explanationEn: "Proton pump inhibitors can compete with the liver activation of Clopidogrel, slightly reducing its protective benefit against blood clots.",
    explanationHi: "एंटासिड दवा खून पतला करने वाली दवा के असर को कुछ कम कर सकती है।",
    mechanism: "Competitive CYP2C19 inhibition reducing active thiol metabolite generation.",
    actionEn: "Discuss with your doctor whether separating doses or using an alternative antacid is recommended.",
    actionHi: "डॉक्टर से पूछें कि क्या दोनों दवाओं के बीच 4 घंटे का अंतर रखना चाहिए।",
    source: "ACC/AHA Clinical Consensus"
  },
  {
    id: "INT-009",
    drugA: "Ciprofloxacin",
    drugB: "Pantoprazole",
    severity: "moderate",
    titleEn: "Antibiotic Absorption Blocked",
    titleHi: "एंटीबायोटिक का शरीर में अवशोषण कम होना",
    explanationEn: "Antacids reduce gastric acidity and impair the absorption of Ciprofloxacin, reducing its ability to cure your bacterial infection.",
    explanationHi: "एंटासिड के कारण एंटीबायोटिक दवा पूरी तरह काम नहीं कर पाती।",
    mechanism: "Altered gastric pH and potential chelation reducing antibiotic bioavailability.",
    actionEn: "Take Ciprofloxacin at least 2 hours before or 4 hours after taking any antacid.",
    actionHi: "एंटीबायोटिक दवा एंटासिड से 2 घंटे पहले या 4 घंटे बाद लें।",
    source: "RxNorm / British Pharmacopoeia"
  },
  {
    id: "INT-010",
    drugA: "Telmisartan",
    drugB: "Potassium Chloride",
    severity: "moderate",
    titleEn: "Elevated Blood Potassium Level",
    titleHi: "खून में पोटेशियम बढ़ने का जोखिम",
    explanationEn: "Telmisartan (ARB) increases potassium retention in the kidneys. Adding potassium supplements requires medical supervision.",
    explanationHi: "बीपी की यह दवा पोटेशियम बचाती है, इसलिए सप्लीमेंट लेने से पहले जांच कराएं।",
    mechanism: "RAAS blockade impairs renal potassium clearance.",
    actionEn: "Get periodic serum potassium blood tests while taking both.",
    actionHi: "समय-समय पर पोटेशियम स्तर का ब्लड टेस्ट करवाएं।",
    source: "Clinical Guidelines"
  }
];

/**
 * Duplicate Generic Detection Rules
 * Detects overlapping active ingredients that lead to accidental overdose.
 */
export function checkDuplicateIngredients(medicationList) {
  const duplicates = [];
  const genericMap = {};

  medicationList.forEach((med) => {
    // Break composite generics like "Ibuprofen + Paracetamol" into individual tokens
    const components = med.genericName.split("+").map((s) => s.trim().toLowerCase());
    
    components.forEach((comp) => {
      if (!genericMap[comp]) {
        genericMap[comp] = [];
      }
      genericMap[comp].push(med);
    });
  });

  for (const [ingredient, meds] of Object.entries(genericMap)) {
    if (meds.length > 1) {
      // Calculate combined daily dose if Paracetamol
      let totalDose = 0;
      let doseInfo = [];

      meds.forEach((m) => {
        const mgMatch = m.strength.match(/(\d+)\s*mg/i);
        const mg = mgMatch ? parseInt(mgMatch[1], 10) : 500;
        doseInfo.push(`${m.brandName} (${m.strength})`);
        totalDose += mg * 2; // Assuming twice daily
      });

      const isParacetamol = ingredient.includes("paracetamol") || ingredient.includes("acetaminophen");
      const isCritical = isParacetamol && totalDose > 3000;

      duplicates.push({
        id: `DUP-${ingredient}-${Date.now()}`,
        ingredient: ingredient.charAt(0).toUpperCase() + ingredient.slice(1),
        medications: meds.map((m) => m.brandName),
        severity: isCritical ? "critical" : "moderate",
        titleEn: `Duplicate Active Ingredient: ${ingredient.toUpperCase()}`,
        titleHi: `दवाइयों में एक ही सामग्री की दोहराव: ${ingredient.toUpperCase()}`,
        explanationEn: `You are taking ${meds.length} different medicines containing "${ingredient.toUpperCase()}" (${doseInfo.join(" and ")}). Combining them leads to accidental overdose and severe liver/kidney damage.`,
        explanationHi: `आप "${ingredient.toUpperCase()}" वाली ${meds.length} अलग-अलग दवाइयां ले रहे हैं (${doseInfo.join(" और ")}). इससे ओवरडोज और लिवर को नुकसान हो सकता है।`,
        actionEn: "Do NOT take both together without your doctor's confirmation. Choose only one prescribed brand.",
        actionHi: "दोनों दवाइयां साथ न लें। डॉक्टर से पूछकर केवल एक ही दवा जारी रखें।"
      });
    }
  }

  return duplicates;
}

/**
 * Food & Timing Contraindications
 */
export const FOOD_TIMING_RULES = [
  {
    genericKeyword: "levothyroxine",
    ruleEn: "Must be taken on an empty stomach with plain water, at least 45 minutes before tea, coffee, breakfast, or calcium supplements.",
    ruleHi: "सुबह खाली पेट सिर्फ सादे पानी के साथ लें। चाय, नाश्ते या दूध से कम से कम 45 मिनट पहले लें।",
    badge: "Empty Stomach"
  },
  {
    genericKeyword: "metformin",
    ruleEn: "Take with or right after food. Strictly avoid excessive alcohol intake due to high risk of lactic acidosis.",
    ruleHi: "खाने के साथ या तुरंत बाद लें। शराब का सेवन बिल्कुल न करें।",
    badge: "With Food / No Alcohol"
  },
  {
    genericKeyword: "ciprofloxacin",
    ruleEn: "Avoid dairy products (milk, curd), calcium, or antacids within 2 hours of this dose.",
    ruleHi: "दूध, दही और एंटासिड सिरप इस दवा के 2 घंटे पहले या बाद तक न लें।",
    badge: "Avoid Dairy & Antacids"
  },
  {
    genericKeyword: "warfarin",
    ruleEn: "Maintain consistent daily intake of green leafy vegetables (spinach/methi) to avoid disrupting INR clotting levels.",
    ruleHi: "हरी पत्तेदार सब्जियों (पालक, मेथी) की मात्रा अचानक न बदलें, जिससे दवा का असर स्थिर रहे।",
    badge: "Diet Consistency"
  },
  {
    genericKeyword: "pantoprazole",
    ruleEn: "Take 30 to 60 minutes before your first meal/breakfast for best acid control.",
    ruleHi: "सुबह के नाश्ते से 30 से 60 मिनट पहले खाली पेट लें।",
    badge: "Before Breakfast"
  }
];

/**
 * Preset Demonstrations for SIH Hackathon & Evaluation (PRD Section 15)
 */
export const HACKATHON_DEMO_PRESETS = [
  {
    id: "preset-bleeding",
    nameEn: "Preset 1: Warfarin + Aspirin (Critical Bleeding Alert)",
    nameHi: "डेमो 1: वारफेरिन + एस्पिरिन (गंभीर ब्लीडिंग अलर्ट)",
    description: "Cardiac patient prescribed blood thinner + OTC painkiller resulting in severe internal hemorrhage risk.",
    medications: [
      {
        id: "med-demo-1",
        brandName: "Warf 5",
        genericName: "Warfarin",
        strength: "5 mg",
        form: "Tablet",
        dose: "1 Tablet",
        frequency: "0-0-1",
        timing: "Bedtime (9:30 PM)",
        instructions: "Nightly after dinner",
        confidence: 96,
        confirmed: true
      },
      {
        id: "med-demo-2",
        brandName: "Ecosprin 75",
        genericName: "Aspirin",
        strength: "75 mg",
        form: "Tablet",
        dose: "1 Tablet",
        frequency: "1-0-0",
        timing: "Morning (8:00 AM)",
        instructions: "After breakfast",
        confidence: 94,
        confirmed: true
      }
    ]
  },
  {
    id: "preset-paracetamol-overdose",
    nameEn: "Preset 2: Dolo 650 + Crocin Advance (Duplicate Overdose)",
    nameHi: "डेमो 2: डोलो 650 + क्रोसिन (पैरासिटामोल ओवरडोज चेतावनी)",
    description: "Patient took two different brand-name tablets unaware they both contain high-dose Paracetamol.",
    medications: [
      {
        id: "med-demo-3",
        brandName: "Dolo 650",
        genericName: "Paracetamol",
        strength: "650 mg",
        form: "Tablet",
        dose: "1 Tablet",
        frequency: "1-0-1",
        timing: "Morning & Night",
        instructions: "For fever & body ache",
        confidence: 98,
        confirmed: true
      },
      {
        id: "med-demo-4",
        brandName: "Crocin Advance",
        genericName: "Paracetamol",
        strength: "500 mg",
        form: "Tablet",
        dose: "1 Tablet",
        frequency: "1-0-1",
        timing: "Morning & Night",
        instructions: "For headache",
        confidence: 97,
        confirmed: true
      }
    ]
  },
  {
    id: "preset-cardiac-nitrate",
    nameEn: "Preset 3: Sorbitrate + Sildenafil (Fatal BP Drop Hazard)",
    nameHi: "डेमो 3: सोरबिट्रेट + सिल्डेनाफिल (घातक बीपी फॉल अलर्ट)",
    description: "Co-administration of nitrate vasodilator with PDE5 inhibitor causing severe shock & hypotension.",
    medications: [
      {
        id: "med-demo-5",
        brandName: "Sorbitrate 10",
        genericName: "Isosorbide Dinitrate",
        strength: "10 mg",
        form: "Tablet",
        dose: "1 Tablet",
        frequency: "1-0-1",
        timing: "Morning & Evening",
        instructions: "Before meals",
        confidence: 95,
        confirmed: true
      },
      {
        id: "med-demo-6",
        brandName: "Manforce 50",
        genericName: "Sildenafil",
        strength: "50 mg",
        form: "Tablet",
        dose: "1 Tablet",
        frequency: "PRN (As Needed)",
        timing: "As needed",
        instructions: "As needed",
        confidence: 93,
        confirmed: true
      }
    ]
  },
  {
    id: "preset-safe-regimen",
    nameEn: "Preset 4: Safe Combination (Augmentin + Pan-40 + Calpol)",
    nameHi: "डेमो 4: सुरक्षित संयोजन (ऑगमेंटिन + पैन 40 + कालपोल)",
    description: "Standard compliant antibiotic regimen with stomach protection and fever relief. Zero conflicts.",
    medications: [
      {
        id: "med-demo-7",
        brandName: "Augmentin 625 Duo",
        genericName: "Amoxicillin + Clavulanic Acid",
        strength: "625 mg",
        form: "Tablet",
        dose: "1 Tablet",
        frequency: "1-0-1",
        timing: "Morning & Night",
        instructions: "With food (7-day course)",
        confidence: 98,
        confirmed: true
      },
      {
        id: "med-demo-8",
        brandName: "Pan 40",
        genericName: "Pantoprazole",
        strength: "40 mg",
        form: "Tablet",
        dose: "1 Tablet",
        frequency: "1-0-0",
        timing: "Morning (Empty Stomach)",
        instructions: "30 mins before breakfast",
        confidence: 97,
        confirmed: true
      }
    ]
  }
];
