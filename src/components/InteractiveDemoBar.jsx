/**
 * MedSafe Interactive Demo Preset Bar
 * Designed specifically for Hackathon Jury Demonstrations (PRD Section 15).
 * Enables instant 1-click execution of critical clinical test scenarios.
 */

import React from "react";
import { useMedSafe } from "../context/MedSafeContext";
import { HACKATHON_DEMO_PRESETS } from "../data/drugDatabase";
import { Sparkles, AlertTriangle, CopyCheck, Clock, ShieldCheck, RefreshCw } from "lucide-react";

export default function InteractiveDemoBar() {
  const { loadPreset, setCurrentTab, setLanguage, speak, t, markDoseTaken, schedule } = useMedSafe();

  const handleRunPreset = (preset, tab = "safety") => {
    loadPreset(preset);
    setCurrentTab(tab);
  };

  const handleDemoLateDose = () => {
    // Load standard preset and mark first morning dose late at 11:30 AM to demonstrate rescheduling
    loadPreset(HACKATHON_DEMO_PRESETS[3]); // Safe antibiotic regimen
    setCurrentTab("timeline");
    setTimeout(() => {
      // simulate taking morning dose late at 11:45 AM
      markDoseTaken("dose-med-demo-7-morning", "11:45");
    }, 400);
  };

  const handleDemoHindiVoice = () => {
    setLanguage("hi");
    setCurrentTab("safety");
    loadPreset(HACKATHON_DEMO_PRESETS[0]);
    setTimeout(() => {
      speak("सावधान! वारफेरिन और एस्पिरिन दोनों दवाएं एक साथ लेने से आंतरिक रक्तस्राव का बहुत बड़ा खतरा है। तुरंत डॉक्टर से संपर्क करें।");
    }, 600);
  };

  return (
    <div className="demo-preset-bar">
      <div className="preset-title">
        <Sparkles size={16} />
        <span>1-Click Hackathon Demos (PRD §15):</span>
      </div>

      <div className="preset-buttons-group">
        {/* Preset 1: Bleeding Risk */}
        <button
          className="preset-chip-btn"
          onClick={() => handleRunPreset(HACKATHON_DEMO_PRESETS[0], "safety")}
          title="Demo 1: Warfarin + Aspirin (Critical Bleeding Alert)"
        >
          <AlertTriangle size={14} style={{ color: "#ff8080" }} />
          <span>1. Warfarin + Aspirin</span>
        </button>

        {/* Preset 2: Duplicate Overdose */}
        <button
          className="preset-chip-btn"
          onClick={() => handleRunPreset(HACKATHON_DEMO_PRESETS[1], "safety")}
          title="Demo 2: Dolo 650 + Crocin (Duplicate Paracetamol Overdose)"
        >
          <CopyCheck size={14} style={{ color: "#ffd580" }} />
          <span>2. Paracetamol Duplicate</span>
        </button>

        {/* Preset 3: Nitrate Hazard */}
        <button
          className="preset-chip-btn"
          onClick={() => handleRunPreset(HACKATHON_DEMO_PRESETS[2], "safety")}
          title="Demo 3: Sorbitrate + Sildenafil (Nitrate Hazard)"
        >
          <AlertTriangle size={14} style={{ color: "#ff8080" }} />
          <span>3. Nitrate + Sildenafil</span>
        </button>

        {/* Preset 4: Safe Regimen */}
        <button
          className="preset-chip-btn"
          onClick={() => handleRunPreset(HACKATHON_DEMO_PRESETS[3], "timeline")}
          title="Demo 4: Augmentin + Pan-40 (All Clear Safe)"
        >
          <ShieldCheck size={14} style={{ color: "#a5d6a7" }} />
          <span>4. Safe Regimen</span>
        </button>

        {/* Preset 5: Dynamic Rescheduling */}
        <button
          className="preset-chip-btn"
          onClick={handleDemoLateDose}
          style={{ background: "rgba(56, 189, 248, 0.2)", borderColor: "#38bdf8" }}
          title="Demo 5: Mark dose taken late & watch auto-reschedule algorithm"
        >
          <Clock size={14} style={{ color: "#7dd3fc" }} />
          <span>5. Late Dose Reschedule</span>
        </button>

        {/* Preset 6: Hindi Voice Demo */}
        <button
          className="preset-chip-btn"
          onClick={handleDemoHindiVoice}
          style={{ background: "rgba(251, 191, 36, 0.2)", borderColor: "#fbbf24" }}
          title="Demo 6: Switch to Hindi + Voice Readout"
        >
          <span>🗣️ 6. हिन्दी Voice Readout</span>
        </button>
      </div>
    </div>
  );
}
