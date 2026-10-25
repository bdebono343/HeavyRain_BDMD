# HeavyRain — 1:00 PM Dom Architecture Handoff & 100-Person Live Stage Playbook

## 0. Instant Launch & Live Preview URLs
Both servers are running as persistent background daemons, plus a standalone zero-dependency HTML live preview is ready in the workspace root:

- **Vite Interactive React App (Primary Live UI)**: `http://localhost:5173`
- **Unified FastAPI + Static SPA + API Docs**: `http://127.0.0.1:8000` (Swagger UI at `http://127.0.0.1:8000/docs`)
- **2nd Synced Chrome Tab (Agent Brain Only)**: `http://localhost:5173/?tab=agent&persona=marcus`
- **Standalone Instant HTML Preview**: `C:\Users\betam\Documents\HeavyRain\live_preview.html`

---

## Part 1: 1:00 PM Engineering & Architecture Session with Dom (10-Minute Walkthrough)

### Goal with Dom
Show Dom that the entire **HeavyRain Frontend + FastAPI Contract + Gemini 4 Argon (`google-genai`) Synthesizer** is already wired end-to-end, and walk through the **4 modular hook points** where his OS/Browser observation daemon and agent pipeline plug in without touching UI code.

### Step-by-Step Flow for Dom
1. **Open the Dedicated Dom View (`Dom's Backend Contract` tab in top header)**
   - In `http://localhost:5173`, click the emerald **`Dom's Backend Contract`** button in the top navigation bar (or click **`Inspect Dom's API Contract →`** inside the Right Agent Brain pane).
2. **Demonstrate the 4 Live FastAPI Endpoints (`backend/app.py` + `backend/agent_engine.py`)**
   - **Hook #1 — Passive Desktop Telemetry (`POST /api/observe`)**:
     - Switch briefly to **`Split Demo (Desktop + Agent)`** and click any step in Marcus's workflow (or click **`Auto-Simulate Workflow`**).
     - Point out the **`Live Background Telemetry Stream (/api/observe)`** at the bottom-right: every desktop window switch, Outlook calendar trigger, Granola transcript finish, or Claude/Gemini clipboard copy emits a structured `ObserveEventRequest` event (`DISCONNECTED_AI_SILO`, `HUMAN_GLUE_HANDOFF`, `WORKFLOW_STEP`).
   - **Hook #2 — Weekly Subtask Clustering & MVP Synthesis (`POST /api/synthesize-weekly`)**:
     - Return to **`Dom's Backend Contract`** and click **`POST /api/synthesize-weekly`**.
     - Show Dom the live JSON response from `HeavyRainAgentEngine.synthesize_weekly_workflow()` powered by `gemini-4-argon` (`client.interactions.create`):
       - Counts `disconnected_ai_silos_detected` vs. `human_glue_steps_detected`
       - Outputs the `BuiltMvpSpec` (`DealPulse AutoBrief & Post-Call Loop v1.2-beta`)
       - Points to `workflows/dom_agent_pipeline_spec.json` for the exact input/output schema.
   - **Hook #3 — Cross-Org Workflow Deduplication (`POST /api/org-dedup`)**:
     - Select **Elena Rostova** in the top Persona Bar and click **`POST /api/org-dedup`**.
     - Show how `HeavyRainAgentEngine.check_org_deduplication()` detects a **68% Workflow DNA Match** with Marcus Vance's existing `mvp_marcus_01` and recommends forking his Calendar + Granola + Gemini core while attaching Elena's custom **Multi-Call Thesis Matrix** delta adapter (saving 28 engineering hours).
   - **Hook #4 — Weekly Beta Telemetry Self-Mutation (`POST /api/telemetry-iterate`)**:
     - Edit the **Custom Beta Telemetry Input** box (e.g., *"User clicked Pre-Call HUD 14/14 times, ignored Public Comp Ticker (0 clicks), and manually typed 'Key Deal Risks' into 11 post-call emails."*) and click **`POST /api/telemetry-iterate`**.
     - Show how `gemini-4-argon` generates the Week 2 `v1.3-beta (Auto-Mutated)` changelog: pruning ignored UI widgets, promoting manual overrides into first-class schema fields, and updating prompts automatically.

---

## Part 2: 100-Person Live Stage Demo Script (5-Minute High-Impact Narrative)

### Core Thesis to Open With (0:00 – 0:45)
> *"Everyone on this team already uses AI—Claude skills, Gemini, Granola call recorders. Yet why are our investors still scrambling 15 minutes before every founder meeting? Because they are acting as **Human Glue** between disconnected AI silos. HeavyRain doesn't give you another chat prompt. It watches your fragmented workflow all week, **autonomously builds you a custom cohesive MVP for next week**, watches how you beta-test it, and connects overlapping workflows across the entire firm."*

### Act I: Dual-Screen Setup & Taking Over Marcus's Computer (0:45 – 2:00)
1. **Launch Dual Synced Chrome Tabs (or Split-Screen)**:
   - Click **`Pop Out 2nd Synced Tab`** in the top-right corner (`BroadcastChannel('heavyrain_demo_sync')` + `POST /api/live-state/sync`).
   - Put **Tab 1 (`Persona Desktop Only`)** on the left half of the projector and **Tab 2 (`HeavyRain Brain Only`)** on the right half (or stay in **`Split Demo (Desktop + Agent)`** single-window view).
2. **Walk Through Marcus Vance (VP, Deal Sourcing — "15-Min Pre-Call Scramble")**:
   - Point to the **Scenario Banner**: Outlook reminder fires 15 minutes before the VeloceAI founder call.
   - Click through Steps 1 → 6 (or hit **`Auto-Simulate Workflow`**):
     - Show that Marcus **already uses AI in 3 places** (Claude Web Skill for brief, Granola for transcription, Gemini for follow-up email), yet still wastes **42 minutes per call** performing **5 manual copy-paste "Human Glue" handoffs** across Outlook, Affinity CRM, Chrome, Granola, and Slack.
3. **Flip the Switch to Week 2 (`Week 2: Test HeavyRain Beta MVP`)**:
   - Click the emerald **`Week 2: Test HeavyRain Beta MVP`** button in Marcus's desktop titlebar.
   - Notice both tabs sync instantly! Show the Monday morning pitch from HeavyRain: **DealPulse AutoBrief & Post-Call Loop (`v1.2-beta`)** collapses 42 minutes into **90 seconds** with zero copy-paste.
   - Click a feature inside the Beta MVP (e.g., *Public Comp Ticker Widget — Ignored 8%*) to show how the **user acts as the beta tester**: HeavyRain passively records what Marcus clicks, ignores, or manually edits, and auto-mutates the app from `v1.0` to `v1.2` the following Monday.

### Act II: Cross-Org Deduplication Across All 5 Personas (2:00 – 3:45)
1. **Switch to Elena Rostova (Principal, Growth & Customer Discovery — `68% Shared DNA`)**:
   - Click **Elena Rostova** in the top Persona Bar.
   - Show her workflow: sourcing 24 VP Engineering personas on LinkedIn, generating tailored questions in Claude, recording customer calls in Granola, and pasting transcripts into Gemini to score her **Excel Thesis Validation Matrix**.
   - In the Right Brain Pane, click **`4. Org Dedup Match`**:
     - Highlight the **68% Workflow DNA Match** with Marcus Vance. Instead of building a redundant call pipeline from scratch, HeavyRain forked Marcus's Calendar + Granola + Gemini core and only built Elena's custom **Multi-Call Thesis Matrix** adapter—saving **28 hours of build time**.
2. **Switch to Devon Brooks (Sr. Associate, Financial Diligence) ↔ Priya Nair (VP, Investor Relations — `62% Shared DNA`)**:
   - Click **Devon Brooks**: Show his 88-page PDF CIM screenshot → Gemini Vision → Excel IC Model EBITDA Bridge (**CIM-to-IC Model Bridge**, saving 11.0 hrs/wk).
   - Click **Priya Nair**: Show the urgent **CalSTRS LP inquiry** landing in Outlook. Previously, Priya interrupted Devon on Slack 7x/week to verify ARR/NDR metrics before polishing emails in Gemini.
   - Click **`4. Org Dedup Match`** on Priya: HeavyRain detected a **62% overlap** and wired Priya's **LP Instant Desk** directly to Devon's verified portfolio KPI table—eliminating cross-team Slack bottlenecks completely.

### Act III: The COO / Managing Partner Finale (3:45 – 5:00)
1. **Click Claire Sterling (`COO Mandate`) or the Rose `COO / Exec Org View` Button**:
   - Reveal the firm-wide **Meridian Crest Capital Executive Command Center**:
     - **36.5 hrs/wk** Partner & Associate time recovered
     - **$274,000** Annualized Productivity ROI
     - **2 Shared Firm Cores** (preventing 4 duplicate point-tool builds across Sourcing, Growth, Diligence, and IR)
     - **98% SOC2 Governance** (19 unmonitored "Shadow-AI" copy-paste loops brought into audited enterprise endpoints)
2. **Closing Punchline**:
   - *"Individual investors get a zero-effort weekly beta app tailored to how they actually work. Leadership gets cross-team reuse, zero duplicate engineering, and full SOC2 governance over every AI workflow in the firm."*
