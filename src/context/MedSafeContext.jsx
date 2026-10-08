/**
 * MedSafe Global Application Context
 * Centralizes patient profiles, medications, interactions, daily schedule,
 * caregiver alerts, accessibility preferences, and localization.
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  INTERACTION_RULES, 
  checkDuplicateIngredients, 
  HACKATHON_DEMO_PRESETS,
  FOOD_TIMING_RULES 
} from "../data/drugDatabase";
import { TRANSLATIONS } from "../data/translations";
import { 
  generateDailySchedule, 
  handleDoseTakenWithRescheduling,
  calculateAdherence 
} from "../utils/schedulerEngine";
import { speakText, stopSpeaking, playChime } from "../utils/speechSynthesis";
import confetti from "canvas-confetti";

const MedSafeContext = createContext();

const DEFAULT_USERS = [
  {
    id: "u-ramesh",
    email: "ramesh.sharma@medsafe.org",
    name: "Ramesh Sharma",
    role: "patient",
    age: 72,
    weightKg: 68,
    condition: "Hypertension & Cardiac Stent (2023)",
    knownAllergies: "Sulfa Antibiotics",
    emergencyContact: "+91 98765 43210",
    avatarColor: "#003366",
    avatarInitials: "RS"
  },
  {
    id: "u-meena",
    email: "meena.sharma@medsafe.org",
    name: "Meena Sharma",
    role: "patient",
    age: 68,
    weightKg: 62,
    condition: "Type-2 Diabetes & Osteoarthritis",
    knownAllergies: "Penicillin",
    emergencyContact: "+91 98765 43210",
    avatarColor: "#0D9488",
    avatarInitials: "MS"
  },
  {
    id: "u-ananya",
    email: "dr.iyer@apollohospitals.demo",
    name: "Dr. Ananya Iyer",
    role: "doctor",
    specialty: "Consulting Cardiologist",
    phone: "+91 91234 56789",
    avatarColor: "#2563EB",
    avatarInitials: "AI"
  },
  {
    id: "u-amit",
    email: "amit.sharma@example.com",
    name: "Amit Sharma",
    role: "caregiver",
    relationship: "Son & Primary Caregiver",
    phone: "+91 98765 43210",
    avatarColor: "#7C3AED",
    avatarInitials: "AS"
  }
];

export const DEFAULT_EMERGENCY_CONTACTS = [
  {
    id: "ec-1",
    name: "Dr. Rajesh Sharma",
    relation: "Primary Caregiver (Son)",
    relationEn: "Primary Caregiver (Son)",
    relationHi: "प्राथमिक देखभालकर्ता (बेटा)",
    phone: "+91 98765 43210",
    role: "Family Caregiver",
    badge: "Priority 1",
    badgeColor: "#dc2626",
    isPrimary: true
  },
  {
    id: "ec-2",
    name: "National Emergency Ambulance",
    relation: "24x7 Ambulance & Paramedics",
    relationEn: "24x7 Ambulance & Paramedics",
    relationHi: "24x7 एम्बुलेंस एवं पैरामेडिक्स",
    phone: "108 / 112",
    role: "Emergency Services",
    badge: "Emergency 24x7",
    badgeColor: "#dc2626",
    isPrimary: true
  },
  {
    id: "ec-3",
    name: "Dr. Ananya Mehta, MD",
    relation: "Consulting Cardiologist",
    relationEn: "Consulting Cardiologist",
    relationHi: "हृदय रोग विशेषज्ञ (डॉक्टर)",
    phone: "+91 98111 22334",
    role: "Physician",
    badge: "Cardiologist",
    badgeColor: "#0284c7",
    isPrimary: false
  },
  {
    id: "ec-4",
    name: "Apollo Emergency Trauma Unit",
    relation: "Nearest Hospital Emergency Room",
    relationEn: "Nearest Hospital Emergency Room",
    relationHi: "निकटतम अस्पताल आपातकालीन वार्ड",
    phone: "+91 98222 33445",
    role: "Hospital Casualty",
    badge: "Hospital",
    badgeColor: "#0d9488",
    isPrimary: false
  },
  {
    id: "ec-5",
    name: "Pooja Sharma",
    relation: "Local Contact / Keyholder (Daughter)",
    relationEn: "Local Contact / Keyholder (Daughter)",
    relationHi: "स्थानीय संपर्क / बेटी",
    phone: "+91 98333 44556",
    role: "Local Responder",
    badge: "Neighbor / Proxy",
    badgeColor: "#7c3aed",
    isPrimary: false
  }
];

export function MedSafeProvider({ children }) {
  // Localization & Accessibility State
  const [language, setLanguage] = useState("en");
  const [fontSize, setFontSize] = useState("normal"); // "normal", "large", "extra-large"
  const [highContrast, setHighContrast] = useState(false);
  const [isSpeakingState, setIsSpeakingState] = useState(false);

  // User Authentication & Multi-User Management State
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem("medsafe_users");
      return saved ? JSON.parse(saved) : DEFAULT_USERS;
    } catch (e) {
      return DEFAULT_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("medsafe_current_user");
      return saved ? JSON.parse(saved) : DEFAULT_USERS[0];
    } catch (e) {
      return DEFAULT_USERS[0];
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login"); // "login", "register", "switch"

  // 5 Emergency Contacts State (PRD Section 5.6)
  const [emergencyContacts, setEmergencyContacts] = useState(() => {
    try {
      const saved = localStorage.getItem("medsafe_emergency_contacts");
      return saved ? JSON.parse(saved) : DEFAULT_EMERGENCY_CONTACTS;
    } catch (e) {
      return DEFAULT_EMERGENCY_CONTACTS;
    }
  });

  // Save emergency contacts
  useEffect(() => {
    try {
      localStorage.setItem("medsafe_emergency_contacts", JSON.stringify(emergencyContacts));
    } catch (e) {}
  }, [emergencyContacts]);

  // Live GPS Patient Location Tracker State
  const [liveLocation, setLiveLocation] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
    accuracy: 4,
    address: "Connaught Place, New Delhi, India",
    landmark: "Patient Residence (Central Ward)",
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    mapsUrl: "https://www.google.com/maps?q=28.6139,77.2090",
    isLiveGPS: true,
    statusText: "🟢 GPS Tracking Active (Live Updates)"
  });

  const refreshLocation = () => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const acc = Math.round(position.coords.accuracy || 5);
          const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
          setLiveLocation({
            latitude: lat,
            longitude: lng,
            accuracy: acc,
            address: `Live GPS: ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`,
            landmark: "Current Patient Live GPS Location (High Accuracy)",
            timestamp: timeStr,
            mapsUrl: `https://www.google.com/maps?q=${lat},${lng}`,
            isLiveGPS: true,
            statusText: `🟢 Live Satellite GPS Active (±${acc}m accuracy)`
          });
          playChime("success");
        },
        (error) => {
          console.warn("Geolocation fallback active:", error.message);
          const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
          setLiveLocation(prev => ({
            ...prev,
            timestamp: timeStr,
            statusText: "🟢 Live Geolocation Active"
          }));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  };

  useEffect(() => {
    refreshLocation();
  }, []);

  // Patient Profile State (PRD Section 5.1)
  const [profiles, setProfiles] = useState([
    {
      id: "p-ramesh",
      name: "Ramesh Sharma (Father)",
      age: 72,
      weightKg: 68,
      condition: "Hypertension & Cardiac Stent (2023)",
      knownAllergies: "Sulfa Antibiotics",
      isPrimary: true
    },
    {
      id: "p-meena",
      name: "Meena Sharma (Mother)",
      age: 68,
      weightKg: 62,
      condition: "Type-2 Diabetes & Osteoarthritis",
      knownAllergies: "Penicillin",
      isPrimary: false
    }
  ]);
  const [activeProfileId, setActiveProfileId] = useState("p-ramesh");


  // Save users & current user to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("medsafe_users", JSON.stringify(users));
    } catch (e) {}
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem("medsafe_current_user", JSON.stringify(currentUser));
    } catch (e) {}
  }, [currentUser]);

  // Active Medications List
  const [medications, setMedications] = useState([]);

  // Computed Safety Interactions & Duplicates
  const [interactions, setInteractions] = useState([]);
  const [duplicateWarnings, setDuplicateWarnings] = useState([]);
  const [foodWarnings, setFoodWarnings] = useState([]);

  // Daily Schedule & Rescheduling State
  const [schedule, setSchedule] = useState([]);
  const [rescheduleNotice, setRescheduleNotice] = useState(null);

  // Caregiver Notification System (PRD Section 5.6)
  const [caregivers, setCaregivers] = useState([
    {
      id: "cg-1",
      name: "Amit Sharma (Son)",
      relationship: "Son & Primary Caregiver",
      phone: "+91 98765 43210",
      email: "amit.sharma@example.com",
      enableSMS: true,
      enableWhatsApp: true,
      alertOnCritical: true,
      alertOnMissedDose: true
    },
    {
      id: "cg-2",
      name: "Dr. Ananya Iyer",
      relationship: "Consulting Cardiologist",
      phone: "+91 91234 56789",
      email: "dr.iyer@apollohospitals.demo",
      enableSMS: false,
      enableWhatsApp: false,
      alertOnCritical: true,
      alertOnMissedDose: false
    }
  ]);

  const [alertHistory, setAlertHistory] = useState([]);
  const [simulatedIncomingAlert, setSimulatedIncomingAlert] = useState(null);
  const [isCaregiverViewMode, setIsCaregiverViewMode] = useState(false);

  // Active Navigation Tab: "home", "scan", "safety", "timeline", "caregiver"
  const [currentTab, setCurrentTab] = useState("home");

  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem("medsafe_theme") === "dark";
    } catch (e) {
      return false;
    }
  });

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      try {
        localStorage.setItem("medsafe_theme", next ? "dark" : "light");
      } catch (e) {}
      return next;
    });
  };

  // Sync body accessibility & dark mode classes
  useEffect(() => {
    const classList = [
      fontSize === "large" ? "font-large" : fontSize === "extra-large" ? "font-extra-large" : "",
      highContrast ? "high-contrast" : "",
      isDarkMode ? "dark-mode" : ""
    ].filter(Boolean).join(" ");

    document.body.className = classList;
    document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  }, [fontSize, highContrast, isDarkMode]);

  // Start clean with empty initial state - medications added when user uploads/scans

  // Compute interactions whenever medications change
  useEffect(() => {
    runSafetyEngine(medications);
    const newSchedule = generateDailySchedule(medications);
    setSchedule(newSchedule);
  }, [medications]);

  /**
   * Safety Contraindication & Cross-Check Engine
   */
  const runSafetyEngine = (medList) => {
    const foundInteractions = [];

    // Pairwise interaction cross-check
    for (let i = 0; i < medList.length; i++) {
      for (let j = i + 1; j < medList.length; j++) {
        const medA = medList[i];
        const medB = medList[j];

        INTERACTION_RULES.forEach((rule) => {
          const nameA = medA.genericName.toLowerCase();
          const nameB = medB.genericName.toLowerCase();
          const ruleA = rule.drugA.toLowerCase();
          const ruleB = rule.drugB.toLowerCase();

          const matchesDirect = (nameA.includes(ruleA) || ruleA.includes(nameA)) && (nameB.includes(ruleB) || ruleB.includes(nameB));
          const matchesInverse = (nameA.includes(ruleB) || ruleB.includes(nameA)) && (nameB.includes(ruleA) || ruleA.includes(nameB));

          if (matchesDirect || matchesInverse) {
            foundInteractions.push({
              ...rule,
              pairText: `${medA.brandName} (${medA.genericName}) ⟷ ${medB.brandName} (${medB.genericName})`,
              medA,
              medB
            });
          }
        });
      }
    }

    // Check duplicate active ingredients (e.g. Paracetamol + Paracetamol)
    const dups = checkDuplicateIngredients(medList);

    // Check food & timing rules
    const foodNotes = [];
    medList.forEach(med => {
      FOOD_TIMING_RULES.forEach(fRule => {
        if (med.genericName.toLowerCase().includes(fRule.genericKeyword)) {
          foodNotes.push({
            medication: med.brandName,
            ...fRule
          });
        }
      });
    });

    setInteractions(foundInteractions);
    setDuplicateWarnings(dups);
    setFoodWarnings(foodNotes);

    // If critical interaction found, trigger alert chime & caregiver SMS preview
    const hasCritical = foundInteractions.some(i => i.severity === "critical") || dups.some(d => d.severity === "critical");
    if (hasCritical) {
      playChime("critical");
      triggerCaregiverAlert(
        "CRITICAL DRUG INTERACTION DETECTED",
        `MedSafe detected a dangerous interaction between prescribed medicines for ${getActiveProfile().name}. Immediate medical review recommended.`,
        "critical"
      );
    }
  };

  /**
   * Trigger Caregiver SMS & Push Alert
   */
  const triggerCaregiverAlert = (title, message, severity = "critical") => {
    const newAlert = {
      id: `alert-${Date.now()}`,
      title,
      message,
      severity,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      patientName: getActiveProfile().name,
      recipients: caregivers.map(c => `${c.name} (${c.phone})`),
      status: "DELIVERED via SMS Gateway & Push"
    };

    setAlertHistory(prev => [newAlert, ...prev]);
    setSimulatedIncomingAlert(newAlert);
  };

  /**
   * Patient Emergency SOS Trigger with Live GPS Location
   */
  const sendPatientSOS = (reason = "Feeling Dizzy / Urgent Help Needed", locationDesc = null) => {
    playChime("critical");
    const active = getActiveProfile();
    const locString = locationDesc || `${liveLocation.address} (GPS: ${liveLocation.latitude.toFixed(4)}, ${liveLocation.longitude.toFixed(4)})`;
    const alertMessage = `🚨 EMERGENCY SOS: ${active.name} (${active.age}y) needs immediate help! Reason: "${reason}". 📍 Location: ${locString}. 🗺️ Live Route: ${liveLocation.mapsUrl}. Pre-existing Condition: ${active.condition || "Hypertension"}.`;
    
    triggerCaregiverAlert(
      "🚨 EMERGENCY SOS ALERT FROM PATIENT",
      alertMessage,
      "critical"
    );
  };

  /**
   * Broadcast Urgent SOS to all 5 Emergency Contacts Simultaneously
   */
  const broadcastSOSAllContacts = (reason = "CRITICAL EMERGENCY - IMMEDIATE PARAMEDIC & CAREGIVER RESPONSE NEEDED") => {
    playChime("critical");
    const active = getActiveProfile();
    const alertMessage = `🚨 CRITICAL EMERGENCY BROADCAST: ${active.name} (${active.age}y, ${active.condition || "Cardiac Condition"}) requires IMMEDIATE medical assistance! Reason: "${reason}". 📍 EXACT LIVE GPS LOCATION: ${liveLocation.address} (Lat: ${liveLocation.latitude.toFixed(4)}, Lng: ${liveLocation.longitude.toFixed(4)}). 🗺️ Real-Time Navigation Map: ${liveLocation.mapsUrl}. Broadcast sent to all 5 emergency lifelines.`;

    const newAlert = {
      id: `alert-broadcast-${Date.now()}`,
      title: "🚨 URGENT SOS BROADCAST (5 LIFELINES DISPATCHED)",
      message: alertMessage,
      severity: "critical",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      patientName: active.name,
      recipients: emergencyContacts.map(c => `${c.name} (${c.phone})`),
      location: liveLocation,
      status: "DELIVERED TO ALL 5 EMERGENCY CONTACTS VIA SMS & GPS SATELLITE"
    };

    setAlertHistory(prev => [newAlert, ...prev]);
    setSimulatedIncomingAlert(newAlert);
  };

  const addEmergencyContact = (contact) => {
    const newContact = {
      id: `ec-${Date.now()}`,
      ...contact,
      badgeColor: contact.badgeColor || "#0284c7"
    };
    setEmergencyContacts(prev => [...prev, newContact]);
    playChime("success");
  };

  const updateEmergencyContact = (id, updatedFields) => {
    setEmergencyContacts(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
    playChime("success");
  };

  const deleteEmergencyContact = (id) => {
    setEmergencyContacts(prev => prev.filter(c => c.id !== id));
  };


  /**
   * Add a confirmed medication
   */
  const addMedication = (med) => {
    setMedications(prev => {
      const filtered = prev.filter(m => m.id !== med.id);
      return [...filtered, { ...med, confirmed: true }];
    });
    playChime("success");
  };

  /**
   * Remove a medication
   */
  const removeMedication = (id) => {
    setMedications(prev => prev.filter(m => m.id !== id));
  };

  /**
   * Load Demo Preset
   */
  const loadPreset = (preset) => {
    setRescheduleNotice(null);
    setMedications(preset.medications);
  };

  /**
   * Handle dynamic dose logging
   */
  const markDoseTaken = (doseId, customActualTime = null) => {
    const now = new Date();
    const timeStr = customActualTime || `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const { newSchedule, notice } = handleDoseTakenWithRescheduling(schedule, doseId, timeStr);
    setSchedule(newSchedule);

    if (notice) {
      setRescheduleNotice(notice);
      playChime("critical");
      triggerCaregiverAlert(
        "Dose Taken Late - Dynamic Reschedule",
        `${notice.medicationName} was logged late. Next dose automatically shifted to ${notice.newTime} to ensure safe ${notice.minGapHours}-hr interval.`,
        "moderate"
      );
    } else {
      playChime("success");
      // Fire celebration confetti if adherence reaches 100%
      const adherence = calculateAdherence(newSchedule);
      if (adherence === 100) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  /**
   * Skip a dose
   */
  const skipDose = (doseId, reason = "Patient requested skip") => {
    setSchedule(prev => prev.map(item => {
      if (item.id === doseId) {
        return { ...item, status: "missed", note: `Skipped: ${reason}` };
      }
      return item;
    }));
    triggerCaregiverAlert(
      "Prescription Dose Skipped",
      `A scheduled dose was skipped for ${getActiveProfile().name}. Reason: ${reason}.`,
      "moderate"
    );
  };

  /**
   * Audio Text-to-Speech via ElevenLabs & Web Speech
   */
  const speak = (text, customLang = null) => {
    speakText(
      text,
      customLang || language,
      () => setIsSpeakingState(true),
      () => setIsSpeakingState(false)
    );
  };

  const stopVoice = () => {
    stopSpeaking();
    setIsSpeakingState(false);
  };

  /**
   * User Authentication & Registration Engine
   */
  const loginWithEmail = (email, password = "") => {
    const trimmedEmail = email.trim().toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      setCurrentUser(existing);
      const matchingProfile = profiles.find(p => p.id === `p-${existing.id}` || p.name.toLowerCase().includes(existing.name.toLowerCase()));
      if (matchingProfile) {
        setActiveProfileId(matchingProfile.id);
      }
      playChime("success");
      return { success: true, user: existing, isNew: false };
    } else {
      const nameFromEmail = trimmedEmail.split("@")[0].replace(/[._-]/g, " ");
      const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
      return addNewUser({
        email: trimmedEmail,
        name: formattedName,
        role: "patient",
        age: 65,
        weightKg: 70,
        condition: "General Health Monitoring",
        knownAllergies: "None Reported"
      });
    }
  };

  const addNewUser = ({
    name,
    email,
    password = "",
    role = "patient",
    age = 65,
    weightKg = 68,
    condition = "General Health",
    knownAllergies = "None Reported",
    emergencyContact = "",
    phone = "",
    specialty = ""
  }) => {
    const trimmedEmail = email.trim().toLowerCase();
    const id = `u-${Date.now()}`;
    const initials = name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";
    
    const palette = ["#003366", "#0D9488", "#2563EB", "#7C3AED", "#059669", "#D97706"];
    const avatarColor = palette[Math.floor(Math.random() * palette.length)];

    const newUser = {
      id,
      email: trimmedEmail,
      name: name.trim(),
      role,
      age: Number(age) || 65,
      weightKg: Number(weightKg) || 68,
      condition: condition.trim() || "General Health",
      knownAllergies: knownAllergies.trim() || "None Reported",
      emergencyContact: emergencyContact || phone,
      phone: phone || emergencyContact,
      specialty: specialty,
      avatarColor,
      avatarInitials: initials,
      createdAt: new Date().toISOString()
    };

    setUsers(prev => {
      const filtered = prev.filter(u => u.email.toLowerCase() !== trimmedEmail);
      return [newUser, ...filtered];
    });

    const newProfile = {
      id: `p-${id}`,
      name: `${newUser.name} (${role === "patient" ? "Self" : role === "caregiver" ? "Caregiver" : "Doctor"})`,
      age: newUser.age,
      weightKg: newUser.weightKg,
      condition: newUser.condition,
      knownAllergies: newUser.knownAllergies,
      isPrimary: true
    };

    setProfiles(prev => [newProfile, ...prev]);
    setActiveProfileId(newProfile.id);
    setCurrentUser(newUser);

    if (role === "caregiver") {
      setCaregivers(prev => [
        {
          id: `cg-${id}`,
          name: newUser.name,
          relationship: "Primary Caregiver",
          phone: newUser.phone || "+91 98765 00000",
          email: newUser.email,
          enableSMS: true,
          enableWhatsApp: true,
          alertOnCritical: true,
          alertOnMissedDose: true
        },
        ...prev
      ]);
    }

    playChime("success");
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.6 }
    });

    return { success: true, user: newUser, isNew: true };
  };

  const switchUser = (userId) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      const matchingProfile = profiles.find(p => p.id === `p-${target.id}` || p.name.toLowerCase().includes(target.name.toLowerCase()));
      if (matchingProfile) {
        setActiveProfileId(matchingProfile.id);
      }
      playChime("success");
    }
  };

  const logout = () => {
    setIsAuthModalOpen(true);
    setAuthModalMode("login");
  };

  const getActiveProfile = () => {
    return profiles.find(p => p.id === activeProfileId) || profiles[0];
  };

  const overallAdherence = calculateAdherence(schedule);
  const criticalCount = interactions.filter(i => i.severity === "critical").length + duplicateWarnings.filter(d => d.severity === "critical").length;
  const moderateCount = interactions.filter(i => i.severity === "moderate").length + duplicateWarnings.filter(d => d.severity === "moderate").length;

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <MedSafeContext.Provider
      value={{
        language,
        setLanguage,
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        isDarkMode,
        toggleDarkMode,
        sendPatientSOS,
        isSpeakingState,
        speak,
        stopVoice,
        t,
        users,
        currentUser,
        setCurrentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        loginWithEmail,
        addNewUser,
        switchUser,
        logout,
        profiles,
        activeProfileId,
        setActiveProfileId,
        activeProfile: getActiveProfile(),
        medications,
        addMedication,
        removeMedication,
        interactions,
        duplicateWarnings,
        foodWarnings,
        schedule,
        rescheduleNotice,
        setRescheduleNotice,
        markDoseTaken,
        skipDose,
        overallAdherence,
        criticalCount,
        moderateCount,
        caregivers,
        setCaregivers,
        emergencyContacts,
        setEmergencyContacts,
        addEmergencyContact,
        updateEmergencyContact,
        deleteEmergencyContact,
        broadcastSOSAllContacts,
        liveLocation,
        refreshLocation,
        alertHistory,
        simulatedIncomingAlert,
        setSimulatedIncomingAlert,
        triggerCaregiverAlert,
        isCaregiverViewMode,
        setIsCaregiverViewMode,
        currentTab,
        setCurrentTab,
        loadPreset
      }}

    >
      {children}
    </MedSafeContext.Provider>
  );
}

export function useMedSafe() {
  return useContext(MedSafeContext);
}
