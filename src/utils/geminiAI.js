/**
 * MedSafe Google Gemini AI Integration Engine
 * Powered by Google AI Studio Gemini 3.5 Flash / Flash Lite
 * Provides real-time multimodal vision OCR, clinical reasoning, prescription safety cross-checks,
 * natural health conversation, and multilingual intelligence.
 */

import { DRUG_DATABASE } from "../data/drugDatabase";

const GEMINI_API_KEY = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY)
  ? import.meta.env.VITE_GEMINI_API_KEY
  : "";

const GEMINI_MODEL = "gemini-3.5-flash-lite";

/**
 * Converts a File object or Blob to clean base64 data and mimeType
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const match = dataUrl.match(/^data:([^;]+);base64,(.*)$/);
      if (match) {
        resolve({
          dataUrl,
          mimeType: match[1],
          base64: match[2]
        });
      } else {
        resolve({
          dataUrl,
          mimeType: file.type || "image/jpeg",
          base64: dataUrl.split(",")[1] || ""
        });
      }
    };
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Converts an image URL (or canvas/SVG) to base64
 */
export async function urlToBase64(imageUrl) {
  try {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    return await fileToBase64(blob);
  } catch (e) {
    // If CORS or local blob fails, return fallback
    return {
      dataUrl: imageUrl,
      mimeType: "image/jpeg",
      base64: ""
    };
  }
}

/**
 * Match identified label against internal verified Indian drug database
 */
function crossReferenceDatabase(brandName = "", genericName = "") {
  const normBrand = (brandName || "").toLowerCase().trim();
  const normGeneric = (genericName || "").toLowerCase().trim();

  for (const drug of DRUG_DATABASE) {
    const b = drug.brandName.toLowerCase();
    const g = drug.genericName.toLowerCase();

    if (normBrand.includes(b) || b.includes(normBrand) || normBrand.split(" ")[0] === b.split(" ")[0]) {
      return drug;
    }
    if (normGeneric.includes(g) || g.includes(normGeneric)) {
      return drug;
    }
  }
  return null;
}

/**
 * Automatically analyze and identify medicine packaging label from image using Google Gemini Vision
 */
export async function identifyMedicineImageWithGemini({
  base64Data,
  mimeType = "image/jpeg",
  fileName = "medicine_photo.jpg",
  language = "en"
}) {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key not configured.");
  }

  // Clean base64 data if it contains the data: prefix
  const cleanBase64 = base64Data.includes(",") ? base64Data.split(",")[1] : base64Data;
  const cleanMime = mimeType || "image/jpeg";

  const visionPrompt = `You are MedSafe Vision AI, a world-class pharmaceutical computer vision and prescription OCR system.
Analyze this uploaded photo of a medicine strip, pill blister pack, medicine bottle, sachet, box, or handwritten/printed prescription slip.

TASK:
1. Examine all visual text, brand headers, logos, chemical composition, strengths, batch, expiry, and dosage instructions printed on the label.
2. Read the title/brand name clearly (e.g. Dolo 650, Combiflam, Augmentin 625 Duo, Pan 40, Warf 5, Ecosprin 75, Metformin 500, etc.).
3. Read the generic salt/molecule name (e.g. Paracetamol, Ibuprofen + Paracetamol, Amoxicillin and Clavulanate, Pantoprazole, Warfarin, Aspirin).
4. Read the dosage strength (e.g. 650 mg, 500 mg, 5 mg, 40 mg, 75 mg).
5. Transcribe all readable text from the packaging into 'extractedText'.
6. Determine if the image contains a readable, valid medication label. If the photo is completely blank, blurred beyond recognition, or is a non-medical object (e.g. a car, cat, landscape), set 'isIdentified' to false and explain why in 'identificationMessage'.

Output STRICT JSON conforming to this schema:
{
  "brandName": "Primary Title / Brand Name printed on label (or null if unreadable)",
  "genericName": "Generic pharmacological molecule / chemical name (or null if unreadable)",
  "strength": "Strength with unit (e.g. 650 mg, 5 mg, 500 mg)",
  "form": "Tablet | Capsule | Syrup | Drops | Inhaler | Injection | Ointment",
  "frequency": "1-0-1 | 1-0-0 | 0-0-1 | 1-1-1 | 0-1-0 | PRN",
  "timing": "Morning & Night | Morning | Night | Morning, Afternoon & Night | As Needed",
  "instructions": "After food | Before food | With meals",
  "extractedText": "Full verbatim text transcribed from the image packaging label",
  "isIdentified": true,
  "confidence": 96,
  "identificationMessage": "Concise summary of identified medicine label"
}`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: visionPrompt },
              {
                inlineData: {
                  mimeType: cleanMime,
                  data: cleanBase64
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
          maxOutputTokens: 1200
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.warn(`Gemini Vision API error HTTP ${response.status}:`, errorText);
      throw new Error(`Gemini Vision API HTTP ${response.status}`);
    }

    const data = await response.json();
    const rawJsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawJsonText) {
      throw new Error("Empty candidate response from Gemini Vision.");
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(rawJsonText);
    } catch (parseErr) {
      // Fallback: strip markdown json tags
      const sanitized = rawJsonText.replace(/```json/gi, "").replace(/```/g, "").trim();
      parsedResult = JSON.parse(sanitized);
    }

    // Cross reference against database for enriched properties
    const dbMatch = crossReferenceDatabase(parsedResult.brandName, parsedResult.genericName);

    const isIdentified = Boolean(parsedResult.isIdentified && parsedResult.brandName);
    const finalBrand = parsedResult.brandName || (dbMatch ? dbMatch.brandName : "⚠️ Unidentified Medicine");
    const finalGeneric = parsedResult.genericName || (dbMatch ? dbMatch.genericName : "Could not identify active molecule");
    const finalStrength = parsedResult.strength || (dbMatch ? dbMatch.strength : "Standard Dose");
    const finalForm = parsedResult.form || (dbMatch ? dbMatch.form : "Tablet");
    const finalFrequency = parsedResult.frequency || (dbMatch ? dbMatch.defaultFrequency : "1-0-1");
    const finalTiming = parsedResult.timing || (dbMatch ? dbMatch.defaultTiming : "Morning & Night");
    const finalInstructions = parsedResult.instructions || (dbMatch ? dbMatch.mealInstruction : "After food");
    const confidence = isIdentified ? (parsedResult.confidence || 95) : 0;

    return {
      success: true,
      isIdentified,
      brandName: finalBrand,
      genericName: finalGeneric,
      strength: finalStrength,
      form: finalForm,
      dose: `1 ${finalForm}`,
      frequency: finalFrequency,
      timing: finalTiming,
      instructions: finalInstructions,
      extractedText: parsedResult.extractedText || "No visible packaging text extracted.",
      confidence,
      identificationMessage: parsedResult.identificationMessage || (isIdentified 
        ? `Identified as ${finalBrand} (${finalGeneric}) with ${confidence}% confidence.`
        : "Could not identify medicine name from image. Please ensure good lighting or select from catalog."),
      source: "Google Gemini 3.5 Vision AI",
      matchedDatabaseDrug: dbMatch
    };
  } catch (err) {
    console.warn("Gemini Vision failed or offline:", err.message);
    return {
      success: false,
      isIdentified: false,
      error: err.message,
      identificationMessage: "Unable to reach AI Vision service. Please check your network or select medicine from catalog."
    };
  }
}

/**
 * Ask Google Gemini AI Clinical Assistant
 */
export async function askGeminiClinicalAI({
  userQuery,
  activeProfile = {},
  medications = [],
  interactions = [],
  duplicateWarnings = [],
  language = "en"
}) {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key not configured.");
  }

  const medSummary = medications.length > 0
    ? medications.map(m => `${m.brandName} (${m.genericName}, ${m.strength}, ${m.frequency})`).join(", ")
    : "No active medications logged currently";

  const alertsSummary = interactions.length > 0
    ? interactions.map(i => `${i.pairText} (${i.severity.toUpperCase()}: ${i.titleEn})`).join("; ")
    : "None detected";

  const systemInstruction = `You are MedSafe Clinical AI, an expert, compassionate healthcare and prescription safety assistant.
Patient Profile:
- Name: ${activeProfile.name || "Patient"} (${activeProfile.age || 65} yrs)
- Pre-existing Condition: ${activeProfile.condition || "General Health"}
- Known Drug Allergies: ${activeProfile.knownAllergies || "None Reported"}
- Active Medications: ${medSummary}
- Active Drug Interaction Alerts: ${alertsSummary}

Instructions:
1. Provide accurate, clear, and reassuring medical guidance for prescription safety, dosages, drug-drug interactions, food timing, symptoms, and lifestyle.
2. If asked in Hindi, Marathi, Tamil, Telugu, or English, reply naturally and fluently in that exact same language (${language}).
3. Always emphasize safe practices: never take duplicate Paracetamol/NSAIDs together, separate dairy from Ciprofloxacin by 2 hours, take PPIs (Pantoprazole) on an empty stomach.
4. Keep answers conversational, structured, and easy for elderly patients and caregivers to understand. Do not exceed 3-4 paragraphs unless deeply technical analysis is requested.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${systemInstruction}\n\nUser Question: "${userQuery}"`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.35,
          maxOutputTokens: 1000
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.warn(`Gemini API returned HTTP ${response.status}:`, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText || !candidateText.trim()) {
      throw new Error("Empty response from Gemini.");
    }

    return {
      success: true,
      text: candidateText.trim(),
      source: "Google Gemini 3.5 AI"
    };
  } catch (err) {
    console.warn("Gemini AI fetch failed, falling back to local clinical engine:", err.message);
    return {
      success: false,
      error: err.message
    };
  }
}

/**
 * Check if Gemini AI is connected and active
 */
export function getGeminiStatus() {
  return {
    connected: Boolean(GEMINI_API_KEY),
    model: GEMINI_MODEL,
    keyPreview: GEMINI_API_KEY ? `${GEMINI_API_KEY.slice(0, 8)}...${GEMINI_API_KEY.slice(-6)}` : "None"
  };
}

