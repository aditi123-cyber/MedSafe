# 📚 MedSafe Training & Dataset Licensing Register

_Adheres to PRD Section 8._

| Dataset / Source | Authority | Scope & Coverage | License / Terms | Integration in MedSafe |
|---|---|---|---|---|
| **RxNorm** | National Library of Medicine (NIH) | Standardized active ingredient ontologies & RxCUI | Open Public Domain (U.S. Gov) | Mapped into `src/utils/clinicalIntelligence.js` |
| **openFDA** | U.S. Food & Drug Administration | Drug labeling, black-box warnings, adverse event logs | Open Data (CC0 Public Domain) | Primary clinical contraindication source |
| **CDSCO Indian Pharmacopoeia** | Central Drugs Standard Control Organisation (India) | Commercial Indian brand names, generic formulations & strengths | Public Sector Information | Brand-to-Generic lookup dictionary |
| **ISMP & NCC MERP** | Institute for Safe Medication Practices | Look-Alike / Sound-Alike (LASA) confusable drug pairs | Non-commercial educational usage | Integrated into `auditMedicationErrors()` |
