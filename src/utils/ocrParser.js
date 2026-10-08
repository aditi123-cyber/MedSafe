/**
 * MedSafe OCR & Prescription NLP Parser
 * Extracts brand, generic, dosage strength, frequency codes (1-0-1, BD, TDS),
 * meal timings, and calculates field-level confidence scores.
 */

import { DRUG_DATABASE } from "../data/drugDatabase";

/**
 * Fuzzy search helper
 */
function findClosestDrug(rawText) {
  const normalized = rawText.toLowerCase();

  // Direct brand or generic match
  for (const drug of DRUG_DATABASE) {
    const bName = drug.brandName.toLowerCase();
    const gName = drug.genericName.toLowerCase();

    if (normalized.includes(bName) || bName.split(" ").every(part => normalized.includes(part))) {
      return { match: drug, type: "brand", confidence: 96 };
    }
    if (normalized.includes(gName) || gName.split(" ").every(part => normalized.includes(part))) {
      return { match: drug, type: "generic", confidence: 94 };
    }
  }

  // Partial word match
  for (const drug of DRUG_DATABASE) {
    const mainBrand = drug.brandName.split(" ")[0].toLowerCase();
    if (mainBrand.length > 3 && normalized.includes(mainBrand)) {
      return { match: drug, type: "partial_brand", confidence: 85 };
    }
  }

  return null;
}

/**
 * Parses raw extracted OCR text into structured medication entity
 */
export function parsePrescriptionText(rawText) {
  const text = rawText || "";
  const matchResult = findClosestDrug(text);

  // Strength regex (e.g., "500 mg", "650mg", "5 mg", "40mg", "1.5 g", "50 mcg")
  const strengthMatch = text.match(/(\d+(?:\.\d+)?)\s*(mg|mcg|g|ml|iu|%)/i);
  const detectedStrength = strengthMatch ? `${strengthMatch[1]} ${strengthMatch[2].toLowerCase()}` : (matchResult?.match.strength || "500 mg");

  // Form detection (Tablet, Capsule, Syrup, Drops, Inhaler)
  let detectedForm = "Tablet";
  if (/syrup|liquid|suspension|drops/i.test(text)) detectedForm = "Syrup";
  else if (/cap|capsule/i.test(text)) detectedForm = "Capsule";
  else if (/inhaler|puff/i.test(text)) detectedForm = "Inhaler";
  else if (/injection|vial/i.test(text)) detectedForm = "Injection";
  else if (matchResult?.match.form) detectedForm = matchResult.match.form;

  // Frequency code detection (1-0-1, 1-1-1, 1-0-0, 0-0-1, 0-1-0, BD, TDS, OD, QID, PRN, SOS)
  let detectedFrequency = "1-0-1";
  let detectedTiming = "Morning & Night";

  if (/1\s*-\s*0\s*-\s*1|bd|twice\s+daily|bid/i.test(text)) {
    detectedFrequency = "1-0-1";
    detectedTiming = "Morning & Night (8:00 AM & 8:00 PM)";
  } else if (/1\s*-\s*1\s*-\s*1|tds|tid|thrice\s+daily/i.test(text)) {
    detectedFrequency = "1-1-1";
    detectedTiming = "Morning, Afternoon & Night (8 AM, 1 PM, 8 PM)";
  } else if (/1\s*-\s*0\s*-\s*0|od|once\s+daily\s+morning|morning/i.test(text)) {
    detectedFrequency = "1-0-0";
    detectedTiming = "Morning (8:00 AM)";
  } else if (/0\s*-\s*0\s*-\s*1|hs|bedtime|night\s+only|night/i.test(text)) {
    detectedFrequency = "0-0-1";
    detectedTiming = "Bedtime / Night (9:30 PM)";
  } else if (/0\s*-\s*1\s*-\s*0|afternoon/i.test(text)) {
    detectedFrequency = "0-1-0";
    detectedTiming = "Afternoon (1:00 PM)";
  } else if (/prn|sos|as\s+needed|when\s+required/i.test(text)) {
    detectedFrequency = "PRN";
    detectedTiming = "As Needed (When in pain/fever)";
  } else if (matchResult?.match.defaultFrequency) {
    detectedFrequency = matchResult.match.defaultFrequency;
    detectedTiming = matchResult.match.defaultTiming;
  }

  // Meal timing instructions
  let detectedMeal = "After food";
  if (/before\s+food|empty\s+stomach|30\s*min\s+before|ac\b/i.test(text)) {
    detectedMeal = "Before food (Empty Stomach)";
  } else if (/with\s+food|with\s+meals/i.test(text)) {
    detectedMeal = "With meals";
  } else if (/after\s+food|pc\b|post\s+meal/i.test(text)) {
    detectedMeal = "After food";
  } else if (matchResult?.match.mealInstruction) {
    detectedMeal = matchResult.match.mealInstruction;
  }

  const isIdentified = Boolean(matchResult);
  const brandName = matchResult ? matchResult.match.brandName : (text.split("\n")[0] || "Unidentified Medicine");
  const genericName = matchResult ? matchResult.match.genericName : "Unmapped Molecule";
  const confidence = matchResult ? matchResult.confidence : 35;

  return {
    id: `med-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    brandName,
    genericName,
    strength: detectedStrength,
    form: detectedForm,
    dose: `1 ${detectedForm}`,
    frequency: detectedFrequency,
    timing: detectedTiming,
    instructions: detectedMeal,
    confidence,
    isIdentified,
    identificationStatus: isIdentified ? "identified" : "unidentified",
    identificationMessage: isIdentified 
      ? `Identified as ${brandName} (${genericName}) with ${confidence}% confidence.` 
      : "Medicine could not be identified from this image. Please retake with better lighting or select the medicine from the catalog.",
    fieldConfidence: {
      name: matchResult ? 98 : 30,
      strength: strengthMatch ? 95 : 40,
      frequency: matchResult ? 90 : 50,
      timing: matchResult ? 88 : 50
    },
    rawOcrText: text,
    confirmed: false
  };
}

/**
 * Realistic Sample Scanned Labels for Quick Demo Testing
 */
export const SAMPLE_LABEL_PRESETS = [
  {
    title: "Warfarin 5mg Label (Blood Thinner)",
    subtitle: "High-alert anticoagulant prescription",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80",
    ocrText: `Rx\nWARF 5 TABLETS\nWarfarin Sodium IP 5 mg\nDosage: Take 1 tablet once daily at bedtime (0-0-1)\nDr. Mehta, Cardiology Clinic\nBatch: W9482 Mfg: 02/2026 Exp: 01/2028`
  },
  {
    title: "Ecosprin 75mg Strip (Aspirin)",
    subtitle: "Antiplatelet blood thinner strip",
    image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600&auto=format&fit=crop&q=80",
    ocrText: `ECOSPRIN 75\nAspirin Gastro-resistant Tablets I.P. 75 mg\nTake 1 tablet in morning after food (1-0-0)\nFor cardiovascular protection\nTorrent Pharmaceuticals`
  },
  {
    title: "Dolo 650mg Bottle (Paracetamol)",
    subtitle: "Common fever & pain relief tablet",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=80",
    ocrText: `DOLO 650 TABLETS\nParacetamol Tablets IP 650 mg\nDosage: 1 tablet twice daily with meals (1-0-1)\nMicro Labs Ltd.\nDo not exceed 4000 mg in 24 hours`
  },
  {
    title: "Combiflam Strip (Ibuprofen + Paracetamol)",
    subtitle: "NSAID painkiller with dual ingredients",
    image: "https://images.unsplash.com/photo-1550572017-ed24c0840e4e?w=600&auto=format&fit=crop&q=80",
    ocrText: `COMBIFLAM TABLET\nIbuprofen IP 400 mg + Paracetamol IP 325 mg\nTake 1 tablet after meals (1-0-1)\nSanofi India Ltd\nWarning: Take strictly with full meal`
  },
  {
    title: "Sorbitrate 10mg (Nitrate for Angina)",
    subtitle: "Vasodilator heart medication",
    image: "https://images.unsplash.com/photo-1576071804486-b8bc221068f4?w=600&auto=format&fit=crop&q=80",
    ocrText: `SORBITRATE 10\nIsosorbide Dinitrate Sublingual Tablets IP 10 mg\nDosage: 1 tablet twice daily (1-0-1)\nAbbott Healthcare\nWarning: Never combine with PDE5 inhibitors`
  },
  {
    title: "Manforce 50mg (Sildenafil)",
    subtitle: "Vasodilator PDE5 inhibitor",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop&q=80",
    ocrText: `MANFORCE 50\nSildenafil Citrate Tablets IP 50 mg\nTake 1 tablet as needed (PRN)\nMankind Pharma`
  },
  {
    title: "Augmentin 625 Duo (Antibiotic)",
    subtitle: "Amoxicillin + Clavulanic acid",
    image: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=600&auto=format&fit=crop&q=80",
    ocrText: `AUGMENTIN 625 DUO\nAmoxicillin 500 mg + Clavulanic Acid 125 mg\n1 tablet twice daily with meals for 7 days (1-0-1)\nGSK Pharmaceuticals`
  },
  {
    title: "Pan 40 (Pantoprazole Antacid)",
    subtitle: "Empty stomach morning PPI",
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&auto=format&fit=crop&q=80",
    ocrText: `PAN 40 TABLETS\nPantoprazole Gastro-resistant Tablets IP 40 mg\nTake 1 tablet daily before breakfast (1-0-0)\nAlkem Laboratories`
  }
];
