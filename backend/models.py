from typing import List, Optional, Dict, Any
from pydantic import BaseModel


class SubtaskNode(BaseModel):
    id: str
    step_number: int
    app: str
    icon_type: str
    action_title: str
    detail: str
    duration_mins: float
    uses_ai_already: bool = False
    is_human_glue: bool = False
    friction_note: Optional[str] = None
    raw_payload_preview: Optional[str] = None


class WorkspaceMessage(BaseModel):
    id: str
    channel: str  # "outlook" | "slack" | "calendar" | "granola" | "gemini" | "claude"
    sender: str
    subject_or_room: str
    timestamp: str
    preview: str
    urgent: bool = False
    full_body: str
    linked_step_id: Optional[str] = None


class BetaTelemetryItem(BaseModel):
    feature_name: str
    usage_rate_pct: int
    status: str  # "adopted" | "ignored" | "manual_override"
    observation_note: str
    week2_agent_action: str


class BuiltMvpSpec(BaseModel):
    mvp_id: str
    name: str
    version: str
    tagline: str
    status: str  # "beta_ready" | "iterating_v1_2" | "org_shared"
    hours_saved_per_week: float
    annual_dollar_value: int
    security_tier: str
    replaces_steps: List[str]
    architecture_summary: str
    weekly_agent_pitch: str
    week1_to_week2_diff_summary: str
    telemetry_items: List[BetaTelemetryItem]
    shared_with_persona_ids: List[str] = []
    forked_from_mvp_id: Optional[str] = None


class OrgDedupMatch(BaseModel):
    match_id: str
    source_persona_id: str
    target_persona_id: str
    target_persona_name: str
    target_persona_role: str
    existing_mvp_name: str
    overlap_score_pct: int
    shared_subtasks: List[str]
    custom_delta_needed: str
    recommendation: str
    estimated_build_hours_saved: int


class PersonaProfile(BaseModel):
    id: str
    name: str
    role: str
    team: str
    avatar_initials: str
    avatar_color: str
    is_exec_view: bool = False
    bio_and_mandate: str
    weekly_repetitive_hours: float
    hours_saved_by_heavyrain: float
    current_ai_tools_used: List[str]
    core_pain_point: str
    scenario_title: str
    scenario_trigger_banner: str
    workspace_messages: List[WorkspaceMessage]
    fragmented_workflow: List[SubtaskNode]
    mvp: BuiltMvpSpec
    dedup_match: Optional[OrgDedupMatch] = None


class ObserveEventRequest(BaseModel):
    persona_id: str
    app_name: str
    window_title: str
    action_type: str
    content_snippet: str
    used_ai_tool: bool = False


class SignalDiscernmentRequest(BaseModel):
    persona_id: str = "marcus"
    scenario_id: Optional[str] = "news_deal_signal"
    observed_sequence: Optional[str] = None
    use_live_gemini: bool = True


class SynthesizeWeeklyRequest(BaseModel):
    persona_id: str
    custom_workflow_logs: Optional[List[str]] = None
    use_live_gemini: bool = True


class OrgDedupRequest(BaseModel):
    persona_id: str
    proposed_workflow_summary: str
    use_live_gemini: bool = True


class TelemetryIterateRequest(BaseModel):
    persona_id: str
    mvp_id: str
    user_feedback_or_telemetry: str
    use_live_gemini: bool = True
