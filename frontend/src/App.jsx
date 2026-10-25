import React, { useState, useEffect, useRef } from 'react';
import {
  CloudRain,
  Users,
  Play,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  GitMerge,
  ShieldCheck,
  Terminal,
  Mail,
  MessageSquare,
  Calendar,
  Mic,
  Cpu,
  Table,
  ExternalLink,
  Layers,
  Activity,
  RefreshCw,
  Zap,
  Eye,
  TrendingUp,
  Copy,
  Check,
  ChevronRight,
  Code2,
  Database,
  Globe,
  FileText,
  Scissors,
  Send,
  Target,
  BarChart3,
  SplitSquareVertical,
  Maximize2,
  Clipboard,
  Bell,
  EyeOff,
  X,
} from 'lucide-react';

const API_BASE = '/api';

export default function App() {
  const [orgData, setOrgData] = useState(null);
  const [personas, setPersonas] = useState([]);
  const [activePersonaId, setActivePersonaId] = useState('marcus');
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [mvpBetaMode, setMvpBetaMode] = useState(false);
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'workspace' | 'agent' | 'exec' | 'dom'
  const [agentRightTab, setAgentRightTab] = useState('observer'); // 'observer' | 'mvp_preview' | 'beta_loop' | 'dedup'
  const [liveEvents, setLiveEvents] = useState([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Ambient Desktop Interaction Layer State (Monday Morning Beta Drop + Dedup Compare Modal)
  const [showMondayDropModal, setShowMondayDropModal] = useState(false);
  const [showDedupModal, setShowDedupModal] = useState(false);
  const [clipboardBuffer, setClipboardBuffer] = useState(
    'Affinity CRM: Last met Liam Chen (VeloceAI) 4 mos ago; $4.1M Seed...'
  );
  const [copiedFlash, setCopiedFlash] = useState(false);

  // Live Gemini 4 Argon Backend Playground state (for Dom's 1 PM walkthrough)
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [geminiResult, setGeminiResult] = useState(null);
  const [liveBuildDispatchStatus, setLiveBuildDispatchStatus] = useState(null);
  const [customTelemetryInput, setCustomTelemetryInput] = useState(
    'User clicked Pre-Call HUD 14/14 times, ignored Public Comp Ticker (0 clicks), and manually typed "Key Deal Risks" into 11 post-call emails.'
  );
  const [backendHealth, setBackendHealth] = useState({ status: 'checking', model: 'gemini-4-argon' });

  const channelRef = useRef(null);

  // Initialize URL params for Dual-Chrome-Tab mode (?tab=workspace or ?tab=agent)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    const personaParam = params.get('persona');
    if (tabParam && ['split', 'workspace', 'agent', 'exec', 'dom', 'discernment'].includes(tabParam)) {
      setViewMode(tabParam);
    }
    if (personaParam) {
      setActivePersonaId(personaParam);
    }
  }, []);

  // Setup BroadcastChannel so Two Side-by-Side Chrome Tabs stay 100% synced in real time!
  useEffect(() => {
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel('heavyrain_demo_sync');
      bc.onmessage = (ev) => {
        const data = ev.data;
        if (!data) return;
        if (data.type === 'STATE_SYNC') {
          if (data.personaId) setActivePersonaId(data.personaId);
          if (typeof data.stepIndex === 'number') setActiveStepIndex(data.stepIndex);
          if (typeof data.mvpBetaMode === 'boolean') setMvpBetaMode(data.mvpBetaMode);
          if (data.agentRightTab) setAgentRightTab(data.agentRightTab);
        } else if (data.type === 'NEW_EVENT' && data.event) {
          setLiveEvents((prev) => [data.event, ...prev.filter((e) => e.id !== data.event.id)].slice(0, 25));
        }
      };
      channelRef.current = bc;
      return () => bc.close();
    }
  }, []);

  const broadcastSync = (patch) => {
    if (channelRef.current) {
      channelRef.current.postMessage({ type: 'STATE_SYNC', ...patch });
    }
    fetch(`${API_BASE}/live-state/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        active_persona_id: patch.personaId ?? activePersonaId,
        active_step_index: patch.stepIndex ?? activeStepIndex,
        mvp_beta_mode_enabled: patch.mvpBetaMode ?? mvpBetaMode,
      }),
    }).catch(() => {});
  };

  // Load initial Org & 5 Personas from FastAPI Backend
  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then((r) => r.json())
      .then((d) => setBackendHealth(d))
      .catch(() => setBackendHealth({ status: 'offline_fallback', model: 'gemini-4-argon' }));

    fetch(`${API_BASE}/org`)
      .then((r) => r.json())
      .then((data) => {
        setOrgData(data.org);
        setPersonas(data.personas || []);
        if (data.live_state?.events_stream) {
          setLiveEvents(data.live_state.events_stream);
        }
      })
      .catch((err) => console.error('Failed to load /api/org:', err));
  }, []);

  const activePersona = personas.find((p) => p.id === activePersonaId) || personas[0];

  useEffect(() => {
    if (activePersona && activePersona.workspace_messages?.length > 0) {
      setSelectedMessageId(activePersona.workspace_messages[0].id);
      const firstStep = activePersona.fragmented_workflow?.[0];
      if (firstStep) {
        setClipboardBuffer(firstStep.raw_payload_preview || firstStep.detail);
      }
    }
  }, [activePersonaId, personas]);

  // Auto-play simulation runner for live demos
  useEffect(() => {
    if (!isAutoPlaying || !activePersona) return;
    const steps = activePersona.fragmented_workflow || [];
    const timer = setInterval(() => {
      setActiveStepIndex((prev) => {
        const next = (prev + 1) % steps.length;
        const stepObj = steps[next];
        if (stepObj) {
          emitObservationEvent(activePersona.id, stepObj, next);
          setClipboardBuffer(stepObj.raw_payload_preview || stepObj.detail);
        }
        return next;
      });
    }, 2600);
    return () => clearInterval(timer);
  }, [isAutoPlaying, activePersona]);

  const emitObservationEvent = async (personaId, stepObj, stepIdx, customOverride = null) => {
    const payload = customOverride || {
      persona_id: personaId,
      app_name: stepObj.app,
      window_title: stepObj.action_title,
      action_type: stepObj.uses_ai_already
        ? 'DISCONNECTED_AI_SILO'
        : stepObj.is_human_glue
        ? 'HUMAN_GLUE_HANDOFF'
        : 'WORKFLOW_STEP',
      content_snippet: stepObj.raw_payload_preview || stepObj.detail,
      used_ai_tool: Boolean(stepObj.uses_ai_already),
    };
    try {
      const res = await fetch(`${API_BASE}/observe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.event) {
        setLiveEvents((prev) => [data.event, ...prev].slice(0, 25));
        if (channelRef.current) {
          channelRef.current.postMessage({ type: 'NEW_EVENT', event: data.event });
        }
      }
    } catch (e) {
      const fallbackEvt = {
        id: `evt_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        ...payload,
      };
      setLiveEvents((prev) => [fallbackEvt, ...prev].slice(0, 25));
    }
    if (typeof stepIdx === 'number') {
      broadcastSync({ personaId, stepIndex: stepIdx });
    }
  };

  const handleSelectPersona = (pid) => {
    setIsAutoPlaying(false);
    setActivePersonaId(pid);
    setActiveStepIndex(0);
    setMvpBetaMode(false);
    setShowMondayDropModal(false);
    setShowDedupModal(false);
    if (pid === 'claire' && viewMode !== 'dom') {
      setViewMode('exec');
    } else if (viewMode === 'exec' && pid !== 'claire') {
      setViewMode('split');
    }
    broadcastSync({ personaId: pid, stepIndex: 0, mvpBetaMode: false });
  };

  const handleStepClick = (step, idx) => {
    setIsAutoPlaying(false);
    setActiveStepIndex(idx);
    setClipboardBuffer(step.raw_payload_preview || step.detail);
    setCopiedFlash(true);
    setTimeout(() => setCopiedFlash(false), 700);
    emitObservationEvent(activePersona.id, step, idx);
    const linkedMsg = activePersona.workspace_messages?.find((m) => m.linked_step_id === step.id);
    if (linkedMsg) {
      setSelectedMessageId(linkedMsg.id);
    }
  };

  const handleToggleBetaMvp = (val) => {
    setMvpBetaMode(val);
    setShowMondayDropModal(false);
    if (val) {
      setAgentRightTab('mvp_preview');
    }
    broadcastSync({ mvpBetaMode: val, agentRightTab: val ? 'mvp_preview' : 'observer' });
  };

  const openSecondChromeTab = () => {
    const url = `${window.location.origin}${window.location.pathname}?tab=agent&persona=${activePersonaId}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Dispatch active persona's workflow directly to Dom's Live Antigravity Builder (:43180 -> :43170)
  const dispatchToDomLiveBuilder = async () => {
    if (!activePersona || !activePersona.mvp) return;
    setLiveBuildDispatchStatus('sending');
    const payload = {
      orgId: 'meridian',
      orgName: orgData?.org_name || 'Meridian Crest Capital',
      persona: {
        id: activePersona.id,
        name: activePersona.name,
        role: activePersona.role,
        department: activePersona.department || 'Investment Team',
        scenarioTitle: activePersona.scenario_title,
        scenarioTriggerBanner: activePersona.scenario_trigger_banner,
        weeklyHoursSaved: Number(activePersona.weekly_hours_saved || 9.2),
        annualizedRoi: '$69,000',
        currentAiToolsUsed: activePersona.current_ai_tools_used || [],
      },
      fragmentedWorkflow: (activePersona.fragmented_workflow || []).map((s) => ({
        id: s.id,
        stepNumber: s.step_number,
        app: s.app,
        windowTitle: s.action_title,
        durationMins: s.duration_mins,
        usesAiAlready: Boolean(s.uses_ai_already),
        isHumanGlue: Boolean(s.is_human_glue),
        detail: s.detail,
        rawPayloadPreview: s.raw_payload_preview || s.detail,
      })),
      mvp: {
        mvpId: activePersona.mvp.mvp_id,
        name: activePersona.mvp.name,
        tagline: activePersona.mvp.tagline,
        version: activePersona.mvp.version || 'v1.0-beta',
        triggerRule: activePersona.mvp.trigger_rule || '',
        beforeTimeMins: Number(activePersona.mvp.before_time_mins || 42),
        afterTimeSeconds: Number(activePersona.mvp.after_time_seconds || 90),
        whyThisMatters: activePersona.mvp.why_this_matters || '',
        features: (activePersona.mvp.features || []).map((f) => ({
          id: f.id,
          title: f.title,
          status: f.status || 'active',
          description: f.description || '',
        })),
        securityGovernance: activePersona.mvp.security_governance || [],
      },
    };

    try {
      const res = await fetch('http://127.0.0.1:43180/api/v1/orgs/meridian/builds/live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setLiveBuildDispatchStatus('sent');
      setTimeout(() => setLiveBuildDispatchStatus(null), 5000);
    } catch (err) {
      console.warn('Direct POST to Dom Relay (:43180) failed:', err);
      setLiveBuildDispatchStatus('error');
      setTimeout(() => setLiveBuildDispatchStatus(null), 4000);
    }
  };

  // Trigger Dom's Backend Endpoints (Gemini 4 Argon)
  const triggerBackendEndpoint = async (endpointType, customTelemetryOverride = null) => {
    if (!activePersona) return;
    setGeminiLoading(true);
    setGeminiResult(null);
    try {
      let url = `${API_BASE}/synthesize-weekly`;
      let body = { persona_id: activePersona.id, use_live_gemini: true };
      if (endpointType === 'discern') {
        url = `${API_BASE}/discern-signal`;
        body = {
          persona_id: activePersona.id,
          scenario_id: customTelemetryOverride || 'news_deal_signal',
          observed_sequence: customTelemetryInput,
          use_live_gemini: true,
        };
      } else if (endpointType === 'dedup') {
        url = `${API_BASE}/org-dedup`;
        body = {
          persona_id: activePersona.id,
          proposed_workflow_summary: activePersona.scenario_title,
          use_live_gemini: true,
        };
      } else if (endpointType === 'telemetry') {
        url = `${API_BASE}/telemetry-iterate`;
        body = {
          persona_id: activePersona.id,
          mvp_id: activePersona.mvp?.mvp_id || 'mvp_01',
          user_feedback_or_telemetry: customTelemetryOverride || customTelemetryInput,
          use_live_gemini: true,
        };
      }
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setGeminiResult({ endpoint: url, timestamp: new Date().toLocaleTimeString(), data });
      return data;
    } catch (err) {
      setGeminiResult({ endpoint: endpointType, error: String(err) });
      return null;
    } finally {
      setGeminiLoading(false);
    }
  };

  if (!activePersona) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
        <div className="flex items-center gap-3 text-sky-400">
          <CloudRain className="w-7 h-7 animate-bounce" />
          <span className="text-lg font-medium">Initializing HeavyRain Agent Infrastructure...</span>
        </div>
      </div>
    );
  }

  const currentStep = activePersona.fragmented_workflow[activeStepIndex] || activePersona.fragmented_workflow[0];
  const selectedMessage =
    activePersona.workspace_messages.find((m) => m.id === selectedMessageId) ||
    activePersona.workspace_messages[0];

  const totalFragMinutes = activePersona.fragmented_workflow.reduce((acc, s) => acc + s.duration_mins, 0);
  const aiSiloCount = activePersona.fragmented_workflow.filter((s) => s.uses_ai_already).length;
  const humanGlueCount = activePersona.fragmented_workflow.filter((s) => s.is_human_glue).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* TOP COMMAND HEADER */}
      <header className="border-b border-slate-800/90 bg-slate-950/95 backdrop-blur sticky top-0 z-40 px-4 py-2.5">
        <div className="max-w-[1800px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <CloudRain className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">HEAVYRAIN</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30">
                  Ambient Agentic Infrastructure
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {backendHealth.model || 'gemini-4-argon'} Live
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {orgData?.org_name || 'Meridian Crest Capital'} • Passive OS Observation → Monday Beta Micro-App → Telemetry Self-Mutation & Org Dedup
              </p>
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                viewMode === 'split'
                  ? 'bg-sky-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              Split Demo (Desktop + Agent)
            </button>
            <button
              onClick={() => setViewMode('workspace')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                viewMode === 'workspace'
                  ? 'bg-sky-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              Persona Desktop Only
            </button>
            <button
              onClick={() => setViewMode('agent')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                viewMode === 'agent'
                  ? 'bg-sky-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              HeavyRain Brain Only
            </button>
            <button
              onClick={() => setViewMode('exec')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                viewMode === 'exec'
                  ? 'bg-rose-500 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              COO / Exec Org View
            </button>
            <button
              onClick={() => setViewMode('discernment')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                viewMode === 'discernment'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-amber-300 hover:text-white hover:bg-slate-800 border border-amber-500/30'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Signal vs. Noise & Stack-Ranker
            </button>
            <button
              onClick={() => setViewMode('dom')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                viewMode === 'dom'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-emerald-300 hover:text-white hover:bg-slate-800 border border-emerald-500/20'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Dom's Backend Contract
            </button>
          </div>

          {/* Live Handoff to Dom's Console (:43170 / :43180) + Dual Chrome Tab Launcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={dispatchToDomLiveBuilder}
              title="POSTs Marcus Vance's LiveBuildRequest to Dom's Relay (http://127.0.0.1:43180/api/v1/orgs/meridian/builds/live) so Dom's :43170 console wakes up from 'Waiting for work' automatically!"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                liveBuildDispatchStatus === 'sent'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                  : liveBuildDispatchStatus === 'error'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/40'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              {liveBuildDispatchStatus === 'sending'
                ? 'Sending to Dom (:43180)...'
                : liveBuildDispatchStatus === 'sent'
                ? '✓ Sent to Dom’s Live Builder (:43170)!'
                : liveBuildDispatchStatus === 'error'
                ? 'Relay :43180 Offline (Use ⋯ → Start on :43170)'
                : 'Send to Dom’s Live Builder (:43170)'}
            </button>
            <button
              onClick={openSecondChromeTab}
              title="Opens HeavyRain Agent Brain in a 2nd Chrome Tab synced live with this Persona Desktop!"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Pop Out 2nd Synced Tab
            </button>
          </div>
        </div>

        {/* 5 PERSONAS BAR ("TAKE OVER WORKSPACE") */}
        <div className="max-w-[1800px] mx-auto mt-2.5 pt-2.5 border-t border-slate-800/70 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1 shrink-0 mr-1">
            <Users className="w-3.5 h-3.5 text-sky-400" />
            Take Over Persona Workspace (5):
          </span>
          {personas.map((p) => {
            const isSelected = p.id === activePersona.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPersona(p.id)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-left transition shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/95 border-sky-400/70 ring-1 ring-sky-400/40 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg bg-gradient-to-br ${p.avatar_color} flex items-center justify-center text-xs font-bold text-white shrink-0`}
                >
                  {p.avatar_initials}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-white">{p.name}</span>
                    {p.dedup_match && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                        {p.dedup_match.overlap_score_pct}% Shared DNA
                      </span>
                    )}
                    {p.is_exec_view && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        COO Mandate
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[190px]">{p.role}</div>
                </div>
              </button>
            );
          })}
        </div>
      </header>

      {/* SCENARIO CONTEXT BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900 border-b border-slate-800 px-4 py-2">
        <div className="max-w-[1800px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 text-[11px] font-bold uppercase rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
              <Zap className="w-3 h-3" /> Live Scenario
            </span>
            <span className="text-xs sm:text-sm font-medium text-slate-200">
              {activePersona.scenario_trigger_banner}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-slate-400">Current Disconnected AI:</span>
              {activePersona.current_ai_tools_used.map((tool, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-sky-300 text-[11px]"
                >
                  {tool}
                </span>
              ))}
            </div>
            <div className="h-4 w-[1px] bg-slate-800 hidden md:block" />
            <div className="text-emerald-400 font-semibold">
              Saves {activePersona.hours_saved_by_heavyrain} hrs/wk (${activePersona.mvp.annual_dollar_value.toLocaleString()}/yr)
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-[1800px] w-full mx-auto p-4">
        {viewMode === 'discernment' ? (
          <SignalVsNoiseDiscernmentCenter
            activePersona={activePersona}
            onOpenExecView={() => setViewMode('exec')}
            onOpenWorkspaceView={() => setViewMode('split')}
          />
        ) : viewMode === 'exec' ? (
          <ExecCommandCenter
            orgData={orgData}
            personas={personas}
            onSelectPersona={(pid) => {
              setActivePersonaId(pid);
              setViewMode('split');
            }}
          />
        ) : viewMode === 'dom' ? (
          <DomBackendInspector
            activePersona={activePersona}
            personas={personas}
            onSelectPersona={setActivePersonaId}
            geminiLoading={geminiLoading}
            geminiResult={geminiResult}
            onTriggerEndpoint={triggerBackendEndpoint}
            customTelemetryInput={customTelemetryInput}
            setCustomTelemetryInput={setCustomTelemetryInput}
            liveEvents={liveEvents}
          />
        ) : (
          <div
            className={`grid gap-4 ${
              viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'
            }`}
          >
            {/* LEFT PANE: SIMULATED PERSONA DESKTOP WORKSPACE + AMBIENT AGENT INTERACTION LAYER */}
            {(viewMode === 'split' || viewMode === 'workspace') && (
              <div className={viewMode === 'split' ? 'lg:col-span-7 flex flex-col gap-4' : 'flex flex-col gap-4'}>
                <PersonaWorkspacePane
                  persona={activePersona}
                  currentStep={currentStep}
                  activeStepIndex={activeStepIndex}
                  onStepClick={handleStepClick}
                  selectedMessage={selectedMessage}
                  onSelectMessage={setSelectedMessageId}
                  mvpBetaMode={mvpBetaMode}
                  onToggleBetaMvp={handleToggleBetaMvp}
                  isAutoPlaying={isAutoPlaying}
                  onToggleAutoPlay={() => setIsAutoPlaying((v) => !v)}
                  totalFragMinutes={totalFragMinutes}
                  aiSiloCount={aiSiloCount}
                  humanGlueCount={humanGlueCount}
                  clipboardBuffer={clipboardBuffer}
                  copiedFlash={copiedFlash}
                  showMondayDropModal={showMondayDropModal}
                  setShowMondayDropModal={setShowMondayDropModal}
                  showDedupModal={showDedupModal}
                  setShowDedupModal={setShowDedupModal}
                  onSwitchPersona={handleSelectPersona}
                  onEmitCustomTelemetry={(evtPayload) =>
                    emitObservationEvent(activePersona.id, currentStep, activeStepIndex, evtPayload)
                  }
                  onTriggerLiveMutation={(telemetryNote) => {
                    setCustomTelemetryInput(telemetryNote);
                    return triggerBackendEndpoint('telemetry', telemetryNote);
                  }}
                />
              </div>
            )}

            {/* RIGHT PANE: HEAVYRAIN AGENT BRAIN, MVP BUILDER & TELEMETRY */}
            {(viewMode === 'split' || viewMode === 'agent') && (
              <div className={viewMode === 'split' ? 'lg:col-span-5 flex flex-col gap-4' : 'flex flex-col gap-4'}>
                <HeavyRainBrainPane
                  persona={activePersona}
                  currentStep={currentStep}
                  activeStepIndex={activeStepIndex}
                  agentRightTab={agentRightTab}
                  setAgentRightTab={setAgentRightTab}
                  mvpBetaMode={mvpBetaMode}
                  onToggleBetaMvp={handleToggleBetaMvp}
                  liveEvents={liveEvents}
                  onSwitchPersona={handleSelectPersona}
                  onOpenDomTab={() => setViewMode('dom')}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

/* ============================================================================
   LEFT PANE: SIMULATED INVESTOR DESKTOP WORKSPACE + AMBIENT INTERACTION LAYER
   ============================================================================ */
function PersonaWorkspacePane({
  persona,
  currentStep,
  activeStepIndex,
  onStepClick,
  selectedMessage,
  onSelectMessage,
  mvpBetaMode,
  onToggleBetaMvp,
  isAutoPlaying,
  onToggleAutoPlay,
  totalFragMinutes,
  aiSiloCount,
  humanGlueCount,
  clipboardBuffer,
  copiedFlash,
  showMondayDropModal,
  setShowMondayDropModal,
  showDedupModal,
  setShowDedupModal,
  onSwitchPersona,
  onEmitCustomTelemetry,
  onTriggerLiveMutation,
}) {
  const nextStepIndex = (activeStepIndex + 1) % persona.fragmented_workflow.length;
  const nextStep = persona.fragmented_workflow[nextStepIndex];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col relative">
      {/* Simulated macOS / Windows Desktop Titlebar */}
      <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-semibold text-slate-200 ml-1">
            {persona.name}'s Desktop OS — {persona.role}
          </span>
        </div>

        {/* Toggle between "Week 1: Fragmented Reality" vs "Monday Drop" vs "Week 2: HeavyRain Beta MVP Active" */}
        <div className="flex items-center gap-2 flex-wrap">
          {!mvpBetaMode && (
            <button
              onClick={onToggleAutoPlay}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
                isAutoPlaying
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Play className="w-3 h-3" />
              {isAutoPlaying ? 'Pause Live Sim' : 'Auto-Simulate Workflow'}
            </button>
          )}

          {/* AMBIENT HEAVYRAIN OS FLOATING PILL (How the investor actually interacts with HeavyRain!) */}
          <button
            onClick={() => setShowMondayDropModal((v) => !v)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/40 shadow-sm cursor-pointer transition"
            title="Preview how HeavyRain's ambient desktop pill pitches the weekly built MVP on Monday morning"
          >
            <Bell className="w-3.5 h-3.5 text-sky-400 animate-bounce" />
            Monday 8AM Agent Drop
          </button>

          <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => onToggleBetaMvp(false)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                !mvpBetaMode ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              Week 1: Fragmented Duct-Tape
            </button>
            <button
              onClick={() => onToggleBetaMvp(true)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition flex items-center gap-1 cursor-pointer ${
                mvpBetaMode
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow'
                  : 'text-emerald-400 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              Week 2: Live Beta Micro-App
            </button>
          </div>
        </div>
      </div>

      {/* INLINE CROSS-ORG WORKFLOW DNA MATCH NUDGE (For Elena <-> Marcus & Priya <-> Devon) */}
      {persona.dedup_match && (
        <div className="bg-gradient-to-r from-violet-950/90 via-indigo-950/80 to-slate-900 px-4 py-2 border-b border-violet-500/30 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded-md bg-violet-500/25 text-violet-200 border border-violet-400/40 font-bold flex items-center gap-1">
              <GitMerge className="w-3.5 h-3.5" />
              {persona.dedup_match.overlap_score_pct}% Org Workflow DNA Match
            </span>
            <span className="text-slate-200">
              HeavyRain detected <strong>{persona.dedup_match.target_persona_name}</strong> already runs{' '}
              <span className="text-violet-300 font-semibold">{persona.dedup_match.existing_mvp_name}</span>.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDedupModal(true)}
              className="px-2.5 py-1 rounded-lg bg-violet-500/25 hover:bg-violet-500/40 text-violet-200 border border-violet-400/40 text-[11px] font-semibold cursor-pointer transition"
            >
              Compare Shared Core vs. Custom Delta ({persona.dedup_match.estimated_build_hours_saved}h Saved) →
            </button>
          </div>
        </div>
      )}

      {/* MONDAY MORNING 8:00 AM AMBIENT AGENT DROP OVERLAY (THE NON-DASHBOARD INTERACTION LAYER) */}
      {showMondayDropModal && (
        <div className="p-4 bg-slate-950/95 border-b border-sky-500/40 shadow-2xl space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center text-slate-950 font-bold shadow">
                <CloudRain className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                    HeavyRain Ambient OS Notification • Monday 8:00 AM
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                    {persona.mvp.name} ({persona.mvp.version}) Built for You
                  </span>
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  "Hey {persona.name.split(' ')[0]} — I watched you act as Human Glue across {aiSiloCount} AI tools last week. Want to beta-test the unified app this week?"
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowMondayDropModal(false)}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/90 p-3 rounded-xl border border-slate-800 italic">
            "{persona.mvp.weekly_agent_pitch}"
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] uppercase text-slate-400 font-semibold">Observed Friction</div>
              <div className="font-bold text-rose-300 mt-0.5">
                {totalFragMinutes} mins/run • {humanGlueCount} manual copy-pastes
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] uppercase text-slate-400 font-semibold">Built Pipeline</div>
              <div className="font-mono text-[11px] text-sky-300 truncate mt-0.5">
                {persona.mvp.architecture_summary}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] uppercase text-slate-400 font-semibold">Security & Org Reuse</div>
              <div className="font-bold text-emerald-300 mt-0.5">{persona.mvp.security_tier}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
            <button
              onClick={() => setShowMondayDropModal(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 cursor-pointer"
            >
              Snooze Until Next Call
            </button>
            <button
              onClick={() => onToggleBetaMvp(true)}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Accept & Launch Week 2 Beta Micro-App Now →
            </button>
          </div>
        </div>
      )}

      {/* INLINE CROSS-ORG DEDUP COMPARISON MODAL */}
      {showDedupModal && persona.dedup_match && (
        <div className="p-4 bg-slate-950/95 border-b border-violet-500/40 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitMerge className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-bold uppercase text-violet-300">
                Cross-Org Architecture Deduplication: {persona.name} ↔ {persona.dedup_match.target_persona_name}
              </span>
            </div>
            <button
              onClick={() => setShowDedupModal(false)}
              className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/30 space-y-1.5">
              <div className="font-bold text-violet-200">
                Reused Firm Core Module ({persona.dedup_match.overlap_score_pct}% Shared DNA)
              </div>
              <p className="text-slate-300">
                Inherited directly from <strong>{persona.dedup_match.target_persona_name}</strong> (
                {persona.dedup_match.existing_mvp_name}):
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {persona.dedup_match.shared_subtasks.map((st, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-200 border border-violet-500/30">
                    ✓ {st}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 space-y-1.5">
              <div className="font-bold text-sky-300">
                {persona.name}'s Custom Adapter Delta (32% Bespoke)
              </div>
              <p className="text-slate-200">{persona.dedup_match.custom_delta_needed}</p>
              <div className="pt-1 flex items-center justify-between">
                <span className="text-emerald-400 font-semibold">
                  Saved {persona.dedup_match.estimated_build_hours_saved} hrs of duplicate engineering
                </span>
                <button
                  onClick={() => {
                    setShowDedupModal(false);
                    onSwitchPersona(persona.dedup_match.target_persona_id);
                  }}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 font-semibold cursor-pointer"
                >
                  Inspect {persona.dedup_match.target_persona_name.split(' ')[0]}'s App →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Persona Responsibilities & Pain Point Strip */}
      <div className="p-3.5 bg-slate-900/60 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
            {persona.scenario_title}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{persona.core_pain_point}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
            <div className="text-sm font-bold text-rose-400">{totalFragMinutes}m</div>
            <div className="text-[10px] text-slate-400">Manual / Run</div>
          </div>
          <div className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
            <div className="text-sm font-bold text-amber-300">{aiSiloCount} AI Silos</div>
            <div className="text-[10px] text-slate-400">{humanGlueCount} Glue Steps</div>
          </div>
          <div className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <div className="text-sm font-bold text-emerald-400">90 sec</div>
            <div className="text-[10px] text-slate-400">With Beta MVP</div>
          </div>
        </div>
      </div>

      {/* IF WEEK 2 BETA MVP MODE IS TOGGLED ON: SHOW THE REAL WORKING FINANCE MINI-APP FOR THIS PERSONA */}
      {mvpBetaMode ? (
        <InteractiveMvpBetaWorkspace
          persona={persona}
          onExitBeta={() => onToggleBetaMvp(false)}
          onEmitCustomTelemetry={onEmitCustomTelemetry}
          onTriggerLiveMutation={onTriggerLiveMutation}
          onSwitchPersona={onSwitchPersona}
        />
      ) : (
        <>
          {/* INTERACTIVE OS APP DOCK & LIVE CLIPBOARD BUFFER ("THE HUMAN GLUE SIMULATOR") */}
          <div className="px-4 py-2.5 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-1">
                Active Desktop Windows:
              </span>
              {persona.fragmented_workflow.map((step, idx) => {
                const isActive = idx === activeStepIndex;
                return (
                  <button
                    key={step.id}
                    onClick={() => onStepClick(step, idx)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-sky-500 text-slate-950 font-bold shadow'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <span>#{step.step_number}</span>
                    <span>{step.app}</span>
                    {step.uses_ai_already && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isActive ? 'bg-slate-950' : 'bg-violet-400'
                        }`}
                        title="Uses Disconnected AI"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Live OS Clipboard Buffer */}
            <div
              className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border text-[11px] font-mono transition ${
                copiedFlash
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <Clipboard className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-slate-400">OS Clipboard:</span>
              <span className="truncate max-w-[230px] text-amber-300">{clipboardBuffer}</span>
            </div>
          </div>

          {/* SUBTASK TIMELINE STEPPER (Shows where AI is already used vs Human Glue!) */}
          <div className="p-4 border-b border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Week 1 Disconnected Workflow — Click Any Step or Simulate Handoff:
              </span>
              <button
                onClick={() => onStepClick(nextStep, nextStepIndex)}
                className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition"
              >
                <Copy className="w-3.5 h-3.5" />
                Simulate Copy-Paste Handoff to Step #{nextStep.step_number} ({nextStep.app}) →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
              {persona.fragmented_workflow.map((step, idx) => {
                const isActive = idx === activeStepIndex;
                return (
                  <button
                    key={step.id}
                    onClick={() => onStepClick(step, idx)}
                    className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                      isActive
                        ? 'bg-sky-500/15 border-sky-400 ring-1 ring-sky-400/40 shadow-md'
                        : 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          Step {step.step_number} • {step.app}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400">{step.duration_mins}m</span>
                      </div>
                      <div className="text-xs font-semibold text-white line-clamp-1">{step.action_title}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{step.detail}</div>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between gap-1">
                      {step.uses_ai_already ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30 font-medium">
                          Uses Disconnected AI
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          Manual App Action
                        </span>
                      )}
                      {step.is_human_glue && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30 font-medium">
                          Human Glue Bottleneck
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* LIVE SIMULATED DESKTOP: INBOX / MESSAGES / GRANOLA / AI PROMPTS */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[340px]">
            {/* Left Column: Persona's Live Communications & App Feeds */}
            <div className="md:col-span-5 border-r border-slate-800 bg-slate-950/50 p-3 flex flex-col gap-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-1">
                Live Desktop Feeds (Outlook, Slack, Granola, AI Tabs)
              </div>
              <div className="space-y-1.5 overflow-y-auto max-h-[340px] pr-1">
                {persona.workspace_messages.map((msg) => {
                  const isSel = selectedMessage?.id === msg.id;
                  return (
                    <button
                      key={msg.id}
                      onClick={() => onSelectMessage(msg.id)}
                      className={`w-full text-left p-2.5 rounded-xl border transition cursor-pointer ${
                        isSel
                          ? 'bg-slate-800/95 border-sky-500/50'
                          : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-950 text-sky-300 border border-slate-700">
                          {msg.channel}
                        </span>
                        <div className="flex items-center gap-1">
                          {msg.urgent && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold">
                              URGENT
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-white truncate">{msg.subject_or_room}</div>
                      <div className="text-[11px] text-slate-400 truncate">{msg.sender}</div>
                      <div className="text-[11px] text-slate-300 line-clamp-2 mt-1">{msg.preview}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Active Window / Message Inspector + HeavyRain Friction Overlay */}
            <div className="md:col-span-7 p-4 flex flex-col justify-between bg-slate-950/30">
              {selectedMessage && (
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                          {selectedMessage.channel} Window
                        </span>
                        <span className="text-xs text-slate-400">{selectedMessage.timestamp}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white mt-1.5">{selectedMessage.subject_or_room}</h3>
                      <p className="text-xs text-slate-400">From: {selectedMessage.sender}</p>
                    </div>
                    <button
                      onClick={() => onToggleBetaMvp(true)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Sparkles className="w-3 h-3" />
                      Replace with {persona.mvp.name} →
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 whitespace-pre-line leading-relaxed font-mono">
                    {selectedMessage.full_body}
                  </div>
                </div>
              )}

              {/* Active Step Telemetry & Friction Callout */}
              {currentStep && (
                <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-violet-500/10 border border-amber-500/30">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-bold uppercase text-amber-300 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      HeavyRain Background Observation (Step {currentStep.step_number}):
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{currentStep.app}</span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium">{currentStep.friction_note}</p>
                  <div className="mt-2 text-[11px] font-mono text-sky-300 bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-slate-800 flex items-center justify-between gap-2">
                    <span className="truncate">{currentStep.raw_payload_preview}</span>
                    <span className="text-[10px] text-emerald-400 shrink-0">● Captured via /api/observe</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ============================================================================
   INTERACTIVE WEEK 2 BETA MVP WORKSPACE (REAL WORKING FINANCE MICRO-APPS!)
   ============================================================================ */
function InteractiveMvpBetaWorkspace({
  persona,
  onExitBeta,
  onEmitCustomTelemetry,
  onTriggerLiveMutation,
  onSwitchPersona,
}) {
  const [betaEventLog, setBetaEventLog] = useState([
    `[Beta v1.2 Active] Monitoring ${persona.name.split(' ')[0]}'s clicks, ignored widgets & manual overrides...`,
  ]);
  const [mutating, setMutating] = useState(false);
  const [mutationResponse, setMutationResponse] = useState(null);

  // Persona-specific interactive micro-app states
  // 1. Marcus (DealPulse)
  const [marcusShowIgnoredTicker, setMarcusShowIgnoredTicker] = useState(false);
  const [marcusRiskInput, setMarcusRiskInput] = useState(
    '1. 60-day enterprise security review bottleneck\n2. Customer concentration in top 2 Fortune 500 logos\n3. Gross margin dip during on-prem deployment'
  );
  const [marcusSentDealNote, setMarcusSentDealNote] = useState(false);

  // 2. Elena (DiscoveryOS)
  const [elenaSelectedFilter, setElenaSelectedFilter] = useState('all');
  const [elenaVetoOverride, setElenaVetoOverride] = useState('CIO Security Sign-Off (> $150k ACV)');
  const [elenaMatrixSynced, setElenaMatrixSynced] = useState(false);

  // 3. Devon (CIM-to-IC Model Bridge)
  const [devonFlagCapRD, setDevonFlagCapRD] = useState(true);
  const [devonExportedExcel, setDevonExportedExcel] = useState(false);

  // 4. Priya (LP Instant Desk)
  const [priyaHighlightNetIRR, setPriyaHighlightNetIRR] = useState(true);
  const [priyaSentCalstrs, setPriyaSentCalstrs] = useState(false);

  const recordInteractiveSignal = (featureName, signalType, detailNote) => {
    const entry = `[${new Date().toLocaleTimeString()}] ${signalType}: ${featureName} — ${detailNote}`;
    setBetaEventLog((prev) => [entry, ...prev].slice(0, 6));
    if (onEmitCustomTelemetry) {
      onEmitCustomTelemetry({
        persona_id: persona.id,
        app_name: persona.mvp.name,
        window_title: `Beta Telemetry: ${featureName}`,
        action_type: `BETA_${signalType}`,
        content_snippet: detailNote,
        used_ai_tool: true,
      });
    }
  };

  const handleRunLiveGeminiMutation = async () => {
    setMutating(true);
    const telemetrySummary = betaEventLog.join(' | ');
    const res = await onTriggerLiveMutation(telemetrySummary);
    setMutationResponse(res);
    setMutating(false);
  };

  return (
    <div className="p-5 bg-gradient-to-b from-slate-900 to-slate-950 space-y-4">
      {/* Top Bar of the Built Beta Micro-App */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-white">{persona.mvp.name}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                {persona.mvp.version}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-sky-300 border border-slate-700 font-mono">
                {persona.mvp.security_tier}
              </span>
            </div>
            <p className="text-xs text-slate-300">{persona.mvp.tagline}</p>
          </div>
        </div>
        <button
          onClick={onExitBeta}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 cursor-pointer"
        >
          ← Back to Week 1 Fragmented View
        </button>
      </div>

      {/* =====================================================================
         REAL INTERACTIVE FINANCE MINI-APP PER PERSONA
         ===================================================================== */}
      {persona.id === 'marcus' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left 6 Cols: T-20m Pre-Call AutoBrief HUD */}
          <div className="lg:col-span-6 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-sky-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                T-20m Auto-Populated Pre-Call HUD: VeloceAI (Series B)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                Adopted 100% (14/14 Calls)
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Founder & Deal Status:</span>
                <span className="text-white font-semibold">Liam Chen (CEO) • Raising $22M Series B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Affinity CRM + Teaser Deck Sync:</span>
                <span className="text-emerald-400 font-semibold">$8.4M ARR (+140% YoY) • $280k/mo Burn</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Prior Meridian Touchpoint:</span>
                <span className="text-slate-200">Met 4 mos ago (Seed); passed on early valuation</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-400">
                Auto-Generated Screening Questions (Click to Pin to Call HUD):
              </div>
              {[
                '1. Net Dollar Retention across the 2 new Fortune 500 logistics logos?',
                '2. Gross margin impact of 60-day custom enterprise deployment?',
                '3. Why raise $22M now vs. waiting for $12M ARR milestone?',
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() =>
                    recordInteractiveSignal(
                      'T-20m Pre-Call Brief HUD',
                      'ADOPTED',
                      `Marcus pinned question #${i + 1} during live VeloceAI call.`
                    )
                  }
                  className="w-full text-left p-2 rounded-lg bg-slate-900 hover:bg-sky-500/15 border border-slate-800 hover:border-sky-500/40 text-xs text-slate-200 flex items-center justify-between cursor-pointer transition"
                >
                  <span>{q}</span>
                  <span className="text-[10px] text-sky-400 shrink-0 ml-2">Pin +</span>
                </button>
              ))}
            </div>

            {/* Ignored Feature Pruning Demo */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <EyeOff className="w-3.5 h-3.5 text-rose-400" />
                v1.0 Public Market Comp Ticker (0 clicks in Week 1):
              </span>
              <button
                onClick={() => {
                  setMarcusShowIgnoredTicker(!marcusShowIgnoredTicker);
                  recordInteractiveSignal(
                    'Public Market Comp Ticker Sidebar',
                    'IGNORED',
                    '0% usage on early-stage calls -> Auto-pruned from v1.2 layout.'
                  );
                }}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-[11px] text-rose-300 border border-rose-500/30 cursor-pointer"
              >
                {marcusShowIgnoredTicker ? 'Hide Pruned v1.0 Widget' : 'Inspect Pruned v1.0 Widget'}
              </button>
            </div>
            {marcusShowIgnoredTicker && (
              <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/30 text-[11px] text-rose-200">
                <div className="font-bold">Deprecated in v1.2 (Ignored Telemetry — 4% Usage):</div>
                Public Freight SaaS Comps: DSGX (11.2x EV/NTM Rev) | SPSC (9.8x) | MANH (13.4x) —{' '}
                <span className="italic">Removed automatically by HeavyRain because Marcus only invests in Series A/B private rounds.</span>
              </div>
            )}
          </div>

          {/* Right 6 Cols: Post-Call Granola -> Deal Team Email + Manual Override Detector */}
          <div className="lg:col-span-6 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5" />
                  Granola Call Ended → Auto-Drafted IC Deal Note
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                  v1.2 Mutation: Added Risk Block
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1 font-mono">
                <div className="text-sky-300 font-bold">To: deal-team@meridiancr.com | Sync: Affinity CRM (6 fields)</div>
                <div>Summary: VeloceAI ($8.4M ARR, 140% YoY, $280k/mo burn). Raising $22M Series B.</div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-amber-300 flex items-center justify-between">
                  <span>✨ Auto-Extracted "Top 3 Diligence Risks" (Promoted from Week 1 Manual Edits):</span>
                  <span className="text-[10px] text-slate-400">Editable</span>
                </label>
                <textarea
                  rows={3}
                  value={marcusRiskInput}
                  onChange={(e) => {
                    setMarcusRiskInput(e.target.value);
                    recordInteractiveSignal(
                      'Granola -> Deal Team Email Draft',
                      'MANUAL_OVERRIDE',
                      'Marcus edited IC Deal Risks block -> Updating Gemini schema.'
                    );
                  }}
                  className="w-full rounded-lg bg-slate-900 border border-amber-500/40 p-2 text-xs text-slate-100 font-mono"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setMarcusSentDealNote(true);
                recordInteractiveSignal(
                  '1-Click Deal Team Email + Affinity CRM Sync',
                  'ADOPTED',
                  'Sent VeloceAI deal note & updated 6 Affinity fields in 1.4s (saved 17 mins).'
                );
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-lg"
            >
              <Send className="w-3.5 h-3.5" />
              {marcusSentDealNote
                ? '✓ Sent to Deal Team & Logged 6 Fields in Affinity CRM!'
                : '1-Click Send Deal Team Recap & Sync Affinity CRM'}
            </button>
          </div>
        </div>
      )}

      {persona.id === 'elena' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left 5 Cols: Batch Candidate Persona Ranker */}
          <div className="lg:col-span-5 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-violet-300">
                Batch Persona Fit Ranker (24 Profiles)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                18 sec vs 35 mins
              </span>
            </div>
            <div className="flex gap-1.5 text-[11px]">
              {['all', 'budget_holder', 'disqualified'].map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setElenaSelectedFilter(f);
                    recordInteractiveSignal(
                      'Batch LinkedIn / Guidepoint Persona Fit Ranker',
                      'ADOPTED',
                      `Filtered 24 candidate bios by '${f}' criteria.`
                    );
                  }}
                  className={`px-2 py-1 rounded capitalize cursor-pointer ${
                    elenaSelectedFilter === f
                      ? 'bg-violet-500 text-white font-semibold'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {f.replace('_', ' ')}
                </button>
              ))}
            </div>
            <div className="space-y-1.5 text-xs">
              {[
                { name: 'Rachel Kim', role: 'VP Global Logistics @ RetailCo', fit: '98% Fit', tag: 'budget_holder', budget: '$450k ACV Auth' },
                { name: 'Marcus Thorne', role: 'Chief Supply Chain Officer @ FreightCorp', fit: '94% Fit', tag: 'budget_holder', budget: '$600k ACV Auth' },
                { name: 'David Lin', role: 'Director Warehouse Ops @ 3PL Regional', fit: '31% Fit', tag: 'disqualified', budget: 'No Software Budget' },
              ]
                .filter((c) => elenaSelectedFilter === 'all' || c.tag === elenaSelectedFilter)
                .map((c, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">{c.name}</div>
                      <div className="text-[11px] text-slate-400">{c.role}</div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          c.tag === 'budget_holder'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {c.fit}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">{c.budget}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Right 7 Cols: Live Multi-Call Thesis Matrix (Forked from Marcus's Call Core) */}
          <div className="lg:col-span-7 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-sky-300 flex items-center gap-1.5">
                  <GitMerge className="w-3.5 h-3.5 text-violet-400" />
                  Multi-Call Thesis Matrix (Powered by Marcus's Shared Granola Core)
                </span>
                <button
                  onClick={() => onSwitchPersona('marcus')}
                  className="text-[10px] text-violet-300 hover:underline cursor-pointer"
                >
                  View Marcus's Core →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-1.5 px-2">Call Respondent</th>
                      <th className="py-1.5 px-2">Routing Score</th>
                      <th className="py-1.5 px-2">Payback</th>
                      <th className="py-1.5 px-2 text-amber-300">✨ v1.1 Veto Holder (Auto-Added)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 text-slate-200">
                    <tr>
                      <td className="py-2 px-2 font-medium">Rachel Kim (VP Logistics)</td>
                      <td className="py-2 px-2 text-emerald-400 font-bold">9.0 / 10</td>
                      <td className="py-2 px-2">75 Days</td>
                      <td className="py-2 px-2 text-amber-200">{elenaVetoOverride}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 font-medium">M. Thorne (CSCO)</td>
                      <td className="py-2 px-2 text-emerald-400 font-bold">8.5 / 10</td>
                      <td className="py-2 px-2">90 Days</td>
                      <td className="py-2 px-2 text-amber-200">CISO InfoSec Review (60d)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-1 pt-1">
                <label className="text-[11px] text-amber-300 font-semibold">
                  Test Manual Column Override (Triggers Week 2 Schema Evolution):
                </label>
                <input
                  type="text"
                  value={elenaVetoOverride}
                  onChange={(e) => {
                    setElenaVetoOverride(e.target.value);
                    recordInteractiveSignal(
                      'Cross-Call Thesis Heatmap Table',
                      'MANUAL_OVERRIDE',
                      `Elena customized Veto Holder value: "${e.target.value}"`
                    );
                  }}
                  className="w-full rounded-lg bg-slate-900 border border-amber-500/40 px-2.5 py-1.5 text-xs text-slate-100 font-mono"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setElenaMatrixSynced(true);
                recordInteractiveSignal(
                  'Shared Granola-to-Structured-JSON Pipeline',
                  'ADOPTED',
                  'Aggregated 18 customer calls into IC Thesis Matrix with zero manual copy-paste.'
                );
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-bold text-xs cursor-pointer transition"
            >
              {elenaMatrixSynced
                ? '✓ 18 Discovery Calls Synced to Master IC Thesis Matrix!'
                : '1-Click Sync All 18 Granola Calls into Master IC Matrix'}
            </button>
          </div>
        </div>
      )}

      {persona.id === 'devon' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left 6 Cols: Direct PDF-to-Excel COA Line Item Mapper */}
          <div className="lg:col-span-6 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-emerald-400">
                PDF CIM Page 47 → Meridian IC Excel Bridge
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                Zero Screenshots Needed
              </span>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
                <span className="text-slate-300">Reported GAAP Operating Income (FY26E)</span>
                <span className="text-white font-bold">$1,240,000</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
                <span className="text-slate-300">(+) D&A and Non-Cash Stock Comp (Footnote 3)</span>
                <span className="text-emerald-400 font-bold">+$820,000</span>
              </div>
              <div
                onClick={() => {
                  setDevonFlagCapRD(!devonFlagCapRD);
                  recordInteractiveSignal(
                    'Footnote EBITDA Add-Back Classifier',
                    'MANUAL_OVERRIDE',
                    `Devon toggled Capitalized R&D Red Flag (${!devonFlagCapRD ? 'Disallowed Add-Back' : 'Allowed'}).`
                  );
                }}
                className={`p-2.5 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                  devonFlagCapRD
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-200'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div>
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    Footnote 4: Capitalized Software R&D (13.3% of Rev)
                  </div>
                  <div className="text-[10px] text-amber-300/90 mt-0.5">
                    v1.1 Rule Learned from Devon's Week 1 Overrides (Click to Toggle Add-Back)
                  </div>
                </div>
                <span className="font-bold text-rose-300">
                  {devonFlagCapRD ? '-$1,120,000 (Disallowed)' : '+$0 (Accepted)'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex justify-between text-xs">
                <span className="font-bold text-emerald-300">Meridian Underwritten Adjusted EBITDA:</span>
                <span className="font-bold text-white">
                  {devonFlagCapRD ? '$940,000 (11.2% Margin)' : '$2,060,000 (24.5% Margin)'}
                </span>
              </div>
            </div>
          </div>

          {/* Right 6 Cols: Shared Verified KPI Feed to Priya (IR) */}
          <div className="lg:col-span-6 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-sky-300 flex items-center gap-1.5">
                  <GitMerge className="w-3.5 h-3.5 text-emerald-400" />
                  Live Verified KPI Pipe → Priya Nair (Investor Relations)
                </span>
                <button
                  onClick={() => onSwitchPersona('priya')}
                  className="text-[10px] text-emerald-300 hover:underline cursor-pointer"
                >
                  Jump to Priya's LP Desk →
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Instead of Priya interrupting you on Slack 7x/week for portfolio ARR/NDR metrics, HeavyRain exposes your verified model outputs via a read-only enclave table.
              </p>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
                <div className="text-emerald-400 font-bold">● READ-ONLY KPI STREAM ACTIVE (SOC2 Enclave)</div>
                <div>• VeloceAI (Q3 Verified): $8.4M ARR (+140% YoY) | 138% NDR</div>
                <div>• FreightMind AI (Q3 Verified): $14.2M ARR (+88% YoY) | 124% NDR</div>
                <div>• Auto-DCF Tab: Pruned in v1.1 (0% Week 1 usage)</div>
              </div>
            </div>

            <button
              onClick={() => {
                setDevonExportedExcel(true);
                recordInteractiveSignal(
                  'Direct PDF-to-Excel COA Line Item Mapper',
                  'ADOPTED',
                  'Exported reconciled EBITDA bridge to Meridian_IC_Model_v14.xlsx & published KPI feed to Priya.'
                );
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer transition"
            >
              {devonExportedExcel
                ? '✓ Synced to Meridian_IC_Model_v14.xlsx & Published to Priya!'
                : '1-Click Export .XLSX Formula Model & Publish Verified KPIs'}
            </button>
          </div>
        </div>
      )}

      {(persona.id === 'priya' || persona.id === 'claire') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left 6 Cols: Live Verified KPI Pull from Devon's Model */}
          <div className="lg:col-span-6 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-amber-300">
                Urgent LP Inquiry: David Thorne (CalSTRS — 1:00 PM IC)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                0 Slack Pings to Devon
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1.5 font-mono">
              <div className="text-sky-300 font-bold">
                Synced Live from Devon Brooks' CIM-to-IC Model Bridge:
              </div>
              <div className="flex justify-between">
                <span>Fund III Vertical AI Logistics Exposure:</span>
                <span className="text-white font-bold">22.4% of NAV (6 Holdings)</span>
              </div>
              <div className="flex justify-between">
                <span>Weighted Q3 YoY ARR Growth:</span>
                <span className="text-emerald-400 font-bold">+114.2% YoY</span>
              </div>
              <div className="flex justify-between">
                <span>Dollar-Weighted Net Retention (NDR):</span>
                <span className="text-emerald-400 font-bold">131.5% Net Retention</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-slate-300">
                ✨ v1.1 SEC Marketing Rule Gross/Net IRR Side-by-Side:
              </span>
              <button
                onClick={() => {
                  setPriyaHighlightNetIRR(!priyaHighlightNetIRR);
                  recordInteractiveSignal(
                    'SEC Marketing Rule Gross/Net Auto-Footnote',
                    'MANUAL_OVERRIDE',
                    'Priya toggled Gross/Net IRR prominence for institutional pension compliance.'
                  );
                }}
                className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-semibold cursor-pointer"
              >
                {priyaHighlightNetIRR ? 'Net IRR Bolded (24.8% Net / 29.1% Gross)' : 'Standard Format'}
              </button>
            </div>
          </div>

          {/* Right 6 Cols: 1-Click Compliant Outlook Reply */}
          <div className="lg:col-span-6 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase text-emerald-400">
                Auto-Drafted Institutional Response (Cited to Audit Deck)
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed">
                Dear David,{'\n'}
                Ahead of CalSTRS' 1:00 PM Investment Committee, Meridian Fund III's verified Q3 exposure across our 6 Supply-Chain & Vertical AI holdings is 22.4% of NAV, delivering +114.2% YoY ARR growth and 131.5% Net Dollar Retention.{'\n'}
                {priyaHighlightNetIRR &&
                  '[SEC Marketing Rule Disclosure: Net IRR 24.8% | Gross IRR 29.1% — Audited Q3 Workbooks Linked]'}
              </div>
            </div>

            <button
              onClick={() => {
                setPriyaSentCalstrs(true);
                recordInteractiveSignal(
                  'Cross-Team Live KPI Pull (via Devon)',
                  'ADOPTED',
                  'Sent verified CalSTRS IC response in 8 seconds without interrupting Devon on Slack.'
                );
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer transition"
            >
              {priyaSentCalstrs
                ? '✓ Sent Compliant Reply to CalSTRS & Logged in Affinity IR!'
                : '1-Click Send Cited Reply to CalSTRS & Log in Affinity'}
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
         BOTTOM BAR: PASSIVE BETA TELEMETRY & LIVE GEMINI 4 ARGON SELF-MUTATION
         ===================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
        <div className="md:col-span-7 p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-amber-300 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              Passive Beta Telemetry (User as Beta Tester — Week 1 → Week 2):
            </span>
            <span className="text-[10px] text-slate-400">Click any row or widget above</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {persona.mvp.telemetry_items.map((item, i) => (
              <div
                key={i}
                onClick={() =>
                  recordInteractiveSignal(item.feature_name, item.status.toUpperCase(), item.week2_agent_action)
                }
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 cursor-pointer transition"
              >
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      item.status === 'adopted'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : item.status === 'ignored'
                        ? 'bg-rose-500/20 text-rose-300 line-through'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {item.status} ({item.usage_rate_pct}%)
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-white mt-1 line-clamp-1">{item.feature_name}</div>
                <div className="text-[10px] text-sky-300 mt-0.5 line-clamp-2">→ {item.week2_agent_action}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Telemetry Log + 1-Click Gemini 4 Argon v1.3 Auto-Mutate Button */}
        <div className="md:col-span-5 p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-2">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-violet-300 flex items-center gap-1.5">
                <RefreshCw className={`w-3.5 h-3.5 ${mutating ? 'animate-spin' : ''}`} />
                Live Telemetry Stream → Auto-Mutate v1.3
              </span>
              <button
                onClick={handleRunLiveGeminiMutation}
                disabled={mutating}
                className="px-2.5 py-1 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 text-violet-200 border border-violet-500/40 text-[11px] font-semibold cursor-pointer"
              >
                {mutating ? 'Mutating via Argon...' : 'Synthesize v1.3 Mutation →'}
              </button>
            </div>
            <div className="mt-2 space-y-1 max-h-[85px] overflow-y-auto font-mono text-[10px] text-slate-300">
              {betaEventLog.map((log, idx) => (
                <div key={idx} className="truncate text-emerald-300/90">
                  {log}
                </div>
              ))}
            </div>
          </div>

          {mutationResponse?.live_gemini_mutation_spec && (
            <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/30 text-[11px] text-slate-200 max-h-[90px] overflow-y-auto">
              <strong className="text-violet-300">Gemini 4 Argon v1.3 Spec: </strong>
              {mutationSpecText(mutationResponse.live_gemini_mutation_spec)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   RIGHT PANE: HEAVYRAIN AGENT BRAIN, WEEKLY MVP & ORG DEDUPLICATION
   ============================================================================ */
function HeavyRainBrainPane({
  persona,
  currentStep,
  activeStepIndex,
  agentRightTab,
  setAgentRightTab,
  mvpBetaMode,
  onToggleBetaMvp,
  liveEvents,
  onSwitchPersona,
  onOpenDomTab,
}) {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full">
      {/* Agent Brain Header & Sub-Tabs */}
      <div className="bg-slate-950 p-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
            HeavyRain Background Agent Engine
          </span>
        </div>
        <button
          onClick={onOpenDomTab}
          className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Code2 className="w-3.5 h-3.5" /> Inspect Dom's API Contract →
        </button>
      </div>

      {/* 4 Sub-Tabs inside the Agent Brain */}
      <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950/60 text-xs">
        <button
          onClick={() => setAgentRightTab('observer')}
          className={`py-2.5 px-2 font-medium border-b-2 transition cursor-pointer ${
            agentRightTab === 'observer'
              ? 'border-sky-400 text-sky-300 bg-sky-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          1. Subtask Graph
        </button>
        <button
          onClick={() => setAgentRightTab('mvp_preview')}
          className={`py-2.5 px-2 font-medium border-b-2 transition cursor-pointer ${
            agentRightTab === 'mvp_preview'
              ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          2. Built Weekly MVP
        </button>
        <button
          onClick={() => setAgentRightTab('beta_loop')}
          className={`py-2.5 px-2 font-medium border-b-2 transition cursor-pointer ${
            agentRightTab === 'beta_loop'
              ? 'border-amber-400 text-amber-300 bg-amber-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          3. Beta Telemetry
        </button>
        <button
          onClick={() => setAgentRightTab('dedup')}
          className={`py-2.5 px-2 font-medium border-b-2 transition cursor-pointer ${
            agentRightTab === 'dedup'
              ? 'border-violet-400 text-violet-300 bg-violet-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          4. Org Dedup Match
        </button>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        {/* TAB 1: SUBTASK CLUSTERING & HUMAN GLUE DETECTOR */}
        {agentRightTab === 'observer' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-sky-400">
                  Why Current AI Usage Still Fails {persona.name}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 font-semibold">
                  Human Glue Detected
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {persona.name} already uses <strong>{persona.current_ai_tools_used.join(', ')}</strong>. However, HeavyRain detected that {persona.name} is still performing{' '}
                <strong className="text-rose-300">
                  {persona.fragmented_workflow.filter((s) => s.is_human_glue).length} manual context-switches
                </strong>{' '}
                under time pressure—copying notes from CRM/Outlook into AI prompts, recording in Granola, and pasting back into Gemini/Excel.
              </p>
            </div>

            {/* Visual Subtask Consolidation Map */}
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Subtask Cluster Proposed for Automation ({persona.mvp.name}):
              </div>
              <div className="space-y-1.5">
                {persona.fragmented_workflow.map((s, idx) => {
                  const isAutomated = persona.mvp.replaces_steps.includes(s.id);
                  const isCurrent = idx === activeStepIndex;
                  return (
                    <div
                      key={s.id}
                      className={`p-2 rounded-lg border flex items-center justify-between text-xs ${
                        isCurrent
                          ? 'bg-sky-500/15 border-sky-400'
                          : 'bg-slate-950/70 border-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-[10px] font-mono text-slate-400">#{s.step_number}</span>
                        <span className="font-medium text-slate-200 truncate">{s.action_title}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {s.uses_ai_already && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300">
                            AI Silo
                          </span>
                        )}
                        {isAutomated ? (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                            → Unified in MVP
                          </span>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            Human Call
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA to Preview / Launch the Built MVP */}
            <button
              onClick={() => {
                onToggleBetaMvp(true);
                setAgentRightTab('mvp_preview');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer transition"
            >
              <Sparkles className="w-4 h-4" />
              Launch Interactive Beta Micro-App ({persona.mvp.name})
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* TAB 2: AUTONOMOUS MVP BUILT FOR THIS PERSONA */}
        {agentRightTab === 'mvp_preview' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-emerald-300">
                  Built & Ready for Beta Testing
                </span>
                <span className="text-[11px] font-mono text-emerald-400">{persona.mvp.security_tier}</span>
              </div>
              <h3 className="text-base font-bold text-white">{persona.mvp.name}</h3>
              <p className="text-xs text-slate-300">{persona.mvp.tagline}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-sky-400 uppercase">Agent Weekly Briefing to User</div>
              <p className="text-xs text-slate-200 leading-relaxed italic">"{persona.mvp.weekly_agent_pitch}"</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase">Generated Pipeline Architecture</div>
              <div className="text-xs font-mono text-emerald-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                {persona.mvp.architecture_summary}
              </div>
            </div>

            <button
              onClick={() => onToggleBetaMvp(!mvpBetaMode)}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer transition"
            >
              {mvpBetaMode ? 'Currently Testing Beta in Left Workspace ✓' : 'Launch Interactive Beta MVP in Workspace'}
            </button>
          </div>
        )}

        {/* TAB 3: WEEK 1 -> WEEK 2 BETA TELEMETRY & SELF-EVOLUTION */}
        {agentRightTab === 'beta_loop' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
              <div className="text-xs font-bold uppercase text-amber-300">
                The User as Beta Tester — Passive Adaptation Loop
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">{persona.mvp.week1_to_week2_diff_summary}</p>
            </div>

            <div className="space-y-2">
              {persona.mvp.telemetry_items.map((t, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{t.feature_name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        t.status === 'adopted'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : t.status === 'ignored'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {t.status} • {t.usage_rate_pct}% usage
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Observed: {t.observation_note}</p>
                  <div className="text-[11px] text-sky-300 font-medium pt-1 border-t border-slate-800/80">
                    → Agent Code Action: {t.week2_agent_action}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CROSS-ORG WORKFLOW DEDUPLICATION & COLLABORATION */}
        {agentRightTab === 'dedup' && (
          <div className="space-y-4">
            {persona.dedup_match ? (
              <>
                <div className="p-4 rounded-xl bg-violet-500/15 border border-violet-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-violet-300 flex items-center gap-1.5">
                      <GitMerge className="w-4 h-4" />
                      {persona.dedup_match.overlap_score_pct}% Workflow DNA Match Detected!
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                      Saves {persona.dedup_match.estimated_build_hours_saved}h Build Time
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    Colleague Match: {persona.dedup_match.target_persona_name} ({persona.dedup_match.target_persona_role})
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">{persona.dedup_match.recommendation}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold uppercase text-slate-400">Shared Firm Subtask Modules</div>
                  <div className="flex flex-wrap gap-1.5">
                    {persona.dedup_match.shared_subtasks.map((st, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-lg bg-violet-500/15 text-violet-200 border border-violet-500/30"
                      >
                        ✓ {st}
                      </span>
                    ))}
                  </div>
                  <div className="pt-2 text-xs text-slate-300">
                    <strong className="text-sky-300">Custom Persona Delta:</strong> {persona.dedup_match.custom_delta_needed}
                  </div>
                </div>

                <button
                  onClick={() => onSwitchPersona(persona.dedup_match.target_persona_id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  Jump to {persona.dedup_match.target_persona_name}'s Workspace to Compare →
                </button>
              </>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                Claire Sterling oversees all org-wide deduplication matches across the 4 investment teams. Switch to the COO / Exec View to see the full firm matrix.
              </div>
            )}
          </div>
        )}

        {/* REAL-TIME OS / WORKSPACE EVENT STREAM (SYNCED ACROSS DUAL CHROME TABS) */}
        <div className="pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Live Background Telemetry Stream (/api/observe)
            </span>
            <span className="text-[10px] text-slate-500">Synced across tabs</span>
          </div>
          <div className="space-y-1.5 max-h-[145px] overflow-y-auto pr-1 font-mono">
            {liveEvents.slice(0, 6).map((ev) => (
              <div
                key={ev.id}
                className="text-[11px] p-2 rounded-lg bg-slate-950 border border-slate-800/90 flex items-start justify-between gap-2"
              >
                <div className="truncate">
                  <span className="text-sky-400 font-semibold">[{ev.app_name}]</span>{' '}
                  <span className="text-slate-200">{ev.window_title}</span>
                  <div className="text-[10px] text-slate-400 truncate">{ev.content_snippet}</div>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">{ev.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   COO / EXECUTIVE ORG COMMAND CENTER (CLAIRE STERLING VIEW)
   ============================================================================ */
function ExecCommandCenter({ orgData, personas, onSelectPersona }) {
  const investorPersonas = personas.filter((p) => !p.is_exec_view);

  return (
    <div className="space-y-6">
      {/* Top Executive Mandate Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-500/15 via-violet-500/10 to-sky-500/15 border border-rose-500/30 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-rose-300">
            COO & Managing Partner Command Center — Dual Mandate View
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            {orgData?.org_name || 'Meridian Crest Capital'} — Autonomous Workflow Governance & ROI
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
            Prevents 5 teams from building redundant point tools or pasting sensitive deal data into unmonitored AI tabs. HeavyRain spots cross-org workflow overlap and compiles shared, SOC2-governed firm applications.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-center">
            <div className="text-xl font-bold text-emerald-400">{orgData?.total_weekly_hours_saved || 36.5} hrs/wk</div>
            <div className="text-[11px] text-slate-400">Partner/Assoc Time Saved</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-center">
            <div className="text-xl font-bold text-sky-400">$274,000</div>
            <div className="text-[11px] text-slate-400">Annualized Productivity ROI</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-center">
            <div className="text-xl font-bold text-violet-400">2 Shared Cores</div>
            <div className="text-[11px] text-slate-400">4 Duplicate Builds Prevented</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-center">
            <div className="text-xl font-bold text-amber-300">98% SOC2</div>
            <div className="text-[11px] text-slate-400">19 Shadow-AI Loops Governed</div>
          </div>
        </div>
      </div>

      {/* CROSS-TEAM DEDUPLICATION & COLLABORATION RADAR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-violet-300 flex items-center gap-1.5">
              <GitMerge className="w-4 h-4" />
              Org Consolidation #1: Call & Synthesis Pipeline (68% Overlap)
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
              28 Eng Hours Saved
            </span>
          </div>
          <h3 className="text-base font-bold text-white">
            Marcus Vance (Deal Sourcing) ↔ Elena Rostova (Customer Discovery)
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Both Marcus and Elena were manually stitching Calendar triggers + Granola call recording + Gemini post-call extraction. HeavyRain unified their core engine into a single governed firm module while keeping Marcus's Affinity CRM adapter and Elena's Multi-Call Thesis Matrix adapter separate.
          </p>
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => onSelectPersona('marcus')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-sky-300 cursor-pointer"
            >
              Inspect Marcus's DealPulse MVP →
            </button>
            <button
              onClick={() => onSelectPersona('elena')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-violet-300 cursor-pointer"
            >
              Inspect Elena's DiscoveryOS Fork →
            </button>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-emerald-300 flex items-center gap-1.5">
              <GitMerge className="w-4 h-4" />
              Org Consolidation #2: Verified Portfolio KPI Data Bridge (62% Overlap)
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
              Eliminated 7 Weekly Slack Bottlenecks
            </span>
          </div>
          <h3 className="text-base font-bold text-white">
            Devon Brooks (Financial Diligence) ↔ Priya Nair (Investor Relations)
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Priya previously interrupted Devon on Slack 7x/week to pull verified portfolio ARR/NDR numbers for LP inquiries. HeavyRain connected Priya's LP Instant Desk directly to the verified output table of Devon's CIM & Portfolio Model Bridge.
          </p>
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => onSelectPersona('devon')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-emerald-300 cursor-pointer"
            >
              Inspect Devon's CIM Bridge →
            </button>
            <button
              onClick={() => onSelectPersona('priya')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 cursor-pointer"
            >
              Inspect Priya's LP Instant Desk →
            </button>
          </div>
        </div>
      </div>

      {/* ALL PERSONAS & AUTONOMOUS MVPs TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Active Firm-Wide Personas, Disconnected AI Replaced & Weekly Beta MVPs
          </h3>
        </div>
        <div className="divide-y divide-slate-800">
          {investorPersonas.map((p) => (
            <div key={p.id} className="p-4 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-800/40">
              <div className="flex items-center gap-3 min-w-[240px]">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.avatar_color} flex items-center justify-center font-bold text-white`}
                >
                  {p.avatar_initials}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{p.name}</div>
                  <div className="text-xs text-slate-400">{p.role}</div>
                </div>
              </div>

              <div className="flex-1 min-w-[260px]">
                <div className="text-xs font-semibold text-emerald-300">
                  {p.mvp.name} <span className="text-slate-400">({p.mvp.version})</span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{p.mvp.tagline}</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-bold text-white">{p.hours_saved_by_heavyrain} hrs/wk saved</div>
                  <div className="text-xs text-emerald-400">${p.mvp.annual_dollar_value.toLocaleString()}/yr value</div>
                </div>
                <button
                  onClick={() => onSelectPersona(p.id)}
                  className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 text-xs font-semibold cursor-pointer"
                >
                  Take Over Workspace →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   DOM'S BACKEND ARCHITECTURE & LIVE GEMINI 4 ARGON INSPECTOR (FOR 1 PM SESSION)
   ============================================================================ */
function DomBackendInspector({
  activePersona,
  personas,
  onSelectPersona,
  geminiLoading,
  geminiResult,
  onTriggerEndpoint,
  customTelemetryInput,
  setCustomTelemetryInput,
  liveEvents,
}) {
  return (
    <div className="space-y-5">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-slate-900 to-sky-500/15 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            1:00 PM Architecture Walkthrough with Dom — Backend & Agent Handoff
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            How Dom's Python Agent Pipeline Plugs Into the HeavyRain Frontend
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
            All endpoints in <code className="text-emerald-300">backend/app.py</code> and{' '}
            <code className="text-emerald-300">backend/agent_engine.py</code> are live right now and wired to{' '}
            <code className="text-sky-300">gemini-4-argon</code> via the <code className="text-sky-300">google-genai</code> SDK.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 6 Cols: Interactive API Triggers for Dom */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-sky-400">
                Test Live Backend Endpoints for: {activePersona.name}
              </span>
              <span className="text-[11px] font-mono text-slate-400">backend/agent_engine.py</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => onTriggerEndpoint('discern', 'news_deal_signal')}
                disabled={geminiLoading}
                className="p-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-left transition cursor-pointer"
              >
                <div className="text-xs font-bold text-amber-300">POST /api/discern-signal</div>
                <div className="text-[11px] text-slate-300 mt-1">
                  Signal vs. Noise & Dual-Level Stack Ranker (User Relevance vs. Org Impact).
                </div>
              </button>

              <button
                onClick={() => onTriggerEndpoint('synthesize')}
                disabled={geminiLoading}
                className="p-3 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-left transition cursor-pointer"
              >
                <div className="text-xs font-bold text-sky-300">POST /api/synthesize-weekly</div>
                <div className="text-[11px] text-slate-300 mt-1">
                  Clusters subtasks, flags "Human Glue" & outputs MVP spec via Gemini 4 Argon.
                </div>
              </button>

              <button
                onClick={() => onTriggerEndpoint('dedup')}
                disabled={geminiLoading}
                className="p-3 rounded-xl bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/30 text-left transition cursor-pointer"
              >
                <div className="text-xs font-bold text-violet-300">POST /api/org-dedup</div>
                <div className="text-[11px] text-slate-300 mt-1">
                  Checks firm registry for overlapping workflows (Marcus ↔ Elena, Devon ↔ Priya).
                </div>
              </button>

              <button
                onClick={() => onTriggerEndpoint('telemetry')}
                disabled={geminiLoading}
                className="p-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-left transition cursor-pointer"
              >
                <div className="text-xs font-bold text-emerald-300">POST /api/telemetry-iterate</div>
                <div className="text-[11px] text-slate-300 mt-1">
                  Mutates Week 1 MVP into Week 2 v1.2 based on user beta telemetry.
                </div>
              </button>
            </div>

            <div className="pt-2 space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400">
                Custom Beta Telemetry / Observation Input (Passed to Gemini 4 Argon):
              </label>
              <textarea
                rows={2}
                value={customTelemetryInput}
                onChange={(e) => setCustomTelemetryInput(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-slate-200 font-mono"
              />
            </div>
          </div>

          {/* Pipeline Architecture Map for Dom */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="text-xs font-bold uppercase text-slate-400">
              Where Dom's Code Plugs In (5 Modular Stages)
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-sky-300">1. OS / Browser Collector → POST /api/observe</span>
                <p className="text-slate-400 mt-0.5">
                  Dom's background daemon streams active window titles, Outlook alerts, Granola transcripts, and clipboard transfers.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-amber-300">1B. Signal vs. Noise & Dual-Level Stack Ranker → POST /api/discern-signal</span>
                <p className="text-slate-400 mt-0.5">
                  Purges personal browsing on-device (Airbnb/iMessage), filters passive news drama, flags deal-sourcing clips as personal micro-skills, and promotes multi-team workflows to firm-wide MVPs.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-violet-300">2 & 3. Subtask Graph & Dedup → POST /api/synthesize-weekly & /api/org-dedup</span>
                <p className="text-slate-400 mt-0.5">
                  Clusters repetitive loops where the user is acting as "human glue" between AI tools and checks if another investor already has a matching module.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-emerald-300">4. Weekly Beta Telemetry Loop → POST /api/telemetry-iterate</span>
                <p className="text-slate-400 mt-0.5">
                  Tracks which MVP widgets the investor actually clicked, ignored, or manually edited in Week 1 and auto-evolves the app for Week 2.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 6 Cols: Live JSON & Gemini 4 Argon Response Inspector */}
        <div className="lg:col-span-6 p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between min-h-[420px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase text-emerald-400">
                Live FastAPI + Gemini 4 Argon Output Inspector
              </span>
              {geminiLoading && (
                <span className="text-xs text-sky-400 animate-pulse">Running gemini-4-argon synthesis...</span>
              )}
            </div>

            {geminiResult ? (
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Endpoint: {geminiResult.endpoint}</span>
                  <span>{geminiResult.timestamp}</span>
                </div>
                {geminiResult.data?.live_gemini_discernment_rationale && (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-100 whitespace-pre-line leading-relaxed">
                    <div className="font-bold text-amber-300 mb-1">
                      Gemini 4 Argon Signal vs. Noise Verdict ({geminiResult.data.verdict_badge}):
                    </div>
                    {geminiResult.data.live_gemini_discernment_rationale}
                  </div>
                )}
                {geminiResult.data?.agent_synthesis_narrative && (
                  <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-xs text-slate-100 whitespace-pre-line leading-relaxed">
                    <div className="font-bold text-sky-300 mb-1">Gemini 4 Argon Output:</div>
                    {geminiResult.data.agent_synthesis_narrative}
                  </div>
                )}
                {geminiResult.data?.live_gemini_dedup_rationale && (
                  <div className="p-3.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-xs text-slate-100 whitespace-pre-line leading-relaxed">
                    <div className="font-bold text-violet-300 mb-1">Gemini 4 Argon Org Dedup Rationale:</div>
                    {geminiResult.data.live_gemini_dedup_rationale}
                  </div>
                )}
                {geminiResult.data?.live_gemini_mutation_spec && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-slate-100 whitespace-pre-line leading-relaxed">
                    <div className="font-bold text-emerald-300 mb-1">Gemini 4 Argon Week 2 Beta Mutation Plan:</div>
                    {mutationSpecText(geminiResult.data.live_gemini_mutation_spec)}
                  </div>
                )}
                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-emerald-300 font-mono overflow-auto max-h-[260px]">
                  {JSON.stringify(geminiResult.data, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="h-[320px] flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <Terminal className="w-8 h-8 text-slate-600 mb-2" />
                <p className="text-xs max-w-md">
                  Click any of the 3 API endpoints on the left to execute a live call against{' '}
                  <code className="text-sky-300">backend/agent_engine.py</code> and inspect the structured JSON payload + Gemini 4 Argon output.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function mutationSpecText(val) {
  if (!val) return '';
  return typeof val === 'string' ? val : JSON.stringify(val, null, 2);
}

/* ============================================================================
   SIGNAL VS. NOISE DISCERNMENT & DUAL-MANDATE STACK-RANKER
   (Fiancée Honeymoon Airbnb vs. News Drama vs. Deal Flagging vs. Firm-Wide MVP)
   ============================================================================ */
const DISCERNMENT_SCENARIOS = [
  {
    id: 'honeymoon_airbnb',
    badge: 'Personal Life • Privacy Shield',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    title: 'Text from Fiancée + Browsing Airbnb for October Honeymoon',
    appsUsed: 'iMessage → Chrome (Airbnb.com "Amalfi Coast Cliffside Villas" + Delta Flights)',
    duration: '14 mins (Tuesday 12:15 PM)',
    simulatedWindowHeader: 'iMessage & Airbnb.com — Personal Browser Session',
    simulatedContent:
      'Fiancée (iMessage): "Babe!! Look at these 3 cliffside Airbnbs in Positano for our October honeymoon 😍 Which one should we book before they sell out?"\n\n[User Action]: Opens 3 Airbnb links, compares nightly rates ($680/nt vs $820/nt), checks PTO calendar, replies via iMessage.',
    userRelevanceScore: 0,
    orgImpactScore: 0,
    weeklyFreq: 'Ad-hoc Personal',
    agentVerdict: '🔒 AUTO-PURGED ON DEVICE (ZERO TOOL BUILT)',
    verdictColor: 'from-rose-500/20 to-slate-900 border-rose-500/40 text-rose-300',
    whyExplanation:
      'HeavyRain’s local on-device classifier detects personal relationship communication & consumer travel browsing with zero link to Meridian Crest entities, CRM, or financial models. Telemetry is immediately purged in local RAM and NEVER transmitted to the org cloud.',
    orgAction: 'Blocked at Local Privacy Gate — COO & Org never see personal browsing.',
  },
  {
    id: 'news_drama',
    badge: 'Daily Reading • Non-Actionable Noise',
    badgeColor: 'bg-slate-700 text-slate-300 border-slate-600',
    title: 'Morning News Browsing — Celebrity/Tech Drama & Sports Scores',
    appsUsed: 'Chrome (WSJ Lifestyle / X Trending Drama / ESPN Box Scores)',
    duration: '18 mins (Daily 8:10 AM)',
    simulatedWindowHeader: 'Chrome — X / Trending Tech Drama & Morning Headlines',
    simulatedContent:
      '[Browser Activity]: User scrolls 14 trending posts about a public CEO feud, reads an op-ed on macro politics, and checks last night’s NBA box scores.\n\n[Downstream Action]: None. Tab closed at 8:28 AM with zero clipboard copies, zero CRM lookups, and zero note-taking.',
    userRelevanceScore: 8,
    orgImpactScore: 2,
    weeklyFreq: '1.5 hrs/wk (Passive)',
    agentVerdict: '🔇 IGNORED AS NOISE (BELOW BUILD THRESHOLD)',
    verdictColor: 'from-slate-800 to-slate-900 border-slate-700 text-slate-300',
    whyExplanation:
      'Even though this happens on the work browser every morning, HeavyRain sees zero downstream work artifacts (no CRM paste, no thesis note, no email). Building an "AI Drama Summarizer" would be clutter—so the agent scores it 8/100 and ignores it.',
    orgAction: 'Filtered out of weekly synthesis so users are never spammed with low-value toy apps.',
  },
  {
    id: 'news_deal_signal',
    badge: 'Same News Site • Work Signal Detected!',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    title: 'Morning News — Spotting Sector Funding & Flagging Deal to CRM',
    appsUsed: 'Chrome (TechCrunch / PitchBook News) → Copy Company → Affinity CRM + Slack',
    duration: '11 mins (4x / week)',
    simulatedWindowHeader: 'Chrome (TechCrunch) → Affinity CRM Deal Radar',
    simulatedContent:
      '[Article Read]: "Autonomous Yard Logistics Startup DockFlow Raises $19M Series A Led by Industrial Ventures"\n\n[Downstream Work Signal Detected!]: Marcus highlights "DockFlow", copies founder name, switches to Affinity CRM to check if Meridian covered the round, and drops the link in #deal-flow-sourcing.',
    userRelevanceScore: 78,
    orgImpactScore: 34,
    weeklyFreq: '2.4 hrs/wk (1 Persona)',
    agentVerdict: '👤 BUILD PERSONAL MICRO-SKILL ONLY (DO NOT PUSH FIRM-WIDE)',
    verdictColor: 'from-sky-500/20 to-slate-900 border-sky-500/40 text-sky-300',
    whyExplanation:
      'Crucial Distinction: The user is still "reading the news", but HeavyRain detects the downstream work handoff (Chrome → Clipboard → Affinity CRM → Slack). It builds a lightweight "1-Click Flag Deal from Article to Affinity" clipper for Marcus!',
    orgAction: 'Kept at User Tier (Org Impact: 34/100) — Helpful for Marcus, but not pushed firm-wide since Diligence & IR teams don’t run news sourcing.',
  },
  {
    id: 'precall_org_mvp',
    badge: 'Stack-Ranked #1 • Dual-Mandate Winner',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    title: '15m Pre-Call Scramble + Granola Call -> Gemini Recap -> CRM & Thesis Matrix',
    appsUsed: 'Outlook + Affinity + Claude Skill + Granola + Gemini + Excel (7 Manual Glue Handoffs)',
    duration: '42 mins/call × 14 calls/wk = 9.8 hrs/wk',
    simulatedWindowHeader: 'Multi-App Work Cluster (Marcus Vance & Elena Rostova — 68% Shared DNA)',
    simulatedContent:
      '[High-Friction Work Loop]: Repeated 14x/wk by Marcus (Deal Sourcing) and 18x/wk by Elena (Customer Discovery).\n\n[Dual-Mandate Score]: User Relevance = 98/100 (saves 9.2 hrs/wk of frantic copy-pasting) + Org Impact = 95/100 (shared across 2 teams, standardizes IC data quality, eliminates unmonitored AI tabs).',
    userRelevanceScore: 98,
    orgImpactScore: 95,
    weeklyFreq: '18.7 hrs/wk Across 2 Teams',
    agentVerdict: '🚀 PROMOTED TO FIRM-WIDE GOVERNED MVP (DEALPULSE + DISCOVERYOS)',
    verdictColor: 'from-emerald-500/25 to-sky-500/15 border-emerald-400 text-emerald-300',
    whyExplanation:
      'Scores highest on BOTH mandates: massive individual time savings (9.2 hrs/wk) AND high cross-org reusability (68% shared core between Marcus and Elena). HeavyRain builds the full MVP, runs the weekly beta loop, and promotes the shared core to the firm registry.',
    orgAction: 'Approved & Pushed Firm-Wide by COO (Claire Sterling) — Unlocks $140K+ combined annual ROI.',
  },
];

function SignalVsNoiseDiscernmentCenter({ activePersona, onOpenExecView, onOpenWorkspaceView }) {
  const [selectedScenarioId, setSelectedScenarioId] = useState('honeymoon_airbnb');
  const currentScenario =
    DISCERNMENT_SCENARIOS.find((s) => s.id === selectedScenarioId) || DISCERNMENT_SCENARIOS[0];

  return (
    <div className="space-y-5">
      {/* Top Explanation Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-emerald-500/15 border border-amber-500/30 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-amber-400 text-slate-950">
              Discernment & Dual-Mandate Stack Ranker
            </span>
            <span className="text-xs text-amber-300 font-medium">
              How HeavyRain Filters Personal Life & Noise vs. Personal Work Skills vs. Firm-Wide MVPs
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Why HeavyRain Ignores Your Honeymoon Airbnb & News Drama — But Flags Sector Deals & Builds High-ROI Org Apps
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-4xl">
            A background agent must know <strong>what NOT to build</strong>. HeavyRain uses a two-stage filter: (1) an <strong>On-Device Relevance & Privacy Gate</strong> that purges personal life (fiancée texts, Airbnb) and ignores passive noise (reading news drama), and (2) an <strong>Org-Level Impact Stack-Ranker</strong> that separates lightweight individual helpers from firm-wide applications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenWorkspaceView}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-sky-300 border border-slate-700 cursor-pointer"
          >
            ← Back to Persona Workspace
          </button>
          <button
            onClick={onOpenExecView}
            className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-xs font-semibold text-rose-300 border border-rose-500/30 cursor-pointer"
          >
            View COO Org Registry →
          </button>
        </div>
      </div>

      {/* 4 SCENARIO SELECTOR CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {DISCERNMENT_SCENARIOS.map((sc, idx) => {
          const isSel = sc.id === selectedScenarioId;
          return (
            <button
              key={sc.id}
              onClick={() => setSelectedScenarioId(sc.id)}
              className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                isSel
                  ? 'bg-slate-800 border-amber-400 ring-2 ring-amber-400/30 shadow-xl'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sc.badgeColor}`}>
                    #{idx + 1} • {sc.badge}
                  </span>
                </div>
                <div className="text-sm font-bold text-white leading-snug">{sc.title}</div>
                <div className="text-[11px] text-slate-400 mt-1">{sc.appsUsed}</div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">User Rel: </span>
                  <strong className={sc.userRelevanceScore > 50 ? 'text-emerald-400' : 'text-rose-400'}>
                    {sc.userRelevanceScore}%
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400">Org Impact: </span>
                  <strong className={sc.orgImpactScore > 50 ? 'text-sky-400' : 'text-slate-400'}>
                    {sc.orgImpactScore}%
                  </strong>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* MAIN INTERACTIVE INSPECTOR: SIMULATED ACTIVITY (LEFT) + AGENT DISCERNMENT & STACK-RANKING ENGINE (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 6 Cols: What the User Is Doing on Their Computer */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between">
          <div>
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-white ml-2">{currentScenario.simulatedWindowHeader}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">{currentScenario.duration}</span>
            </div>

            <div className="p-5 space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Observed Desktop & Browser Stream:
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                {currentScenario.simulatedContent}
              </div>

              {/* Nuance Comparison Callout for News Reading */}
              {(currentScenario.id === 'news_drama' || currentScenario.id === 'news_deal_signal') && (
                <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-xs text-slate-200">
                  <strong className="text-sky-300">💡 Notice the Nuance on "Reading the News":</strong> HeavyRain doesn't just block or allow "Chrome News Sites". It watches <strong>downstream intent</strong>: scrolling drama with no output is ignored (8% relevance), whereas reading a sector funding article and copying the company into Affinity CRM is recognized as Deal Sourcing (78% relevance)!
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Click the 4 cards above to compare Personal vs. Noise vs. Work Signal</span>
            <span className="font-mono text-amber-300">{currentScenario.weeklyFreq}</span>
          </div>
        </div>

        {/* Right 6 Cols: HeavyRain Discernment Verdict & User-vs-Org Stack Ranker */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className={`p-4 rounded-xl bg-gradient-to-r ${currentScenario.verdictColor} border`}>
              <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">
                HeavyRain Discernment & Stack-Rank Verdict
              </div>
              <div className="text-base sm:text-lg font-extrabold mt-1">{currentScenario.agentVerdict}</div>
            </div>

            {/* Dual Meters: User Relevance vs. Org-Level Impact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-semibold">1. User Relevance Score</span>
                  <span className="font-bold text-white">{currentScenario.userRelevanceScore} / 100</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-500"
                    style={{ width: `${currentScenario.userRelevanceScore}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-400">
                  Measures repetitive friction, work entity links (CRM/Excel), & weekly hours saved for this user.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-semibold">2. Org-Wide Impact Score</span>
                  <span className="font-bold text-white">{currentScenario.orgImpactScore} / 100</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-400 to-rose-400 transition-all duration-500"
                    style={{ width: `${currentScenario.orgImpactScore}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-400">
                  Measures multi-persona overlap across teams, AUM/deal velocity impact, & firm-wide ROI.
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-white uppercase tracking-wider">Why the Agent Made This Call:</div>
              <p className="text-slate-300 leading-relaxed">{currentScenario.whyExplanation}</p>
              <div className="pt-2 border-t border-slate-800 text-amber-300 font-medium">
                <strong>Org Governance Routing:</strong> {currentScenario.orgAction}
              </div>
            </div>
          </div>

          {/* Complete Stack-Ranked Org Queue Summary Table */}
          <div className="pt-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Full Weekly Stack-Ranked Queue (User Relevance vs. Org Promotion Threshold):
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-2">Observed Activity</th>
                    <th className="p-2">User Score</th>
                    <th className="p-2">Org Score</th>
                    <th className="p-2">Stack-Rank Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  <tr className="bg-emerald-500/5">
                    <td className="p-2 font-semibold text-white">Pre/Post-Call Granola + Gemini Loop</td>
                    <td className="p-2 text-emerald-400 font-bold">98%</td>
                    <td className="p-2 text-emerald-400 font-bold">95% (2 Teams)</td>
                    <td className="p-2 text-emerald-300 font-bold">🚀 #1 Push Firm-Wide MVP</td>
                  </tr>
                  <tr className="bg-emerald-500/5">
                    <td className="p-2 font-semibold text-white">CIM PDF -> Excel & LP KPI Bridge</td>
                    <td className="p-2 text-emerald-400 font-bold">96%</td>
                    <td className="p-2 text-emerald-400 font-bold">91% (2 Teams)</td>
                    <td className="p-2 text-emerald-300 font-bold">🚀 #2 Push Firm-Wide MVP</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-slate-200">Morning News -> Flag Deal to CRM</td>
                    <td className="p-2 text-sky-400 font-bold">78%</td>
                    <td className="p-2 text-slate-400">34% (1 User)</td>
                    <td className="p-2 text-sky-300">👤 #3 Personal Skill Only</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-slate-400">Morning News -> Drama / Sports</td>
                    <td className="p-2 text-slate-500">8%</td>
                    <td className="p-2 text-slate-500">2%</td>
                    <td className="p-2 text-slate-500">🔇 Ignore (Noise)</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-rose-300/80">Fiancée Text -> Airbnb Honeymoon</td>
                    <td className="p-2 text-rose-400">0% (Personal)</td>
                    <td className="p-2 text-rose-400">0%</td>
                    <td className="p-2 text-rose-400 font-semibold">🔒 Purge Locally (Privacy)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
