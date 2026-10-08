/**
 * MedSafe Smart Daily Timeline & Dynamic Rescheduling Engine
 * Generates time-slotted daily dosage cards and adjusts subsequent doses
 * when doses are taken late to maintain mandatory minimum safe pharmacologic gaps.
 */

import { DRUG_DATABASE } from "../data/drugDatabase";

/**
 * Slot definitions
 */
export const DEFAULT_TIME_SLOTS = [
  { id: "morning", labelKey: "morning", defaultTime: "08:00", name: "Morning", period: "AM" },
  { id: "afternoon", labelKey: "afternoon", defaultTime: "13:00", name: "Afternoon", period: "PM" },
  { id: "evening", labelKey: "evening", defaultTime: "18:00", name: "Evening", period: "PM" },
  { id: "night", labelKey: "night", defaultTime: "21:30", name: "Bedtime", period: "PM" }
];

/**
 * Generate initial timeline entries for active confirmed medications
 */
export function generateDailySchedule(medications) {
  const schedule = [];

  medications.forEach((med) => {
    const freq = (med.frequency || "1-0-1").toUpperCase();
    const dbInfo = DRUG_DATABASE.find(d => d.brandName.toLowerCase() === med.brandName.toLowerCase() || d.genericName.toLowerCase() === med.genericName.toLowerCase());
    const minGap = dbInfo?.minGapHours || 6;

    // Determine which slots to place this medication in
    if (freq === "1-0-1" || freq === "BD" || freq === "TWICE DAILY") {
      schedule.push(createDoseEntry(med, "morning", "08:00", minGap, "Scheduled morning dose"));
      schedule.push(createDoseEntry(med, "night", "21:30", minGap, "Scheduled bedtime dose"));
    } else if (freq === "1-1-1" || freq === "TDS" || freq === "THRICE DAILY") {
      schedule.push(createDoseEntry(med, "morning", "08:00", minGap, "Morning dose"));
      schedule.push(createDoseEntry(med, "afternoon", "13:00", minGap, "Afternoon dose"));
      schedule.push(createDoseEntry(med, "night", "21:30", minGap, "Night dose"));
    } else if (freq === "1-0-0" || freq === "OD" || freq === "MORNING") {
      schedule.push(createDoseEntry(med, "morning", "08:00", minGap, "Daily morning dose"));
    } else if (freq === "0-0-1" || freq === "HS" || freq === "NIGHT" || freq === "BEDTIME") {
      schedule.push(createDoseEntry(med, "night", "21:30", minGap, "Daily bedtime dose"));
    } else if (freq === "0-1-0" || freq === "AFTERNOON") {
      schedule.push(createDoseEntry(med, "afternoon", "13:00", minGap, "Afternoon dose"));
    } else {
      // Default to morning
      schedule.push(createDoseEntry(med, "morning", "08:00", minGap, "Prescribed intake"));
    }
  });

  return sortSchedule(schedule);
}

function createDoseEntry(med, slotId, timeStr, minGapHours, note) {
  return {
    id: `dose-${med.id}-${slotId}`,
    medicationId: med.id,
    brandName: med.brandName,
    genericName: med.genericName,
    strength: med.strength,
    form: med.form,
    dose: med.dose || `1 ${med.form}`,
    instructions: med.instructions,
    slotId,
    scheduledTime: timeStr,
    actualTime: null,
    status: "upcoming", // "upcoming", "due", "taken", "missed", "rescheduled"
    minGapHours,
    rescheduledReason: null,
    labelImage: med.labelImage || med.image || null,
    note
  };
}

function sortSchedule(entries) {
  const slotOrder = { morning: 1, afternoon: 2, evening: 3, night: 4 };
  return entries.sort((a, b) => {
    return (slotOrder[a.slotId] || 5) - (slotOrder[b.slotId] || 5);
  });
}

/**
 * Dynamic Rescheduling Algorithm:
 * When user marks dose taken at actualTime (e.g. 11:30), check subsequent doses of same medication.
 * If scheduled time is closer than minGapHours, adjust scheduled time and set status to 'rescheduled'.
 */
export function handleDoseTakenWithRescheduling(currentSchedule, doseId, actualTimeStr) {
  const updated = currentSchedule.map(item => ({ ...item }));
  const targetIndex = updated.findIndex(d => d.id === doseId);

  if (targetIndex === -1) return { newSchedule: currentSchedule, notice: null };

  const targetDose = updated[targetIndex];
  targetDose.status = "taken";
  targetDose.actualTime = actualTimeStr;

  let notice = null;

  // Convert actual time "HH:MM" to decimal hours (e.g., "11:30" -> 11.5)
  const [actualH, actualM] = actualTimeStr.split(":").map(Number);
  const actualDecimal = actualH + (actualM / 60);

  // Look for any later doses of this same medication
  const subsequentDoses = updated.filter((d, idx) => 
    idx > targetIndex && 
    d.medicationId === targetDose.medicationId && 
    d.status !== "taken"
  );

  subsequentDoses.forEach(subDose => {
    const [subH, subM] = subDose.scheduledTime.split(":").map(Number);
    const subDecimal = subH + (subM / 60);
    const currentGap = subDecimal - actualDecimal;

    if (currentGap < subDose.minGapHours) {
      // Must push forward to maintain minimum gap
      const newTimeDecimal = actualDecimal + subDose.minGapHours;
      const newH = Math.floor(newTimeDecimal) % 24;
      const newM = Math.round((newTimeDecimal - Math.floor(newTimeDecimal)) * 60);
      const newTimeStr = `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;

      const prevTime = subDose.scheduledTime;
      subDose.scheduledTime = newTimeStr;
      subDose.status = "rescheduled";
      subDose.rescheduledReason = `Shifted from ${prevTime} to ${newTimeStr} to maintain required ${subDose.minGapHours}-hour safety buffer.`;

      notice = {
        medicationName: targetDose.brandName,
        oldTime: prevTime,
        newTime: newTimeStr,
        minGapHours: subDose.minGapHours,
        reason: subDose.rescheduledReason
      };
    }
  });

  return {
    newSchedule: sortSchedule(updated),
    notice
  };
}

/**
 * Calculate overall adherence percentage
 */
export function calculateAdherence(schedule) {
  if (!schedule || schedule.length === 0) return 100;
  const takenCount = schedule.filter(d => d.status === "taken").length;
  return Math.round((takenCount / schedule.length) * 100);
}
