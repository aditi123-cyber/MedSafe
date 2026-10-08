/**
 * MedSafe Caregiver Alert System & Remote Family View
 * Automated SMS/WhatsApp notifications, caregiver setup, consent flags,
 * and live adherence monitoring dashboard.
 * PRD Section 5.6 & 10
 */

import React, { useState } from "react";
import { useMedSafe } from "../context/MedSafeContext";
import { 
  HeartHandshake, 
  BellRing, 
  PhoneCall, 
  MessageSquare, 
  ShieldAlert, 
  CheckCircle2, 
  UserPlus, 
  Send, 
  Calendar, 
  Clock, 
  AlertOctagon,
  Sparkles,
  Smartphone
} from "lucide-react";

export default function CaregiverView() {
  const { 
    caregivers, 
    setCaregivers, 
    alertHistory, 
    triggerCaregiverAlert, 
    activeProfile, 
    overallAdherence,
    schedule,
    criticalCount,
    moderateCount,
    t,
    isCaregiverViewMode
  } = useMedSafe();

  const [newCaregiver, setNewCaregiver] = useState({
    name: "",
    relationship: "Family Member",
    phone: "+91 ",
    email: "",
    enableSMS: true,
    enableWhatsApp: true,
    alertOnCritical: true,
    alertOnMissedDose: true
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddCaregiver = (e) => {
    e.preventDefault();
    if (!newCaregiver.name || !newCaregiver.phone) return;

    const created = {
      ...newCaregiver,
      id: `cg-${Date.now()}`
    };

    setCaregivers(prev => [...prev, created]);
    setShowAddForm(false);
    setNewCaregiver({
      name: "",
      relationship: "Family Member",
      phone: "+91 ",
      email: "",
      enableSMS: true,
      enableWhatsApp: true,
      alertOnCritical: true,
      alertOnMissedDose: true
    });
  };

  const handleSendTestSOS = () => {
    triggerCaregiverAlert(
      "TEST EMERGENCY SOS ALERT",
      `Test notification from MedSafe: All safety verification channels for ${activeProfile.name} are active and functional.`,
      "critical"
    );
  };

  return (
    <div>
      {/* Caregiver View Mode Notice */}
      {isCaregiverViewMode && (
        <div style={{
          background: "linear-gradient(90deg, #003366, #0d4a8a)",
          color: "white",
          padding: "1rem 1.25rem",
          borderRadius: "var(--radius-lg)",
          marginBottom: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>
              📡 Remote Caregiver Live Monitor Active
            </div>
            <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>
              Viewing live medication compliance & safety alerts for: <strong>{activeProfile.name}</strong> ({activeProfile.age} yrs)
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: "var(--radius-full)", fontSize: "0.8rem", fontWeight: 700 }}>
            Read-Only Family Link
          </div>
        </div>
      )}

      {/* Header Info */}
      <div className="card-container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--primary)" }}>
              <HeartHandshake size={26} />
              <span>{t.caregiverTitle}</span>
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)", marginTop: "2px" }}>
              {t.caregiverSub} (Compliant with India DPDP Act Consent Protocols)
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
              <UserPlus size={18} />
              <span>{showAddForm ? "Close Form" : "Add Caregiver"}</span>
            </button>

            <button className="btn-secondary" onClick={handleSendTestSOS}>
              <Send size={16} />
              <span>{t.sendTestAlert}</span>
            </button>
          </div>
        </div>

        {/* Add Caregiver Form */}
        {showAddForm && (
          <form onSubmit={handleAddCaregiver} style={{ background: "var(--bg-surface-subtle)", padding: "1.25rem", borderRadius: "var(--radius-md)", marginTop: "1rem", border: "1px solid var(--border-subtle)" }}>
            <h4 style={{ marginBottom: "0.75rem", color: "var(--primary)" }}>Link New Emergency Contact / Caregiver</h4>
            <div className="grid-2" style={{ gap: "0.75rem", marginBottom: "0.75rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={newCaregiver.name}
                  onChange={(e) => setNewCaregiver({ ...newCaregiver, name: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--border-medium)" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>Relationship</label>
                <input
                  type="text"
                  placeholder="e.g. Daughter / Nurse / Doctor"
                  value={newCaregiver.relationship}
                  onChange={(e) => setNewCaregiver({ ...newCaregiver, relationship: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--border-medium)" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>Mobile Phone (for SMS/WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={newCaregiver.phone}
                  onChange={(e) => setNewCaregiver({ ...newCaregiver, phone: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--border-medium)" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>Email Address</label>
                <input
                  type="email"
                  placeholder="priya@example.com"
                  value={newCaregiver.email}
                  onChange={(e) => setNewCaregiver({ ...newCaregiver, email: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--border-medium)" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={newCaregiver.alertOnCritical}
                  onChange={(e) => setNewCaregiver({ ...newCaregiver, alertOnCritical: e.target.checked })}
                />
                <span>Alert on Critical Drug Interactions</span>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={newCaregiver.alertOnMissedDose}
                  onChange={(e) => setNewCaregiver({ ...newCaregiver, alertOnMissedDose: e.target.checked })}
                />
                <span>Alert on Missed Critical Doses</span>
              </label>
            </div>

            <button type="submit" className="btn-primary">
              Save Caregiver Consent & Link
            </button>
          </form>
        )}

        {/* Caregiver Cards */}
        <div style={{ marginTop: "1.25rem" }}>
          <h3 style={{ fontSize: "var(--font-size-base)", marginBottom: "0.75rem" }}>
            Linked Family Contacts & Doctors ({caregivers.length})
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
            {caregivers.map((cg) => (
              <div
                key={cg.id}
                style={{
                  background: "var(--bg-surface)",
                  border: "1.5px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  padding: "1rem",
                  boxShadow: "var(--shadow-sm)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--primary)" }}>
                      {cg.name}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {cg.relationship}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.35rem" }}>
                    <a href={`tel:${cg.phone}`} className="control-btn" style={{ padding: "4px 8px" }} title="Direct Call">
                      <PhoneCall size={15} style={{ color: "var(--safe)" }} />
                    </a>
                    <a href={`sms:${cg.phone}`} className="control-btn" style={{ padding: "4px 8px" }} title="Direct SMS">
                      <MessageSquare size={15} style={{ color: "var(--primary)" }} />
                    </a>
                  </div>
                </div>

                <div style={{ fontSize: "0.82rem", color: "var(--text-main)", marginBottom: "0.75rem" }}>
                  📞 {cg.phone} {cg.email && `• ✉️ ${cg.email}`}
                </div>

                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", fontSize: "0.72rem" }}>
                  {cg.enableSMS && <span style={{ background: "var(--safe-bg)", color: "var(--safe)", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>SMS Active</span>}
                  {cg.enableWhatsApp && <span style={{ background: "#e0f2fe", color: "#0369a1", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>WhatsApp Active</span>}
                  {cg.alertOnCritical && <span style={{ background: "var(--critical-bg)", color: "var(--critical)", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>Critical Alerts</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Alert Simulation & Delivery Log */}
      <div className="card-container">
        <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <Smartphone size={20} style={{ color: "var(--primary)" }} />
          <span>{t.simulatedSMS} & Delivery History ({alertHistory.length})</span>
        </h3>

        {alertHistory.length === 0 ? (
          <p style={{ fontSize: "var(--font-size-sm)", color: "var(--text-muted)", textAlign: "center", padding: "1.5rem" }}>
            No emergency alerts triggered yet. If a critical conflict occurs or a dose is delayed, alerts appear here instantly.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {alertHistory.map((alert) => (
              <div
                key={alert.id}
                style={{
                  background: alert.severity === "critical" ? "var(--critical-bg)" : "var(--primary-subtle)",
                  border: `1.5px solid ${alert.severity === "critical" ? "var(--critical-border)" : "var(--border-subtle)"}`,
                  borderRadius: "var(--radius-md)",
                  padding: "0.9rem",
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "flex-start"
                }}
              >
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: alert.severity === "critical" ? "var(--critical)" : "var(--primary)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  <BellRing size={18} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ fontWeight: 800, fontSize: "0.92rem", color: alert.severity === "critical" ? "var(--critical-dark)" : "var(--primary)" }}>
                      {alert.title}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      🕒 {alert.timestamp}
                    </div>
                  </div>

                  <p style={{ fontSize: "0.85rem", color: "var(--text-main)", margin: "0.25rem 0" }}>
                    {alert.message}
                  </p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                    <span>Sent to: {alert.recipients.join(", ")}</span>
                    <span style={{ color: "var(--safe)", fontWeight: 700 }}>✓ {alert.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
