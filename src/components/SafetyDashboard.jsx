/**
 * MedSafe Safety Dashboard & Contraindication Engine
 * Categorized conflict cards (Critical, Moderate, Minor, Duplicate Ingredients),
 * plain-language explanations, voice read-out, and clinical citations.
 * PRD Section 5.4, 9 & 10
 */

import React, { useState } from "react";
import { useMedSafe } from "../context/MedSafeContext";
import { 
  AlertOctagon, 
  AlertTriangle, 
  ShieldCheck, 
  Volume2, 
  Trash2, 
  PlusCircle, 
  ExternalLink, 
  Info, 
  Pill, 
  Utensils, 
  PhoneCall,
  Sparkles
} from "lucide-react";

export default function SafetyDashboard() {
  const { 
    medications, 
    removeMedication, 
    interactions, 
    duplicateWarnings, 
    foodWarnings,
    t, 
    language, 
    speak, 
    criticalCount, 
    moderateCount,
    setCurrentTab,
    triggerCaregiverAlert
  } = useMedSafe();

  const [expandedMechanismId, setExpandedMechanismId] = useState(null);

  const toggleMechanism = (id) => {
    setExpandedMechanismId(prev => prev === id ? null : id);
  };

  const hasNoMeds = medications.length === 0;
  const isAllSafe = medications.length >= 2 && criticalCount === 0 && moderateCount === 0;

  const handleVoiceReadConflict = (conflict) => {
    let text = "";
    if (language === "hi") {
      text = `सावधान! ${conflict.titleHi || conflict.titleEn}। ${conflict.explanationHi || conflict.explanationEn}। आवश्यक सलाह: ${conflict.actionHi || conflict.actionEn}`;
    } else if (language === "mr") {
      text = `सावधान! ${conflict.titleEn}। ${conflict.explanationEn}। सल्ला: ${conflict.actionEn}`;
    } else if (language === "ta") {
      text = `எச்சரிக்கை! ${conflict.titleEn}। ${conflict.explanationEn}। பரிந்துரைக்கப்பட்ட நடவடிக்கை: ${conflict.actionEn}`;
    } else if (language === "te") {
      text = `హెచ్చరిక! ${conflict.titleEn}। ${conflict.explanationEn}। సిఫార్సు చేసిన చర్య: ${conflict.actionEn}`;
    } else {
      text = `Warning: ${conflict.titleEn}. ${conflict.explanationEn}. Recommended Action: ${conflict.actionEn}`;
    }
    speak(text, language);
  };

  const handleDirectDoctorCall = () => {
    triggerCaregiverAlert(
      "Emergency Doctor Call Requested",
      "Patient requested urgent consultation with primary caregiver / doctor.",
      "critical"
    );
    alert("Initiating emergency dialer connection to consulting doctor...");
  };

  return (
    <div>
      {/* Safety Summary Banner */}
      {criticalCount > 0 ? (
        <div className="alert-card-critical">
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
            <AlertOctagon size={36} style={{ color: "var(--critical)", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.25rem" }}>
                <span className="badge-critical">
                  <AlertOctagon size={14} /> {language === "hi" ? "गंभीर खतरा" : language === "mr" ? "गंभीर धोका" : language === "ta" ? "ஆபத்து" : language === "te" ? "ప్రమాదం" : "Critical Hazard"}
                </span>
                <h3 style={{ color: "var(--critical-dark)", fontSize: "var(--font-size-xl)" }}>
                  {t.safetyStatusCritical} ({criticalCount})
                </h3>
              </div>
              <p style={{ fontWeight: 600, fontSize: "var(--font-size-base)", color: "var(--text-on-critical)", marginBottom: "0.75rem" }}>
                {t.criticalActionBanner}
              </p>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <button className="btn-critical" onClick={handleDirectDoctorCall}>
                  <PhoneCall size={18} />
                  <span>{language === "hi" ? "डॉक्टर / देखभालकर्ता को कॉल करें" : language === "mr" ? "डॉक्टरांना कॉल करा" : language === "ta" ? "மருத்துவரை அழைக்கவும்" : language === "te" ? "డాక్టర్‌కు కాల్ చేయండి" : "Call Doctor / Caregiver Now"}</span>
                </button>
                <button 
                  className="btn-secondary" 
                  onClick={() => {
                    const firstCrit = interactions.find(i => i.severity === "critical") || duplicateWarnings[0];
                    if (firstCrit) handleVoiceReadConflict(firstCrit);
                  }}
                  style={{ background: "#ffffff" }}
                >
                  <Volume2 size={18} />
                  <span>{t.readAloud}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : moderateCount > 0 ? (
        <div className="alert-card-moderate">
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
            <AlertTriangle size={32} style={{ color: "var(--moderate)", flexShrink: 0 }} />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                <span className="badge-moderate">
                  <AlertTriangle size={14} /> {language === "hi" ? "सावधानी आवश्यक" : language === "mr" ? "खबरदारी" : language === "ta" ? "எச்சரிக்கை" : language === "te" ? "జాగ్రత్త" : "Caution Required"}
                </span>
                <h3 style={{ color: "var(--moderate)", fontSize: "var(--font-size-lg)" }}>
                  {t.safetyStatusModerate} ({moderateCount})
                </h3>
              </div>
              <p style={{ fontSize: "var(--font-size-base)", color: "var(--text-on-moderate)" }}>
                {language === "hi" ? "कुछ दवाओं के संयोजन से दवा का प्रभाव कम हो सकता है। नीचे दिए गए सुझावों को ध्यानपूर्वक पढ़ें।" : "Certain combinations may reduce medicine effectiveness or cause discomfort. Review recommendations below."}
              </p>
            </div>
          </div>
        </div>
      ) : isAllSafe ? (
        <div className="alert-card-safe">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <ShieldCheck size={36} style={{ color: "var(--safe)", flexShrink: 0 }} />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                <span className="badge-safe">
                  <ShieldCheck size={14} /> {t.verifiedSafe || "Verified Safe"}
                </span>
                <h3 style={{ color: "var(--safe)", fontSize: "var(--font-size-lg)" }}>
                  {t.safetyStatusSafe}
                </h3>
              </div>
              <p style={{ fontSize: "var(--font-size-sm)", color: "var(--text-on-safe)" }}>
                {language === "hi" 
                  ? `आपकी ${medications.length} सक्रिय दवाओं में कोई हानिकारक टकराव या दोहराव नहीं पाया गया।` 
                  : `No dangerous drug-drug interactions or duplicate active molecules detected among your ${medications.length} active prescriptions.`}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Active Medications List */}
      <div className="card-container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <h3>{t.medsBrandMappings || "Active Scanned Medications"} ({medications.length})</h3>
            <p style={{ fontSize: "var(--font-size-sm)", color: "var(--text-muted)" }}>
              {language === "hi" ? "सुरक्षा जांच पूल में शामिल सभी दवाइयां।" : "All medicines currently checked in this safety cross-verification pool."}
            </p>
          </div>
          <button className="btn-primary" onClick={() => setCurrentTab("scan")}>
            <PlusCircle size={18} />
            <span>{language === "hi" ? "+ दवा जोड़ें" : language === "mr" ? "+ औषध जोडा" : language === "ta" ? "+ மருந்து சேர்க்க" : language === "te" ? "+ మందును జోడించండి" : "Add Medicine"}</span>
          </button>
        </div>

        {hasNoMeds ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
            <Pill size={40} style={{ opacity: 0.4, marginBottom: "0.5rem" }} />
            <p>No medications in the safety pool yet. Tap "Scan" or select a preset demo above.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.75rem" }}>
            {medications.map((med) => (
              <div 
                key={med.id}
                style={{
                  background: "var(--bg-surface-subtle)",
                  border: "1.5px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  padding: "0.85rem",
                  display: "flex",
                  gap: "0.75rem",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flex: 1, minWidth: 0 }}>
                  {med.labelImage && (
                    <img 
                      src={med.labelImage} 
                      alt={med.brandName} 
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "8px",
                        objectFit: "cover",
                        flexShrink: 0,
                        border: "1.5px solid var(--border-medium)"
                      }}
                    />
                  )}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: "var(--font-size-base)", color: "var(--primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {med.brandName}
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>
                      {med.genericName} • {med.strength}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-light)", marginTop: "2px" }}>
                      Freq: <strong>{med.frequency}</strong> | {med.instructions}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeMedication(med.id)}
                  title="Remove from verification pool"
                  style={{ color: "var(--text-light)", padding: "4px", flexShrink: 0 }}
                  aria-label={`Remove ${med.brandName}`}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Critical & Moderate Drug-Drug Interaction Flags */}
      {interactions.length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <AlertOctagon size={20} style={{ color: "var(--critical)" }} />
            <span>Drug-Drug Interaction Analysis ({interactions.length})</span>
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {interactions.map((intRule) => {
              const isCrit = intRule.severity === "critical";
              const isExp = expandedMechanismId === intRule.id;

              return (
                <div
                  key={intRule.id}
                  style={{
                    background: isCrit ? "var(--critical-bg)" : "var(--moderate-bg)",
                    border: `2px solid ${isCrit ? "var(--critical)" : "var(--moderate)"}`,
                    borderRadius: "var(--radius-lg)",
                    padding: "1.25rem",
                    boxShadow: isCrit ? "var(--shadow-glow-red)" : "var(--shadow-sm)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                        <span className={isCrit ? "badge-critical" : "badge-moderate"}>
                          {isCrit ? "CRITICAL" : "MODERATE"}
                        </span>
                        <span style={{ fontWeight: 800, fontSize: "0.88rem", color: isCrit ? "var(--critical-dark)" : "var(--moderate)" }}>
                          {intRule.pairText}
                        </span>
                      </div>
                      <h4 style={{ fontSize: "var(--font-size-lg)", color: isCrit ? "var(--critical-dark)" : "var(--moderate)", marginBottom: "0.4rem" }}>
                        {language === "hi" ? (intRule.titleHi || intRule.titleEn) : intRule.titleEn}
                      </h4>
                    </div>

                    <button
                      className="btn-secondary"
                      onClick={() => handleVoiceReadConflict(intRule)}
                      style={{ background: "#ffffff", padding: "0.35rem 0.75rem", fontSize: "0.85rem" }}
                      title="Read warning aloud"
                    >
                      <Volume2 size={16} />
                      <span>{t.readAloud}</span>
                    </button>
                  </div>

                  {/* Plain Language Explanation */}
                  <p style={{ fontSize: "var(--font-size-base)", color: isCrit ? "var(--text-on-critical)" : "var(--text-on-moderate)", margin: "0.5rem 0" }}>
                    {language === "hi" ? (intRule.explanationHi || intRule.explanationEn) : intRule.explanationEn}
                  </p>

                  {/* Patient Action Box */}
                  <div style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    padding: "0.75rem",
                    borderRadius: "var(--radius-md)",
                    margin: "0.75rem 0",
                    borderLeft: `4px solid ${isCrit ? "var(--critical)" : "var(--moderate)"}`
                  }}>
                    <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-main)", marginBottom: "2px" }}>
                      👉 {language === "hi" ? "आपको क्या करना चाहिए:" : language === "mr" ? "आपण काय करावे:" : language === "ta" ? "நீங்கள் செய்ய வேண்டியது:" : language === "te" ? "మీరు ఏమి చేయాలి:" : "What you should do:"}
                    </div>
                    <div style={{ fontSize: "var(--font-size-sm)", color: "var(--text-main)", fontWeight: 500 }}>
                      {language === "hi" ? (intRule.actionHi || intRule.actionEn) : intRule.actionEn}
                    </div>
                  </div>

                  {/* Clinical Pharmacology Mechanism Toggle */}
                  <div style={{ marginTop: "0.5rem" }}>
                    <button
                      onClick={() => toggleMechanism(intRule.id)}
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: "var(--primary)",
                        textDecoration: "underline",
                        cursor: "pointer"
                      }}
                    >
                      {isExp 
                        ? (language === "hi" ? "▲ विवरण छिपाएं" : "▲ Hide Clinical Pharmacology Mechanism") 
                        : (language === "hi" ? "▼ क्लिनिकल फार्माकोलॉजी विवरण एवं संदर्भ देखें" : "▼ View Clinical Pharmacology Mechanism & Citations")}
                    </button>

                    {isExp && (
                      <div style={{
                        marginTop: "0.5rem",
                        padding: "0.75rem",
                        background: "#ffffff",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "0.8rem",
                        color: "var(--text-muted)",
                        border: "1px solid var(--border-subtle)"
                      }}>
                        <div><strong>Mechanism:</strong> {intRule.mechanism}</div>
                        <div style={{ marginTop: "4px" }}>
                          <strong>Clinical Reference:</strong> {intRule.source}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Duplicate Molecule Warnings (PRD Section 5.4: Paracetamol Overdose Detection) */}
      {duplicateWarnings.length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <AlertOctagon size={20} style={{ color: "var(--critical)" }} />
            <span>{t.duplicateAlertTitle} ({duplicateWarnings.length})</span>
          </h3>

          {duplicateWarnings.map((dup) => (
            <div
              key={dup.id}
              style={{
                background: "var(--critical-bg)",
                border: "2px solid var(--critical)",
                borderRadius: "var(--radius-lg)",
                padding: "1.25rem",
                marginBottom: "1rem"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                <span className="badge-critical">OVERDOSE RISK</span>
                <h4 style={{ color: "var(--critical-dark)" }}>
                  {language === "hi" ? dup.titleHi : dup.titleEn}
                </h4>
              </div>

              <p style={{ fontSize: "var(--font-size-base)", color: "var(--text-on-critical)", marginBottom: "0.75rem" }}>
                {language === "hi" ? dup.explanationHi : dup.explanationEn}
              </p>

              <div style={{ background: "#ffffff", padding: "0.6rem 0.85rem", borderRadius: "var(--radius-sm)", borderLeft: "4px solid var(--critical)" }}>
                <strong>Recommended Action:</strong> {language === "hi" ? dup.actionHi : dup.actionEn}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Food, Diet & Alcohol Timing Cautions (PRD Section 5.4 & Phase 2) */}
      {foodWarnings.length > 0 && (
        <div className="card-container">
          <h3 style={{ marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Utensils size={20} style={{ color: "var(--primary)" }} />
            <span>Food, Timing & Dietary Precautions ({foodWarnings.length})</span>
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {foodWarnings.map((food, idx) => (
              <div
                key={idx}
                style={{
                  background: "var(--primary-subtle)",
                  border: "1px solid rgba(0, 51, 102, 0.15)",
                  borderRadius: "var(--radius-md)",
                  padding: "0.85rem",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.75rem"
                }}
              >
                <div style={{ background: "var(--primary)", color: "white", padding: "4px 8px", borderRadius: "var(--radius-sm)", fontSize: "0.75rem", fontWeight: 700 }}>
                  {food.badge}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "var(--font-size-sm)", color: "var(--primary)" }}>
                    {food.medication}
                  </div>
                  <div style={{ fontSize: "0.88rem", color: "var(--text-main)", marginTop: "2px" }}>
                    {language === "hi" ? food.ruleHi : food.ruleEn}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regulatory & Safety Disclaimer (PRD Section 11) */}
      <div style={{
        background: "var(--bg-surface-subtle)",
        border: "1px solid var(--border-subtle)",
        padding: "1rem",
        borderRadius: "var(--radius-md)",
        fontSize: "0.8rem",
        color: "var(--text-muted)",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        marginTop: "1.5rem"
      }}>
        <Info size={22} style={{ color: "var(--primary)", flexShrink: 0 }} />
        <div>
          <strong>Clinical Disclaimer:</strong> {t.disclaimer} Database mapped via RxNorm, openFDA, and CDSCO India. All alerts must be verified by a registered medical practitioner.
        </div>
      </div>
    </div>
  );
}
