# PharmAI Assistant 💊

An elegant, robust, AI-powered clinical pharmacy assistant engineered for pharmacy students, clinical educators, and healthcare professionals. PharmAI simplifies complex pharmacology into high-yield, structured reference sheets, side-by-side drug comparisons, and interactive, context-aware student consultation guides.

## 📷 Screenshots

![Landing Page](screenshots/screenshot-1.png)

![Profile Comparison](screenshots/screenshot-2.png)

![Pharmacist Chat](screenshots/screenshot-3.png)

> Place your screenshot images in the `screenshots/` folder with the matching file names above.

---

## 🌟 Key Capabilities

### 1. Dynamic Clinical Drug Profiles
Search for any generic or brand-name medication to instantly synthesize a **15-section structured reference card** detailing:
*   **Pharmacology Core:** Classifications, exact Mechanism of Action (MOA), FDA indications, and off-label uses.
*   **Administration & Safety:** Standard adult/pediatric dosages, essential renal/hepatic dosing adjustments, and clear contraindications.
*   **Monitoring & Patient Care:** Severe/serious adverse effects, crucial monitoring parameters (e.g., eGFR, INR, LFTs), patient counseling guides, and storage configurations.
*   **High-Yield Study Tips:** Curated clinical study guidelines and memory triggers tailored specifically for board examinations.

### 2. Side-by-Side Therapeutic Comparison
Compare two different therapeutic profiles dynamically (e.g., *Warfarin vs. Apixaban* or *Metformin vs. Insulin Glargine*). The application matches corresponding parameters side-by-side, allowing students and educators to easily study therapeutic class differences, metabolic routes, excretion profiles, and distinct monitoring rules.

### 3. Interactive Student Chat Guide
A built-in interactive consultation simulator. Ask clinical questions about the selected drug, test mock counseling scenarios, or select pre-configured questions designed to drill key concepts. 

###

---

## 🎨 Visual Identity & UI Craftsmanship

PharmAI avoids generic "AI Slop" templates by utilizing custom mathematical grids, professional editorial typography, and high-contrast clinical themes:
*   **Elegant Editorial Palette:** Uses rich Slate neutrals (`#0F172A`), clinical deep-sea blues, and refreshing emerald tones, designed for high legibility under WCAG AA standards.
*   **Mathematical Spacing & Radii:** Container padding strictly adheres to structural logic where outer margins exceed inner child gap distances. Rounded corners cap elegantly at `12px` to `16px` for clean, modern containers.
*   **Dynamic Fluid Motion:** Features graceful entrance transitions, tab fades, and alert pulses powered by `motion/react` to deliver an organic desktop and mobile browsing experience.
*   **No Nested Cards:** Flat, readable hierarchies that replace redundant cards-in-cards structures with beautiful dividers, custom tags, and high-yield badges.

---

## 🛠️ Built With

*   **Frontend:** React 19, Vite 6, Tailwind CSS v4 (using the `@tailwindcss/vite` compiler).
*   **Backend:** Node.js Express server acting as a secure API proxy to hide sensitive keys.
*   **AI Engine:** Modern `@google/genai` TypeScript SDK utilizing server-side execution.
*   **Motion & Effects:** `motion/react` for fluid layout and state transitions.
*   **Icons:** Elegant, functional vector sets from `lucide-react`.

---

## ⚙️ Quick Start

### Prerequisites
Make sure you have Node.js (v18+) and npm installed.

### 1. Configure Secrets
Create a `.env` file in the project root:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*Note: If the API key is not supplied, the application will gracefully fall back to the extensive local high-yield reference dataset.*

### 2. Install Dependencies
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build and Start in Production
To compile and bundle both the Vite frontend and Express server:
```bash
npm run build
npm start
```

---

## 🏥 Educational Disclaimer
This assistant provides educational reference materials and clinical study guides only. It does not replace professional medical advice, clinical diagnosis, or direct medical decision-making. Always verify therapeutic recommendations with official drug monographs and peer-reviewed professional sources.

