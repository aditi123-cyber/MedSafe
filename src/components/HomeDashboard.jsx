/**
 * MedSafe Modern Healthcare Home Dashboard
 * Features:
 * - Immediate safety status & numbered quick cards
 * - Patient Live GPS Satellite Location Hub with direct Google Maps route
 * - 5 Emergency Contacts rapid response directory with 1-click calling & SOS dispatch
 * - New & Noteworthy prescription insights
 */

import React, { useState } from "react";
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
  MapPin,
  Navigation,
  Phone,
  PhoneCall,
  MessageSquare,
  RefreshCw,
  ExternalLink,
  Share2,
  AlertTriangle,
  Siren,
  UserCheck,
  Building2,
  Ambulance,
  Stethoscope,
  Users,
  CheckCircle2,
  Copy
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
    broadcastSOSAllContacts,
    liveLocation,
    refreshLocation,
    emergencyContacts,
    language,
    t 
  } = useMedSafe();

  const [copiedLink, setCopiedLink] = useState(false);
  const [activeSOSSent, setActiveSOSSent] = useState(false);

  const nextDueDose = schedule.find(d => d.status !== "taken");
  const isSafetyClear = medications.length >= 2 && criticalCount === 0 && moderateCount === 0;

  const handleCopyLocation = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `📍 Patient Live GPS: ${activeProfile.name} is currently at: ${liveLocation.address} (${liveLocation.latitude.toFixed(4)}, ${liveLocation.longitude.toFixed(4)}). Live Map Route: ${liveLocation.mapsUrl}`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleTriggerBroadcast = () => {
    broadcastSOSAllContacts(`EMERGENCY SOS: ${activeProfile.name} needs immediate medical assistance!`);
    setActiveSOSSent(true);
    setTimeout(() => setActiveSOSSent(false), 5000);
  };

  const getContactIcon = (role = "") => {
    const r = role.toLowerCase();
    if (r.includes("ambulance") || r.includes("emergency")) return <Ambulance size={20} style={{ color: "#dc2626" }} />;
    if (r.includes("doctor") || r.includes("physician") || r.includes("cardiologist")) return <Stethoscope size={20} style={{ color: "#0284c7" }} />;
    if (r.includes("hospital") || r.includes("icu")) return <Building2 size={20} style={{ color: "#0d9488" }} />;
    if (r.includes("caregiver") || r.includes("son")) return <HeartHandshake size={20} style={{ color: "#7c3aed" }} />;
    return <Users size={20} style={{ color: "#475569" }} />;
  };

  return (
    <div className="dashboard-page-container">
      {/* SECTION 1: "Top today" Numbered Cards */}
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

      {/* ========================================================================= */}
      {/* SECTION 2: LIVE PATIENT GPS LOCATION HUB (Interactive Live Tracking)     */}
      {/* ========================================================================= */}
      <div className="live-location-panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
              <div style={{ position: "relative", width: "12px", height: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="live-pulse-dot" />
                <span className="radar-ping-ring" />
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-main)", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                <MapPin size={20} style={{ color: "var(--teal-accent)" }} />
                <span>{t.liveLocationTitle || "Live Patient GPS Location Tracker"}</span>
              </h3>
              <span style={{ 
                fontSize: "0.72rem", 
                background: "rgba(16, 185, 129, 0.12)", 
                color: "var(--safe)", 
                padding: "2px 8px", 
                borderRadius: "12px", 
                border: "1px solid rgba(16, 185, 129, 0.3)",
                fontWeight: 700 
              }}>
                {liveLocation.statusText}
              </span>
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
              {t.liveLocationSub || "Real-time satellite coordinates & address shared with emergency services & family proxies."}
            </p>
          </div>

          {/* Quick Location Action Buttons */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button 
              className="control-btn"
              onClick={refreshLocation}
              title="Refresh GPS Coordinates"
              style={{ fontSize: "0.78rem" }}
            >
              <RefreshCw size={14} />
              <span>{t.refreshGPS || "Refresh GPS"}</span>
            </button>

            <button 
              className="control-btn"
              onClick={handleCopyLocation}
              style={{ fontSize: "0.78rem", color: copiedLink ? "var(--safe)" : "var(--text-main)" }}
            >
              {copiedLink ? <CheckCircle2 size={14} /> : <Copy size={14} />}
              <span>{copiedLink ? "GPS Link Copied!" : (t.shareLocationBtn || "Copy GPS Link")}</span>
            </button>

            <a
              href={liveLocation.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ minHeight: "auto", padding: "0.45rem 0.9rem", fontSize: "0.78rem", textDecoration: "none" }}
            >
              <Navigation size={14} />
              <span>{t.openGoogleMaps || "Open Google Maps"}</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Live GPS Coordinates Info Strip */}
        <div style={{
          background: "var(--bg-surface-secondary)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "10px",
          padding: "0.85rem 1rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "0.75rem",
          alignItems: "center"
        }}>
          <div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-light)", textTransform: "uppercase", fontWeight: 800 }}>
              Current Address & Landmark
            </div>
            <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--text-main)", marginTop: "2px" }}>
              {liveLocation.address}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              {liveLocation.landmark}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-light)", textTransform: "uppercase", fontWeight: 800 }}>
              Exact GPS Coordinates
            </div>
            <div style={{ fontSize: "0.88rem", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--teal-accent)", marginTop: "2px" }}>
              {liveLocation.latitude.toFixed(6)}° N, {liveLocation.longitude.toFixed(6)}° E
            </div>
            <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
              Accuracy: ±{liveLocation.accuracy} meters • Satellite Lock
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-light)", textTransform: "uppercase", fontWeight: 800 }}>
              Patient Identity & Monitored Condition
            </div>
            <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text-main)", marginTop: "2px" }}>
              {activeProfile.name} ({activeProfile.age} yrs)
            </div>
            <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
              Condition: {activeProfile.condition || "Hypertension"} • Allergies: {activeProfile.knownAllergies || "None"}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: 5 EMERGENCY CONTACTS RAPID DIRECTORY & SOS LIFELINES           */}
      {/* ========================================================================= */}
      <div style={{ marginTop: "2rem" }}>
        <div className="dashboard-section-header" style={{ marginBottom: "0.5rem" }}>
          <div>
            <h2 className="section-headline-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Siren size={24} style={{ color: "var(--critical)" }} />
              <span>{t.emergencyContactsTitle || "5 Emergency Contacts & Rapid Response Directory"}</span>
            </h2>
            <p className="section-headline-sub">
              {t.emergencyContactsSub || "Registered emergency lifelines & paramedics dispatched with live GPS during urgent patient SOS."}
            </p>
          </div>
        </div>

        {/* 5 Emergency Contacts Responsive Grid */}
        <div className="emergency-contacts-grid">
          {emergencyContacts.slice(0, 5).map((contact, index) => {
            const isPriority = contact.isPrimary || index < 2;
            const relationText = language === "hi" && contact.relationHi ? contact.relationHi : (contact.relationEn || contact.relation);

            return (
              <div 
                key={contact.id} 
                className={`emergency-contact-card ${isPriority ? "priority-card" : ""}`}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                    <div style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "10px",
                      background: isPriority ? "rgba(239, 68, 68, 0.12)" : "rgba(14, 165, 233, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      {getContactIcon(contact.role)}
                    </div>

                    <span style={{
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      padding: "2px 7px",
                      borderRadius: "6px",
                      background: isPriority ? "rgba(239, 68, 68, 0.15)" : "rgba(14, 165, 233, 0.12)",
                      color: isPriority ? "var(--critical)" : "#0284c7"
                    }}>
                      {contact.badge || `Priority ${index + 1}`}
                    </span>
                  </div>

                  <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "2px" }}>
                    {contact.name}
                  </div>

                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                    {relationText}
                  </div>

                  <div style={{ fontSize: "0.85rem", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--primary-light)", marginBottom: "0.75rem" }}>
                    {contact.phone}
                  </div>
                </div>

                {/* Direct Calling & SMS with GPS Actions */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", paddingTop: "0.6rem", borderTop: "1px solid var(--border-subtle)" }}>
                  <a
                    href={`tel:${contact.phone.replace(/[^0-9+]/g, "")}`}
                    className={`contact-action-btn ${isPriority ? "btn-call-emergency" : "btn-call-primary"}`}
                    title={`Call ${contact.name}`}
                  >
                    <PhoneCall size={13} />
                    <span>{t.callContact || "Call"}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      sendPatientSOS(`Direct emergency dispatch to ${contact.name}`);
                    }}
                    className="contact-action-btn btn-sms-gps"
                    title={`Send emergency SMS to ${contact.name}`}
                  >
                    <MessageSquare size={13} />
                    <span>{t.sendSMSAlert || "Send SOS"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Master One-Click Emergency Broadcast Bar to All 5 Contacts */}
        <div 
          style={{
            marginTop: "1.25rem",
            background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.18) 100%)",
            border: "2px solid rgba(239, 68, 68, 0.35)",
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
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "var(--critical)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 0 20px rgba(239, 68, 68, 0.5)"
            }}>
              <Siren size={26} className="speaking-pulse" />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: "var(--critical-dark)", fontSize: "1.08rem" }}>
                {activeSOSSent 
                  ? "✅ EMERGENCY BROADCAST DISPATCHED TO ALL 5 CONTACTS!" 
                  : (t.broadcastSOSToAll || "🚨 Broadcast Emergency SOS + Live GPS to All 5 Contacts")}
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                Dispatches real-time SMS alerts with Google Maps live route to Dr. Rajesh Sharma, Ambulance (108/112), Dr. Ananya Mehta, Apollo ICU & Family.
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              onClick={() => sendPatientSOS("Patient experiencing sudden severe dizziness post-dose")}
              className="control-btn"
              style={{ fontSize: "0.78rem", borderColor: "rgba(239, 68, 68, 0.4)", color: "var(--critical)" }}
            >
              {t.sendDizzyAlert || "⚠️ Send \"Feeling Dizzy\""}
            </button>
            <button
              onClick={() => sendPatientSOS("Missed vital cardiac medication dose")}
              className="control-btn"
              style={{ fontSize: "0.78rem", borderColor: "rgba(239, 68, 68, 0.4)", color: "var(--critical)" }}
            >
              {t.sendMissedDoseAlert || "💊 Send \"Missed Dose\""}
            </button>
            <button
              onClick={handleTriggerBroadcast}
              className="btn-primary"
              style={{ 
                minHeight: "auto", 
                padding: "0.65rem 1.4rem", 
                background: "var(--critical)", 
                fontSize: "0.88rem",
                boxShadow: "0 4px 14px rgba(239, 68, 68, 0.4)"
              }}
            >
              <Siren size={16} />
              <span>{activeSOSSent ? "Broadcast Active" : (t.triggerUrgentSOS || "🚨 Trigger Urgent SOS")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 4: "New & noteworthy" Prescriptions & Dosing Insights             */}
      {/* ========================================================================= */}
      <div className="dashboard-section-header" style={{ marginTop: "2.25rem" }}>
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
    </div>
  );
}
