/**
 * MedSafe Clinical Intelligence & Medication Error Auditing Engine
 * Adheres to SIH PRD Section 8 & Section 15 specifications.
 * Grounded in openFDA, RxNorm (NIH), CDSCO Indian Pharmacopoeia, and NCC MERP error taxonomies.
 */

import { DRUG_DATABASE, INTERACTION_RULES, FOOD_TIMING_RULES } from "../data/drugDatabase";

/**
 * Standard RxNorm & openFDA Clinical Entity Schema
 */
export const CLINICAL_ONTOLOGY = [
  {
    rxcui: "11289",
    atcCode: "B01AA03",
    genericName: "Warfarin",
    brandNames: ["Warf 5", "Warf 1", "Warf 2", "Coumadin"],
    therapeuticClass: "Anticoagulant (Vitamin K Antagonist)",
    narrowTherapeuticIndex: true,
    maxDailyDoseMg: 10,
    minGapHours: 24,
    foodInteractions: ["Vitamin K rich foods (spinach, methi, kale)"],
    pregnancyCategory: "X (Contraindicated)"
  },
  {
    rxcui: "1191",
    atcCode: "B01AC06",
    genericName: "Aspirin",
    brandNames: ["Ecosprin 75", "Ecosprin 150", "Disprin", "ASA 75"],
    therapeuticClass: "Antiplatelet / NSAID",
    narrowTherapeuticIndex: false,
    maxDailyDoseMg: 325,
    minGapHours: 24,
    foodInteractions: ["Alcohol increases gastrointestinal bleeding risk"],
    pregnancyCategory: "D (3rd Trimester)"
  },
  {
    rxcui: "161",
    atcCode: "N02BE01",
    genericName: "Paracetamol",
    brandNames: ["Dolo 650", "Crocin Advance", "Calpol 500", "Pacimol 650", "P-650", "Sumo L"],
    therapeuticClass: "Antipyretic / Non-Opioid Analgesic",
    narrowTherapeuticIndex: false,
    maxDailyDoseMg: 4000,
    minGapHours: 6,
    foodInteractions: ["Chronic alcohol intake increases hepatotoxicity risk"],
    pregnancyCategory: "B (Generally Safe)"
  },
  {
    rxcui: "5640",
    atcCode: "M01AE01",
    genericName: "Ibuprofen",
    brandNames: ["Brufen 400", "Ibugesic", "Combiflam"],
    therapeuticClass: "Non-Steroidal Anti-Inflammatory Drug (NSAID)",
    narrowTherapeuticIndex: false,
    maxDailyDoseMg: 1200,
    minGapHours: 8,
    foodInteractions: ["Take strictly after food with water to protect gastric mucosa"],
    pregnancyCategory: "D (3rd Trimester)"
  },
  {
    rxcui: "6809",
    atcCode: "A10BA02",
    genericName: "Metformin",
    brandNames: ["Glycomet 500", "Glycomet SR 1g", "Obimet", "Glucophage"],
    therapeuticClass: "Biguanide Antidiabetic",
    narrowTherapeuticIndex: false,
    maxDailyDoseMg: 2000,
    minGapHours: 10,
    foodInteractions: ["Take with meals to reduce gastrointestinal distress"],
    pregnancyCategory: "B"
  },
  {
    rxcui: "83367",
    atcCode: "C10AA05",
    genericName: "Atorvastatin",
    brandNames: ["Atorva 20", "Atorva 10", "Storvas 20", "Lipitor"],
    therapeuticClass: "HMG-CoA Reductase Inhibitor (Statin)",
    narrowTherapeuticIndex: false,
    maxDailyDoseMg: 80,
    minGapHours: 24,
    foodInteractions: ["Avoid excessive grapefruit juice (CYP3A4 inhibition)"],
    pregnancyCategory: "X (Contraindicated)"
  },
  {
    rxcui: "2551",
    atcCode: "J01MA02",
    genericName: "Ciprofloxacin",
    brandNames: ["Ciplox 500", "Cifran 500", "Ciprolet"],
    therapeuticClass: "Fluoroquinolone Antibiotic",
    narrowTherapeuticIndex: false,
    maxDailyDoseMg: 1500,
    minGapHours: 12,
    foodInteractions: ["Dairy products, antacids, and iron reduce gut absorption by up to 75%"],
    pregnancyCategory: "C"
  },
  {
    rxcui: "40790",
    atcCode: "A02BC02",
    genericName: "Pantoprazole",
    brandNames: ["Pan 40", "Pantocid 40", "Pan-D", "Pantosec"],
    therapeuticClass: "Proton Pump Inhibitor (PPI)",
    narrowTherapeuticIndex: false,
    maxDailyDoseMg: 80,
    minGapHours: 24,
    foodInteractions: ["Take 30-60 minutes before morning breakfast on an empty stomach"],
    pregnancyCategory: "B"
  },
  {
    rxcui: "9796",
    atcCode: "G04BE03",
    genericName: "Sildenafil",
    brandNames: ["Manforce 50", "Manforce 100", "Viagra", "Revatio"],
    therapeuticClass: "Phosphodiesterase-5 (PDE5) Inhibitor",
    narrowTherapeuticIndex: false,
    maxDailyDoseMg: 100,
    minGapHours: 24,
    foodInteractions: ["High fat meals delay peak plasma concentration"],
    pregnancyCategory: "B"
  },
  {
    rxcui: "6054",
    atcCode: "C01DA08",
    genericName: "Isosorbide Dinitrate",
    brandNames: ["Sorbitrate 10", "Isordil", "Monosorbitrate"],
    therapeuticClass: "Vasodilator (Organic Nitrate)",
    narrowTherapeuticIndex: true,
    maxDailyDoseMg: 120,
    minGapHours: 8,
    foodInteractions: ["Avoid alcohol which amplifies severe hypotension"],
    pregnancyCategory: "C"
  }
];

/**
 * Common Look-Alike / Sound-Alike (LASA) Confusable Drug Pairs
 * Sourced from ISMP (Institute for Safe Medication Practices) & NCC MERP
 */
export const LASA_CONFUSION_PAIRS = [
  {
    drugA: "Celebrex",
    genericA: "Celecoxib (NSAID / Arthritis)",
    drugB: "Celexa",
    genericB: "Citalopram (SSRI / Antidepressant)",
    riskEn: "Mixing up anti-inflammatory with psychiatric antidepressant",
    riskHi: "दर्द निवारक दवा और मानसिक अवसाद की दवा में भ्रम का जोखिम",
    severity: "critical"
  },
  {
    drugA: "Metformin",
    genericA: "Metformin (Antidiabetic)",
    drugB: "Metronidazole",
    genericB: "Metronidazole (Antiprotozoal / Antibiotic)",
    riskEn: "Sound-alike confusion: blood sugar regulator mistaken for antibiotic",
    riskHi: "डायबिटीज की दवा और एंटीबायोटिक के नामों में समानता से भ्रम",
    severity: "critical"
  },
  {
    drugA: "Hydralazine",
    genericA: "Hydralazine (Antihypertensive)",
    drugB: "Hydroxyzine",
    genericB: "Hydroxyzine (Antihistamine / Sedative)",
    riskEn: "Blood pressure reducer mistaken for allergy sedative",
    riskHi: "ब्लड प्रेशर की दवा और एलर्जी की दवा में भ्रम",
    severity: "critical"
  },
  {
    drugA: "Dolo 650",
    genericA: "Paracetamol (Fever/Pain)",
    drugB: "Dox 100",
    genericB: "Doxycycline (Tetracycline Antibiotic)",
    riskEn: "OTC fever brand confused with prescription antibiotic",
    riskHi: "बुखार की गोली और एंटीबायोटिक के नाम में भ्रम",
    severity: "moderate"
  },
  {
    drugA: "Amlong",
    genericA: "Amlodipine (Calcium Channel Blocker)",
    drugB: "Aten",
    genericB: "Atenolol (Beta Blocker)",
    riskEn: "Similar cardiac brand prefixes with differing mechanisms",
    riskHi: "हार्ट और बीपी की अलग-अलग श्रेणियों की दवाओं में भ्रम",
    severity: "moderate"
  }
];

/**
 * Calculates Levenshtein string distance between two strings
 */
function levenshteinDistance(a = "", b = "") {
  const s1 = a.toLowerCase();
  const s2 = b.toLowerCase();
  const matrix = [];

  for (let i = 0; i <= s1.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= s2.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[s1.length][s2.length];
}

/**
 * Audit Medication Errors & Sound-Alike (LASA) Confusions
 * Adheres to PRD Section 8.3.
 */
export function auditMedicationErrors(medications = []) {
  const auditFlags = [];

  medications.forEach(med => {
    const brandName = (med.brandName || "").trim();
    const genericName = (med.genericName || "").trim();

    // 1. Check known LASA database
    LASA_CONFUSION_PAIRS.forEach(pair => {
      const matchA = brandName.toLowerCase().includes(pair.drugA.toLowerCase()) || genericName.toLowerCase().includes(pair.drugA.toLowerCase());
      const matchB = brandName.toLowerCase().includes(pair.drugB.toLowerCase()) || genericName.toLowerCase().includes(pair.drugB.toLowerCase());

      if (matchA || matchB) {
        auditFlags.push({
          type: "lasa_warning",
          severity: pair.severity,
          medication: brandName,
          confusableWith: matchA ? pair.drugB : pair.drugA,
          detailsEn: `Look-Alike / Sound-Alike (LASA) Alert: Ensure "${brandName}" is not confused with "${matchA ? pair.drugB : pair.drugA}" (${matchA ? pair.genericB : pair.genericA}). ${pair.riskEn}.`,
          detailsHi: `सावधानी: सुनिश्चित करें कि "${brandName}" को "${matchA ? pair.drugB : pair.drugA}" समझकर न लिया जाए। ${pair.riskHi}।`,
          source: "ISMP & NCC MERP Medication Error Taxonomy"
        });
      }
    });

    // 2. Unit Error Auditor (e.g. mg vs mcg vs g)
    if (med.strength) {
      if (/mcg/i.test(med.strength) && /levothyroxine|thyronorm/i.test(genericName)) {
        const num = parseFloat(med.strength);
        if (num > 300) {
          auditFlags.push({
            type: "unit_outlier",
            severity: "critical",
            medication: brandName,
            detailsEn: `Dosing Unit Outlier: Levothyroxine strength of ${med.strength} is unusually high (typical range: 25 to 150 mcg). Please verify the unit is not mg.`,
            detailsHi: `खुराक इकाई चेतावनी: थायरोक्सिन की खुराक (${med.strength}) सामान्य से अधिक है। कृपया जांचें कि यह mg की जगह mcg ही है।`,
            source: "RxNorm Dosage Validation Model"
          });
        }
      }
    }
  });

  return auditFlags;
}

/**
 * Clinical Outlier & Safe Dose Range Checker
 * Adheres to PRD Section 8.2.
 */
export function checkDoseOutliers(medications = [], patientProfile = {}) {
  const outlierAlerts = [];
  const age = patientProfile.age || 65;

  medications.forEach(med => {
    const generic = (med.genericName || "").toLowerCase();
    const brand = med.brandName || "";
    const strengthMatch = (med.strength || "").match(/(\d+(?:\.\d+)?)\s*(mg|g|mcg)/i);

    if (strengthMatch) {
      const val = parseFloat(strengthMatch[1]);
      const unit = strengthMatch[2].toLowerCase();
      const doseMg = unit === "g" ? val * 1000 : unit === "mcg" ? val / 1000 : val;

      // Paracetamol maximum single dose check
      if (generic.includes("paracetamol")) {
        if (doseMg > 1000) {
          outlierAlerts.push({
            medication: brand,
            severity: "critical",
            reasonEn: `Single intake dose of ${doseMg}mg exceeds the maximum recommended single dose (1000mg). Risk of acute liver injury.`,
            reasonHi: `एक बार में ${doseMg} मिलीग्राम पैरासिटामोल की खुराक अधिकतम सुरक्षित सीमा (1000 mg) से अधिक है।`,
            source: "openFDA & Indian Pharmacopoeia monographs"
          });
        }
      }

      // Aspirin pediatric contraindication (Reye's syndrome)
      if (generic.includes("aspirin") && age < 18) {
        outlierAlerts.push({
          medication: brand,
          severity: "critical",
          reasonEn: `Aspirin is contraindicated in patients under 18 years of age due to the risk of life-threatening Reye's Syndrome.`,
          reasonHi: `18 वर्ष से कम उम्र के मरीजों के लिए एस्पिरिन रेये सिंड्रोम के खतरे के कारण सख्त वर्जित है।`,
          source: "FDA Black Box Advisory"
        });
      }

      // Atorvastatin max daily dose check
      if (generic.includes("atorvastatin") && doseMg > 80) {
        outlierAlerts.push({
          medication: brand,
          severity: "critical",
          reasonEn: `Atorvastatin dose of ${doseMg}mg exceeds the maximum daily limit of 80mg. Risk of rhabdomyolysis and myopathy.`,
          reasonHi: `एटोरवास्टेटिन की ${doseMg} mg खुराक 80 mg की अधिकतम दैनिक सीमा से अधिक है।`,
          source: "RxNorm Clinical Dosing Rules"
        });
      }
    }
  });

  return outlierAlerts;
}

/**
 * Full Comprehensive Clinical Safety Evaluation
 */
export function evaluatePrescriptionSafety({
  medications = [],
  patientProfile = {}
}) {
  // 1. Run Drug-Drug Interaction Rules
  const interactions = [];
  for (let i = 0; i < medications.length; i++) {
    for (let j = i + 1; j < medications.length; j++) {
      const medA = medications[i];
      const medB = medications[j];

      INTERACTION_RULES.forEach(rule => {
        const nameA = (medA.genericName || "").toLowerCase();
        const nameB = (medB.genericName || "").toLowerCase();
        const ruleA = rule.drugA.toLowerCase();
        const ruleB = rule.drugB.toLowerCase();

        const matchDirect = (nameA.includes(ruleA) || ruleA.includes(nameA)) && (nameB.includes(ruleB) || ruleB.includes(nameB));
        const matchInverse = (nameA.includes(ruleB) || ruleB.includes(nameA)) && (nameB.includes(ruleA) || ruleA.includes(nameB));

        if (matchDirect || matchInverse) {
          interactions.push({
            ...rule,
            pairText: `${medA.brandName} (${medA.genericName}) ⟷ ${medB.brandName} (${medB.genericName})`,
            medA,
            medB
          });
        }
      });
    }
  }

  // 2. Run Duplicate Active Ingredient Detector
  const duplicates = [];
  const genericCountMap = {};

  medications.forEach(med => {
    const rawGen = (med.genericName || "").toLowerCase();
    const parts = rawGen.split(/\s*\+\s*|\s*,\s*|\s+and\s+/i);

    parts.forEach(part => {
      const clean = part.replace(/\(.*?\)/g, "").replace(/\d+\s*(mg|mcg|g|ml)/g, "").trim();
      if (clean.length > 3) {
        if (!genericCountMap[clean]) {
          genericCountMap[clean] = [];
        }
        genericCountMap[clean].push(med);
      }
    });
  });

  Object.keys(genericCountMap).forEach(genName => {
    const meds = genericCountMap[genName];
    if (meds.length > 1) {
      duplicates.push({
        ingredient: genName.toUpperCase(),
        severity: "critical",
        medications: meds.map(m => m.brandName),
        titleEn: `Duplicate Active Ingredient: ${genName.toUpperCase()}`,
        titleHi: `दवाइयों में एक ही घटक का दोहराव: ${genName.toUpperCase()}`,
        descEn: `Multiple prescribed products (${meds.map(m => m.brandName).join(" & ")}) contain the same active chemical molecule (${genName}). Taking them together risks accidental overdose and toxicity.`,
        descHi: `आपके पर्चे में शामिल कई दवाइयां (${meds.map(m => m.brandName).join(" व ")}) एक ही सक्रिय घटक (${genName}) से बनी हैं। इन्हें साथ लेने से ओवरडोज का खतरा है।`,
        actionEn: "Immediately verify with your physician to select a single product and avoid duplicate overdose.",
        actionHi: "तुरंत अपने डॉक्टर से संपर्क करें ताकि ओवरडोज से बचा जा सके।",
        source: "CDSCO & openFDA Active Ingredient Overdose Registry"
      });
    }
  });

  // 3. Medication Error Audits & LASA
  const auditErrors = auditMedicationErrors(medications);

  // 4. Dose Outliers
  const doseOutliers = checkDoseOutliers(medications, patientProfile);

  return {
    interactions,
    duplicates,
    auditErrors,
    doseOutliers,
    isSafe: interactions.length === 0 && duplicates.length === 0 && doseOutliers.length === 0,
    hasCritical: interactions.some(i => i.severity === "critical") || duplicates.length > 0 || doseOutliers.some(d => d.severity === "critical")
  };
}
