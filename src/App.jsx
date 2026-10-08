/**
 * MedSafe - Patient Prescription Safety Verification Platform
 * Main App Root Component with Interactive Sidebar Layout
 */

import React, { useState } from "react";
import { MedSafeProvider, useMedSafe } from "./context/MedSafeContext";
import SidebarNav from "./components/SidebarNav";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import HomeDashboard from "./components/HomeDashboard";
import ScannerView from "./components/ScannerView";
import SafetyDashboard from "./components/SafetyDashboard";
import TimelineView from "./components/TimelineView";
import CaregiverView from "./components/CaregiverView";
import DrugKnowledgeView from "./components/DrugKnowledgeView";
import AIBotView from "./components/AIBotView";
import LoginPage from "./components/LoginPage";
import AuthModal from "./components/AuthModal";
import SearchModal from "./components/SearchModal";
import SimulatedSMSNotification from "./components/SimulatedSMSNotification";
import { ShieldCheck, Info } from "lucide-react";

function MedSafeAppContent() {
  const { currentTab, t } = useMedSafe();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      {/* Interactive Sidebar Navigation (as shown in screenshot) */}
      <SidebarNav onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Main Dashboard Content Area */}
      <div className="dashboard-main-content">
        {/* Top Header */}
        <Header />

        {/* Top Disclaimer Banner */}
        <div className="disclaimer-banner">
          <Info size={14} style={{ color: "var(--teal-accent)" }} />
          <span>
            <strong>{t.patientSafetyNoticeTitle || "Patient Safety Notice:"}</strong> {t.patientSafetyNoticeBody || "MedSafe flags immediate drug interactions and builds daily schedules. Never adjust medication dosages without professional medical consultation."}
          </span>
        </div>

        {/* Main Tab Routing */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {currentTab === "home" && <HomeDashboard />}
          {currentTab === "scan" && <div className="dashboard-page-container"><ScannerView /></div>}
          {currentTab === "safety" && <div className="dashboard-page-container"><SafetyDashboard /></div>}
          {currentTab === "timeline" && <div className="dashboard-page-container"><TimelineView /></div>}
          {currentTab === "caregiver" && <div className="dashboard-page-container"><CaregiverView /></div>}
          {currentTab === "knowledge" && <DrugKnowledgeView />}
          {currentTab === "aibot" && <AIBotView />}
          {currentTab === "login" && <LoginPage />}
        </main>

        {/* Search / Command Palette Modal */}
        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

        {/* User Login & Add User Modal Overlay */}
        <AuthModal />

        {/* Floating Simulated SMS Notification Alert */}
        <SimulatedSMSNotification />

        {/* Clean Clinical Footer */}
        <footer style={{
          background: "#111111",
          borderTop: "1px solid #27272a",
          padding: "1.25rem 2rem",
          fontSize: "0.8rem",
          color: "#71717a",
          marginTop: "auto"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, color: "#f4f4f5" }}>
              <ShieldCheck size={18} style={{ color: "#38bdf8" }} />
              <span>{t.footerText || "MedSafe • Prescription Safety Verification & Medication Timeline"}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <MedSafeProvider>
      <MedSafeAppContent />
    </MedSafeProvider>
  );
}
