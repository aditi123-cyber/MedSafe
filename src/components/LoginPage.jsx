/**
 * MedSafe Clinical Authentication & Add User Portal
 * Supports Email Login, New User Registration with Clinical Profiles,
 * Multi-user Switching, and One-Click Demo Access.
 */

import React, { useState } from "react";
import { useMedSafe } from "../context/MedSafeContext";
import { 
  ShieldCheck, 
  UserPlus, 
  LogIn, 
  Users, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  HeartHandshake, 
  Stethoscope, 
  AlertCircle, 
  Sparkles, 
  Phone, 
  Calendar, 
  Activity, 
  ArrowRight,
  Check,
  X
} from "lucide-react";

export default function LoginPage({ isModal = false, onClose = () => {} }) {
  const { 
    users, 
    currentUser, 
    loginWithEmail, 
    addNewUser, 
    switchUser, 
    authModalMode, 
    setAuthModalMode,
    setCurrentTab,
    setIsAuthModalOpen,
    t
  } = useMedSafe();

  const [activeTab, setActiveTab] = useState(authModalMode || "register"); // "login", "register", "switch"
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState(null);

  // Sign In Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register / Add User Form State
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState("patient"); // "patient", "caregiver", "doctor"
  const [regAge, setRegAge] = useState("68");
  const [regWeight, setRegWeight] = useState("65");
  const [regCondition, setRegCondition] = useState("");
  const [regAllergies, setRegAllergies] = useState("");
  const [regPhone, setRegPhone] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setNotification({ type: "error", message: "Please enter a valid email address." });
      return;
    }

    const result = loginWithEmail(loginEmail, loginPassword);
    if (result.success) {
      setNotification({ 
        type: "success", 
        message: result.isNew 
          ? `New account created for ${result.user.name}! Welcome to MedSafe.` 
          : `Signed in successfully as ${result.user.name}!` 
      });
      setTimeout(() => {
        if (isModal) setIsAuthModalOpen(false);
        setCurrentTab("home");
      }, 900);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regName.trim()) {
      setNotification({ type: "error", message: "Please provide the user's full name." });
      return;
    }
    if (!regEmail.trim() || !regEmail.includes("@")) {
      setNotification({ type: "error", message: "Please provide a valid email address (e.g. user@example.com)." });
      return;
    }

    const result = addNewUser({
      name: regName,
      email: regEmail,
      password: regPassword,
      role: regRole,
      age: regAge,
      weightKg: regWeight,
      condition: regCondition || "General Health Monitoring",
      knownAllergies: regAllergies || "None Reported",
      emergencyContact: regPhone,
      phone: regPhone,
      specialty: regRole === "doctor" ? "Consulting Specialist" : ""
    });

    if (result.success) {
      setNotification({
        type: "success",
        message: `User "${result.user.name}" registered successfully! Profile safety matrix activated.`
      });
      setTimeout(() => {
        if (isModal) setIsAuthModalOpen(false);
        setCurrentTab("home");
      }, 1000);
    }
  };

  const handleQuickSwitch = (userId) => {
    switchUser(userId);
    const target = users.find(u => u.id === userId);
    setNotification({
      type: "success",
      message: `Active profile switched to ${target?.name || "selected user"}.`
    });
    setTimeout(() => {
      if (isModal) setIsAuthModalOpen(false);
      setCurrentTab("home");
    }, 700);
  };

  return (
    <div className={isModal ? "auth-modal-overlay" : "auth-page-wrapper"} style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: isModal ? "auto" : "calc(100vh - 120px)",
      padding: isModal ? "0" : "2rem 1rem",
      background: isModal ? "transparent" : "var(--bg-app)"
    }}>
      <div 
        className="auth-card" 
        style={{
          width: "100%",
          maxWidth: "680px",
          background: "#ffffff",
          borderRadius: "16px",
          border: "1.5px solid var(--border-medium)",
          boxShadow: "var(--shadow-lg)",
          overflow: "hidden"
        }}
      >
        {/* Top Header Banner */}
        <div style={{
          background: "linear-gradient(135deg, var(--primary) 0%, #002244 100%)",
          color: "#ffffff",
          padding: "1.5rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <div style={{
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255, 255, 255, 0.25)"
            }}>
              <ShieldCheck size={26} style={{ color: "#38bdf8" }} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>
                {t.portalTitle || "MedSafe User Portal"}
              </h2>
              <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "rgba(255, 255, 255, 0.8)" }}>
                {t.portalSub || "Add new clinical users, manage family patient profiles, and access verified Rx safety."}
              </p>
            </div>
          </div>

          {isModal && (
            <button
              onClick={onClose}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "none",
                color: "#ffffff",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Tab Navigation Controls */}
        <div style={{
          display: "flex",
          borderBottom: "1.5px solid var(--border-subtle)",
          background: "var(--bg-surface-subtle)"
        }}>
          <button
            onClick={() => { setActiveTab("register"); setNotification(null); }}
            style={{
              flex: 1,
              padding: "0.9rem",
              background: activeTab === "register" ? "var(--bg-surface)" : "transparent",
              border: "none",
              borderBottom: activeTab === "register" ? "3px solid var(--primary)" : "3px solid transparent",
              fontWeight: 700,
              color: activeTab === "register" ? "var(--primary)" : "var(--text-muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              fontSize: "0.92rem",
              transition: "all 0.2s ease"
            }}
          >
            <UserPlus size={16} />
            <span>{t.tabRegister || "Add New User"}</span>
            <span style={{ fontSize: "0.68rem", background: "var(--primary-bg)", color: "var(--primary)", padding: "2px 6px", borderRadius: "10px", fontWeight: 700 }}>Email</span>
          </button>

          <button
            onClick={() => { setActiveTab("login"); setNotification(null); }}
            style={{
              flex: 1,
              padding: "0.9rem",
              background: activeTab === "login" ? "var(--bg-surface)" : "transparent",
              border: "none",
              borderBottom: activeTab === "login" ? "3px solid var(--primary)" : "3px solid transparent",
              fontWeight: 700,
              color: activeTab === "login" ? "var(--primary)" : "var(--text-muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              fontSize: "0.92rem",
              transition: "all 0.2s ease"
            }}
          >
            <LogIn size={16} />
            <span>{t.tabLogin || "Sign In"}</span>
          </button>

          <button
            onClick={() => { setActiveTab("switch"); setNotification(null); }}
            style={{
              flex: 1,
              padding: "0.9rem",
              background: activeTab === "switch" ? "var(--bg-surface)" : "transparent",
              border: "none",
              borderBottom: activeTab === "switch" ? "3px solid var(--primary)" : "3px solid transparent",
              fontWeight: 700,
              color: activeTab === "switch" ? "var(--primary)" : "var(--text-muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              fontSize: "0.92rem",
              transition: "all 0.2s ease"
            }}
          >
            <Users size={16} />
            <span>{t.tabSavedUsers || "Saved Users"} ({users.length})</span>
          </button>
        </div>

        {/* Notification Banner */}
        {notification && (
          <div style={{
            margin: "1rem 1.75rem 0",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            background: notification.type === "success" ? "#ecfdf5" : "#fef2f2",
            color: notification.type === "success" ? "#065f46" : "#991b1b",
            border: `1.5px solid ${notification.type === "success" ? "#a7f3d0" : "#fecaca"}`,
            fontSize: "0.85rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            {notification.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{notification.message}</span>
          </div>
        )}

        <div style={{ padding: "1.75rem" }}>
          {/* TAB 1: ADD NEW USER (REGISTER) */}
          {activeTab === "register" && (
            <form onSubmit={handleRegisterSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.5rem" }}>
                  1. Select Account Role
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
                  <div
                    onClick={() => setRegRole("patient")}
                    style={{
                      border: `2px solid ${regRole === "patient" ? "var(--primary)" : "var(--border-subtle)"}`,
                      background: regRole === "patient" ? "var(--primary-bg)" : "var(--bg-surface)",
                      borderRadius: "10px",
                      padding: "0.75rem",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <User size={20} style={{ color: regRole === "patient" ? "var(--primary)" : "var(--text-muted)", margin: "0 auto 4px" }} />
                    <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--text-main)" }}>{t.rolePatient || "Patient (Self)"}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Prescriptions & Schedule</div>
                  </div>

                  <div
                    onClick={() => setRegRole("caregiver")}
                    style={{
                      border: `2px solid ${regRole === "caregiver" ? "var(--teal-accent)" : "var(--border-subtle)"}`,
                      background: regRole === "caregiver" ? "var(--teal-bg)" : "var(--bg-surface)",
                      borderRadius: "10px",
                      padding: "0.75rem",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <HeartHandshake size={20} style={{ color: regRole === "caregiver" ? "var(--teal-accent)" : "var(--text-muted)", margin: "0 auto 4px" }} />
                    <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--text-main)" }}>{t.roleCaregiver || "Family Caregiver"}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>SMS & Missed Dose Alerts</div>
                  </div>

                  <div
                    onClick={() => setRegRole("doctor")}
                    style={{
                      border: `2px solid ${regRole === "doctor" ? "var(--primary)" : "var(--border-subtle)"}`,
                      background: regRole === "doctor" ? "var(--primary-bg)" : "var(--bg-surface)",
                      borderRadius: "10px",
                      padding: "0.75rem",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <Stethoscope size={20} style={{ color: regRole === "doctor" ? "var(--primary)" : "var(--text-muted)", margin: "0 auto 4px" }} />
                    <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--text-main)" }}>{t.roleDoctor || "Doctor / Clinician"}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Safety Review & Auditing</div>
                  </div>
                </div>
              </div>

              {/* Basic Details: Name & Email */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "4px" }}>
                    {t.fullNameLabel || "Full Name *"}
                  </label>
                  <div style={{ position: "relative" }}>
                    <User size={16} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }} />
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Sharma"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "0.55rem 0.6rem 0.55rem 2.2rem",
                        border: "1.5px solid var(--border-medium)",
                        borderRadius: "8px",
                        fontSize: "0.9rem"
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "4px" }}>
                    {t.emailLabel || "Email Address (Account Login) *"}
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail size={16} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }} />
                    <input
                      type="email"
                      placeholder="e.g. ramesh@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "0.55rem 0.6rem 0.55rem 2.2rem",
                        border: "1.5px solid var(--border-medium)",
                        borderRadius: "8px",
                        fontSize: "0.9rem"
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Password & Phone */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "4px" }}>
                    {t.passwordLabel || "Password / Medical PIN"}
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock size={16} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.55rem 2.2rem 0.55rem 2.2rem",
                        border: "1.5px solid var(--border-medium)",
                        borderRadius: "8px",
                        fontSize: "0.9rem"
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "4px" }}>
                    {t.phoneLabel || "Phone Number (for SMS Alerts)"}
                  </label>
                  <div style={{ position: "relative" }}>
                    <Phone size={16} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }} />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.55rem 0.6rem 0.55rem 2.2rem",
                        border: "1.5px solid var(--border-medium)",
                        borderRadius: "8px",
                        fontSize: "0.9rem"
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Clinical Safety Details: Age, Weight, Condition, Allergies */}
              <div style={{ background: "var(--bg-surface-subtle)", border: "1px solid var(--border-subtle)", padding: "0.85rem", borderRadius: "10px" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--primary)", marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "5px" }}>
                  <Activity size={15} />
                  <span>Clinical Safety Profile (Used for Contraindication Checks)</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "2px" }}>
                      {t.patientAgeLabel || "Patient Age (Years)"}
                    </label>
                    <input
                      type="number"
                      value={regAge}
                      onChange={(e) => setRegAge(e.target.value)}
                      placeholder="e.g. 68"
                      style={{ width: "100%", padding: "0.45rem", border: "1px solid var(--border-medium)", borderRadius: "6px", fontSize: "0.85rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "2px" }}>
                      {t.weightLabel || "Weight (kg)"}
                    </label>
                    <input
                      type="number"
                      value={regWeight}
                      onChange={(e) => setRegWeight(e.target.value)}
                      placeholder="e.g. 65"
                      style={{ width: "100%", padding: "0.45rem", border: "1px solid var(--border-medium)", borderRadius: "6px", fontSize: "0.85rem" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "2px" }}>
                      {t.conditionsLabel || "Pre-existing Conditions"}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Hypertension, Cardiac Stent"
                      value={regCondition}
                      onChange={(e) => setRegCondition(e.target.value)}
                      style={{ width: "100%", padding: "0.45rem", border: "1px solid var(--border-medium)", borderRadius: "6px", fontSize: "0.85rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "2px" }}>
                      {t.allergiesLabel || "Known Drug Allergies"}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sulfa, Penicillin, None"
                      value={regAllergies}
                      onChange={(e) => setRegAllergies(e.target.value)}
                      style={{ width: "100%", padding: "0.45rem", border: "1px solid var(--border-medium)", borderRadius: "6px", fontSize: "0.85rem" }}
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "0.85rem",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  marginTop: "0.5rem"
                }}
              >
                <UserPlus size={18} />
                <span>{t.createAccountBtn || "Create User & Activate Clinical Safety Profile"}</span>
              </button>
            </form>
          )}

          {/* TAB 2: SIGN IN WITH EMAIL */}
          {activeTab === "login" && (
            <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "5px" }}>
                  {t.emailLabel || "Email Address *"}
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }} />
                  <input
                    type="email"
                    placeholder="Enter registered email (e.g. ramesh.sharma@medsafe.org)"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.75rem 0.65rem 2.4rem",
                      border: "1.5px solid var(--border-medium)",
                      borderRadius: "8px",
                      fontSize: "0.95rem"
                    }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-main)" }}>
                    {t.passwordLabel || "Password / Medical PIN"}
                  </label>
                  <span style={{ fontSize: "0.75rem", color: "var(--teal-accent)", cursor: "pointer", fontWeight: 600 }}>
                    Demo Mode (No password required)
                  </span>
                </div>
                <div style={{ position: "relative" }}>
                  <Lock size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.65rem 2.4rem 0.65rem 2.4rem",
                      border: "1.5px solid var(--border-medium)",
                      borderRadius: "8px",
                      fontSize: "0.95rem"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "0.85rem",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem"
                }}
              >
                <LogIn size={18} />
                <span>{t.signInBtn || "Sign In to MedSafe"}</span>
              </button>

              {/* Quick 1-Click Demo Profiles */}
              <div style={{ marginTop: "1rem", borderTop: "1px solid var(--border-subtle)", paddingTop: "1rem" }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.6rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {t.oneClickDemo || "Or One-Click Demo Login:"}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                  {users.slice(0, 4).map(u => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleQuickSwitch(u.id)}
                      style={{
                        padding: "0.55rem 0.75rem",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "8px",
                        background: "var(--bg-surface-subtle)",
                        textAlign: "left",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "0.8rem",
                        color: "var(--text-main)",
                        fontWeight: 600
                      }}
                    >
                      <div style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        background: u.avatarColor || "var(--primary)",
                        color: "#ffffff",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        {u.avatarInitials || "U"}
                      </div>
                      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        <div>{u.name}</div>
                        <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "capitalize" }}>{u.role}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

          {/* TAB 3: SAVED USERS LIST & SWITCH */}
          {activeTab === "switch" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>
                Select an existing user profile on this browser to switch active prescriptions, allergies, and daily timeline:
              </div>

              {users.map(u => {
                const isActive = currentUser?.id === u.id;
                return (
                  <div
                    key={u.id}
                    onClick={() => handleQuickSwitch(u.id)}
                    style={{
                      border: `2px solid ${isActive ? "var(--primary)" : "var(--border-subtle)"}`,
                      background: isActive ? "var(--primary-bg)" : "var(--bg-surface)",
                      borderRadius: "12px",
                      padding: "0.85rem 1rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                      <div style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "50%",
                        background: u.avatarColor || "var(--primary)",
                        color: "#ffffff",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        {u.avatarInitials || "U"}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "6px" }}>
                          <span>{u.name}</span>
                          {isActive && (
                            <span style={{ fontSize: "0.65rem", background: "var(--safe-bg)", color: "var(--safe)", padding: "1px 6px", borderRadius: "8px", fontWeight: 700 }}>
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          {u.email} • <span style={{ textTransform: "capitalize", fontWeight: 600 }}>{u.role}</span>
                          {u.age ? ` (${u.age} yrs)` : ""}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {isActive ? (
                        <Check size={18} style={{ color: "var(--primary)" }} />
                      ) : (
                        <button
                          className="control-btn"
                          style={{ fontSize: "0.75rem", padding: "4px 10px" }}
                        >
                          Switch
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              <button
                onClick={() => setActiveTab("register")}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.75rem",
                  border: "1.5px dashed var(--teal-accent)",
                  borderRadius: "10px",
                  background: "rgba(13, 148, 136, 0.04)",
                  color: "var(--teal-accent)",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem"
                }}
              >
                <UserPlus size={16} />
                <span>+ Add Another New User via Email</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
