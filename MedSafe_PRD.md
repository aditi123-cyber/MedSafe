_PRODUCT REQUIREMENTS DOCUMENT_

# MedSafe

Patient Prescription Safety Verification Platform (working name)

**Based on:** Smart India Hackathon, Problem Statement 6

**Status:** Draft v1

## 1. Overview

MedSafe is a mobile app where a user scans several pill bottles or prescription labels with the phone camera. The app extracts the drug names, dosages, and frequencies, flags immediate contraindications between the scanned drugs, and builds an interactive, color-coded daily medication timeline. A caregiver alert system and regional-language support make it usable for elderly patients and their families.

### 1.1 Problem

- Patients, especially elderly people on multiple medicines from different doctors, often cannot tell whether their medicines are safe together.

- Labels are small, curved, cluttered, and in English or mixed languages. Dosage instructions are easy to misread.

- Missed or doubled doses and dangerous combinations lead to preventable harm and hospital visits.

### 1.2 Vision

Scan once, know immediately whether your medicines conflict, and get a clear schedule you can follow, in your own language, with family kept in the loop.

## 2. Goals and Non-Goals

### Goals

- Scan multiple medicine labels and extract drug name, strength, dose, and frequency with user confirmation.

- Flag immediate drug-drug interactions with severity levels and plain-language explanations.

- Generate a daily timeline that adapts when doses are taken early or late.

- Notify a caregiver or doctor on dangerous interactions or missed critical doses.

- Support at least English, Hindi, and one more regional language in the MVP.

### Non-Goals

- Diagnosing conditions or replacing a doctor or pharmacist.

- Prescribing, changing doses, or telling a user to stop a medicine.

- E-pharmacy ordering or payments (future scope).

## 3. Target Users

| **Persona**                       | **Needs**                                                                    | **Key constraints**                                 |
|-----------------------------------|------------------------------------------------------------------------------|-----------------------------------------------------|
| **Elderly patient**               | Simple verification, large text, voice and local language, reminders         | Low digital literacy, vision issues, many medicines |
| **Family caregiver**              | Alerts when something is unsafe or a dose is missed, remote view of schedule | Not physically present, wants low-noise alerts      |
| **Chronic patient**               | Track multiple long-term prescriptions, check new medicines before taking    | Multiple doctors, frequent changes                  |
| **Doctor / pharmacist (Phase 2)** | View patient medication list and safety flags                                | Needs consent-based access, limited time            |

## 4. Scope

| **Phase**           | **Features**                                                                                                                                                                                         |
|---------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **MVP (hackathon)** | Camera scan of 2+ labels, OCR, parsing, user confirmation screen, interaction check, safety dashboard with severity badges, daily timeline with check-off, English + Hindi, caregiver SMS/push alert |
| **Phase 2**         | Dynamic timeline rescheduling, voice read-out, more Indian languages, food/alcohol and allergy checks, doctor access, refill reminders                                                               |
| **Phase 3**         | Pharmacy integration, dose-adherence analytics, wearable and smart-pillbox sync, offline-first mode                                                                                                  |

## 5. Functional Requirements

### 5.1 Onboarding and profile

- Sign-up by mobile OTP; language selection at first launch.

- Basic profile: name, age, weight (optional), known allergies (optional), caregiver contacts with explicit consent.

- Multiple profiles on one account so a caregiver can manage a parent’s medicines.

### 5.2 Scan and text extraction (OCR layer)

- In-app camera with guidance overlay, auto-focus, flash toggle, and a blur/glare warning.

- Scan multiple bottles in one session; each scan is stored as a separate medication card.

- On-device OCR using Google ML Kit, with Tesseract as fallback; support for curved bottles via multi-frame capture.

- Gallery upload as an alternative to live scanning.

### 5.3 Parsing (NLP layer)

- Extract: drug name (brand and generic), strength (e.g., 500 mg), form (tablet, syrup), dose per intake, frequency (e.g., twice daily, 1-0-1), duration, and doctor instructions (e.g., after food).

- Hybrid approach: regex rules for common patterns (1-0-1, BD, TDS, OD) plus a lightweight LLM for messy text.

- Map brand names to generic ingredients (essential for Indian brands) using a local mapping dataset and RxNorm.

- Confirmation screen: show the parsed result next to the label image so the user can correct any field before it is saved. Never run safety checks on unconfirmed low-confidence fields silently.

### 5.4 Safety and contraindication engine

- Cross-check every pair of confirmed drugs against the interaction data source.

- Severity levels: Critical (red, stop and call doctor), Moderate (amber, consult pharmacist), Minor (informational).

- Each flag shows the two drugs involved, a plain-language reason, a recommended action ("Contact your doctor or pharmacist before taking both"), and the data source.

- Duplicate-ingredient detection (e.g., two products both containing paracetamol).

- Optional checks in later phases: allergies, age-based cautions, food and alcohol.

- The app never tells the user to stop or change a medicine; it only advises consulting a professional.

### 5.5 Smart daily timeline

- Generate a day view from the confirmed dosage and frequency, grouped into morning, afternoon, evening, and night.

- Color-coded states: upcoming (blue), due now (amber), taken (mint with check), missed (red with icon).

- Check-off with one tap; push reminders at scheduled times.

- Dynamic rescheduling: if a dose is taken early or late, the next dose shifts to maintain the minimum safe gap, with a warning if the gap is too short.

- Interactive: tap a dose to see the drug, instructions, and any related warning.

### 5.6 Caregiver alert system

- Alert triggers: a Critical interaction is detected, a vital dose is missed beyond a set window, or a new medicine is added.

- Channels: push notification and SMS; optional email to the doctor.

- Caregiver view: today’s schedule, adherence status, and active warnings.

- Consent and easy revoke for every linked caregiver.

### 5.7 Multilingual support

- Interface and warnings in English, Hindi, and regional languages (Marathi, Tamil, Telugu, Bengali as stretch goals).

- OCR and parser handle English drug names on labels with local-language instructions.

- Voice read-out of warnings and the daily schedule for elderly users.

## 6. Key User Flows

### Flow A: First scan and safety check

1.  User opens the app and taps Scan.

2.  User scans each bottle or label; thumbnails appear in a tray.

3.  App extracts text and shows a confirmation card per medicine.

4.  User confirms or corrects fields.

5.  App runs the interaction check and shows the Safety Dashboard.

6.  User taps Generate Timeline; the daily schedule is created.

### Flow B: Daily use

1.  Reminder arrives; user opens the timeline.

2.  User marks the dose as taken (or skips it).

3.  Timeline updates; a missed critical dose triggers a caregiver alert.

### Flow C: New medicine added

1.  User scans the new bottle.

2.  App checks it against every existing medicine and flags conflicts before it joins the schedule.

## 7. System Architecture

| **Layer**           | **Description**                                                                                                        |
|---------------------|------------------------------------------------------------------------------------------------------------------------|
| **Mobile frontend** | Flutter or React Native app: camera, state management for active medications, timeline UI, notifications, localization |
| **OCR layer**       | Google ML Kit on-device (primary), Tesseract fallback; image pre-processing for glare and curvature                    |
| **Parsing layer**   | Regex rules plus a lightweight LLM; drug name normalization via brand-to-generic mapping and RxNorm                    |
| **Safety engine**   | Backend service that queries interaction sources, normalizes severity, and caches results                              |
| **Backend**         | Python FastAPI (or Node.js): auth, profiles, medications, schedules, alerts                                            |
| **Database**        | PostgreSQL for users, medications, schedules, and dose logs                                                            |
| **Notifications**   | Firebase Cloud Messaging for push, SMS gateway (e.g., Twilio or MSG91) for SMS                                         |

### 7.1 Data sources

| **Source**                      | **Use**                                           | **Note**                                                                        |
|---------------------------------|---------------------------------------------------|---------------------------------------------------------------------------------|
| **RxNorm (NIH)**                | Normalize drug names to standard identifiers      | Free API                                                                        |
| **openFDA drug labels**         | Interaction and warning text from official labels | Free-text, needs parsing                                                        |
| **NIH RxNav interaction API**   | Pairwise interactions                             | Reportedly retired in 2024; confirm current availability before depending on it |
| **Licensed or curated dataset** | Reliable interaction pairs and severity           | Build a small curated set for the demo                                          |
| **Indian medicine dataset**     | Map Indian brand names to generic ingredients     | Needed for realistic label scans in India                                       |

## 8. Data Model (core entities)

- User: id, name, language, phone, role (patient or caregiver).

- Patient profile: id, user id, age, allergies (optional), caregiver links with consent flags.

- Medication: id, profile id, brand name, generic name, strength, form, dose, frequency, duration, instructions, label image, parse confidence, confirmed flag.

- Interaction flag: id, medication pair, severity, explanation, source, acknowledged flag.

- Schedule entry: id, medication id, planned time, status (upcoming, due, taken, missed), actual time.

- Alert: id, type, recipient, channel, sent time, delivery status.

## 9. Design System

Calm, clinical, and high-contrast, built for elderly and visually impaired users.

| **Role**                   | **Color**             | **Hex**      |
|----------------------------|-----------------------|--------------|
| **Primary / authority**    | Deep Trust Blue       | **\#003366** |
| **Safe / verified accent** | Soft Mint Green       | **\#A5D6A7** |
| **Base background**        | Off-white / soft gray | **\#F8F9FA** |
| **Critical conflict**      | Muted brick red       | **\#B23A3A** |
| **Moderate caution**       | Dark amber            | **\#8A5A00** |
| **Body text**              | Charcoal              | **\#1F2933** |

| **Interface element**         | **Tone**                       | **Purpose**                                                |
|-------------------------------|--------------------------------|------------------------------------------------------------|
| **Main layout and data rows** | Off-white / light gray         | Keeps prescription text clear and readable                 |
| **Primary buttons**           | Deep Trust Blue                | Authority and confident action                             |
| **Safe / Verified badges**    | Soft Mint Green with dark text | Reassurance that no conflict was found                     |
| **Critical warnings**         | Muted brick red                | Quickly alerts the user to halt and consult a professional |
| **Moderate caution**          | Dark amber                     | Draws attention without panic                              |

### Accessibility rules

- Never rely on color alone: pair every state with an icon and a text label (checkmark, warning triangle, clock).

- Meet WCAG 2.1 AA contrast. Use dark text on mint (white on mint fails). Verify exact hex values before release.

- Minimum body text 16 sp, with a large-text mode; dosage numbers displayed extra large.

- Large touch targets (48 dp minimum), voice read-out, and simple navigation with at most 4 bottom tabs.

- Avoid neon saturation; use red sparingly so critical alerts keep their meaning.

## 10. Key Screens

- Language selection and onboarding

- Home: today’s timeline summary, active warnings, Scan button

- Scan: camera with overlay, multi-bottle tray

- Confirm medicine: image next to editable parsed fields, confidence indicator

- Safety dashboard: list of medicines, severity-badged conflicts, detail sheet per conflict

- Daily timeline: color-coded dose cards with check-off

- Medicine list and detail

- Caregiver management and alert settings

- Settings: language, text size, notifications

## 11. Non-Functional Requirements

- **Safety and disclaimer:** clear statement that the app supports, not replaces, medical advice; the app never recommends stopping or changing a medicine.

- **Privacy and compliance:** health data is sensitive. Follow India’s DPDP Act, collect explicit consent, encrypt data in transit and at rest, allow full data deletion.

- **Accuracy:** human confirmation of all parsed fields; show confidence scores; log corrections to improve the parser.

- **Performance:** scan-to-result in under 10 seconds on a mid-range phone; on-device OCR to work with weak connectivity.

- **Reliability:** reminders must fire even if the app is closed; cache the last interaction results for offline viewing.

- **Localization:** all strings externalized; right font support for Indic scripts.

## 12. Success Metrics

- OCR field accuracy for drug name and dose on a test set of real labels (target 90% or higher after correction flow).

- Interaction detection recall on a curated set of known dangerous pairs.

- Time from first scan to a confirmed schedule.

- Dose adherence rate and missed-dose alert response time.

- User comprehension: share of test users who correctly explain a flagged warning.

## 13. Risks and Mitigations

| **Risk**                                   | **Mitigation**                                                                                                          |
|--------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| **OCR errors on curved or blurry bottles** | Multi-frame capture, glare warnings, mandatory confirmation screen, manual entry fallback                               |
| **Wrong or missing interaction data**      | Use more than one source, show source and last-updated, cover only well-documented pairs in the MVP, include disclaimer |
| **Indian brand names not recognized**      | Local brand-to-generic dataset and fuzzy matching; ask the user to confirm the generic name                             |
| **Alert fatigue or false alarms**          | Severity tiers, alert only on Critical or vital missed doses, user-configurable thresholds                              |
| **Over-reliance by users**                 | Persistent disclaimer and "consult your doctor" actions; no dosing advice                                               |
| **Privacy and misuse of health data**      | Consent-based sharing, encryption, minimal data collection, deletion option                                             |

## 14. Implementation Plan

1.  Mobile frontend: build the cross-platform app (Flutter or React Native) with camera access and state management for active medications.

2.  Backend and APIs: set up FastAPI or Node.js to receive images or extracted text, run parsing, and query the interaction sources.

3.  OCR and parsing: integrate ML Kit, build regex plus LLM parser, add brand-to-generic mapping.

4.  Safety engine: connect data sources, build a curated interaction set, and define severity logic.

5.  Safety dashboard and timeline: high-contrast UI with urgent warning badges and clear timeline checkboxes.

6.  Caregiver alerts and multilingual support.

7.  Testing with real labels, accessibility checks, and demo preparation.

## 15. Suggested Demo Script (hackathon)

1.  Scan two real or printed labels with a known dangerous pair.

2.  Show the confirmation screen and fix one parsing error to prove the human-in-the-loop design.

3.  Show the red Critical warning with a plain-language explanation and a caregiver SMS arriving.

4.  Switch the app to Hindi and have it read the warning aloud.

5.  Generate the daily timeline, mark a dose late, and show the next dose reschedule.

## 16. Open Questions

- Which interaction data source will be the primary one, given the status of the NIH interaction API?

- Which regional languages beyond Hindi will be in the demo?

- Will the prototype use a real SMS gateway or a simulated alert?

- Is a doctor-facing web dashboard in scope for the submission?
