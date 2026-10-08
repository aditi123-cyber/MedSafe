/**
 * MedSafe Smart Daily Timeline & Dynamic Rescheduling View
 * Grouped time slots (Morning, Afternoon, Evening, Bedtime), color-coded dose states,
 * 1-tap dose check-off, late-intake dynamic rescheduling, and adherence meter.
 * PRD Section 5.5, 9 & 15
 */

import React, { useState } from "react";
import { useMedSafe } from "../context/MedSafeContext";
import { DEFAULT_TIME_SLOTS } from "../utils/schedulerEngine";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  RefreshCw, 
  Volume2, 
  Pill, 
  CalendarCheck, 
  ChevronRight, 
  Check, 
  AlertTriangle,
  Info
} from "lucide-react";

export default function TimelineView() {
  const { 
    schedule, 
    markDoseTaken, 
    skipDose, 
    rescheduleNotice, 
    setRescheduleNotice,
    overallAdherence, 
    t, 
    language, 
    speak 
  } = useMedSafe();

  const [selectedDoseForCustomTime, setSelectedDoseForCustomTime] = useState(null);
  const [customTimeInput, setCustomTimeInput] = useState("11:30");

  const handleVoiceReadSchedule = () => {
    const total = schedule.length;
    const taken = schedule.filter(d => d.status === "taken").length;
    const remaining = total - taken;

    let text = `Today you have ${total} doses scheduled. You have taken ${taken} doses with ${remaining} remaining. Your daily adherence is ${overallAdherence} percent.`;
    
    if (language === "hi") {
      text = `आज कुल ${total} खुराकें निर्धारित हैं। आपने ${taken} खुराकें ले ली हैं और ${remaining} बाकी हैं। आपका आज का पालन स्कोर ${overallAdherence} प्रतिशत है।`;
    } else if (language === "mr") {
      text = `आज एकूण ${total} डोस नियोजित आहेत. आपण ${taken} डोस घेतले आहेत आणि ${remaining} शिल्लक आहेत. आजचे पालन ${overallAdherence} टक्के आहे.`;
    } else if (language === "ta") {
      text = `இன்று மொத்தம் ${total} மருந்துகள் திட்டமிடப்பட்டுள்ளன. நீங்கள் ${taken} மருந்துகளை எடுத்துள்ளீர்கள், ${remaining} மீதமுள்ளன. உங்கள் தினசரி பின்பற்றுதல் ${overallAdherence} சதவீதம் ஆகும்.`;
    } else if (language === "te") {
      text = `ఈ రోజు మొత్తం ${total} మోతాదులు షెడ్యూల్ చేయబడ్డాయి. మీరు ${taken} మోతాదులను తీసుకున్నారు, ${remaining} మిగిలి ఉన్నాయి. మీ రోజువారీ పాటించే శాతం ${overallAdherence} శాతం.`;
    }
    
    speak(text, language);
  };

  const handleOpenCustomTimeModal = (dose) => {
    setSelectedDoseForCustomTime(dose);
    const now = new Date();
    setCustomTimeInput(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`);
  };

  const handleConfirmCustomDose = () => {
    if (selectedDoseForCustomTime) {
      markDoseTaken(selectedDoseForCustomTime.id, customTimeInput);
      setSelectedDoseForCustomTime(null);
    }
  };

  const [previewImage, setPreviewImage] = useState(null);

  return (
    <div>
      {/* Image Lightbox Modal */}
      {previewImage && (
        <div className="modal-overlay" onClick={() => setPreviewImage(null)}>
          <div className="modal-content" style={{ maxWidth: "520px", textAlign: "center", padding: "1rem" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <h4 style={{ margin: 0, color: "var(--primary)" }}>Prescription / Strip Photo</h4>
              <button onClick={() => setPreviewImage(null)} style={{ padding: "4px", cursor: "pointer" }}>✕</button>
            </div>
            <img 
              src={previewImage} 
              alt="Prescription Photo" 
              style={{ width: "100%", maxHeight: "70vh", objectFit: "contain", borderRadius: "8px" }} 
            />
          </div>
        </div>
      )}
      {/* Top Adherence & Quick Stats Card */}
      <div className="card-container" style={{ padding: "1.25rem 1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <CalendarCheck size={22} style={{ color: "var(--primary)" }} />
              <h2 style={{ fontSize: "var(--font-size-xl)", color: "var(--primary)" }}>
                {t.navTimeline} - Today
              </h2>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>
              {schedule.length} {t.dosesScheduled} • {schedule.filter(d => d.status === "taken").length} Completed
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Adherence Percentage Meter */}
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                {t.todayAdherence}
              </div>
              <div style={{ fontSize: "var(--font-size-2xl)", fontWeight: 800, color: overallAdherence >= 80 ? "var(--safe)" : "var(--moderate)" }}>
                {overallAdherence}%
              </div>
            </div>

            {/* Read Aloud Button */}
            <button className="control-btn" onClick={handleVoiceReadSchedule} title="Read schedule aloud">
              <Volume2 size={17} style={{ color: "var(--primary)" }} />
              <span>{t.readAloud}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Adherence Progress Bar */}
        <div style={{ width: "100%", height: "8px", background: "var(--border-subtle)", borderRadius: "var(--radius-full)", overflow: "hidden", marginTop: "0.75rem" }}>
          <div 
            style={{ 
              width: `${overallAdherence}%`, 
              height: "100%", 
              background: overallAdherence === 100 ? "var(--safe)" : "linear-gradient(90deg, #0284c7, #2e7d32)",
              transition: "width 0.4s ease"
            }} 
          />
        </div>
      </div>

      {/* Dynamic Rescheduling Alert Notice (PRD Section 5.5 & 15) */}
      {rescheduleNotice && (
        <div className="reschedule-banner">
          <RefreshCw size={22} className="speaking-pulse" style={{ flexShrink: 0, marginTop: "2px" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>
              {t.rescheduleNotice} — {rescheduleNotice.medicationName}
            </div>
            <div style={{ fontSize: "var(--font-size-sm)", marginTop: "2px" }}>
              {rescheduleNotice.reason}
            </div>
          </div>
          <button 
            onClick={() => setRescheduleNotice(null)}
            style={{ color: "#0369a1", fontWeight: 700, padding: "2px 8px" }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Time Slots (Morning, Afternoon, Evening, Bedtime) */}
      {DEFAULT_TIME_SLOTS.map((slot) => {
        const slotDoses = schedule.filter(d => d.slotId === slot.id);
        if (slotDoses.length === 0) return null;

        const slotLabel = t.timeSlots[slot.labelKey] || `${slot.name} (${slot.defaultTime})`;

        return (
          <div key={slot.id} className="time-slot-group">
            <div className="slot-heading">
              <Clock size={18} />
              <span>{slotLabel}</span>
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-light)", marginLeft: "auto" }}>
                {slotDoses.length} {slotDoses.length === 1 ? "Dose" : "Doses"}
              </span>
            </div>

            <div>
              {slotDoses.map((dose) => {
                const isTaken = dose.status === "taken";
                const isRescheduled = dose.status === "rescheduled";
                const isMissed = dose.status === "missed";

                return (
                  <div 
                    key={dose.id} 
                    className={`dose-card ${isTaken ? "status-taken" : isRescheduled ? "status-rescheduled" : isMissed ? "status-missed" : ""}`}
                  >
                    <div className="dose-details">
                      <div 
                        className="dose-pill-avatar"
                        style={{
                          overflow: "hidden",
                          position: "relative",
                          padding: 0,
                          cursor: dose.labelImage ? "pointer" : "default"
                        }}
                        onClick={() => dose.labelImage && setPreviewImage(dose.labelImage)}
                        title={dose.labelImage ? "Click to enlarge photo" : undefined}
                      >
                        {dose.labelImage ? (
                          <>
                            <img 
                              src={dose.labelImage} 
                              alt={dose.brandName} 
                              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} 
                            />
                            {isTaken && (
                              <div style={{
                                position: "absolute",
                                inset: 0,
                                background: "rgba(46, 125, 50, 0.8)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white"
                              }}>
                                <Check size={22} strokeWidth={3} />
                              </div>
                            )}
                          </>
                        ) : (
                          isTaken ? <Check size={24} strokeWidth={2.8} /> : <Pill size={22} />
                        )}
                      </div>

                      <div>
                        <div className="dose-name">
                          <span>{dose.brandName}</span>
                          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)" }}>
                            • {dose.strength}
                          </span>
                          {isRescheduled && (
                            <span style={{ fontSize: "0.72rem", background: "#e0f2fe", color: "#0284c7", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>
                              Rescheduled to {dose.scheduledTime}
                            </span>
                          )}
                        </div>

                        <div className="dose-generic">
                          {dose.genericName} • {dose.dose}
                        </div>

                        <div className="dose-instructions-tag">
                          <span>🕒 Scheduled: {dose.scheduledTime}</span>
                          {isTaken && <span style={{ color: "var(--safe)", fontWeight: 700 }}>• Taken at {dose.actualTime}</span>}
                          <span>• {dose.instructions}</span>
                        </div>

                        {dose.rescheduledReason && (
                          <div style={{ fontSize: "0.75rem", color: "#0284c7", fontWeight: 600, marginTop: "4px" }}>
                            ℹ️ {dose.rescheduledReason}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="dose-actions">
                      {isTaken ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--safe)", fontWeight: 800, fontSize: "0.9rem" }}>
                          <CheckCircle2 size={20} />
                          <span>{t.markTakenShort}</span>
                        </div>
                      ) : (
                        <>
                          <button
                            className="btn-dose-check"
                            onClick={() => markDoseTaken(dose.id)}
                            title="Mark as taken now"
                          >
                            <Check size={16} />
                            <span>{t.markTaken}</span>
                          </button>

                          <button
                            className="control-btn"
                            onClick={() => handleOpenCustomTimeModal(dose)}
                            title="Log dose taken at a specific earlier/later time to test dynamic rescheduling"
                            style={{ fontSize: "0.78rem" }}
                          >
                            <span>Log Late/Custom</span>
                          </button>

                          <button
                            className="control-btn"
                            onClick={() => skipDose(dose.id, "Skipped by patient")}
                            style={{ color: "var(--text-light)" }}
                            title="Skip this dose"
                          >
                            <span>{t.skipDose}</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {schedule.length === 0 && (
        <div className="card-container" style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)" }}>
          <Clock size={48} style={{ opacity: 0.3, marginBottom: "0.75rem" }} />
          <h3>No Doses in Today's Schedule</h3>
          <p style={{ marginTop: "0.4rem" }}>Scan medicines to automatically generate your smart timeline schedule.</p>
        </div>
      )}

      {/* Custom Time Modal for Demonstrating Dynamic Rescheduling */}
      {selectedDoseForCustomTime && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "440px" }}>
            <h3 style={{ color: "var(--primary)", marginBottom: "0.5rem" }}>
              Log Dose Intake Time
            </h3>
            <p style={{ fontSize: "var(--font-size-sm)", color: "var(--text-muted)", marginBottom: "1rem" }}>
              Simulate taking <strong>{selectedDoseForCustomTime.brandName}</strong> at a late or early time to test dynamic safe interval recalculation.
            </p>

            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "4px" }}>
                Actual Taken Time:
              </label>
              <input 
                type="time" 
                value={customTimeInput}
                onChange={(e) => setCustomTimeInput(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  borderRadius: "var(--radius-md)",
                  border: "1.5px solid var(--border-medium)"
                }}
              />
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                Scheduled was: {selectedDoseForCustomTime.scheduledTime} (Safe interval: {selectedDoseForCustomTime.minGapHours} hrs)
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setSelectedDoseForCustomTime(null)}>
                Cancel
              </button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleConfirmCustomDose}>
                Confirm Intake
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
