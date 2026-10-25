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

  // Live Gemini 4 Argon Backend Playground state (for Dom's 1 PM walkthrough)
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [geminiResult, setGeminiResult] = useState(null);
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
    if (tabParam && ['split', 'workspace', 'agent', 'exec', 'dom'].includes(tabParam)) {
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
        }
        return next;
      });
    }, 2600);
    return () => clearInterval(timer);
  }, [isAutoPlaying, activePersona]);

  const emitObservationEvent = async (personaId, stepObj, stepIdx) => {
    const payload = {
      persona_id: personaId,
      app_name: stepObj.app,
      window_title: stepObj.action_title,
      action_type: stepObj.uses_ai_already ? 'DISCONNECTED_AI_SILO' : stepObj.is_human_glue ? 'HUMAN_GLUE_HANDOFF' : 'WORKFLOW_STEP',
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
    broadcastSync({ personaId, stepIndex: stepIdx });
  };

  const handleSelectPersona = (pid) => {
    setIsAutoPlaying(false);
    setActivePersonaId(pid);
    setActiveStepIndex(0);
    setMvpBetaMode(false);
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
    emitObservationEvent(activePersona.id, step, idx);
    // Also highlight linked message if present
    const linkedMsg = activePersona.workspace_messages?.find((m) => m.linked_step_id === step.id);
    if (linkedMsg) {
      setSelectedMessageId(linkedMsg.id);
    }
  };

  const handleToggleBetaMvp = (val) => {
    setMvpBetaMode(val);
    if (val) {
      setAgentRightTab('mvp_preview');
    }
    broadcastSync({ mvpBetaMode: val, agentRightTab: val ? 'mvp_preview' : 'observer' });
  };

  const openSecondChromeTab = () => {
    const url = `${window.location.origin}${window.location.pathname}?tab=agent&persona=${activePersonaId}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Trigger Dom's Backend Endpoints (Gemini 4 Argon)
  const triggerBackendEndpoint = async (endpointType) => {
    if (!activePersona) return;
    setGeminiLoading(true);
    setGeminiResult(null);
    try {
      let url = `${API_BASE}/synthesize-weekly`;
      let body = { persona_id: activePersona.id, use_live_gemini: true };
      if (endpointType === 'dedup') {
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
          user_feedback_or_telemetry: customTelemetryInput,
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
    } catch (err) {
      setGeminiResult({ endpoint: endpointType, error: String(err) });
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
                  Workflow Agent Infrastructure
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {backendHealth.model || 'gemini-4-argon'} Live
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {orgData?.org_name || 'Meridian Crest Capital'} • Passive Observation → Autonomous Weekly MVP → Beta Telemetry & Org Dedup
              </p>
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                viewMode === 'exec'
                  ? 'bg-rose-500 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              COO / Exec Org View
            </button>
            <button
              onClick={() => setViewMode('dom')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                viewMode === 'dom'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-emerald-300 hover:text-white hover:bg-slate-800 border border-emerald-500/20'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Dom's Backend Contract
            </button>
          </div>

          {/* Dual Chrome Tab Launcher */}
          <button
            onClick={openSecondChromeTab}
            title="Opens HeavyRain Agent Brain in a 2nd Chrome Tab synced live with this Persona Desktop!"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Pop Out 2nd Synced Tab
          </button>
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
              <span className="text-slate-400">Current AI Silos Used:</span>
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
        {viewMode === 'exec' ? (
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
            {/* LEFT PANE: SIMULATED PERSONA DESKTOP WORKSPACE */}
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
   LEFT PANE: SIMULATED INVESTOR DESKTOP WORKSPACE ("TAKE OVER THEIR COMPUTER")
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
}) {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Simulated macOS / Windows Desktop Titlebar */}
      <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-semibold text-slate-200 ml-1">
            {persona.name}'s Desktop Workspace — {persona.role}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            HeavyRain Daemon: Recording Subtasks
          </span>
        </div>

        {/* Toggle between "Week 1: Fragmented Reality" vs "Week 2: HeavyRain Beta MVP Active" */}
        <div className="flex items-center gap-2">
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
              Week 2: Test HeavyRain Beta MVP
            </button>
          </div>
        </div>
      </div>

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

      {/* IF WEEK 2 BETA MVP MODE IS TOGGLED ON: SHOW THE COHESIVE CUSTOM APP RUNNING INSIDE THEIR WORKSPACE */}
      {mvpBetaMode ? (
        <InteractiveMvpBetaWorkspace persona={persona} onExitBeta={() => onToggleBetaMvp(false)} />
      ) : (
        <>
          {/* SUBTASK TIMELINE STEPPER (Shows where AI is already used vs Human Glue!) */}
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Click Any Subtask Step to Inspect Desktop State & Stream Telemetry to HeavyRain:
              </span>
              <span className="text-[11px] text-amber-300">
                Notice: Uses AI in {aiSiloCount} places, yet still requires {humanGlueCount} manual copy-paste handoffs!
              </span>
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
            {/* Left Column: Persona's Live Communications & App Feeds (Outlook, Slack, Granola, Claude/Gemini) */}
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
                  <div className="mt-2 text-[11px] font-mono text-sky-300 bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
                    {currentStep.raw_payload_preview}
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
   INTERACTIVE WEEK 2 BETA MVP WORKSPACE (WHEN USER TESTS THE BUILT APP)
   ============================================================================ */
function InteractiveMvpBetaWorkspace({ persona, onExitBeta }) {
  const [testedAction, setTestedAction] = useState(null);

  return (
    <div className="p-5 bg-gradient-to-b from-slate-900 to-slate-950 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{persona.mvp.name}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                {persona.mvp.version}
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

      {/* Pitch from HeavyRain Agent */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-sky-400">
          Monday Morning Agent Pitch to {persona.name}:
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">"{persona.mvp.weekly_agent_pitch}"</p>
        <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
          <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-300 font-medium">
            Replaces {persona.mvp.replaces_steps.length} manual glue steps
          </span>
          <span>•</span>
          <span className="font-mono text-sky-300">{persona.mvp.architecture_summary}</span>
        </div>
      </div>

      {/* Interactive Simulated MVP Controls (User acts as Beta Tester!) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="text-xs font-bold uppercase text-white flex items-center justify-between">
            <span>1-Click Cohesive Workflow Execution</span>
            <span className="text-[11px] text-emerald-400">Zero Copy-Paste</span>
          </div>
          <p className="text-xs text-slate-400">
            Test the live MVP below. Notice how HeavyRain monitors which buttons {persona.name} uses or overrides during the beta week:
          </p>
          <div className="space-y-2">
            {persona.mvp.telemetry_items.map((item, i) => (
              <div
                key={i}
                onClick={() => setTestedAction(item)}
                className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-between cursor-pointer transition"
              >
                <div>
                  <div className="text-xs font-semibold text-white">{item.feature_name}</div>
                  <div className="text-[11px] text-slate-400">{item.observation_note}</div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase shrink-0 ${
                    item.status === 'adopted'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : item.status === 'ignored'
                      ? 'bg-slate-800 text-slate-400 line-through'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {item.status} ({item.usage_rate_pct}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
          <div>
            <div className="text-xs font-bold uppercase text-violet-300 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />
              How HeavyRain Auto-Mutated Week 1 → Week 2 Beta
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">{persona.mvp.week1_to_week2_diff_summary}</p>
          </div>

          {testedAction ? (
            <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/30">
              <div className="text-[11px] font-bold text-sky-300">
                Beta Telemetry Event Recorded for: {testedAction.feature_name}
              </div>
              <div className="text-xs text-slate-200 mt-1">
                Next Week Agent Mutation: <span className="text-emerald-300 font-medium">{testedAction.week2_agent_action}</span>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400">
              Click any MVP feature on the left to inspect how the agent adapts the code for next week's release.
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
              Preview Autonomous MVP Built for Next Week ({persona.mvp.name})
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
              Where Dom's Code Plugs In (4 Modular Layers)
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-sky-300">1. OS / Browser Collector → POST /api/observe</span>
                <p className="text-slate-400 mt-0.5">
                  Dom's background daemon streams active window titles, Outlook alerts, Granola transcripts, and clipboard transfers.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-violet-300">2. Subtask Graph & Dedup → POST /api/synthesize-weekly & /api/org-dedup</span>
                <p className="text-slate-400 mt-0.5">
                  Clusters repetitive loops where the user is acting as "human glue" between AI tools and checks if another investor already has a matching module.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-emerald-300">3. Weekly Beta Telemetry Loop → POST /api/telemetry-iterate</span>
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
                    {geminiResult.data.live_gemini_mutation_spec}
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
