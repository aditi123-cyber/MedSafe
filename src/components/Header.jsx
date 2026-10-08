/**
 * MedSafe Top Navigation Header
 * Patient Switcher, Language Selector, Accessibility Controls, Voice Mute/Active indicator
 */

import React from "react";
import { useMedSafe } from "../context/MedSafeContext";
import { 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  UserCheck, 
  UserPlus,
  Eye, 
  Type, 
  Languages, 
  BellRing,
  HeartHandshake,
  Sun,
  Moon,
  AlertOctagon
} from "lucide-react";

import { MULTILINGUAL_VOICE_GREETINGS } from "../utils/speechSynthesis";

export default function Header() {
  const { 
    language, 
    setLanguage, 
    fontSize, 
    setFontSize, 
    highContrast, 
    setHighContrast, 
    isDarkMode,
    toggleDarkMode,
    sendPatientSOS,
    isSpeakingState, 
    stopVoice,
    speak,
    t,
    profiles,
    activeProfileId,
    setActiveProfileId,
    activeProfile,
    currentUser,
    setIsAuthModalOpen,
    setAuthModalMode,
    isCaregiverViewMode,
    setIsCaregiverViewMode,
    criticalCount
  } = useMedSafe();

  const cycleFontSize = () => {
    if (fontSize === "normal") setFontSize("large");
    else if (fontSize === "large") setFontSize("extra-large");
    else setFontSize("normal");
  };

  const handleTestVoice = (customLang = null) => {
    if (isSpeakingState) {
      stopVoice();
    } else {
      const targetLang = customLang || language;
      const greeting = MULTILINGUAL_VOICE_GREETINGS[targetLang] || MULTILINGUAL_VOICE_GREETINGS.en;
      speak(greeting, targetLang);
    }
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    const greeting = MULTILINGUAL_VOICE_GREETINGS[newLang] || MULTILINGUAL_VOICE_GREETINGS.en;
    speak(greeting, newLang);
  };

  return (
    <header className="app-header">
      <div className="header-content">
        {/* Brand Logo & Tag */}
        <div className="brand-section">
          <div className="brand-icon-box">
            <ShieldCheck size={26} strokeWidth={2.4} />
          </div>
          <div>
            <div className="brand-title">
              MedSafe
              <span className="brand-badge">VERIFIED Rx</span>
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 500 }}>
              {t.tagline}
            </div>
          </div>
        </div>

        {/* Top Controls: Profile, Language, Accessibility & Voice */}
        <div className="header-controls">
          {/* Active Patient Profile Switcher & Add User Button */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div className="profile-pill" title="Switch Patient Profile">
              <div style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: currentUser?.avatarColor || "var(--primary)",
                color: "#ffffff",
                fontSize: "0.68rem",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                {currentUser?.avatarInitials || "U"}
              </div>
              <select
                value={activeProfileId}
                onChange={(e) => setActiveProfileId(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontWeight: 700,
                  color: "var(--primary)",
                  cursor: "pointer",
                  outline: "none",
                  maxWidth: "130px"
                }}
                aria-label="Select Patient Profile"
              >
                {profiles.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.age}y)
                  </option>
                ))}
              </select>
            </div>

            <button
              className="control-btn"
              onClick={() => {
                setAuthModalMode("register");
                setIsAuthModalOpen(true);
              }}
              style={{
                background: "rgba(13, 148, 136, 0.08)",
                borderColor: "var(--teal-accent)",
                color: "var(--teal-accent)",
                fontWeight: 700,
                padding: "0.45rem 0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "0.78rem"
              }}
              title="Add a New User via Email"
            >
              <UserPlus size={14} />
              <span>{t.addUserCTA || "+ Add User"}</span>
            </button>
          </div>

          {/* Multilingual Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Languages size={17} style={{ color: "var(--primary)" }} />
            <select
              className="lang-select"
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              aria-label="Choose Interface Language"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="te">తెలుగు (Telugu)</option>
            </select>
          </div>

          {/* Elderly Font Size Toggle */}
          <button 
            className="control-btn" 
            onClick={cycleFontSize} 
            title={`Current Font: ${fontSize.toUpperCase()}. Click to enlarge.`}
            aria-label="Toggle Font Size for Elderly"
          >
            <Type size={16} />
            <span style={{ fontSize: "0.8rem" }}>
              {fontSize === "normal" ? "A" : fontSize === "large" ? "A+" : "A++"}
            </span>
          </button>

          {/* High Contrast Mode Toggle */}
          <button 
            className={`control-btn ${highContrast ? "active" : ""}`}
            onClick={() => setHighContrast(!highContrast)} 
            title="Toggle High Contrast for Visual Impairment"
            aria-label="High Contrast Mode"
          >
            <Eye size={16} />
          </button>

          {/* Voice Readout Test / Mute */}
          <button 
            className={`control-btn ${isSpeakingState ? "active" : ""}`} 
            onClick={handleTestVoice} 
            title={isSpeakingState ? "Stop Voice" : "Listen to Audio Voice Assistance"}
            aria-label="Voice Readout Assistance"
          >
            {isSpeakingState ? (
              <VolumeX size={17} className="speaking-pulse" style={{ color: "var(--critical)" }} />
            ) : (
              <Volume2 size={17} style={{ color: "var(--primary)" }} />
            )}
          </button>

          {/* Dark / Day (Light) Mode Toggle */}
          <button 
            className={`control-btn ${isDarkMode ? "active" : ""}`}
            onClick={toggleDarkMode}
            title={isDarkMode ? "Switch to Day (Light) Mode" : "Switch to Dark Night Mode"}
            aria-label="Toggle Dark or Light Mode"
          >
            {isDarkMode ? (
              <Sun size={16} style={{ color: "#f59e0b" }} />
            ) : (
              <Moon size={16} style={{ color: "var(--primary)" }} />
            )}
          </button>

          {/* Quick Patient Emergency SOS Button */}
          <button
            className="control-btn"
            onClick={() => sendPatientSOS("Patient triggered Quick Emergency SOS Button from Header")}
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              borderColor: "var(--critical)",
              color: "var(--critical)",
              fontWeight: 800,
              padding: "0.45rem 0.65rem",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
            title="Send Immediate Emergency SOS Alert to Caregiver"
          >
            <AlertOctagon size={15} />
            <span>{t.emergencySOS || "SOS"}</span>
          </button>

          {/* Caregiver Remote Monitor Mode Toggle */}
          <button
            className={`control-btn ${isCaregiverViewMode ? "active" : ""}`}
            onClick={() => setIsCaregiverViewMode(!isCaregiverViewMode)}
            style={{
              borderColor: isCaregiverViewMode ? "var(--primary)" : "var(--border-subtle)",
              background: isCaregiverViewMode ? "var(--primary-bg)" : "inherit"
            }}
            title="Toggle Caregiver Remote Monitoring View"
          >
            <HeartHandshake size={16} />
            <span>{isCaregiverViewMode ? (t.caregiverView || "Caregiver View") : (t.patientMode || "Patient Mode")}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
