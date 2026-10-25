# HeavyRain — 1:00 PM Dom Architecture Handoff & 100-Person Live Stage Playbook

## 0. Instant Launch & Live Preview URLs
All servers are running as persistent background daemons, plus standalone HTML views are ready in the workspace root:

- **Vite Interactive React App (V2 Animated UI + Signal vs. Noise Ranker)**: `http://localhost:5173`
- **Unified FastAPI + Static SPA + API Docs**: `http://127.0.0.1:8000` (Swagger UI at `http://127.0.0.1:8000/docs`)
- **Agent Teams Live Comms War Room (QB1 • RB1 • LB1)**: `http://127.0.0.1:8090` (`C:\Users\betam\Documents\HeavyRain\team_war_room.html`)
- **2nd Synced Chrome Tab**: `http://localhost:5173/?tab=act2&persona=marcus`
- **Standalone Instant HTML Preview**: `C:\Users\betam\Documents\HeavyRain\live_preview.html`

### V2 Top Navigation Bar — Story Switcher (`http://localhost:5173`)
1. **`1. Before HeavyRain (Animated Workflow)`**: Morphing desktop window animation (Outlook Alert → CRM → Claude Skill → Granola Waveform → Excel/Email) + `Stage Mode` toggle.
2. **`2. Recommended App & Beta Loop`**: Interactive mini-app per persona with live Week 1 → Week 2 self-mutating telemetry when clicked/edited.
3. **`3. "Already Exists!" Org Dedup & COO View`**: Interactive cross-org deduplication flow (Marcus ↔ Elena 68% match, Devon ↔ Priya 62% match) + Claire Sterling's COO Command Center ($274k ROI, 98% SOC2).
4. **`🛡️ Signal vs. Noise & Stack-Ranker`**: Shows how HeavyRain discerns personal life (Fiancée Honeymoon text + Airbnb) and daily news drama from work-relevant deal flagging and high-ROI firm-wide workflows.
5. **`Dom's Backend Contract`**: Interactive visual pipeline + 1-click live event emitter & Gemini 4 Argon endpoint tester.

---

## Part 1: 1:00 PM Engineering & Architecture Session with Dom (10-Minute Walkthrough)

### Goal with Dom
Show Dom that the entire **HeavyRain Frontend + FastAPI Contract + Gemini 4 Argon (`google-genai`) Synthesizer** is already wired end-to-end, and walk through the **5 modular stages** (including the on-device Signal vs. Noise & Dual-Level Stack Ranker) in `workflows/dom_agent_pipeline_spec.json`.

### Step-by-Step Flow for Dom
1. **Open the Dedicated Dom View (`Dom's Backend Contract` tab in top header)**
   - In `http://localhost:5173`, click the emerald **`Dom's Backend Contract`** button in the top navigation bar.
2. **Demonstrate the Live FastAPI Endpoints & Discernment Pipeline (`backend/app.py` + `backend/agent_engine.py`)**
   - **Stage 1 — Passive Desktop Telemetry (`POST /api/observe`)**:
     - Switch to **`1. Before HeavyRain (Animated Workflow)`** and click any step in Marcus's workflow (or click **`Auto-Play Animated Story`**).
     - Point out the **`Live Background Telemetry Stream (/api/observe)`**: every desktop window switch, Outlook calendar trigger, Granola transcript finish, or Claude/Gemini clipboard copy emits a structured `ObserveEventRequest` event (`DISCONNECTED_AI_SILO`, `HUMAN_GLUE_HANDOFF`, `WORKFLOW_STEP`).
   - **Stage 1B — Signal vs. Noise Discernment & Dual-Level Stack Ranker (`🛡️ Signal vs. Noise & Stack-Ranker`)**:
     - Show Dom how the agent avoids creepy or useless automation by scoring every observed task on **Individual User Relevance (0–100%)** AND **Org-Wide Impact (0–100%)**:
       1. *Fiancée Honeymoon Text + Airbnb Browsing* → `0% Work Relevance` → **🔒 Auto-Purged on Device (Never Logged / Never Builds a Tool)**
       2. *Morning News: Sports / Celebrity / Political Drama* → `8% Work Relevance` → **🔇 Ignored as Routine Noise**
       3. *Morning News: Sector AI Funding Article → Copy to Affinity CRM* → `78% User Relevance / 34% Org Impact` → **👤 Lightweight Personal "Flag Deal" Clipper Only (Not Pushed Firm-Wide)**
       4. *15-Min Pre/Post-Call Loop & 88-Page CIM-to-Excel Bridge* → `98% User Relevance / 95% Org Impact (62–68% Multi-Team Overlap)` → **🏢 Promoted to Firm-Wide Governed MVP**
   - **Stage 2 — Weekly Subtask Clustering & MVP Synthesis (`POST /api/synthesize-weekly`)**:
     - Return to **`Dom's Backend Contract`** and click **`POST /api/synthesize-weekly`**.
     - Show Dom the live JSON response from `HeavyRainAgentEngine.synthesize_weekly_workflow()` powered by `gemini-4-argon` (`client.interactions.create`).
   - **Stage 3 — Cross-Org Workflow Deduplication (`POST /api/org-dedup`)**:
     - Select **Elena Rostova** in the top Persona Bar and click **`POST /api/org-dedup`**.
     - Show how `HeavyRainAgentEngine.check_org_deduplication()` detects a **68% Workflow DNA Match** with Marcus Vance's existing `mvp_marcus_01` and recommends forking his Calendar + Granola + Gemini core while attaching Elena's custom **Multi-Call Thesis Matrix** delta adapter (saving 28 engineering hours).
   - **Stage 4 — Weekly Beta Telemetry Self-Mutation (`POST /api/telemetry-iterate`)**:
     - Edit the **Custom Beta Telemetry Input** box and click **`POST /api/telemetry-iterate`**.
     - Show how `gemini-4-argon` generates the Week 2 `v1.3-beta (Auto-Mutated)` changelog: pruning ignored UI widgets, promoting manual overrides into first-class schema fields, and updating prompts automatically.

---

## Part 2: 100-Person Live Stage Demo Script (5-Minute High-Impact Narrative)

### Core Thesis to Open With (0:00 – 0:45)
> *"Everyone on this team already uses AI—Claude skills, Gemini, Granola call recorders. Yet why are our investors still scrambling 15 minutes before every founder meeting? Because they are acting as **Human Glue** between disconnected AI silos. HeavyRain doesn't give you another chat prompt. It watches your fragmented workflow all week, filters out personal noise, **autonomously builds you a custom cohesive MVP for next week**, watches how you beta-test it, and connects overlapping workflows across the entire firm."*

### Act I: Animated "Before HeavyRain" Workflow (`1. Before HeavyRain (Animated Workflow)`) (0:45 – 1:45)
1. **Walk Through Marcus Vance (VP, Deal Sourcing — "15-Min Pre-Call Scramble")**:
   - Hit **`Auto-Play Animated Story`** or click Steps 1 → 6:
   - Watch the active desktop window morph live from **Outlook Calendar Alert** → **Affinity CRM + Gmail** → **Claude 3.7 Web Skill** → **Zoom + Granola Live Waveform** → **Gemini Post-Call Polisher** → **Slack `#deal-flow-ic`**.
   - Show that Marcus **already uses AI in 3 places**, yet still wastes **42 minutes per call** performing **5 manual copy-paste "Human Glue" handoffs**.

### Act II: Signal vs. Noise Discernment (`🛡️ Signal vs. Noise & Stack-Ranker`) (1:45 – 2:30)
1. **Show Why HeavyRain Isn't a Naive Macro Recorder**:
   - Point out the **Fiancée Honeymoon Text + Airbnb** example (`0% Work Relevance` → **Auto-Purged on Device**) and **Daily News Drama** (`8%` → **Ignored**) vs. **Reading TechCrunch & Flagging a Sector Deal into CRM** (`78% User Relevance / 34% Org Impact` → **Personal Micro-Clipper Only**).
   - Contrast that with **Pre/Post-Call Synthesis & CIM-to-Excel Modeling** (`98% User / 95% Org Impact`), which the stack-ranker promotes to full **Firm-Wide Governed MVPs**.

### Act III: Interactive Recommended App & Self-Mutating Beta Loop (`2. Recommended App & Beta Loop`) (2:30 – 3:45)
1. **Click `2. Recommended App & Beta Loop`**:
   - Show the interactive **DealPulse AutoBrief & Post-Call Loop (`v1.2-beta`)** mini-app built autonomously for Marcus—collapsing 42 minutes into **90 seconds** with zero copy-paste.
   - Toggle between **Week 1 Beta (`v1.0`)** and **Week 2 Auto-Mutated (`v1.2`)** to show how HeavyRain observes what Marcus clicks, ignores, or manually overrides during the beta week and mutates the app automatically.

### Act IV: "Already Exists in Org!" Dedup & COO Command Center (`3. "Already Exists!" Org Dedup & COO View`) (3:45 – 5:00)
1. **Click `3. "Already Exists!" Org Dedup & COO View`**:
   - Select **Elena Rostova (`68% Shared DNA`)**: Show the interactive **"Workflow Already Exists in Firm!"** interception—forking Marcus's 68% shared core and attaching Elena's **Multi-Call Thesis Matrix** adapter (saving 28 build hours).
   - Select **Priya Nair (`62% Shared DNA`)**: Show how HeavyRain connects Priya's **LP Instant Desk** directly to **Devon Brooks's** verified portfolio KPI table—eliminating 7 weekly Slack interruptions.
   - Reveal **Claire Sterling's COO Executive Command Center**: **36.5 hrs/wk** saved, **$274,000** annualized ROI, **2 Shared Firm Cores**, and **98% SOC2 Governance**.
