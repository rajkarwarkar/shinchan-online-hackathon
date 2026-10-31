# 🌑 DarkSpot AI
### *AI-Assisted Information Gap & Contradiction Detection Platform*
**Official Submission for the Shinchan Online Hackathon 2026**  
*Problem Statement: DIGITAL DARK SPOT*

---

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

---

## 1. 📌 Problem Overview & The "Digital Dark Spot"

People make life-altering decisions every day—applying for scholarships, obtaining visas, applying for government benefits, and investing in research. While modern search engines find information and AI summarizers compress what was found, **neither tool identifies what is missing, obsolete, or mutually contradictory**.

A scholarship applicant might read three articles explaining eligibility criteria, yet miss the fact that:
1. **Critical Gap**: None of the sources state the minimum retention GPA or renewal terms for Year 2.
2. **Direct Contradiction**: One source claims a $50,000 income ceiling while another states $65,000.
3. **Temporal Stale Warning**: The most detailed forum guide refers to an obsolete 2024 application cycle.
4. **Action Paralysis**: The user is left unsure of what specific office or document to verify next.

**DarkSpot AI** solves this by shifting the paradigm from *passive text summarization* to **proactive risk synthesis and gap cross-examination**.

---

## 2. 🚀 Key Innovations & Differentiators

Unlike generic chatbots or summarization tools, **DarkSpot AI** introduces 5 core intelligence layers:

- 🎯 **Expectation-Driven Gap Engine**: Automatically benchmarks extracted content against domain-specific decision facets (e.g., *Renewal Criteria*, *Dispute/Appeal Recourse*, *Tax Liability*, *Stacking Restrictions*).
- ⚔️ **Cross-Source Contradiction Radar**: Cross-examines statements across publications and displays side-by-side snippet comparisons with verbatim quotes, root cause analysis, and resolution guidance.
- ⏳ **Temporal Decay & Freshness Auditor**: Scans dates, calendar years, and cycle tags to flag obsolete cycles (e.g., 2024 guidance in a 2026 decision).
- 🛡️ **Traceable Evidence & Responsible AI Labeling**: Strictly adheres to transparency standards: direct quotes are stamped `[SOURCE FACT]`, while inferred missing areas are responsibly tagged `[POTENTIAL GAP / SIGNAL]`.
- ✅ **Prioritized Human Verification Checklist**: Synthesizes findings into an interactive, prioritized action plan with 1-click Markdown export.

---

## 3. 📊 Alignment with Hackathon Evaluation Criteria (10 / 10 Marks)

| Evaluation Area | Weight | Marks | How DarkSpot AI Delivers |
| :--- | :---: | :---: | :--- |
| **Working Prototype & Functionality** | **25%** | **2.5** | Fully functional end-to-end pipeline. Includes 3 instant 1-click evaluation presets (including the official PDF Scholarship scenario) and dynamic multi-URL/text scraping. |
| **Innovation & Originality** | **20%** | **2.0** | Moves beyond summarization to compute a **Dark Spot Index** (Completeness Score) and a dual-claim contradiction matrix. |
| **Evidence, Accuracy & Transparency** | **15%** | **1.5** | Every finding is traceable to exact source snippets; facts and AI signals are visually segregated with distinct tags. |
| **Problem Understanding & Relevance** | **15%** | **1.5** | Directly addresses high-stakes real-world domains: Education/Scholarships, STEM OPT Visas, and Clean Energy Rebates. |
| **Technical Implementation** | **15%** | **1.5** | Built on Next.js 16 App Router, TypeScript, Tailwind CSS v4, Cheerio HTML parser, and Gemini AI integration with zero-crash heuristic fallback. |
| **Presentation & Demo** | **10%** | **1.0** | Intuitive glassmorphic dashboard, responsive layout, interactive verification checklist with progress tracking and Markdown export. |

---

## 4. 🏗️ System Architecture

```
                    ┌──────────────────────────────────────────────┐
                    │               User Input                     │
                    │   - 1-Click Showcases (Scholarship, etc.)   │
                    │   - Custom Query + URLs / Raw Text Excerpts  │
                    └──────────────────────┬───────────────────────┘
                                           │
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │      URL Parser & Normalizer (Cheerio)       │
                    │   - Cleans HTML, extracts dates, metadata    │
                    └──────────────────────┬───────────────────────┘
                                           │
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │          Intelligence Synthesis Engine       │
                    │  (Gemini API / Rule-Based Heuristic Fallback)│
                    └──────┬───────────────┼───────────────┬───────┘
                           │               │               │
                           ▼               ▼               ▼
                 ┌─────────────────┐ ┌───────────┐ ┌───────────────┐
                 │ 1. Gap Detector │ │2. Conflict│ │  3. Temporal  │
                 │ Missing Facets  │ │   Radar   │ │ Freshness     │
                 └─────────┬───────┘ └─────┬─────┘ └───────┬───────┘
                           │               │               │
                           └───────────────┼───────────────┘
                                           │
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │       DarkSpot Completeness Score (0-100%)   │
                    │       Interactive Verification Checklist     │
                    └──────────────────────┬───────────────────────┘
                                           │
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │       Next.js Responsive Dashboard UI        │
                    │   - Gaps View        - Contradiction Radar   │
                    │   - Freshness Audit  - Source Explorer       │
                    │   - Action Plan      - Export Brief          │
                    └──────────────────────────────────────────────┘
```

---

## 5. 🎬 Suggested 3-Minute Demo Flow (Per Problem Statement Section 7)

1. **The Core Thesis (30s)**:
   - "Search engines tell you what exists. DarkSpot AI shows you what is dangerously missing, conflicting, or outdated before you make high-stakes decisions."
2. **Load Scenario (30s)**:
   - Click the **"STEM Excellence Scholarship (PDF Use Case)"** preset button. The dashboard instantly renders the complete analysis across 3 sources.
3. **Inspect the Dark Spots (45s)**:
   - Navigate to **"Information Gaps"**. Highlight that despite 3 detailed sources, **Renewal Criteria** and **Appeal Recourse** are completely absent.
4. **Demonstrate Conflict & Outdated Warnings (45s)**:
   - Switch to **"Contradiction Radar"**: Show Source 1 ($60k cap) vs. Source 3 ($65k dependent cap) side-by-side.
   - Switch to **"Temporal & Freshness Audit"**: Show how Source 2 is flagged as an obsolete 2024 archive.
5. **Actionable Checklist & Export (30s)**:
   - Open **"Verification Checklist"**, check off tasks to watch the progress bar update, and click **"Copy Markdown Brief"** to show real-world utility.

---

## 6. 🛠️ Tech Stack

- **Framework**: Next.js 16.4.3 (App Router with Turbopack)
- **Language**: TypeScript 5.0
- **UI & Styling**: Tailwind CSS v4, Lucide React Icons
- **Animation & FX**: Canvas Confetti, CSS Glassmorphism
- **HTML Parsing**: Cheerio
- **AI Integration**: Google Gemini API (`@google/genai`) with offline heuristic fallback

---

## 7. ⚡ Quickstart & Local Setup

### Prerequisites
- Node.js `v18.0.0` or higher
- npm `v9.0.0` or higher

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/shinchan-online-hackathon.git

# Navigate to the project directory
cd shinchan-online-hackathon

# Install dependencies
npm install

# (Optional) Set up your Gemini API key for live AI analysis
# Create a .env.local file:
# echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env.local

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 8. 📄 Project Submission Summary

- **Project Name**: DarkSpot AI
- **Problem Statement**: DIGITAL DARK SPOT — AI-Assisted Information Gap Detection Platform
- **Category**: Web Development • Artificial Intelligence • Research & Information Technology
- **Hackathon**: Shinchan Online Hackathon 2026 (Devengers)

---

*Built with thoughtful engineering, verifiable evidence, and responsible AI.*
