import os
import json
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv
from google import genai
from .mock_org_data import get_persona_by_id, PERSONAS

load_dotenv()


class HeavyRainAgentEngine:
    """
    Core Gemini 4 Argon Agent Engine for HeavyRain.
    Designed as the clean Python handoff layer where Dom's background observation,
    workflow clustering, org deduplication, and weekly MVP builder plug in.
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
