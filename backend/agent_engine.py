import os
import json
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv
from google import genai
from .mock_org_data import get_persona_by_id, PERSONAS

load_dotenv()

DISCERNMENT_MATRIX: List[Dict[str, Any]] = [
    {
        "scenario_id": "honeymoon_airbnb",
        "tier": 1,
        "category": "PERSONAL_PRIVATE_LIFE",
        "title": "Text from Fiancée + Browsing Airbnb for October Honeymoon",
        "observed_sequence": "iMessage from Fiancée ('Look at this Amalfi villa for our honeymoon!') -> Chrome: Airbnb.com & Delta Flights",
        "user_relevance_score": 0,
        "org_impact_score": 0,
        "downstream_artifact_detected": False,
        "agent_decision": "AUTO_PURGED_ON_DEVICE",
        "verdict_badge": "🔒 AUTO-PURGED ON DEVICE (ZERO TOOL BUILT)",
        "rationale": (
            "On-Device Privacy Shield: Local classifier detects personal relationship messaging and consumer travel browsing "
            "with zero link to Meridian Crest CRM entities or financial models. Purged in local RAM; never logged to server."
        ),
        "org_governance_routing": "Blocked at Local Privacy Gate — COO & Org never see personal browsing.",
    },
    {
        "scenario_id": "news_drama",
        "tier": 2,
        "category": "CASUAL_NON_WORK_BROWSING",
        "title": "Morning News Browsing — Celebrity/Tech Drama & Sports Scores",
        "observed_sequence": "Chrome: X Trending CEO Drama threads -> WSJ Lifestyle -> ESPN NBA Box Scores (Tab closed with zero copy/paste)",
        "user_relevance_score": 8,
        "org_impact_score": 2,
        "downstream_artifact_detected": False,
        "agent_decision": "IGNORED_AS_NOISE",
        "verdict_badge": "🔇 IGNORED AS NOISE (BELOW BUILD THRESHOLD)",
        "rationale": (
            "Passive Reading Filter: Although performed on the work browser, HeavyRain observes zero downstream work artifacts "
            "(no clipboard copy, no Affinity CRM lookup, no thesis note). Scored 8/100 and ignored to prevent low-value toy apps."
        ),
        "org_governance_routing": "Filtered out of weekly synthesis so users are never spammed with clutter.",
    },
    {
        "scenario_id": "news_deal_signal",
        "tier": 3,
        "category": "WORK_RELEVANT_INDIVIDUAL_TASK",
        "title": "Morning News — Spotting Sector Funding & Flagging Deal to CRM",
        "observed_sequence": "Chrome: TechCrunch ('DockFlow Raises $19M Series A') -> Copies company & founder -> Pastes into Affinity CRM Watchlist & #deal-flow-sourcing",
        "user_relevance_score": 78,
        "org_impact_score": 34,
        "downstream_artifact_detected": True,
        "agent_decision": "PERSONAL_MICRO_SKILL_ONLY",
        "verdict_badge": "👤 BUILD PERSONAL MICRO-SKILL ONLY (NOT PUSHED FIRM-WIDE)",
        "rationale": (
            "Downstream Intent Detected: Unlike passive news reading, the user copies a sector funding target directly into Affinity CRM. "
            "High individual relevance (78/100) for Marcus's deal sourcing, but low multi-team overlap (34/100)—so HeavyRain builds a lightweight "
            "1-click 'Flag Deal to Affinity' browser clipper for Marcus without pushing a heavy firm-wide app."
        ),
        "org_governance_routing": "Kept at Individual User Tier (Org Impact: 34/100) — Not pushed to Diligence or IR teams.",
    },
    {
        "scenario_id": "precall_org_mvp",
        "tier": 4,
        "category": "HIGH_ROI_MULTI_TEAM_WORKFLOW",
        "title": "15m Pre-Call Scramble + Granola Call -> Gemini Recap -> CRM & Thesis Matrix",
        "observed_sequence": "Outlook 15m Alert -> Affinity CRM -> Claude Pre-Call Skill -> Zoom + Granola Transcript -> Gemini Polisher -> Excel Thesis Matrix & Slack",
        "user_relevance_score": 98,
        "org_impact_score": 95,
        "downstream_artifact_detected": True,
        "agent_decision": "PROMOTED_TO_FIRM_WIDE_MVP",
        "verdict_badge": "🚀 PROMOTED TO FIRM-WIDE GOVERNED MVP (DEALPULSE + DISCOVERYOS)",
        "rationale": (
            "Dual-Mandate Winner: Scores 98/100 on User Relevance (saves 9.2 hrs/wk of frantic Human Glue copy-pasting across 3 AI silos) "
            "and 95/100 on Org-Wide Impact (68% shared workflow DNA between Marcus in Deal Sourcing and Elena in Customer Discovery)."
        ),
        "org_governance_routing": "Promoted to SOC2-Governed Firm-Wide MVP Registry by COO (Claire Sterling).",
    },
]


class HeavyRainAgentEngine:
    """
    Core Gemini 4 Argon Agent Engine for HeavyRain.
    Designed as the clean Python handoff layer where Dom's background observation,
    signal-vs-noise discernment, workflow clustering, org deduplication, and weekly MVP builder plug in.
    """

    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
        self.model_name = "gemini-4-argon"
        self.client = None
        if self.api_key and self.api_key != "your_gemini_api_key_here":
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                print(f"[HeavyRainAgentEngine] Warning initializing genai.Client: {e}")

    def _call_gemini(self, system_prompt: str, user_prompt: str) -> Optional[str]:
        if not self.client:
            return None
        try:
            interaction = self.client.interactions.create(
                model=self.model_name,
                config={"system_instruction": system_prompt},
                input=user_prompt,
            )
            return interaction.output_text
        except Exception as e:
            print(f"[HeavyRainAgentEngine] Gemini call fallback triggered: {e}")
            return None

    def discern_signal_vs_noise(
        self,
        persona_id: str = "marcus",
        scenario_id: Optional[str] = "news_deal_signal",
        observed_sequence: Optional[str] = None,
        use_live_gemini: bool = True,
    ) -> Dict[str, Any]:
        persona = get_persona_by_id(persona_id)
        matched = next((item for item in DISCERNMENT_MATRIX if item["scenario_id"] == scenario_id), None)

        if not matched and observed_sequence:
            seq_lower = observed_sequence.lower()
            if any(k in seq_lower for k in ["airbnb", "honeymoon", "fiance", "fiancée", "imessage", "flight"]):
                matched = DISCERNMENT_MATRIX[0]
            elif any(k in seq_lower for k in ["drama", "espn", "nba", "sports", "celebrity"]):
                matched = DISCERNMENT_MATRIX[1]
            elif any(k in seq_lower for k in ["techcrunch", "funding", "series a", "watchlist", "flag deal"]):
                matched = DISCERNMENT_MATRIX[2]
            else:
                matched = DISCERNMENT_MATRIX[3]

        if not matched:
            matched = DISCERNMENT_MATRIX[2]

        seq_to_analyze = observed_sequence or matched["observed_sequence"]
        live_rationale = None
        if use_live_gemini:
            sys_prompt = (
                "You are HeavyRain's On-Device Signal vs. Noise Discernment & Dual-Mandate Stack-Ranker powered by Gemini 4 Argon. "
                "Evaluate the observed desktop sequence along two axes: "
                "(1) Individual User Relevance (0-100) based on downstream work artifacts (e.g., copying into Affinity CRM, Excel, or IC memos vs. personal life or passive reading), and "
                "(2) Firm-Wide Org Impact (0-100) based on multi-team workflow overlap and ROI. "
                "In 3 crisp bullets: state the Privacy/Signal classification, explain why downstream intent matters (especially for news browsing vs. deal flagging), "
                "and give the final routing decision (Auto-Purge on Device, Ignore as Noise, Build Personal Micro-Skill Only, or Promote to Firm-Wide Governed MVP)."
            )
            user_prompt = (
                f"Persona: {persona.name} ({persona.role})\n"
                f"Observed Desktop Sequence: {seq_to_analyze}\n"
                f"Baseline Scores: User Relevance={matched['user_relevance_score']}/100, Org Impact={matched['org_impact_score']}/100, "
                f"Decision={matched['agent_decision']}"
            )
            live_rationale = self._call_gemini(sys_prompt, user_prompt)

        return {
            "persona_id": persona.id,
            "persona_name": persona.name,
            "model_used": self.model_name if live_rationale else f"{self.model_name} (Deterministic Blueprint)",
            "live_gemini_active": bool(live_rationale),
            "scenario_id": matched["scenario_id"],
            "tier": matched["tier"],
            "category": matched["category"],
            "title": matched["title"],
            "observed_sequence": seq_to_analyze,
            "user_relevance_score": matched["user_relevance_score"],
            "org_impact_score": matched["org_impact_score"],
            "downstream_artifact_detected": matched["downstream_artifact_detected"],
            "agent_decision": matched["agent_decision"],
            "verdict_badge": matched["verdict_badge"],
            "org_governance_routing": matched["org_governance_routing"],
            "live_gemini_discernment_rationale": live_rationale or matched["rationale"],
            "all_tiers_reference": DISCERNMENT_MATRIX,
            "dom_pipeline_hook": {
                "module": "backend.agent_engine.HeavyRainAgentEngine.discern_signal_vs_noise",
                "stage_id": "stage_1b_signal_vs_noise_discernment",
                "endpoint": "POST /api/discern-signal",
            },
        }

    def synthesize_weekly_workflow(
        self, persona_id: str, custom_logs: Optional[List[str]] = None, use_live_gemini: bool = True
    ) -> Dict[str, Any]:
        persona = get_persona_by_id(persona_id)
        steps_summary = "\n".join(
            [
                f"Step {s.step_number} [{s.app}]: {s.action_title} ({s.duration_mins}m) | "
                f"Uses AI already: {s.uses_ai_already} | Human Glue Friction: {s.friction_note}"
                for s in persona.fragmented_workflow
            ]
        )
        if custom_logs:
            steps_summary += "\nAdditional Live Desktop Logs:\n" + "\n".join(custom_logs)

        live_ai_insight = None
        if use_live_gemini:
            sys_prompt = (
                "You are HeavyRain's Core Workflow Synthesis Agent powered by Gemini 4 Argon. "
                "Your job is to observe a busy investment professional's fragmented desktop workflow "
                "(Notice where they ALREADY use AI tools like Claude, Gemini, or Granola in disconnected silos "
                "and act as 'human glue' copy-pasting between them). "
                "In 3 concise, punchy bullet points: (1) Diagnose the 'Human Glue' bottleneck, "
                "(2) Specify the cohesive autonomous MVP HeavyRain built for them this week, and "
                "(3) Identify which other persona at Meridian Crest Capital shares overlapping workflow DNA."
            )
            user_prompt = (
                f"Persona: {persona.name} ({persona.role})\n"
                f"Current AI Tools Used: {', '.join(persona.current_ai_tools_used)}\n"
                f"Observed Weekly Subtasks:\n{steps_summary}\n\n"
                f"Built MVP Target: {persona.mvp.name} ({persona.mvp.architecture_summary})"
            )
            live_ai_insight = self._call_gemini(sys_prompt, user_prompt)

        return {
            "persona_id": persona.id,
            "persona_name": persona.name,
            "model_used": self.model_name if live_ai_insight else f"{self.model_name} (Deterministic Blueprint)",
            "live_gemini_active": bool(live_ai_insight),
            "human_glue_steps_detected": sum(1 for s in persona.fragmented_workflow if s.is_human_glue),
            "disconnected_ai_silos_detected": sum(1 for s in persona.fragmented_workflow if s.uses_ai_already),
            "weekly_hours_recovered": persona.mvp.hours_saved_per_week,
            "built_mvp": persona.mvp.model_dump(),
            "agent_synthesis_narrative": live_ai_insight or persona.mvp.weekly_agent_pitch,
            "dom_pipeline_hook": {
                "module": "backend.agent_engine.HeavyRainAgentEngine.synthesize_weekly_workflow",
                "input_stream": "OS Window Events + Clipboard Graph + Browser/Granola Hooks",
                "output_artifact": f"workflows/{persona.id}_mvp_manifest.json",
            },
        }

    def check_org_deduplication(
        self, persona_id: str, proposed_workflow_summary: str, use_live_gemini: bool = True
    ) -> Dict[str, Any]:
        persona = get_persona_by_id(persona_id)
        org_catalog = "\n".join(
            [
                f"- {p.name} ({p.role}): MVP '{p.mvp.name}' -> {p.mvp.architecture_summary}"
                for p in PERSONAS
                if p.id != persona.id and not p.is_exec_view
            ]
        )

        live_dedup_recommendation = None
        if use_live_gemini:
            sys_prompt = (
                "You are HeavyRain's Organization De-duplication & Cross-Pollination Engine (COO Mandate). "
                "Compare the target user's workflow against existing MVPs built by other agents across the firm. "
                "Explain in 2 crisp sentences why they should NOT build from scratch, which colleague's module to fork/share, "
                "and what custom delta adapter to attach."
            )
            user_prompt = (
                f"User: {persona.name} ({persona.role})\n"
                f"Proposed Workflow: {proposed_workflow_summary or persona.scenario_title}\n"
                f"Existing Firm MVPs:\n{org_catalog}"
            )
            live_dedup_recommendation = self._call_gemini(sys_prompt, user_prompt)

        return {
            "persona_id": persona.id,
            "dedup_match": persona.dedup_match.model_dump() if persona.dedup_match else None,
            "live_gemini_dedup_rationale": live_dedup_recommendation
            or (
                persona.dedup_match.recommendation
                if persona.dedup_match
                else "Org-level control plane view across all 4 investment team MVPs."
            ),
        }

    def iterate_from_beta_telemetry(
        self, persona_id: str, mvp_id: str, user_feedback_or_telemetry: str, use_live_gemini: bool = True
    ) -> Dict[str, Any]:
        persona = get_persona_by_id(persona_id)
        live_mutation_plan = None
        if use_live_gemini:
            sys_prompt = (
                "You are HeavyRain's Weekly Beta Telemetry & Self-Evolving App Engine. "
                "Given how the beta user interacted with last week's MVP (what they clicked, ignored, or manually edited), "
                "output a concise Week 2 changelog (3 bullet points: Pruned UI, Auto-Added Feature, Updated Gemini Prompt/Integration)."
            )
            user_prompt = (
                f"User: {persona.name} ({persona.role})\n"
                f"MVP: {persona.mvp.name} ({persona.mvp.version})\n"
                f"Observed Beta Telemetry / User Behavior: {user_feedback_or_telemetry}"
            )
            live_mutation_plan = self._call_gemini(sys_prompt, user_prompt)

        return {
            "persona_id": persona.id,
            "mvp_id": mvp_id,
            "next_version": "v1.3-beta (Auto-Mutated)",
            "week1_to_week2_diff_summary": persona.mvp.week1_to_week2_diff_summary,
            "live_gemini_mutation_spec": live_mutation_plan or persona.mvp.week1_to_week2_diff_summary,
            "telemetry_breakdown": [t.model_dump() for t in persona.mvp.telemetry_items],
        }
