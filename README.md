# HeavyRain (`HeavyRain_BDMD`)
**Autonomous Workflow Agent Infrastructure — Passive Desktop Observation, On-Device Signal vs. Noise Discernment, Weekly MVP Generation & Org-Wide Deduplication**

HeavyRain runs in the background of an organization's computers to observe repetitive weekly workflows—especially where employees **already use AI tools (Claude skills, Gemini, Granola, ChatGPT) in disconnected silos** and still act as the "human copy-paste glue" between Outlook, CRM, PDFs, Excel, and Slack.

Instead of just suggesting prompts, **HeavyRain filters out personal life and passive noise on-device, stack-ranks work workflows on both Individual User Relevance and Org-Wide Impact, autonomously builds a cohesive custom MVP each week**, invites the user to **beta test it the following week**, passively tracks usage telemetry to evolve `v1.0 -> v1.2`, and gives the **COO / Executive team** an org-wide command center for ROI, security governance, and **cross-team workflow deduplication**.

---

## Repository Structure

```text
HeavyRain/
├── backend/                              # FastAPI + Gemini 4 Argon Agent Engine (Dom's Core Backend)
│   ├── app.py                            # REST API (/api/observe, /api/discern-signal, /api/synthesize-weekly, /api/org-dedup, /api/telemetry-iterate)
│   ├── agent_engine.py                   # HeavyRainAgentEngine powered by google-genai (gemini-4-argon) + DISCERNMENT_MATRIX
│   ├── models.py                         # Shared Pydantic schemas
│   ├── mock_org_data.py                  # 5 Personas @ Meridian Crest Capital ($1.8B AUM)
│   └── requirements.txt                  # Python dependencies
├── frontend/                             # Interactive Multi-Persona V2 Platform (React + Vite + Tailwind)
│   ├── src/App.jsx                       # Animated Desktop Workflow, Signal vs. Noise Stack-Ranker, Beta Mini-Apps, COO View & Dom API Inspector
│   ├── src/InstitutionalSimulator.jsx    # Multi-Tool Desktop & Institutional SaaS Workstation Simulator
│   └── vite.config.js                    # Vite config proxying /api -> http://127.0.0.1:8000
├── workflows/                            # Dom's 5-stage pipeline spec (workflows/dom_agent_pipeline_spec.json)
├── docs/                                 # 1:00 PM Architecture Handoff Playbook for Dom & QA Readiness Report
├── live_preview.html                     # Standalone HTML multi-view launcher & heartbeat monitor
├── main.py                               # Minimal Gemini 4 Argon connectivity script
└── chat.py                               # Interactive Argon CLI agent
```

---

## Signal vs. Noise Discernment & Dual-Mandate Stack-Ranker (`POST /api/discern-signal`)

A background agent must know **what NOT to build**. HeavyRain evaluates every observed desktop sequence along two axes—**User Relevance Score (0–100)** and **Org-Wide Impact Score (0–100)**—and routes across 4 tiers:

1. **Tier 1 — Personal Life / Privacy Shield (`0% User / 0% Org` → `🔒 AUTO_PURGED_ON_DEVICE`)**
   - *Observed Sequence*: Fiancée iMessage text + browsing Airbnb villas & flights for an October honeymoon.
   - *Action*: Immediately purged in local RAM; never logged to the server and never triggers an app build.
2. **Tier 2 — Casual Non-Work Browsing / Noise (`8% User / 2% Org` → `🔇 IGNORED_AS_NOISE`)**
   - *Observed Sequence*: Morning coffee reading—scrolling X tech/celebrity drama threads and ESPN NBA box scores with zero downstream clipboard/CRM actions.
   - *Action*: Filtered out of weekly synthesis so users are never spammed with low-value toy apps.
3. **Tier 3 — Work-Relevant Individual Task (`78% User / 34% Org` → `👤 PERSONAL_MICRO_SKILL_ONLY`)**
   - *Observed Sequence*: Reading TechCrunch/PitchBook news → spotting a Series A/B AI funding round → copying company into Affinity CRM Watchlist & `#deal-flow-sourcing`.
   - *Action*: Downstream work intent detected! Builds a lightweight 1-click **"Flag Deal to Affinity"** browser clipper for Marcus, without pushing a heavy firm-wide app to Diligence or IR teams.
4. **Tier 4 — High-ROI Multi-Team Workflow (`98% User / 95% Org` → `🚀 PROMOTED_TO_FIRM_WIDE_MVP`)**
   - *Observed Sequence*: 15-Minute Pre-Call Scramble (Outlook → CRM → Claude → Granola → Gemini → Excel/Slack) & 88-Page PDF CIM to Excel EBITDA Bridge.
   - *Action*: High repetition + 62%–68% cross-team overlap → Promoted to a SOC2-governed Firm-Wide MVP.

---

## The 5 Demo Personas (Meridian Crest Capital)

1. **Marcus Vance (VP, Deal Sourcing & Screening)** — *"The 15-Minute Pre-Call Scramble"*
   - **Autonomous MVP Built**: **DealPulse AutoBrief & Post-Call Loop (v1.2)** (Saves 9.2 hrs/wk).
2. **Elena Rostova (Principal, Thesis & Customer Discovery)** — *"Target Persona Sourcing & Multi-Call Aggregation"*
   - **Cross-Org Deduplication (68% Overlap with Marcus)**: Forks Marcus's core Call Engine + attaches Batch Persona Scorer & Thesis Matrix (**DiscoveryOS v1.1**, saves 9.5 hrs/wk).
3. **Devon Brooks (Sr. Associate, Financial Diligence)** — *"88-Page PDF CIM Table Duct-Tape"*
   - **Autonomous MVP Built**: **CIM-to-IC Model Bridge & Live KPI Feed (v1.1)** (Saves 10.8 hrs/wk).
4. **Priya Nair (VP, Investor Relations)** — *"Urgent LP Inquiry & Slack Chasing"*
   - **Cross-Org Deduplication (62% Overlap with Devon)**: Connects **LP Instant Desk (v1.0)** directly to Devon's verified KPI feed (Saves 7.0 hrs/wk).
5. **Claire Sterling (COO & Managing Partner)** — *"Executive Governance, Org ROI & Dedup Command Center"*
   - **Org Mandate**: 36.5 hrs/wk saved ($274,000 annualized ROI), 2 cross-team module consolidations, 19 shadow-AI loops converted into SOC2-governed firm micro-apps.

---

## Quickstart (Running the Live Platform)

### 1. Environment Setup
Copy `.env.example` to `.env` and add your `GEMINI_API_KEY` / `GOOGLE_API_KEY`.

### 2. Start the FastAPI + Gemini 4 Argon Backend (Port 8000)
```powershell
python -m uvicorn backend.app:app --host 127.0.0.1 --port 8000 --reload
```

### 3. Start the React + Vite Frontend (Port 5173)
```powershell
cd frontend
npm.cmd run dev
```

Open **http://localhost:5173** in Chrome (or **http://127.0.0.1:8000/docs** for interactive Swagger API docs).
