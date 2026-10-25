# Heavy Rain × Talos — Complete 5-Minute Live Demo Script & Talk Track

> [!IMPORTANT]
> **Core Narrative Arc (5 Minutes, Co-Presented by You & Dom)**
> 1. **The Modern Work Problem (`0:00 – 0:50`)**: Workers complete high-frequency, multi-app workflows every week—already using AI tools in silos—without realizing their "human glue" routine is a textbook candidate for custom software.
> 2. **Meet Marcus & Why He Needs Talos (`0:50 – 1:55`)**: Marcus is deeply technical at *investing*, not software engineering. **Talos** (the agentic harness inside **Heavy Rain**) passively observes his desktop loop, purges personal noise on-device, stack-ranks by user & org impact, and packages the context automatically.
> 3. **Dom's Platform Live — How Talos Works Under the Hood (`1:55 – 3:10`)**: Inside the Heavy Rain Console (`Ingest` → `Build` → `Apps`), **Relay** and **Talos (`Cairn`)** enforce enterprise security, continuity, and a 3-way gate (**Reuse Catalog App**, **Hold for Missing Evidence**, or **Commission Sandbox Build** behind the smoky-blur veil).
> 4. **Impact on Marcus & His Entire Team (`3:10 – 4:05`)**: How Marcus's **DealPulse AutoBrief** & **Rookmere Close** save hours, self-mutate from Week 1 to Week 2 (`v1.0 → v1.2`), and deduplicate across his teammates (**Elena**, **Devon**, **Priya**, and **Claire**).
> 5. **The Anti-AI-Slop Finale — Dynamic Modality at AUGI Manufacturing (`4:05 – 5:00`)**: Why cookie-cutter AI chat wrappers fail. When we switch from finance to **AUGI** (an 800V electric SUV manufacturer), Talos dynamically determines that engineers don't need a form—they need **Sable Studio**, an interactive 3D WebGL chassis & load-case comparator.

---

## Pre-Flight Screen Setup

- **Your Browser (`http://localhost:5173`)**: Start on **Marcus Vance** (`VP, Deal Sourcing & Screening`) with **`1. Before HeavyRain (Animated Workflow)`** selected.
- **Dom's Browser (`argon-hackathon-heavy-rain`)**:
  - Tab 1: **Heavy Rain Operator Console** (`http://127.0.0.1:43170`) — set to **Ingest / Work** view.
  - Tab 2: **Rookmere Close** (`http://127.0.0.1:43173`) — Finance variance & covenant workbench.
  - Tab 3: **AUGI Sable Studio** (`http://127.0.0.1:43171`) & **Sable Balance** (`http://127.0.0.1:43171/?app=balance`) — 3D WebGL engineering studio.

---

## Act 1: The Problem — "Invisible Workflows & The Human Glue Trap" (`0:00 – 0:50`)
**Speaker:** You | **Screen:** Your UI (`1. Before HeavyRain (Animated Workflow)`)

### Visual / Click Cues
1. Start on `http://localhost:5173` with **Marcus Vance** selected.
2. Click **`Auto-Play Animated Story`** so the desktop window animation morphs live behind you (*Outlook 15-Min Reminder → Affinity CRM → Google News → Claude 3.7 Skill → Zoom + Granola Waveform → Gemini Post-Call Polisher → Deal Team Email & Slack*).

### Spoken Talk Track
> **"Every week, knowledge workers across finance, operations, and engineering execute hundreds of complex, high-stakes workflows. And here is the fundamental problem: the people doing the work have no idea that what they are doing is a prime candidate for custom software."**
>
> **"Why? Because to them, it just feels like 'doing their job.' Even worse—everyone on these teams *already uses AI*. They have Claude skills, Gemini, ChatGPT Enterprise, and Granola call recorders. Look at the animation on screen right now: modern workers aren't failing to adopt AI—they are trapped acting as the 'human copy-paste glue' between disconnected AI silos and legacy tabs."**
>
> **"They don't have the time, the product management lens, or the engineering background to step back and say, *'Wait—I just did this exact 7-step loop 14 times this week; someone should build an enterprise app for this.'* And even if they did, IT backlogs mean it would never get built."**

---

## Act 2: Meet Marcus Vance & Enter Talos (`0:50 – 1:55`)
**Speaker:** You | **Screen:** Your UI (`Marcus Workflow` → `🛡️ Signal vs. Noise & Stack-Ranker`)

### Visual / Click Cues
1. Point to **Marcus Vance's profile card** and the **`Live Background Telemetry Stream (/api/observe)`** on the right.
2. Click **`🛡️ Signal vs. Noise & Stack-Ranker`** in the top navigation bar to show the 4-tier discernment matrix.

### Spoken Talk Track
> **"Take Marcus Vance here. Marcus is a VP of Deal Sourcing at a $1.8B growth equity firm. Now, Marcus is *deeply technical at his role*—he can tear apart an ARR retention bridge, interrogate SaaS gross margins, and structure a Series B term sheet in his sleep. But he is *not* a software engineer. He isn't going to wire up Outlook webhooks, write React frontends, or configure enterprise OAuth."**
>
> **"Look at what happens 15 minutes before Marcus's intro call with VeloceAI: Outlook pops a reminder. Marcus scrambles across Affinity CRM, old emails, and Google News, manually copies snippets into a Claude pre-call skill, jumps on Zoom with Granola recording, exports the raw 6,400-word transcript into Gemini to format a Deal Note, and pastes it into Outlook and Slack. Three separate AI tools—and he still wastes 42 minutes per call doing 5 manual copy-paste handoffs, 14 times a week."**
>
> **"Marcus doesn't need another chatbot. He needs *Talos*—our agentic harness powering the Heavy Rain platform."**
>
> *(Click `🛡️ Signal vs. Noise & Stack-Ranker`)*
> **"Instead of waiting for Marcus to write a software spec, Talos observes his workflow context across desktop and assistant tools, and immediately runs our Signal-vs-Noise Stack-Ranker along two axes: *Individual User Relevance* and *Org-Wide Impact*:"**
> - **"When Marcus texts his fiancée and browses Airbnb for his honeymoon? `0% work relevance`—auto-purged in local RAM on-device. Never logged, never leaves his laptop."**
> - **"Scrolling morning sports scores or X drama? `8%`—ignored as routine noise."**
> - **"Spotting an AI funding round on TechCrunch and copying it to his CRM watchlist? `78% User Relevance, 34% Org Impact`—Talos spins up a lightweight personal 1-click clipper just for Marcus."**
> - **"But Marcus's 15-minute Pre- and Post-Call Loop? `98% User Relevance` and `95% Org Impact`. Talos packages the verified workflow evidence and sends it to our coordination engine to build a governed enterprise application. Dom, show them what happens when Talos takes over."**

---

## Act 3: Inside Dom's Backend — How Talos Governs, Reuses & Builds (`1:55 – 3:10`)
**Speaker:** Dom (or You narrating Dom's screen) | **Screen:** Dom's Heavy Rain Console (`http://127.0.0.1:43170`)

### Visual / Click Cues
1. On **Heavy Rain Console (`:43170`)**, start in **`Ingest` (`Work`)**: Show the synthetic worker avatars, verbatim workflow quotes, and the 3-way routing outcomes (`Reuse existing app`, `Need evidence`, `Commission sandbox build`).
2. Click into **`Build` (`System`)**: Show the **Smoky-Blur Sandbox Build Canvas** with worker quote bubbles and the 3 verified checkpoints (`1. Schema check` → `2. UI assembly` → `3. Verification`).
3. Let the smoky veil clear (`blur 0px`) to reveal the sharp, verified application preview and manual release approval gate.
4. Briefly click **`Activity`** / Inspector Drawer to show the SHA-256 verification, role permissions, and zero-production-write safety boundary.

### Spoken Talk Track
> **"Thanks! This is the Heavy Rain operator console, where our intake service (*Relay*) and our Gemini 4 Argon orchestrator (*Talos / Cairn*) turn raw worker evidence into enterprise-grade software."**
>
> **"When workflow context arrives at our weekly cutoff, Talos doesn't just blindly generate one-off throwaway apps for every employee. That would create massive shadow-IT sprawl and security holes. Instead, Talos enforces *enterprise continuity and security* through a strict three-way triage:"**
>
> 1. **"First, Reuse Before Build: Talos checks the organization's Approved Application Catalog first. When two deal associates repeatedly prompt Claude to deduplicate 140-row Diligence Request Lists, Talos detects that an approved *Diligence Request Tracker* already exists in the firm's catalog with the exact right permissions—and routes them directly to it with zero duplicate compute."**
> 2. **"Second, Evidence & Legal Gating: When Investor Relations tries to automate LP Side-Letter MFN checks, Talos sees that raw side-letters are restricted under legal policy and halts *before* spending a single builder token—requesting an anonymized schema from General Counsel first."**
> 3. **"Third, Managed Sandbox Build: When a verified capability gap exists—like Marcus's call loop or our monthly portfolio variance close—Talos dispatches a Google-hosted Antigravity Sandbox Builder running Gemini 4 Argon."**
>
> *(Switch to `Build` view as the smoky canvas runs checkpoints)*
> **"Here in the Build chamber, you're watching the sandbox builder work behind a live state-driven smoky veil across three hard checkpoints: Schema validation, UI assembly, and automated TypeScript & boundary verification. Every app is compiled against our shared `@heavy-rain/organization-ui` baseline—meaning it automatically inherits the firm's SSO identity, role-based access matrix, audit logging, and theme continuity. Once verification passes, the smoke clears, and with one approval click, the app is live across the firm."**

---

## Act 4: How This Helps Marcus & His Entire Team (`3:10 – 4:05`)
**Speaker:** You & Dom | **Screen:** Quick toggle from Dom's **Rookmere Close (`:43173`)** back to Your UI (`2. Recommended App & Beta Loop` + `3. "Already Exists!" Org Dedup & COO View`)

### Visual / Click Cues
1. Show **Rookmere Close (`http://127.0.0.1:43173`)** on Dom's screen (trial-balance mapping, FX vs. operating EBITDA variance, and Nordic ColdChain `3.60x vs 3.75x` covenant headroom) AND/OR **DealPulse AutoBrief (`v1.2`)** on your screen (`2. Recommended App & Beta Loop`).
2. Toggle **Week 1 (`v1.0`) → Week 2 (`v1.2`)** in `2. Recommended App & Beta Loop` to show telemetry-driven evolution.
3. Click **`3. "Already Exists!" Org Dedup & COO View`** and click through **Elena Rostova (`68% match`)**, **Devon Brooks**, **Priya Nair (`62% match`)**, and **Claire Sterling (`COO View`)**.

### Spoken Talk Track
> **"So what does this actually mean for Marcus on Monday morning? Instead of a 42-minute copy-paste scramble, Marcus opens *DealPulse AutoBrief*. Twenty minutes before his VeloceAI call, his Affinity history, funding news, and 5 tailored screening questions are already waiting. The second Granola stops recording, his IC deal note and CRM fields are drafted for 1-click send—collapsing 42 minutes into 90 seconds."**
>
> **"Even better, Talos doesn't stop at v1.0. During Marcus's Week 1 beta test, Talos passively notices he clicked the Pre-Call HUD 14 out of 14 times, ignored the public comp ticker, and manually typed 'Key Deal Risks' into 11 emails. For Week 2, Talos auto-mutates `v1.2`—pruning the unused widget and promoting 'Key Deal Risks' into a first-class schema field."**
>
> *(Click `3. "Already Exists!" Org Dedup & COO View`)*
> **"And look at how Talos scales continuity across the rest of Marcus's team:"**
> - **"Elena Rostova (Principal on Customer Discovery) runs a multi-call synthesis loop that shares **68% Workflow DNA** with Marcus. Instead of building a second siloed app, Talos intercepts it, reuses Marcus's core Call Engine, and attaches Elena's *Multi-Call Thesis Matrix*—saving 28 engineering hours."**
> - **"Devon Brooks (Senior Associate in Financial Diligence) was spending 10.8 hours a week duct-taping 88-page PDF CIM tables and multi-currency ERP trial balances into Excel. Talos builds his *CIM-to-IC Bridge* and *Rookmere Close* workbench—separating SEK and NOK FX translation from operating EBITDA and automatically flagging covenant headroom."**
> - **"Priya Nair (VP of Investor Relations) shares **62% DNA** with Devon—so Talos wires her *LP Instant Desk* straight into Devon's verified KPI feed, eliminating 7 weekly Slack fire drills."**
> - **"And for Claire Sterling, our COO, she gets a single executive command center: 36.5 hours saved every week, $274,000 in annualized ROI, and 19 shadow-AI prompt loops converted into SOC2-governed applications."**

---

## Act 5: Finale — Dynamic Output (No AI Slop): The AUGI Manufacturing Example (`4:05 – 5:00`)
**Speaker:** Dom & You | **Screen:** Dom's **AUGI Sable Studio (`http://127.0.0.1:43171`)** & **Sable Balance (`http://127.0.0.1:43171/?app=balance`)**

### Visual / Click Cues
1. Switch to **Sable Studio (`http://127.0.0.1:43171`)** on Dom's screen.
2. Orbit the 3D WebGL chassis in the viewport and toggle between **`SABLE-A`** (142 parts, 384 kg), **`SABLE-B`** (Cell-to-Body + boron rings, 86 parts), and **`SABLE-C`** (HPDC megacastings, 31 parts, 338 kg, `49.8 kN·m/deg`).
3. Sweep the **Wheelbase (`2920–3160 mm`)** or **Rocker Wall Gauge (`2.2–4.5 mm`)** slider, drag the **Exploded View (`0%–100%`)** slider to separate the 5 lower-chassis subassemblies, and toggle the **Torsion / Vertical Bending** load case (`45x–60x` visual amplification).
4. Point to the **Origin Worker Quotes** card (`Lukas Lindner`, `Kenji Takahashi`, `Hannah Bergström`) and the **inline Concept Approximation Scope notice** beside the stiffness numbers.
5. Optional 5-second flash: switch to **Sable Balance (`http://127.0.0.1:43171/?app=balance`)** showing the 3D X-ray mass & center-of-gravity axle load calculator.

### Spoken Talk Track
> **"Now, here is the most important takeaway of our architecture: *what the user actually gets is dynamically determined by Talos.*"**
>
> **"Every other 'AI app builder' spits out the exact same cookie-cutter AI slop—a generic chat box or a cruddy form table. That doesn't help anyone if the domain isn't a spreadsheet problem."**
>
> **"Look at what happens when we take Heavy Rain and Talos out of an office finance firm and drop it into *AUGI*—an automotive manufacturer engineering the *AUGI Sable*, an 800-volt electric SUV."**
>
> *(Orbit the 3D chassis in `Sable Studio` and sweep the Exploded View & Gauge sliders)*
> **"At AUGI, Body-in-White architects like Lukas and dynamics engineers like Hannah were pasting closed-box torsion equations, wheelbase stretches, and aluminum-to-boron wall gauges into Claude and Gemini every week. And what did chat give them back? Flat 1D text tables that forced engineers to mentally imagine how a 20-millimeter track change affects a 3D skateboard chassis!"**
>
> **"When Talos clusters those 9 engineering workflows, it recognizes that a table is the wrong modality. So our sandbox builder compiles *Sable Studio* on `@heavy-rain/organization-3d`—a full interactive Three.js spatial engineering workbench:"**
> - **"Engineers can compare `SABLE-A`, `SABLE-B`, and `SABLE-C` megacastings side-by-side in real 3D space, watching part counts drop from 142 parts down to 31."**
> - **"They can sweep wheelbase and rocker wall gauge sliders in real time, explode the 5 lower-chassis subassemblies along axial vectors, and animate 18,000 Newton-meter axle-twist torsion and vertical bending load cases."**
> - **"And because Viktor in NVH warned in his prompt that concept beam math must never be confused with certified Nastran crash FEA, Talos automatically embeds the exact analytical units and scope limits right beside the numbers—while routing materials engineers who ask about boron-steel rivets straight to AUGI's existing *BIW Joining Registry* instead of letting chat hallucinate unsafe fasteners."**
>
> **"Whether you're an investor like Marcus scrambling before a founder call, or a chassis engineer at AUGI balancing an 800V SUV—you don't need to be a software developer, and you don't need more AI slop. You just do your work, and Heavy Rain & Talos build the exact enterprise software your team actually needs. Thank you!"**
