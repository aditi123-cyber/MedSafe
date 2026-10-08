# 📋 MedSafe Architectural Assumptions & Design Decisions

_Adheres to PRD Section 0._

1. **Safety Rules are Hard Deterministic Invariants:**
   - The application strictly flags contraindications and duplicate overdoses based on deterministic openFDA / RxNorm / CDSCO matrices.
   - Generative AI assists with OCR parsing and patient-friendly explanations, but cannot suppress or disable a clinical safety flag.

2. **Human-in-the-Loop Confirmation:**
   - Every scanned or OCR-extracted prescription card requires explicit user confirmation before being ingested into the active interaction checking engine.

3. **Dynamic Schedule Gap Maintenance:**
   - Subsequent doses of time-sensitive medications (such as Paracetamol requiring a 6-hour interval or Warfarin requiring once-daily 24-hour spacing) dynamically adjust forward if a dose is logged late.

4. **Multi-profile Caregiver Alerts:**
   - Emergency SOS triggers broadcast simulated SMS notifications and live popups to registered family caregivers.
