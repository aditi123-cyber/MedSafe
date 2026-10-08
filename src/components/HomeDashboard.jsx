/**
 * MedSafe Modern Healthcare Home Dashboard
 * Color Palette: Calming Navy Blue, Muted Teal, Clean White, and Soft Grey.
 * High readability, soft contrast, and soothing patient-centric aesthetics.
 */

import React from "react";
import { useMedSafe } from "../context/MedSafeContext";
import { 
  Camera, 
  ShieldCheck, 
  AlertOctagon, 
  CalendarClock, 
  HeartHandshake, 
  Pill, 
  ChevronRight, 
  Layers, 
  Clock, 
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function HomeDashboard() {
  const { 
    activeProfile, 
    medications, 
    schedule, 
    overallAdherence, 
    criticalCount, 
    moderateCount, 
    setCurrentTab,
    sendPatientSOS,
    t
  } = useMedSafe();

  const nextDueDose = schedule.find(d => d.status !== "taken");
  const isSafetyClear = medications.length >= 2 && criticalCount === 0 && moderateCount === 0;

  return (
    <div className="dashboard-page-container">
      {/* SECTION 1: "Top today" */}
      <div className="dashboard-section-header">
        <div>
          <h2 className="section-headline-title">{t.topToday || "Top today"}</h2>
          <p className="section-headline-sub">{t.topTodaySub || "Immediate Safety Status, Active Prescriptions & Today's Schedule"}</p>
        </div>
        <button 
          className="section-view-all-link"
          onClick={() => setCurrentTab("safety")}
        >
          <span>{t.viewAll || "View all"}</span>
          <ChevronRight size={15} />
        </button>
      </div>

      {/* Numbered Cards (1, 2, 3, 4) in Calming Healthcare Palette */}
      <div className="top-today-cards-grid">
        {/* CARD 1: Multi-Photo Scanner */}
        <div className="top-card-item" onClick={() => setCurrentTab("scan")}>
          <div className="card-number-watermark">1</div>
          <div className="top-card-preview-area">
            <div className="top-card-inner-box">
              <Camera size={34} style={{ color: "var(--teal-accent)", marginBottom: "0.4rem" }} />
              <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--primary)" }}>
                {t.multiPhotoScannerTitle || "Multi-Photo Scanner"}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>
                {t.multiPhotoScannerSub || "Upload multiple strips at once"}
              </div>
            </div>
          </div>
          <div className="top-card-footer">
            <span className="top-card-title">{t.navScan || "Prescription Scan"}</span>
            <span className="top-card-badge" style={{ background: "var(--teal-bg)", color: "var(--teal-accent-hover)" }}>
              {t.prescriptionScanBadge || "Multi-Strip"}
            </span>
          </div>
        </div>

        {/* CARD 2: Safety & Contraindications */}
        <div className="top-card-item" onClick={() => setCurrentTab("safety")}>
          <div className="card-number-watermark">2</div>
          <div className="top-card-preview-area">
            <div className="top-card-inner-box">
              {criticalCount > 0 ? (
                <>
                  <AlertOctagon size={34} style={{ color: "var(--critical)", marginBottom: "0.4rem" }} />
                  <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--critical)" }}>
                    {criticalCount} {t.criticalConflictsFound || "Critical Conflict"}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--critical-dark)", marginTop: "2px" }}>
                    {t.doctorConsultAdvised || "Doctor consult advised"}
                  </div>
                </>
              ) : isSafetyClear ? (
                <>
                  <ShieldCheck size={34} style={{ color: "var(--safe)", marginBottom: "0.4rem" }} />
                  <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--safe)" }}>
                    {t.verifiedSafe || "Verified Safe"}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    {t.zeroConflictsFound || "Zero conflicts found"}
                  </div>
                </>
              ) : (
                <>
                  <ShieldCheck size={34} style={{ color: "var(--primary-light)", marginBottom: "0.4rem" }} />
                  <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--primary)" }}>
                    {t.safetyVerificationTitle || "Safety Engine"}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    {medications.length} {t.activeMedicinesCount || "active medicines"}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="top-card-footer">
            <span className="top-card-title">{t.navSafety || "Safety Verification"}</span>
            <span 
              className="top-card-badge" 
              style={{ 
                background: criticalCount > 0 ? "var(--critical-bg)" : isSafetyClear ? "var(--safe-bg)" : "var(--primary-bg)", 
                color: criticalCount > 0 ? "var(--critical)" : isSafetyClear ? "var(--safe)" : "var(--primary)" 
              }}
            >
              {criticalCount > 0 ? "Critical" : isSafetyClear ? "Safe" : "Active"}
            </span>
          </div>
        </div>

        {/* CARD 3: Smart Daily Timeline */}
        <div className="top-card-item" onClick={() => setCurrentTab("timeline")}>
          <div className="card-number-watermark">3</div>
          <div className="top-card-preview-area">
            <div className="top-card-inner-box">
              <CalendarClock size={34} style={{ color: "var(--primary-light)", marginBottom: "0.4rem" }} />
              <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--primary)" }}>
                {overallAdherence}% {t.adherenceRate || "Adherence"}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>
                {schedule.filter(d => d.status === "taken").length}/{schedule.length} {t.dosesCompletedCount || "Doses Completed"}
              </div>
            </div>
          </div>
          <div className="top-card-footer">
            <span className="top-card-title">{t.dailyScheduleTitle || "Daily Schedule"}</span>
            <span className="top-card-badge" style={{ background: "var(--primary-bg)", color: "var(--primary)" }}>
              {t.dynamicGapBadge || "Dynamic Gap"}
            </span>
          </div>
        </div>

        {/* CARD 4: Caregiver Alerts */}
        <div className="top-card-item" onClick={() => setCurrentTab("caregiver")}>
          <div className="card-number-watermark">4</div>
          <div className="top-card-preview-area">
            <div className="top-card-inner-box">
              <HeartHandshake size={34} style={{ color: "var(--teal-accent)", marginBottom: "0.4rem" }} />
              <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--primary)" }}>
                {t.navCaregiver || "Caregiver Alerts"}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>
                {t.smsActiveBadge || "SMS Active"}
              </div>
            </div>
          </div>
          <div className="top-card-footer">
            <span className="top-card-title">{t.familyMonitorTitle || "Family Monitor"}</span>
            <span className="top-card-badge" style={{ background: "var(--teal-bg)", color: "var(--teal-accent-hover)" }}>
              {t.smsActiveBadge || "SMS Active"}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: "New & noteworthy" */}
      <div className="dashboard-section-header">
        <div>
          <h2 className="section-headline-title">{t.newAndNoteworthy || "New & noteworthy"}</h2>
          <p className="section-headline-sub">{t.newAndNoteworthySub || "Active Prescriptions, Mapped Generic Molecules & Safe Dosing Insights"}</p>
        </div>
        <button 
          className="section-view-all-link"
          onClick={() => setCurrentTab("scan")}
        >
          <span>{t.viewAll || "View all"}</span>
          <ChevronRight size={15} />
        </button>
      </div>

      {/* Grid for New & Noteworthy Items */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
        {/* Next Scheduled Dose Highlight Card */}
        {nextDueDose && (
          <div 
            className="card-container"
            style={{
              marginBottom: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              cursor: "pointer"
            }}
            onClick={() => setCurrentTab("timeline")}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--teal-accent)", textTransform: "uppercase" }}>
                  {t.nextScheduledDose || "Next Scheduled Dose"} ({nextDueDose.scheduledTime})
                </span>
                <Clock size={16} style={{ color: "var(--teal-accent)" }} />
              </div>
              <h3 style={{ fontSize: "1.15rem", color: "var(--primary)", marginBottom: "4px" }}>
                {nextDueDose.brandName} • {nextDueDose.strength}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                {nextDueDose.genericName} • {nextDueDose.instructions}
              </p>
            </div>

            <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.78rem", color: "var(--text-light)" }}>{t.tapToLogDose || "Tap to log intake"}</span>
              <span style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 700 }}>{t.logDoseArrow || "Log Dose →"}</span>
            </div>
          </div>
        )}

        {/* Multi-Photo Scanner Feature Card */}
        <div 
          className="card-container"
          style={{
            marginBottom: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            cursor: "pointer"
          }}
          onClick={() => setCurrentTab("scan")}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--safe)", textTransform: "uppercase" }}>
                {t.prescriptionScanBadge || "Multi-Strip"}
              </span>
              <Layers size={16} style={{ color: "var(--safe)" }} />
            </div>
            <h3 style={{ fontSize: "1.15rem", color: "var(--primary)", marginBottom: "4px" }}>
              {t.batchPrescriptionUpload || "Batch Prescription Upload"}
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              {t.batchPrescriptionSub || "Upload multiple medicine strip photos at once with auto-detection of doses and frequency."}
            </p>
          </div>

          <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--text-light)" }}>{t.browseSelectPhotosBtn || "Upload photos now"}</span>
            <span style={{ fontSize: "0.85rem", color: "var(--safe)", fontWeight: 700 }}>{t.openScannerArrow || "Open Scanner →"}</span>
          </div>
        </div>

        {/* AI & Clinical Interaction Knowledge Card */}
        <div 
          className="card-container"
          style={{
            marginBottom: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            cursor: "pointer"
          }}
          onClick={() => setCurrentTab("safety")}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--primary-light)", textTransform: "uppercase" }}>
                RxNorm & openFDA
              </span>
              <Pill size={16} style={{ color: "var(--primary-light)" }} />
            </div>
            <h3 style={{ fontSize: "1.15rem", color: "var(--primary)", marginBottom: "4px" }}>
              {t.indianBrandMappings || "Indian Brand Mappings"}
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              {t.indianBrandMappingsSub || "Over 50 Indian commercial brands mapped to generic chemical molecules with duplicate overdose prevention."}
            </p>
          </div>

          <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--text-light)" }}>{t.navSafety || "Check interactions"}</span>
            <span style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 700 }}>{t.viewReportArrow || "View Report →"}</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: Live Patient Emergency SOS Trigger to Caregiver */}
      <div 
        style={{
          marginTop: "2rem",
          background: "linear-gradient(135deg, rgba(239, 68, 68, 0.06) 0%, rgba(13, 148, 136, 0.06) 100%)",
          border: "2px solid rgba(239, 68, 68, 0.25)",
          borderRadius: "14px",
          padding: "1.25rem 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: "var(--critical)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 0 15px rgba(239, 68, 68, 0.4)"
          }}>
            <AlertOctagon size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 800, color: "var(--critical-dark)", fontSize: "1.05rem" }}>
              {t.patientEmergencySOSTitle || "Patient Emergency SOS to Caregiver"}
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              {t.patientEmergencySOSSub || "Send an instant emergency SMS & live pop-up broadcast to registered caregivers."}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            onClick={() => sendPatientSOS("Patient feeling sudden dizziness after medication")}
            className="control-btn"
            style={{ fontSize: "0.78rem", borderColor: "rgba(239, 68, 68, 0.4)", color: "var(--critical)" }}
          >
            {t.sendDizzyAlert || "⚠️ Send \"Feeling Dizzy\""}
          </button>
          <button
            onClick={() => sendPatientSOS("Missed scheduled evening cardiac dose")}
            className="control-btn"
            style={{ fontSize: "0.78rem", borderColor: "rgba(239, 68, 68, 0.4)", color: "var(--critical)" }}
          >
            {t.sendMissedDoseAlert || "💊 Send \"Missed Dose\""}
          </button>
          <button
            onClick={() => sendPatientSOS("Urgent Assistance / Blood Pressure Spike")}
            className="btn-primary"
            style={{ minHeight: "auto", padding: "0.5rem 1rem", background: "var(--critical)", fontSize: "0.82rem" }}
          >
            {t.triggerUrgentSOS || "🚨 Trigger Urgent SOS"}
          </button>
        </div>
      </div>
    </div>
  );
}
