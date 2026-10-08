/**
 * MedSafe Human-in-the-Loop Confirmation Screen
 * Adheres to PRD Section 5.3 & 15: Shows extracted OCR fields next to the label image,
 * highlights confidence scores, and enables 1-click edits before committing to safety checks.
 */

import React, { useState } from "react";
import { useMedSafe } from "../context/MedSafeContext";
import { 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Edit3, 
  ShieldCheck, 
  Pill, 
  Clock, 
  FileText 
} from "lucide-react";

export default function ConfirmMedicineModal({ pendingMed, onConfirm, onCancel }) {
  const { t, language } = useMedSafe();

  const [formData, setFormData] = useState({
    id: pendingMed.id,
    brandName: pendingMed.brandName || "",
    genericName: pendingMed.genericName || "",
    strength: pendingMed.strength || "500 mg",
    form: pendingMed.form || "Tablet",
    dose: pendingMed.dose || "1 Tablet",
    frequency: pendingMed.frequency || "1-0-1",
    timing: pendingMed.timing || "Morning & Night",
    instructions: pendingMed.instructions || "After food",
    confidence: pendingMed.confidence || 92,
    labelImage: pendingMed.labelImage || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80",
    rawOcrText: pendingMed.rawOcrText || ""
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({ ...formData, confirmed: true });
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content modal-content-wide">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.75rem" }}>
          <div>
            <h2 style={{ fontSize: "var(--font-size-xl)", color: "var(--primary)" }}>
              {t.confirmHeader}
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>
              {t.confirmSub}
            </p>
          </div>
          <button 
            onClick={onCancel}
            style={{ padding: "0.4rem", borderRadius: "50%", color: "var(--text-muted)" }}
            aria-label="Close dialog"
          >
            <X size={22} />
          </button>
        </div>

        {/* Side-by-Side: Label Preview & Editable Form */}
        <div className="grid-2" style={{ gap: "1.5rem", alignItems: "start" }}>
          {/* Scanned Image & OCR Confidence Card */}
          <div style={{ background: "var(--bg-surface-subtle)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
            <div style={{ position: "relative", borderRadius: "8px", overflow: "hidden", marginBottom: "0.75rem", maxHeight: "200px" }}>
              <img 
                src={formData.labelImage} 
                alt="Scanned Prescription Label"
                style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }}
              />
              <div style={{
                position: "absolute",
                bottom: 8,
                left: 8,
                background: "rgba(0, 0, 0, 0.75)",
                color: "white",
                padding: "3px 8px",
                borderRadius: "4px",
                fontSize: "0.75rem",
                fontWeight: 600
              }}>
                📷 Captured Label Image
              </div>
            </div>

            {/* OCR Confidence Badge */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: formData.confidence >= 90 ? "var(--safe-bg)" : "var(--moderate-bg)",
              padding: "0.5rem 0.75rem",
              borderRadius: "var(--radius-sm)",
              marginBottom: "0.75rem"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 700, fontSize: "0.85rem", color: formData.confidence >= 90 ? "var(--safe)" : "var(--moderate)" }}>
                {formData.confidence >= 90 ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                <span>{formData.confidence}% {formData.confidence >= 90 ? "High Extraction Confidence" : "Moderate Confidence - Please Verify"}</span>
              </div>
            </div>

            {/* Raw OCR Extracted Text snippet */}
            {formData.rawOcrText && (
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.25rem" }}>
                  Raw OCR Text Stream:
                </div>
                <div style={{
                  background: "var(--bg-surface)",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  fontFamily: "monospace",
                  color: "var(--text-main)",
                  border: "1px solid var(--border-medium)",
                  maxHeight: "90px",
                  overflowY: "auto",
                  whiteSpace: "pre-line"
                }}>
                  {formData.rawOcrText}
                </div>
              </div>
            )}
          </div>

          {/* Editable Form Fields (Human in the Loop) */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {/* Brand Name */}
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "2px" }}>
                {t.brandName} *
              </label>
              <input
                type="text"
                required
                value={formData.brandName}
                onChange={(e) => handleChange("brandName", e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.55rem 0.75rem",
                  borderRadius: "var(--radius-md)",
                  border: "1.5px solid var(--border-medium)",
                  fontWeight: 700,
                  fontSize: "var(--font-size-base)",
                  color: "var(--primary)"
                }}
              />
            </div>

            {/* Mapped Generic Name */}
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "2px" }}>
                {t.genericName} (Mapped Molecule) *
              </label>
              <input
                type="text"
                required
                value={formData.genericName}
                onChange={(e) => handleChange("genericName", e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.55rem 0.75rem",
                  borderRadius: "var(--radius-md)",
                  border: "1.5px solid var(--border-medium)",
                  fontWeight: 600
                }}
              />
            </div>

            {/* Strength & Form */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "2px" }}>
                  {t.strength}
                </label>
                <input
                  type="text"
                  value={formData.strength}
                  onChange={(e) => handleChange("strength", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-medium)",
                    fontWeight: 600
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "2px" }}>
                  {t.form}
                </label>
                <select
                  value={formData.form}
                  onChange={(e) => handleChange("form", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-medium)",
                    fontWeight: 600
                  }}
                >
                  <option value="Tablet">Tablet</option>
                  <option value="Capsule">Capsule</option>
                  <option value="Syrup">Syrup / Liquid</option>
                  <option value="Inhaler">Inhaler</option>
                  <option value="Drops">Drops</option>
                  <option value="Injection">Injection</option>
                </select>
              </div>
            </div>

            {/* Frequency Pattern & Timing */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "2px" }}>
                  {t.frequency}
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => handleChange("frequency", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-medium)",
                    fontWeight: 600
                  }}
                >
                  <option value="1-0-1">1-0-1 (Morning & Night)</option>
                  <option value="1-0-0">1-0-0 (Morning Only)</option>
                  <option value="0-0-1">0-0-1 (Bedtime Only)</option>
                  <option value="1-1-1">1-1-1 (Thrice Daily)</option>
                  <option value="0-1-0">0-1-0 (Afternoon Only)</option>
                  <option value="PRN">PRN (As Needed / SOS)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "2px" }}>
                  {t.instructions}
                </label>
                <input
                  type="text"
                  value={formData.instructions}
                  onChange={(e) => handleChange("instructions", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-medium)"
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
              <button type="button" className="btn-secondary" onClick={onCancel} style={{ flex: 1 }}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" style={{ flex: 2 }}>
                <ShieldCheck size={18} />
                <span>{t.saveAndCheck}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
