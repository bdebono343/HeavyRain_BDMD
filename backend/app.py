from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from .models import (
    ObserveEventRequest,
    SignalDiscernmentRequest,
    SynthesizeWeeklyRequest,
    OrgDedupRequest,
    TelemetryIterateRequest,
)
from .mock_org_data import ORG_METADATA, PERSONAS, get_persona_by_id
from .agent_engine import HeavyRainAgentEngine, DISCERNMENT_MATRIX

app = FastAPI(
    title="HeavyRain Workflow Agent Infrastructure API",
    description="Backend API & Gemini 4 Argon Agent Engine for HeavyRain (Dom + Frontend Integration Contract)",
    version="1.3.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = HeavyRainAgentEngine()

# Real-time shared state for Dual-Tab / Split-Screen Live Demo synchronization
LIVE_DEMO_STATE: Dict[str, Any] = {
    "active_persona_id": "marcus",
    "active_step_index": 0,
    "mvp_beta_mode_enabled": False,
    "events_stream": [
        {
            "id": "evt_init_1",
            "timestamp": "10:45:02 AM",
            "persona_id": "marcus",
            "app_name": "Outlook Calendar",
            "window_title": "Reminder: VeloceAI Founder Intro (in 15 mins)",
            "action_type": "TRIGGER_DETECTED",
            "content_snippet": "External founder call detected in 15m; scanning prior CRM & email context...",
            "used_ai_tool": False,
        }
    ],
}


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "HeavyRain Agent Backend",
        "version": "1.3.0",
        "model": engine.model_name,
        "gemini_key_configured": bool(engine.client),
    }


@app.get("/api/org")
def get_org_overview():
    return {
        "org": ORG_METADATA,
        "personas": [p.model_dump() for p in PERSONAS],
        "discernment_examples": DISCERNMENT_MATRIX,
        "live_state": LIVE_DEMO_STATE,
    }


@app.get("/api/discernment-matrix")
def get_discernment_matrix():
    """
    Returns the 4-tier Signal vs. Noise & Dual-Mandate Stack-Ranking decision matrix
    (Personal Privacy Shield, Passive News Noise, Individual Deal-Flagging Micro-Skill, and Firm-Wide Governed MVP).
    """
    return {
        "tiers": DISCERNMENT_MATRIX,
        "scoring_axes": {
            "axis_1": "user_relevance_score (0-100): Downstream work artifact handoffs, repetition, and weekly time saved",
            "axis_2": "org_impact_score (0-100): Cross-team workflow DNA overlap, AUM velocity, and SOC2 governance value",
        },
    }


@app.get("/api/personas/{persona_id}")
def get_persona_detail(persona_id: str):
    persona = get_persona_by_id(persona_id)
    return persona.model_dump()


@app.get("/api/live-state")
def get_live_state():
    return LIVE_DEMO_STATE


@app.post("/api/live-state/sync")
def update_live_state(payload: Dict[str, Any]):
    if "active_persona_id" in payload:
        LIVE_DEMO_STATE["active_persona_id"] = payload["active_persona_id"]
    if "active_step_index" in payload:
        LIVE_DEMO_STATE["active_step_index"] = payload["active_step_index"]
    if "mvp_beta_mode_enabled" in payload:
        LIVE_DEMO_STATE["mvp_beta_mode_enabled"] = payload["mvp_beta_mode_enabled"]
    return LIVE_DEMO_STATE


@app.post("/api/observe")
def ingest_observation_event(req: ObserveEventRequest):
    """
    Dom's Endpoint #1: Ingests background OS/Window/Clipboard/AI-tool telemetry events
    as the user works across Outlook, Granola, Claude, Gemini, Excel, or Slack.
    """
    event_entry = {
        "id": f"evt_{len(LIVE_DEMO_STATE['events_stream']) + 1}_{int(datetime.now().timestamp())}",
        "timestamp": datetime.now().strftime("%I:%M:%S %p"),
        "persona_id": req.persona_id,
        "app_name": req.app_name,
        "window_title": req.window_title,
        "action_type": req.action_type,
        "content_snippet": req.content_snippet,
        "used_ai_tool": req.used_ai_tool,
    }
    LIVE_DEMO_STATE["active_persona_id"] = req.persona_id
    LIVE_DEMO_STATE["events_stream"].insert(0, event_entry)
    LIVE_DEMO_STATE["events_stream"] = LIVE_DEMO_STATE["events_stream"][:30]
    return {
        "status": "captured",
        "event": event_entry,
        "total_buffered_events": len(LIVE_DEMO_STATE["events_stream"]),
    }


@app.post("/api/discern-signal")
def discern_signal_vs_noise(req: SignalDiscernmentRequest):
    """
    Dom's Endpoint #1B: On-Device Privacy Filter, Signal vs. Noise Classifier & Dual-Mandate Stack-Ranker.
    Evaluates an observed desktop sequence on User Relevance (0-100) and Org-Wide Impact (0-100)
    to decide whether to Auto-Purge on Device, Ignore as Noise, Build a Personal Micro-Skill, or Promote to a Firm-Wide MVP.
    """
    return engine.discern_signal_vs_noise(
        persona_id=req.persona_id,
        scenario_id=req.scenario_id,
        observed_sequence=req.observed_sequence,
        use_live_gemini=req.use_live_gemini,
    )


@app.post("/api/synthesize-weekly")
def synthesize_weekly(req: SynthesizeWeeklyRequest):
    """
    Dom's Endpoint #2: Clusters a week of fragmented desktop subtasks (including disconnected AI usage)
    and synthesizes the cohesive MVP specification using Gemini 4 Argon.
    """
    return engine.synthesize_weekly_workflow(
        persona_id=req.persona_id,
        custom_logs=req.custom_workflow_logs,
        use_live_gemini=req.use_live_gemini,
    )


@app.post("/api/org-dedup")
def check_org_dedup(req: OrgDedupRequest):
    """
    Dom's Endpoint #3: Compares a persona's workflow graph against the firm's existing MVP registry
    to recommend cross-team collaboration and prevent duplicate app builds.
    """
    return engine.check_org_deduplication(
        persona_id=req.persona_id,
        proposed_workflow_summary=req.proposed_workflow_summary,
        use_live_gemini=req.use_live_gemini,
    )


@app.post("/api/telemetry-iterate")
def iterate_mvp_from_telemetry(req: TelemetryIterateRequest):
    """
    Dom's Endpoint #4: Takes Week 1 beta usage telemetry (adopted features, ignored UI, manual overrides)
    and auto-mutates the MVP for Week 2.
    """
    return engine.iterate_from_beta_telemetry(
        persona_id=req.persona_id,
        mvp_id=req.mvp_id,
        user_feedback_or_telemetry=req.user_feedback_or_telemetry,
        use_live_gemini=req.use_live_gemini,
    )


# Mount built frontend/dist so http://127.0.0.1:8000 also serves as a unified live preview!
FRONTEND_DIST = Path(__file__).resolve().parent.parent / "frontend" / "dist"
if FRONTEND_DIST.exists():
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIST / "assets")), name="assets")

    @app.get("/")
    def serve_spa_root():
        return FileResponse(str(FRONTEND_DIST / "index.html"))
