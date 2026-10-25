# HeavyRain (`HeavyRain_BDMD`)
**Autonomous Workflow Agent Infrastructure — Passive Desktop Observation, Weekly MVP Generation & Org-Wide Deduplication**

HeavyRain runs in the background of an organization's computers to observe repetitive weekly workflows—especially where employees **already use AI tools (Claude skills, Gemini, Granola, ChatGPT) in disconnected silos** and still act as the "human copy-paste glue" between Outlook, CRM, PDFs, Excel, and Slack.

Instead of just suggesting prompts, **HeavyRain autonomously builds a cohesive custom MVP each week**, invites the user to **beta test it the following week**, passively tracks usage telemetry (what they adopt, ignore, or manually override) to evolve `v1.0 -> v1.2`, and gives the **COO / Executive team** an org-wide command center for ROI, security governance, and **cross-team workflow deduplication**.

---

## Repository Structure

```text
HeavyRain/
├── backend/                              # FastAPI + Gemini 4 Argon Agent Engine (Dom's Core Backend)
│   ├── app.py                            # REST API (/api/observe, /api/synthesize-weekly, /api/org-dedup, /api/telemetry-iterate)
│   ├── agent_engine.py                   # HeavyRainAgentEngine powered by google-genai (gemini-4-argon)
│   ├── models.py                         # Shared Pydantic schemas
│   ├── mock_org_data.py                  # 5 Personas @ Meridian Crest Capital ($1.8B AUM)
│   └── requirements.txt                  # Python dependencies
├── frontend/                             # Interactive Multi-Persona Demo & Workspace Takeover UI (React + Vite + Tailwind)
│   ├── src/App.jsx                       # Split-Screen Demo, Persona Workspace Takeover, Agent Brain, COO View & Dom API Inspector
│   └── vite.config.js                    # Vite config proxying /api -> http://127.0.0.1:8000
├── workflows/                            # Workflow schemas & shared firm module definitions
├── docs/                                 # Architecture & 1:00 PM Demo Playbook for Dom
├── main.py                               # Minimal Gemini 4 Argon connectivity script
└── chat.py                               # Interactive Argon CLI agent
```

---

## The 5 Demo Personas (Meridian Crest Capital)

1. **Marcus Vance (VP, Deal Sourcing & Screening)** — *"The 15-Minute Pre-Call Scramble"*
   - **Fragmented Workflow**: Outlook 15m alert → Affinity CRM → Google News → Claude Pre-Call Skill → Zoom + Granola → Gemini Recap → Deal Team Email.
   - **Autonomous MVP Built**: **DealPulse AutoBrief & Post-Call Loop (v1.2)** (Saves 9.2 hrs/wk).
2. **Elena Rostova (Principal, Thesis & Customer Discovery)** — *"Target Persona Sourcing & Multi-Call Aggregation"*
   - **Fragmented Workflow**: Thesis doc → 24 LinkedIn/Guidepoint bios → Claude interview guide → Granola recording → Gemini extraction → Excel Thesis Matrix.
   - **Cross-Org Deduplication (68% Overlap with Marcus)**: Forks Marcus's core Call Engine + attaches Batch Persona Scorer & Thesis Matrix (**DiscoveryOS v1.1**, saves 9.5 hrs/wk).
3. **Devon Brooks (Sr. Associate, Financial Diligence)** — *"88-Page PDF CIM Table Duct-Tape"*
   - **Fragmented Workflow**: VDR PDF download → Snipping Tool screenshots → Gemini Vision CSV → Master Excel EBITDA Bridge + Slack interruptions from IR.
   - **Autonomous MVP Built**: **CIM-to-IC Model Bridge & Live KPI Feed (v1.1)** (Saves 10.8 hrs/wk).
4. **Priya Nair (VP, Investor Relations)** — *"Urgent LP Inquiry & Slack Chasing"*
   - **Fragmented Workflow**: Urgent CalSTRS LP email → Slack DM waiting on Devon → DDQ check → Gemini tone polisher → Outlook reply.
   - **Cross-Org Deduplication (62% Overlap with Devon)**: Connects **LP Instant Desk (v1.0)** directly to Devon's verified KPI feed (Saves 7.0 hrs/wk).
5. **Claire Sterling (COO & Managing Partner)** — *"Executive Governance, Org ROI & Dedup Command Center"*
   - **Org Mandate**: 36.5 hrs/wk saved ($274,000 annualized ROI), 2 cross-team module consolidations, 19 shadow-AI loops converted into SOC2-governed firm micro-apps.

---

## Quickstart (Running the Live Demo)

### 1. Environment Setup
Ensure `.env` contains your `GOOGLE_API_KEY` / `GEMINI_API_KEY`.

### 2. Start the FastAPI + Gemini 4 Argon Backend (Port 8000)
```powershell
python -m uvicorn backend.app:app --host 127.0.0.1 --port 8000 --reload
```

### 3. Start the React + Vite Frontend (Port 5173)
```powershell
cd frontend
npm.cmd run dev
```

Open **http://localhost:5173** in Chrome. Click **"Pop Out 2nd Synced Tab"** in the top-right to showcase the Persona Desktop Workspace and the HeavyRain Background Agent side-by-side across two live-synced browser windows!
