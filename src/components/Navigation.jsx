/**
 * MedSafe Primary Navigation Bar
 * Section 10 of PRD: Simple navigation with at most 4-5 tabs, large touch targets (48dp+)
 */

import React from "react";
import { useMedSafe } from "../context/MedSafeContext";
import { 
  LayoutDashboard, 
  Camera, 
  ShieldAlert, 
  CalendarClock, 
  HeartHandshake 
} from "lucide-react";

export default function Navigation() {
  const { currentTab, setCurrentTab, t, criticalCount, moderateCount } = useMedSafe();
  const totalAlerts = criticalCount + moderateCount;

  return (
    <nav className="main-nav" aria-label="Main Application Navigation">
      <button
        className={`nav-tab-btn ${currentTab === "home" ? "active" : ""}`}
        onClick={() => setCurrentTab("home")}
        aria-current={currentTab === "home" ? "page" : undefined}
      >
        <LayoutDashboard size={20} />
        <span>{t.navHome}</span>
      </button>

      <button
        className={`nav-tab-btn ${currentTab === "scan" ? "active" : ""}`}
        onClick={() => setCurrentTab("scan")}
        aria-current={currentTab === "scan" ? "page" : undefined}
      >
        <Camera size={20} />
        <span>{t.navScan}</span>
      </button>

      <button
        className={`nav-tab-btn ${currentTab === "safety" ? "active" : ""}`}
        onClick={() => setCurrentTab("safety")}
        aria-current={currentTab === "safety" ? "page" : undefined}
      >
        <ShieldAlert size={20} />
        <span>{t.navSafety}</span>
        {totalAlerts > 0 && (
          <span className="nav-badge-alert" title={`${totalAlerts} Active Drug Warnings`}>
            {totalAlerts}
          </span>
        )}
      </button>

      <button
        className={`nav-tab-btn ${currentTab === "timeline" ? "active" : ""}`}
        onClick={() => setCurrentTab("timeline")}
        aria-current={currentTab === "timeline" ? "page" : undefined}
      >
        <CalendarClock size={20} />
        <span>{t.navTimeline}</span>
      </button>

      <button
        className={`nav-tab-btn ${currentTab === "caregiver" ? "active" : ""}`}
        onClick={() => setCurrentTab("caregiver")}
        aria-current={currentTab === "caregiver" ? "page" : undefined}
      >
        <HeartHandshake size={20} />
        <span>{t.navCaregiver}</span>
      </button>
    </nav>
  );
}
