/**
 * MedSafe Interactive Sidebar Navbar
 * Matches the layout and aesthetic of the screenshot:
 * - Search Bar with ⌘K
 * - Navigation links with badges (New, Alert) and carets (>)
 * - Categories: Explore, Build & AI, and Active Profile Bot Widget
 */

import React, { useState } from "react";
import { useMedSafe } from "../context/MedSafeContext";
import { 
  Home, 
  Search, 
  Camera, 
  ShieldAlert, 
  CalendarClock, 
  HeartHandshake, 
  Pill, 
  Sparkles, 
  Bot, 
  ChevronRight,
  UserPlus,
  LogIn
} from "lucide-react";

export default function SidebarNav({ onOpenSearch }) {
  const { 
    currentTab, 
    setCurrentTab, 
    criticalCount, 
    moderateCount, 
    activeProfile, 
    medications,
    currentUser,
    setIsAuthModalOpen,
    setAuthModalMode,
    t
  } = useMedSafe();

  const totalAlerts = criticalCount + moderateCount;

  return (
    <aside className="sidebar-navbar" aria-label="Sidebar Navigation">
      {/* Search Bar with ⌘K Shortcut */}
      <div className="sidebar-search-box" onClick={onOpenSearch}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Search size={15} />
          <span>{t.searchPlaceholder || "Search..."}</span>
        </div>
        <span className="search-shortcut-badge">⌘K</span>
      </div>

      {/* Primary Home Nav */}
      <button
        className={`sidebar-nav-item ${currentTab === "home" ? "active" : ""}`}
        onClick={() => setCurrentTab("home")}
      >
        <div className="sidebar-nav-item-left">
          <Home size={17} />
          <span>{t.navHome || "Home"}</span>
        </div>
      </button>

      {/* Explore Section */}
      <div className="nav-group-title">{t.navExplore || "Explore"}</div>

      <button
        className={`sidebar-nav-item ${currentTab === "scan" ? "active" : ""}`}
        onClick={() => setCurrentTab("scan")}
      >
        <div className="sidebar-nav-item-left">
          <Camera size={17} />
          <span>{t.navScan || "Scan & Verify"}</span>
        </div>
        <div className="sidebar-nav-item-right">
          <span className="sidebar-badge-new">New</span>
          <ChevronRight size={14} className="sidebar-caret" />
        </div>
      </button>

      <button
        className={`sidebar-nav-item ${currentTab === "safety" ? "active" : ""}`}
        onClick={() => setCurrentTab("safety")}
      >
        <div className="sidebar-nav-item-left">
          <ShieldAlert size={17} />
          <span>{t.navSafety || "Safety Checks"}</span>
        </div>
        <div className="sidebar-nav-item-right">
          {totalAlerts > 0 ? (
            <span className="sidebar-badge-alert">{totalAlerts} Alert</span>
          ) : null}
          <ChevronRight size={14} className="sidebar-caret" />
        </div>
      </button>

      <button
        className={`sidebar-nav-item ${currentTab === "timeline" ? "active" : ""}`}
        onClick={() => setCurrentTab("timeline")}
      >
        <div className="sidebar-nav-item-left">
          <CalendarClock size={17} />
          <span>{t.navTimeline || "Daily Schedule"}</span>
        </div>
        <div className="sidebar-nav-item-right">
          <ChevronRight size={14} className="sidebar-caret" />
        </div>
      </button>

      <button
        className={`sidebar-nav-item ${currentTab === "caregiver" ? "active" : ""}`}
        onClick={() => setCurrentTab("caregiver")}
      >
        <div className="sidebar-nav-item-left">
          <HeartHandshake size={17} />
          <span>{t.navCaregiver || "Caregiver Alerts"}</span>
        </div>
        <div className="sidebar-nav-item-right">
          <span className="sidebar-badge-new">SMS</span>
          <ChevronRight size={14} className="sidebar-caret" />
        </div>
      </button>

      <button
        className={`sidebar-nav-item ${currentTab === "knowledge" ? "active" : ""}`}
        onClick={() => setCurrentTab("knowledge")}
      >
        <div className="sidebar-nav-item-left">
          <Pill size={17} />
          <span>{t.navKnowledge || "Drug Knowledge"}</span>
        </div>
        <div className="sidebar-nav-item-right">
          <span className="sidebar-badge-new">Rx</span>
          <ChevronRight size={14} className="sidebar-caret" />
        </div>
      </button>

      {/* Build & AI Section */}
      <div className="nav-group-title">{t.navBuildAI || "Build & Intelligence"}</div>

      <button
        className={`sidebar-nav-item ${currentTab === "scan" ? "active" : ""}`}
        onClick={() => setCurrentTab("scan")}
      >
        <div className="sidebar-nav-item-left">
          <Sparkles size={17} />
          <span>{t.navMultiPhoto || "Multi-Photo Studio"}</span>
        </div>
        <div className="sidebar-nav-item-right">
          <ChevronRight size={14} className="sidebar-caret" />
        </div>
      </button>

      <button
        className={`sidebar-nav-item ${currentTab === "aibot" ? "active" : ""}`}
        onClick={() => setCurrentTab("aibot")}
      >
        <div className="sidebar-nav-item-left">
          <Bot size={17} />
          <span>{t.navAIBot || "MedSafe AI Bot"}</span>
        </div>
        <div className="sidebar-nav-item-right">
          <span className="sidebar-badge-new" style={{ background: "#fdf2f8", color: "#db2777" }}>AI</span>
          <ChevronRight size={14} className="sidebar-caret" />
        </div>
      </button>

      <button
        className={`sidebar-nav-item ${currentTab === "login" ? "active" : ""}`}
        onClick={() => {
          setAuthModalMode("register");
          setCurrentTab("login");
        }}
      >
        <div className="sidebar-nav-item-left">
          <UserPlus size={17} style={{ color: "var(--teal-accent)" }} />
          <span>{t.navAddUser || "Add New User"}</span>
        </div>
        <div className="sidebar-nav-item-right">
          <span className="sidebar-badge-new" style={{ background: "#ecfdf5", color: "#059669" }}>Email</span>
          <ChevronRight size={14} className="sidebar-caret" />
        </div>
      </button>

      {/* Bottom Profile / User Status Widget */}
      <div 
        className="sidebar-bottom-card"
        onClick={() => {
          setAuthModalMode("switch");
          setIsAuthModalOpen(true);
        }}
        style={{ cursor: "pointer", transition: "all 0.15s ease" }}
        title="Click to switch or manage user accounts"
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
          <div style={{ fontWeight: 700, color: "var(--primary)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              background: currentUser?.avatarColor || "var(--primary)",
              color: "#ffffff",
              fontSize: "0.62rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              {currentUser?.avatarInitials || "U"}
            </div>
            <span>{currentUser?.name || activeProfile?.name}</span>
          </div>
          <span style={{ fontSize: "0.7rem", color: "var(--teal-accent)", fontWeight: 700 }}>{t.switchUser || "Switch"}</span>
        </div>
        <div style={{ color: "var(--text-muted)", fontSize: "0.74rem", lineHeight: 1.3, display: "flex", justifyContent: "space-between" }}>
          <span>{currentUser?.email || `${medications.length} Prescriptions`}</span>
        </div>
      </div>

      {/* Developer Credits Badge */}
      <div style={{
        marginTop: "0.5rem",
        padding: "0.45rem 0.6rem",
        borderRadius: "8px",
        background: "rgba(14, 165, 233, 0.05)",
        border: "1px solid rgba(14, 165, 233, 0.15)",
        textAlign: "center",
        fontSize: "0.68rem",
        color: "var(--text-muted)",
        lineHeight: 1.35
      }}>
        <div style={{ fontWeight: 700, color: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
          <span>Crafted by</span>
        </div>
        <div style={{ fontWeight: 800, color: "var(--text-main)", marginTop: "1px" }}>
          Aashutosh Rajput & Aditi Gupta
        </div>
      </div>
    </aside>
  );
}
