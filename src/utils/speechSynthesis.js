/**
 * MedSafe Voice Readout & ElevenLabs AI Speech Engine
 * Powered by ElevenLabs Multilingual v2 & Browser Web Speech Fallback.
 * Provides auditory accessibility for elderly and visually impaired users.
 * Supports English, Hindi, Marathi, Tamil, Telugu with human-grade clinical voice synthesis.
 */

const ELEVENLABS_API_KEY = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_ELEVENLABS_API_KEY) 
  ? import.meta.env.VITE_ELEVENLABS_API_KEY 
  : "b18956bd5e07f760b989e0e9849f8b6888cc3c14f211033b62a0fd4522a148a9";
const ELEVENLABS_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel - Multilingual Clinical Voice
const ELEVENLABS_MODEL_ID = "eleven_multilingual_v2";

let currentAudio = null;
let currentUtterance = null;
const audioCache = new Map();

export const MULTILINGUAL_VOICE_GREETINGS = {
  en: "Hello! Welcome to MedSafe. Your prescription safety and daily medication timeline are actively monitored.",
  hi: "नमस्ते। मेडो-सेफ में आपका स्वागत है। आपकी सभी दवाइयों की सुरक्षा और समय-सारणी की निगरानी की जा रही है।",
  mr: "नमस्कार! मेडसेफ मध्ये आपले स्वागत आहे. आपल्या सर्व औषधांची सुरक्षितता आणि वेळापत्रक सक्रियपणे तपासले जात आहे.",
  ta: "வணக்கம்! மெட்சேஃப்-க்கு வரவேற்கிறோம். உங்கள் மருந்துகளின் பாதுகாப்பு மற்றும் தினசரி அட்டவணை கண்காணிக்கப்படுகிறது.",
  te: "నమస్కారం! మెడ్‌సేఫ్‌కి స్వాగతం. మీ మందుల భద్రత మరియు రోజువారీ షెడ్యూల్ నిరంతరం పర్యవేక్షించబడుతున్నాయి."
};

/**
 * Get active Voice Engine configuration metadata
 */
export function getVoiceEngineInfo() {
  return {
    provider: "ElevenLabs Multilingual AI Voice",
    voiceName: "Rachel (Multilingual Clinical)",
    voiceId: ELEVENLABS_VOICE_ID,
    model: ELEVENLABS_MODEL_ID,
    supportedLanguages: ["en", "hi", "mr", "ta", "te"],
    hasApiKey: Boolean(ELEVENLABS_API_KEY)
  };
}

/**
 * Call ElevenLabs Text-to-Speech API
 */
async function fetchElevenLabsAudio(text, lang = "en") {
  if (!ELEVENLABS_API_KEY) {
    throw new Error("ElevenLabs API Key not configured.");
  }

  const cacheKey = `${lang}_${text.trim()}`;
  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey);
  }

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": ELEVENLABS_API_KEY,
      "Accept": "audio/mpeg"
    },
    body: JSON.stringify({
      text: text,
      model_id: ELEVENLABS_MODEL_ID,
      voice_settings: {
        stability: 0.55,
        similarity_boost: 0.8,
        style: 0.0,
        use_speaker_boost: true
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`ElevenLabs API returned status ${response.status}: ${errorText}`);
  }

  const audioBlob = await response.blob();
  const audioUrl = URL.createObjectURL(audioBlob);
  audioCache.set(cacheKey, audioUrl);
  return audioUrl;
}

/**
 * Speak text using ElevenLabs with Web Speech API fallback
 */
export async function speakText(text, lang = "en", onStart = () => {}, onEnd = () => {}) {
  // Stop any active speech first
  stopSpeaking();

  if (!text || !text.trim()) {
    onEnd();
    return false;
  }

  // Attempt ElevenLabs AI Voice first
  try {
    const audioUrl = await fetchElevenLabsAudio(text, lang);
    const audio = new Audio(audioUrl);
    currentAudio = audio;

    audio.onplay = () => {
      onStart();
    };

    audio.onended = () => {
      currentAudio = null;
      onEnd();
    };

    audio.onerror = (err) => {
      console.warn("ElevenLabs audio playback failed, falling back to Web Speech:", err);
      currentAudio = null;
      speakWithWebSpeech(text, lang, onStart, onEnd);
    };

    await audio.play();
    return true;
  } catch (elevenLabsError) {
    console.warn("ElevenLabs TTS failed, invoking Web Speech fallback:", elevenLabsError.message);
    return speakWithWebSpeech(text, lang, onStart, onEnd);
  }
}

/**
 * Browser Native Web Speech Fallback
 */
function speakWithWebSpeech(text, lang = "en", onStart = () => {}, onEnd = () => {}) {
  if (!("speechSynthesis" in window)) {
    console.warn("Speech synthesis not supported in this browser.");
    onEnd();
    return false;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  const langMap = {
    en: "en-US",
    hi: "hi-IN",
    mr: "mr-IN",
    ta: "ta-IN",
    te: "te-IN"
  };

  utterance.lang = langMap[lang] || "en-US";
  utterance.rate = 0.9;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(v => v.lang.startsWith(utterance.lang.split("-")[0]));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.onstart = () => {
    currentUtterance = utterance;
    onStart();
  };

  utterance.onend = () => {
    currentUtterance = null;
    onEnd();
  };

  utterance.onerror = (e) => {
    console.error("Speech synthesis error:", e);
    currentUtterance = null;
    onEnd();
  };

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (e) {
      // Ignore pause errors
    }
    currentAudio = null;
  }

  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

export function isSpeaking() {
  const isAudioPlaying = currentAudio && !currentAudio.paused && !currentAudio.ended;
  const isWebSpeechActive = typeof window !== "undefined" && "speechSynthesis" in window && window.speechSynthesis.speaking;
  return Boolean(isAudioPlaying || isWebSpeechActive);
}

/**
 * Play gentle notification chime
 */
export function playChime(type = "success") {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "critical") {
      // Urgent double beep
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.35);
      gain2.gain.setValueAtTime(0.3, ctx.currentTime + 0.35);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.65);
      osc2.start(ctx.currentTime + 0.35);
      osc2.stop(ctx.currentTime + 0.65);
    } else {
      // Pleasant soft chime
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch (e) {
    // Audio context not allowed without interaction
  }
}

