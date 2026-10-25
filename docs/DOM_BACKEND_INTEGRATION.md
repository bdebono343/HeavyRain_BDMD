# HeavyRain — Dom's Backend & Agent Pipeline Integration Guide

## Overview
HeavyRain observes how investors work across their desktop each week (including where they **already use AI tools like Claude, Gemini, or Granola in disconnected silos**, acting as "human copy-paste glue"), autonomously builds a cohesive custom MVP for them to beta test the following week, and deduplicates overlapping workflows across the firm for the COO/Executive team.

## Folder Structure
```text
HeavyRain/
├── backend/                  # FastAPI + Gemini 4 Argon Agent Engine (Dom's Core Domain)
│   ├── app.py                # FastAPI server & REST endpoints (/api/observe, /api/synthesize-weekly, etc.)
│   ├── agent_engine.py       # HeavyRainAgentEngine using google-genai (gemini-4-argon)
│   ├── models.py             # Pydantic contracts shared between Frontend & Backend
│   ├── mock_org_data.py      # 5 Investor Personas @ Meridian Crest Capital + Telemetry
│   └── requirements.txt      # Python dependencies
├── frontend/                 # Interactive Demo & Multi-Persona Workspace Takeover UI (React + Vite + Tailwind)
├── workflows/                # Shared workflow graph schemas & org deduplication manifests
├── docs/                     # Architecture & 1:00 PM walkthrough notes
├── main.py                   # Original minimal Gemini 4 Argon test script
└── chat.py                   # Original interactive CLI agent script
```

## Core API Contract for Dom's Agent Pipeline
1. `POST /api/observe` — Ingests desktop window switches, Outlook reminders, Granola recordings, and clipboard handoffs between AI chat tabs.
2. `POST /api/synthesize-weekly` — Runs `HeavyRainAgentEngine.synthesize_weekly_workflow()` (powered by `gemini-4-argon`) to diagnose "Human Glue" bottlenecks and output an autonomous weekly MVP spec.
3. `POST /api/org-dedup` — Compares a user's workflow graph against all other agents in the firm (e.g., matching Marcus's Deal Call loop with Elena's Customer Discovery loop at 68% overlap).
4. `POST /api/telemetry-iterate` — Takes Week 1 beta usage telemetry (adopted widgets, ignored tabs, manual overrides) and mutates the app to `v1.2` for Week 2.
