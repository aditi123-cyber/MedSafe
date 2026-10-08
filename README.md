# 🛡️ MedSafe - Prescription Safety Verification & Medication Timeline

[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-3.5_Flash_Lite-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

> **MedSafe** is an intelligent, AI-powered prescription verification and medication adherence platform designed to protect patients from adverse drug-drug interactions, duplicate molecule overdoses, and incorrect dosing intervals.

-----

## ✨ Key Features

### 🔍 1. Multimodal AI Vision Strip & Prescription OCR
- Powered by **Google Gemini 3.5 Flash Lite Vision AI**.
- Automatically reads printed labels, brand titles, chemical active salts, strengths, batch numbers, and dosing instructions from uploaded photos.
- Real-time animated scanning laser feedback and verbatim OCR transcript inspection drawer.
- Automatic failover to local Indian pharmaceutical heuristics for unreadable photos.

### 🛡️ 2. Comprehensive Drug-Drug & Food Interaction Matrix
- Cross-references prescriptions against **RxNorm**, **openFDA**, and **CDSCO Indian Pharmacopoeia** datasets.
- Immediate color-coded severity grading: **Critical Safety Hazard (Red)**, **Moderate Caution (Amber)**, and **Safe (Green)**.
- Food & mineral timing warnings (e.g., dairy binding with Ciprofloxacin, PPI empty stomach rules, anticoagulant dietary consistency).

### ⏰ 3. Dynamic Daily Schedule & Smart Gap Shifting
- Interactive daily timeline with custom slots (Morning 8:00 AM, Afternoon 1:00 PM, Evening 6:00 PM, Night 9:30 PM).
- **Smart Gap Shifter**: If a dose is logged late, the platform dynamically reschedules subsequent doses to maintain clinically safe minimum time intervals (e.g., 6h Paracetamol gap).

### 🌐 4. Full Multilingual Intelligence & ElevenLabs Audio
- Dynamic full-page reactive translation across **5 languages**:
  - 🇬🇧 English (`en`)
  - 🇮🇳 Hindi (`hi`)
  - 🇮🇳 Marathi (`mr`)
  - 🇮🇳 Tamil (`ta`)
  - 🇮🇳 Telugu (`te`)
- High-definition voice readouts powered by **ElevenLabs AI Voice Engine** with fallback to Web Speech Synthesis.

### 🤖 5. Context-Aware Google Gemini Clinical Assistant
- 24/7 conversational healthcare assistant integrated with active patient context (profile, age, allergies, active prescriptions, and contraindications).
- Instant conversational answers for symptoms, missed doses, and dietary precautions.

### 🚨 6. Caregiver Emergency SOS & Pop-up Broadcast
- Instant patient emergency trigger for "Feeling Dizzy", "Missed Dose", or "Urgent SOS".
- Live caregiver notification popups with audio chime and SMS payload simulation.

### 🎨 7. Taste-Skill Anti-Slop Visual Design
- Sleek **Midnight Navy & Cyber Glow** dark mode and crisp clinical light mode.
- Glassmorphic panels with subtle `1px` inner highlights and tactile `:active` micro-interactions.
- Custom modern typography with Outfit, Plus Jakarta Sans, and JetBrains Mono.

---

## 🛠️ Technology Stack

- **Frontend Framework:** React 18 (SPA with Hooks & Context API)
- **Build Tool:** Vite 6
- **AI & Vision Model:** Google Gemini 3.5 Flash Lite (`@google/genai` & REST API)
- **Voice Synthesis:** ElevenLabs TTS API + Web Speech API
- **Icons:** Lucide React
- **Styling:** Custom Vanilla CSS Design System (Glassmorphism, CSS Variables, Responsive Grid)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aditi123-cyber/MedSafe.git
   cd MedSafe
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_google_ai_studio_gemini_api_key
   VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```
MedSafe/
├── public/
├── src/
│   ├── components/
│   │   ├── AIBotView.jsx            # Gemini 3.5 Clinical Chat Assistant
│   │   ├── CaregiverAlertView.jsx   # Live emergency broadcast & alerts
│   │   ├── DrugKnowledgeView.jsx    # Indian brand mappings & drug catalog
│   │   ├── Header.jsx               # Navigation bar, language picker, dark mode
│   │   ├── LoginPage.jsx            # Authentication & profile switcher
│   │   ├── SafetyDashboard.jsx      # Interaction matrix & duplicate alerts
│   │   ├── ScannerView.jsx          # Gemini Vision multi-strip OCR reader
│   │   ├── SidebarNav.jsx           # Responsive sidebar navigation
│   │   └── TimelineView.jsx         # Dynamic daily schedule & adherence log
│   ├── context/
│   │   └── MedSafeContext.jsx       # Global state (prescriptions, profile, lang)
│   ├── data/
│   │   ├── drugDatabase.js          # 50+ Indian brands, generics & rules
│   │   └── translations.js          # Full multilingual dictionary (5 languages)
│   ├── styles/
│   │   └── index.css                # Taste-skill design system & dark mode
│   ├── utils/
│   │   ├── geminiAI.js              # Google Gemini 3.5 API integration
│   │   ├── ocrParser.js             # Fallback prescription NLP parser
│   │   └── speechSynthesis.js       # ElevenLabs + Web Speech engine
│   ├── App.jsx                      # Main app root & routing
│   └── main.jsx                     # Entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🔒 Medical Disclaimer
*MedSafe is designed as a safety verification and medication adherence companion tool. It cross-checks established clinical databases to flag potential risks and timing conflicts. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a licensed healthcare provider regarding medication regimens.*

---

## 📄 License
This project is licensed under the MIT License.
