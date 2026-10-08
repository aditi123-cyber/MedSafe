/**
 * MedSafe Clinical Drug Knowledge Base & Interaction Graph
 * Searchable Indian brand-to-generic catalog, pairwise interaction checker,
 * therapeutic classes, and dietary timing rules.
 */

import React, { useState } from "react";
import { useMedSafe } from "../context/MedSafeContext";
import { DRUG_DATABASE, INTERACTION_RULES, FOOD_TIMING_RULES } from "../data/drugDatabase";
import { 
  Pill, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  Utensils, 
  Plus, 
  Volume2, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Filter
} from "lucide-react";

export default function DrugKnowledgeView() {
  const { addMedication, setCurrentTab, speak, language, t } = useMedSafe();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [activeSubTab, setActiveSubTab] = useState("catalog"); // "catalog", "checker", "food"
  
  // Pairwise Interactive Checker State
  const [checkerDrugA, setCheckerDrugA] = useState("Warfarin");
  const [checkerDrugB, setCheckerDrugB] = useState("Aspirin");

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "cardiac", label: "Cardiac & Blood Pressure" },
    { id: "pain", label: "Pain & Fever (NSAIDs)" },
    { id: "diabetes", label: "Diabetes" },
    { id: "antibiotic", label: "Antibiotics" },
    { id: "gastro", label: "Antacids & Gastro" }
  ];

  const filteredDrugs = DRUG_DATABASE.filter(drug => {
    const matchesSearch = drug.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drug.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drug.therapeuticClass.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedClass === "all") return matchesSearch;
    return matchesSearch && drug.tags?.includes(selectedClass);
  });

  // Check custom pair in checker
  const findPairInteraction = (nameA, nameB) => {
    return INTERACTION_RULES.find(rule => {
      const rA = rule.drugA.toLowerCase();
      const rB = rule.drugB.toLowerCase();
      const a = nameA.toLowerCase();
      const b = nameB.toLowerCase();
      return (a.includes(rA) && b.includes(rB)) || (a.includes(rB) && b.includes(rA));
    });
  };

  const currentPairResult = findPairInteraction(checkerDrugA, checkerDrugB);

  const handleAddDrugToProfile = (drug) => {
    addMedication({
      id: `med-kb-${Date.now()}`,
      brandName: drug.brandName,
      genericName: drug.genericName,
      strength: drug.strength,
      form: drug.form,
      dose: `1 ${drug.form}`,
      frequency: drug.defaultFrequency,
      instructions: drug.mealInstruction,
      confidence: 99,
      confirmed: true
    });
    alert(`Added ${drug.brandName} (${drug.genericName}) to active safety verification pool.`);
  };

  return (
    <div className="dashboard-page-container">
      {/* Header */}
      <div className="dashboard-section-header">
        <div>
          <h2 className="section-headline-title">{t.knowledgeTitle || "Drug Knowledge & Interaction Graph"}</h2>
          <p className="section-headline-sub">
            {t.knowledgeSub || "Verified Indian commercial brand-to-generic mappings, pharmacologic classifications, and contraindications."}
          </p>
        </div>
      </div>

      {/* Sub-Navigation Pills */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1.5px solid var(--border-subtle)", paddingBottom: "0.75rem", overflowX: "auto" }}>
        <button
          className={`control-btn ${activeSubTab === "catalog" ? "active" : ""}`}
          onClick={() => setActiveSubTab("catalog")}
        >
          <Pill size={16} />
          <span>{t.catalogTab || "Medicine Catalog"} ({DRUG_DATABASE.length})</span>
        </button>

        <button
          className={`control-btn ${activeSubTab === "checker" ? "active" : ""}`}
          onClick={() => setActiveSubTab("checker")}
        >
          <ShieldAlert size={16} />
          <span>{t.checkerTab || "Pairwise Interaction Checker"}</span>
        </button>

        <button
          className={`control-btn ${activeSubTab === "food" ? "active" : ""}`}
          onClick={() => setActiveSubTab("food")}
        >
          <Utensils size={16} />
          <span>{t.foodTab || "Food & Alcohol Rules"}</span>
        </button>
      </div>

      {/* TAB 1: Medicine Catalog */}
      {activeSubTab === "catalog" && (
        <div>
          {/* Search & Category Filter Controls */}
          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "260px", position: "relative" }}>
              <Search size={18} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--teal-accent)" }} />
              <input
                type="text"
                placeholder={t.searchCatalogPlaceholder || "Search Indian brand (Crocin, Dolo, Ecosprin), generic name (Paracetamol, Warfarin)..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.6rem 0.85rem 0.6rem 2.4rem",
                  borderRadius: "8px",
                  border: "1.5px solid var(--border-subtle)",
                  background: "var(--bg-surface)",
                  color: "var(--text-main)",
                  fontSize: "0.95rem"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "0.4rem", overflowX: "auto", paddingBottom: "2px" }}>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`control-btn ${selectedClass === cat.id ? "active" : ""}`}
                  onClick={() => setSelectedClass(cat.id)}
                  style={{ fontSize: "0.82rem", whiteSpace: "nowrap" }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Catalog Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem" }}>
            {filteredDrugs.map((drug, idx) => (
              <div 
                key={idx} 
                className="card-container"
                style={{
                  marginBottom: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
                    <div>
                      <h3 style={{ fontSize: "1.2rem", color: "var(--primary)", margin: 0 }}>
                        {drug.brandName}
                      </h3>
                      <div style={{ fontSize: "0.85rem", color: "var(--teal-accent-hover)", fontWeight: 700, marginTop: "2px" }}>
                        {drug.genericName}
                      </div>
                    </div>
                    <span style={{ fontSize: "0.75rem", background: "var(--primary-subtle)", color: "var(--primary)", padding: "3px 8px", borderRadius: "4px", fontWeight: 700 }}>
                      {drug.strength}
                    </span>
                  </div>

                  <div style={{ fontSize: "0.8rem", color: "var(--text-light)", marginBottom: "0.5rem" }}>
                    Class: <strong>{drug.therapeuticClass}</strong>
                  </div>

                  <div style={{ background: "var(--bg-surface-subtle)", padding: "0.6rem 0.75rem", borderRadius: "6px", fontSize: "0.8rem", border: "1px solid var(--border-subtle)", marginBottom: "0.75rem" }}>
                    <div>🕒 <strong>Default Frequency:</strong> {drug.defaultFrequency} ({drug.defaultTiming})</div>
                    <div style={{ marginTop: "3px" }}>🍽️ <strong>Meal Guidance:</strong> {drug.mealInstruction}</div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.75rem" }}>
                  <button
                    className="btn-primary"
                    onClick={() => handleAddDrugToProfile(drug)}
                    style={{ flex: 1, padding: "0.45rem 0.75rem", fontSize: "0.85rem", minHeight: "auto" }}
                  >
                    <Plus size={15} />
                    <span>{t.addToActivePoolBtn || "Add to Active Pool"}</span>
                  </button>

                  <button
                    className="control-btn"
                    onClick={() => speak(`${drug.brandName}. Generic molecule: ${drug.genericName}. Strength: ${drug.strength}. Instructions: ${drug.mealInstruction}.`, language)}
                    title="Listen to medicine instructions"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Pairwise Interaction Checker */}
      {activeSubTab === "checker" && (
        <div className="card-container">
          <h3 style={{ color: "var(--primary)", marginBottom: "0.4rem" }}>
            {t.testPairwiseTitle || "Test Any Pairwise Drug Combination"}
          </h3>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
            {t.testPairwiseSub || "Select two medications from the clinical catalog to check if they cause adverse contraindications or bleeding risks."}
          </p>

          <div className="grid-2" style={{ gap: "1rem", marginBottom: "1.5rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "4px" }}>
                {t.medicine1Label || "Medicine 1:"}
              </label>
              <select
                value={checkerDrugA}
                onChange={(e) => setCheckerDrugA(e.target.value)}
                style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1.5px solid var(--border-medium)", fontSize: "1rem", fontWeight: 600 }}
              >
                {DRUG_DATABASE.map(d => (
                  <option key={d.brandName} value={d.genericName}>
                    {d.brandName} ({d.genericName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "4px" }}>
                {t.medicine2Label || "Medicine 2:"}
              </label>
              <select
                value={checkerDrugB}
                onChange={(e) => setCheckerDrugB(e.target.value)}
                style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1.5px solid var(--border-medium)", fontSize: "1rem", fontWeight: 600 }}
              >
                {DRUG_DATABASE.map(d => (
                  <option key={d.brandName} value={d.genericName}>
                    {d.brandName} ({d.genericName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Interaction Outcome Box */}
          {currentPairResult ? (
            <div 
              style={{
                background: currentPairResult.severity === "critical" ? "var(--critical-bg)" : "var(--moderate-bg)",
                border: `2px solid ${currentPairResult.severity === "critical" ? "var(--critical-border)" : "var(--moderate-border)"}`,
                borderRadius: "12px",
                padding: "1.5rem"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className={currentPairResult.severity === "critical" ? "badge-critical" : "badge-moderate"}>
                    {currentPairResult.severity.toUpperCase()} HAZARD
                  </span>
                  <h4 style={{ fontSize: "1.2rem", color: currentPairResult.severity === "critical" ? "var(--critical-dark)" : "var(--moderate)", margin: 0 }}>
                    {currentPairResult.titleEn}
                  </h4>
                </div>

                <button
                  className="control-btn"
                  onClick={() => speak(`Clinical Safety Warning: ${currentPairResult.titleEn}. ${currentPairResult.explanationEn}. Recommended Action: ${currentPairResult.actionEn}`, language)}
                  style={{ background: "#ffffff", borderColor: "var(--border-subtle)", fontSize: "0.8rem", padding: "4px 10px", display: "flex", alignItems: "center", gap: "4px" }}
                  title="Listen to this warning in voice form"
                >
                  <Volume2 size={15} style={{ color: "var(--teal-accent)" }} />
                  <span>{t.listenInVoiceBtn || "Listen in Voice"}</span>
                </button>
              </div>

              <p style={{ fontSize: "0.95rem", color: "var(--text-main)", margin: "0.75rem 0" }}>
                {currentPairResult.explanationEn}
              </p>

              <div style={{ background: "#ffffff", padding: "0.75rem 1rem", borderRadius: "8px", borderLeft: "4px solid var(--critical)", margin: "0.75rem 0" }}>
                <strong>Recommended Action:</strong> {currentPairResult.actionEn}
              </div>

              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                <strong>Clinical Mechanism:</strong> {currentPairResult.mechanism} • Reference: {currentPairResult.source}
              </div>
            </div>
          ) : (
            <div style={{ background: "var(--safe-bg)", border: "2px solid var(--safe-border)", borderRadius: "12px", padding: "1.5rem", textAlign: "center" }}>
              <ShieldCheck size={40} style={{ color: "var(--safe)", marginBottom: "0.4rem" }} />
              <h4 style={{ color: "var(--safe)", fontSize: "1.15rem", margin: 0 }}>
                {t.noKnownInteraction || "No Known Severe Interaction Found"}
              </h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-on-safe)", marginTop: "4px" }}>
                {checkerDrugA} and {checkerDrugB} have no documented critical conflicts in our RxNorm database.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Food & Alcohol Rules */}
      {activeSubTab === "food" && (
        <div className="card-container">
          <h3 style={{ color: "var(--primary)", marginBottom: "1rem" }}>
            Food, Dairy & Alcohol Timing Guidelines
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
            {FOOD_TIMING_RULES.map((rule, idx) => (
              <div 
                key={idx}
                style={{
                  background: "#f8fafc",
                  border: "1.5px solid var(--border-subtle)",
                  borderRadius: "10px",
                  padding: "1rem"
                }}
              >
                <div style={{ display: "inline-block", background: "var(--teal-bg)", color: "var(--teal-accent-hover)", fontSize: "0.75rem", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", marginBottom: "0.4rem" }}>
                  {rule.badge}
                </div>
                <div style={{ fontWeight: 800, fontSize: "1rem", color: "var(--primary)", textTransform: "capitalize" }}>
                  {rule.genericKeyword}
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--text-main)", marginTop: "0.35rem" }}>
                  {rule.ruleEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
