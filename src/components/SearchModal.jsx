/**
 * MedSafe Command Palette & Drug Search Modal (⌘K)
 * Clean Healthcare Theme: White background, soft slate borders, high-contrast text.
 */

import React, { useState, useEffect } from "react";
import { useMedSafe } from "../context/MedSafeContext";
import { DRUG_DATABASE, INTERACTION_RULES } from "../data/drugDatabase";
import { Search, X, Pill, ShieldAlert, ArrowRight, Camera, CalendarClock } from "lucide-react";

export default function SearchModal({ isOpen, onClose }) {
  const { setCurrentTab, addMedication, t } = useMedSafe();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(true); // toggle open
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredDrugs = DRUG_DATABASE.filter(d => 
    d.brandName.toLowerCase().includes(query.toLowerCase()) || 
    d.genericName.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const filteredInteractions = INTERACTION_RULES.filter(i =>
    i.titleEn.toLowerCase().includes(query.toLowerCase()) ||
    i.drugA.toLowerCase().includes(query.toLowerCase()) ||
    i.drugB.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{
          maxWidth: "600px",
          background: "var(--bg-surface)",
          border: "1.5px solid var(--border-medium)",
          color: "var(--text-main)",
          padding: 0,
          overflow: "hidden",
          boxShadow: "var(--shadow-lg)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div style={{ display: "flex", alignItems: "center", padding: "1rem 1.25rem", borderBottom: "1.5px solid var(--border-subtle)", gap: "0.75rem", background: "var(--bg-surface-subtle)" }}>
          <Search size={20} style={{ color: "var(--teal-accent)" }} />
          <input
            type="text"
            placeholder={t.searchModalTitle || "Search drugs, Indian brands, interactions, or navigate... (Esc to close)"}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              color: "var(--text-main)",
              fontSize: "1rem",
              fontWeight: 600,
              outline: "none"
            }}
          />
          <button onClick={onClose} style={{ color: "var(--text-light)", background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
            <X size={18} />
          </button>
        </div>

        {/* Search Results */}
        <div style={{ maxHeight: "380px", overflowY: "auto", padding: "1rem" }}>
          {/* Quick Actions */}
          <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-light)", textTransform: "uppercase", padding: "0.3rem 0.5rem" }}>
            {t.quickNav || "Quick Navigation"}
          </div>
          <button
            className="sidebar-nav-item"
            onClick={() => {
              setCurrentTab("scan");
              onClose();
            }}
          >
            <div className="sidebar-nav-item-left">
              <Camera size={16} style={{ color: "var(--teal-accent)" }} />
              <span>{t.openScannerNav || "Open Multi-Photo Scanner"}</span>
            </div>
            <ArrowRight size={14} style={{ color: "var(--text-light)" }} />
          </button>

          <button
            className="sidebar-nav-item"
            onClick={() => {
              setCurrentTab("timeline");
              onClose();
            }}
          >
            <div className="sidebar-nav-item-left">
              <CalendarClock size={16} style={{ color: "var(--primary-light)" }} />
              <span>{t.viewScheduleNav || "View Daily Schedule"}</span>
            </div>
            <ArrowRight size={14} style={{ color: "var(--text-light)" }} />
          </button>

          {/* Matched Drugs from Database */}
          <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-light)", textTransform: "uppercase", padding: "0.75rem 0.5rem 0.3rem 0.5rem" }}>
            {t.medsBrandMappings || "Medicines & Brand Mappings"} ({filteredDrugs.length})
          </div>
          {filteredDrugs.map(drug => (
            <div
              key={drug.brandName}
              style={{
                padding: "0.65rem 0.85rem",
                borderRadius: "8px",
                background: "var(--bg-surface-subtle)",
                border: "1px solid var(--border-subtle)",
                marginBottom: "5px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
              onClick={() => {
                addMedication({
                  id: `med-search-${Date.now()}`,
                  brandName: drug.brandName,
                  genericName: drug.genericName,
                  strength: drug.strength,
                  form: drug.form,
                  dose: `1 ${drug.form}`,
                  frequency: drug.defaultFrequency,
                  instructions: drug.mealInstruction,
                  confidence: 98,
                  confirmed: true
                });
                setCurrentTab("safety");
                onClose();
              }}
            >
              <div>
                <div style={{ fontWeight: 800, color: "var(--primary)", fontSize: "0.92rem" }}>{drug.brandName}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 500 }}>{drug.genericName} • {drug.strength}</div>
              </div>
              <span style={{ fontSize: "0.74rem", background: "var(--primary-bg)", color: "var(--primary)", padding: "3px 8px", borderRadius: "4px", fontWeight: 700 }}>
                + Add to Safety Pool
              </span>
            </div>
          ))}

          {/* Matched Clinical Interactions */}
          {filteredInteractions.length > 0 && (
            <>
              <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-light)", textTransform: "uppercase", padding: "0.75rem 0.5rem 0.3rem 0.5rem" }}>
                {t.drugInteractionsWarnings || "Drug Interactions & Warnings"}
              </div>
              {filteredInteractions.map(int => (
                <div
                  key={int.id}
                  style={{
                    padding: "0.65rem 0.85rem",
                    borderRadius: "8px",
                    background: int.severity === "critical" ? "var(--critical-bg)" : "var(--moderate-bg)",
                    border: `1.5px solid ${int.severity === "critical" ? "var(--critical-border)" : "var(--moderate-border)"}`,
                    marginBottom: "5px",
                    cursor: "pointer"
                  }}
                  onClick={() => {
                    setCurrentTab("safety");
                    onClose();
                  }}
                >
                  <div style={{ fontWeight: 800, color: int.severity === "critical" ? "var(--critical)" : "var(--moderate)", fontSize: "0.88rem" }}>
                    ⚠️ {int.titleEn}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-main)", marginTop: "2px", fontWeight: 500 }}>
                    {int.drugA} ⟷ {int.drugB}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
