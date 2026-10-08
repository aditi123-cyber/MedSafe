/**
 * MedSafe Live Caregiver Emergency Alert Pop-Up & SMS Gateway
 * Immediately pops up on screen when patient triggers an SOS alert,
 * misses a critical dose, or encounters severe drug contraindications.
 */

import React, { useEffect, useState } from "react";
import { useMedSafe } from "../context/MedSafeContext";
import { 
  BellRing, 
  X, 
  PhoneCall, 
  MessageSquare, 
  ShieldAlert, 
  Smartphone, 
  User, 
  MapPin, 
  Activity, 
  CheckCircle2,
  AlertOctagon,
  HeartHandshake
} from "lucide-react";

export default function SimulatedSMSNotification() {
  const { 
    simulatedIncomingAlert, 
    setSimulatedIncomingAlert, 
    setCurrentTab,
    activeProfile,
    caregivers
  } = useMedSafe();

  const [visible, setVisible] = useState(false);
  const [replySent, setReplySent] = useState(false);

  useEffect(() => {
    if (simulatedIncomingAlert) {
      setVisible(true);
      setReplySent(false);
    }
  }, [simulatedIncomingAlert]);

  if (!visible || !simulatedIncomingAlert) return null;

  const isCrit = simulatedIncomingAlert.severity === "critical";

  const handleQuickReply = (msgText) => {
    setReplySent(true);
    setTimeout(() => {
      alert(`Automated SMS sent to ${activeProfile.name}: "${msgText}"`);
    }, 300);
  };

  return (
    <div 
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        maxWidth: "440px",
        width: "calc(100% - 40px)",
        background: isCrit ? "linear-gradient(135deg, #ffffff 0%, #fff5f5 100%)" : "#ffffff",
        border: `2px solid ${isCrit ? "var(--critical)" : "var(--primary)"}`,
        borderRadius: "16px",
        boxShadow: "0 20px 45px rgba(0,0,0,0.35)",
        zIndex: 99999,
        padding: "1.25rem",
        animation: "pop-in-alert 0.35s cubic-bezier(0.16, 1, 0.3, 1)"
      }}
      className="caregiver-live-popup"
    >
      <style>{`
        @keyframes pop-in-alert {
          from { transform: scale(0.85) translateY(-20px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        .pulse-critical {
          animation: critical-pulse-glow 1.5s infinite alternate;
        }
        @keyframes critical-pulse-glow {
          from { box-shadow: 0 0 10px rgba(239, 68, 68, 0.4); }
          to { box-shadow: 0 0 25px rgba(239, 68, 68, 0.85); }
        }
      `}</style>

      {/* Top Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", borderBottom: `1px solid ${isCrit ? "rgba(239, 68, 68, 0.2)" : "var(--border-subtle)"}`, paddingBottom: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: isCrit ? "var(--critical)" : "var(--primary)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <BellRing size={16} className="speaking-pulse" />
          </div>
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: 800, color: isCrit ? "var(--critical)" : "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {isCrit ? "🚨 Live Caregiver Alert" : "Caregiver Notification"}
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
              SMS & Push Broadcast Active
            </div>
          </div>
        </div>

        <button 
          onClick={() => setVisible(false)}
          style={{
            background: "rgba(0,0,0,0.05)",
            border: "none",
            borderRadius: "50%",
            width: "26px",
            height: "26px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--text-muted)"
          }}
          title="Dismiss popup"
        >
          <X size={15} />
        </button>
      </div>

      {/* Alert Title & Message */}
      <div style={{ marginBottom: "0.85rem" }}>
        <h4 style={{
          fontSize: "1rem",
          fontWeight: 800,
          color: isCrit ? "var(--critical-dark)" : "var(--primary)",
          margin: "0 0 0.35rem 0",
          lineHeight: 1.3
        }}>
          {simulatedIncomingAlert.title}
        </h4>
        <div style={{
          background: isCrit ? "rgba(239, 68, 68, 0.08)" : "#f8fafc",
          border: `1px solid ${isCrit ? "rgba(239, 68, 68, 0.25)" : "var(--border-subtle)"}`,
          padding: "0.75rem",
          borderRadius: "8px",
          fontSize: "0.85rem",
          color: "var(--text-main)",
          lineHeight: 1.45
        }}>
          {simulatedIncomingAlert.message}
        </div>
      </div>

      {/* Patient & Caregiver Info Strip */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.85rem", fontSize: "0.74rem", color: "var(--text-muted)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <User size={13} style={{ color: "var(--primary)" }} />
          <span><strong>Patient:</strong> {simulatedIncomingAlert.patientName || activeProfile.name}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <MapPin size={13} style={{ color: "var(--teal-accent)" }} />
          <span><strong>Location:</strong> Home / Living Room</span>
        </div>
      </div>

      {/* Quick Action Buttons for Caregiver */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            className="btn-primary"
            onClick={() => {
              alert(`Calling patient ${activeProfile.name} (${caregivers[0]?.phone || "+91 98765 43210"})...`);
            }}
            style={{
              flex: 1,
              padding: "0.55rem",
              fontSize: "0.82rem",
              minHeight: "auto",
              background: isCrit ? "var(--critical)" : "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px"
            }}
          >
            <PhoneCall size={14} />
            <span>Call Patient Now</span>
          </button>

          <button
            className="control-btn"
            onClick={() => {
              setCurrentTab("caregiver");
              setVisible(false);
            }}
            style={{
              flex: 1,
              padding: "0.55rem",
              fontSize: "0.82rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px"
            }}
          >
            <HeartHandshake size={14} />
            <span>Open Caregiver Hub</span>
          </button>
        </div>

        {/* Quick SMS Reply Chips */}
        {!replySent ? (
          <div style={{ display: "flex", gap: "4px", overflowX: "auto", paddingTop: "2px" }}>
            <button
              onClick={() => handleQuickReply("On my way, please sit down and stay calm.")}
              style={{ fontSize: "0.72rem", background: "#ffffff", border: "1px solid var(--border-medium)", borderRadius: "6px", padding: "3px 7px", cursor: "pointer", whiteSpace: "nowrap" }}
            >
              💬 Reply: "On my way"
            </button>
            <button
              onClick={() => handleQuickReply("Did you take your heart medicine with water?")}
              style={{ fontSize: "0.72rem", background: "#ffffff", border: "1px solid var(--border-medium)", borderRadius: "6px", padding: "3px 7px", cursor: "pointer", whiteSpace: "nowrap" }}
            >
              💬 Reply: "Check dose"
            </button>
          </div>
        ) : (
          <div style={{ fontSize: "0.74rem", color: "var(--safe)", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
            <CheckCircle2 size={13} />
            <span>Quick SMS response sent to patient!</span>
          </div>
        )}
      </div>
    </div>
  );
}
