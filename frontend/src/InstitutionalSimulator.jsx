import React, { useState, useEffect } from 'react';
import {
  CloudRain,
  Play,
  Pause,
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
  Layers,
  Activity,
  RefreshCw,
  Zap,
  Eye,
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
  Clipboard,
  Bell,
  EyeOff,
  Lock,
  Search,
  CheckCheck,
  Sliders,
  ExternalLink,
  X,
} from 'lucide-react';

/**
 * INSTITUTIONAL SAAS WORKSTATION & TRUE MULTI-TOOL DESKTOP SIMULATION
 * Built by WR1 (9b072985-bbe1-4a84-bc59-32fdc4ba8032), synced with QB1, RB1, LB1.
 *
 * Lets the audience & Dom literally step into each investor's shoes:
 * - Mode A ("WITHOUT HEAVYRAIN — Manual Multi-Tool Simulation"):
 *   Use the actual simulated desktop apps (Outlook, Affinity CRM, PDF Snipping Tool,
 *   Chrome + Personal Airbnb/iMessage Privacy Gate, Claude Skill, Granola Call Recorder,
 *   Excel IC Model Grid, Slack) and perform the copy-paste handoffs yourself (or Auto-Pilot).
 * - Mode B ("WITH HEAVYRAIN — Autonomous Week 2 Beta Micro-App"):
 *   Experience the unified institutional micro-app built by HeavyRain, test features,
 *   and watch passive beta telemetry mutate v1.0 -> v1.2 -> v1.3 live.
 */
export default function InstitutionalSimulator({
  persona,
  currentStep,
  activeStepIndex,
  onStepClick,
  mvpBetaMode,
  onToggleBetaMvp,
  isAutoPlaying,
  onToggleAutoPlay,
  totalFragMinutes,
  aiSiloCount,
  humanGlueCount,
  liveEvents,
  onSwitchPersona,
  onOpenDomTab,
  onOpenDiscernmentTab,
  onEmitCustomTelemetry,
  onTriggerLiveMutation,
}) {
  // Interactive state inside the simulated tools so the user feels like they are really using the apps
  const [clipboardText, setClipboardText] = useState(
    'Affinity CRM: VeloceAI ($8.4M ARR, +140% YoY) • Last met Liam Chen 4 mos ago'
  );
  const [clipboardCopiedAtStep, setClipboardCopiedAtStep] = useState(null);
  const [pastedSteps, setPastedSteps] = useState({});
  const [browserSubTab, setBrowserSubTab] = useState('work_signal'); // 'work_signal' | 'personal_airbnb' | 'news_drama'
  const [showMondayIntercept, setShowMondayIntercept] = useState(false);
  const [showOrgDnaDrawer, setShowOrgDnaDrawer] = useState(false);
  const [rightTelemetryTab, setRightTelemetryTab] = useState('dag'); // 'dag' | 'stream' | 'privacy' | 'dedup'

  // Reset interactive tool state when persona changes
  useEffect(() => {
    setPastedSteps({});
    setBrowserSubTab('work_signal');
    const s0 = persona?.fragmented_workflow?.[0];
    if (s0) {
      setClipboardText(s0.raw_payload_preview || s0.detail);
    }
  }, [persona?.id]);

  // Update clipboard preview when active step changes
  useEffect(() => {
    if (currentStep) {
      setClipboardText(currentStep.raw_payload_preview || currentStep.detail);
    }
  }, [activeStepIndex, currentStep]);

  const steps = persona.fragmented_workflow || [];
  const nextStepIdx = (activeStepIndex + 1) % steps.length;
  const nextStep = steps[nextStepIdx];

  // Calculate cumulative "Human Glue Tax" up to current step
  const elapsedMinutes = steps
    .slice(0, activeStepIndex + 1)
    .reduce((acc, s) => acc + s.duration_mins, 0);
  const elapsedGlueSteps = steps
    .slice(0, activeStepIndex + 1)
    .filter((s) => s.is_human_glue).length;
  const elapsedAiSilos = steps
    .slice(0, activeStepIndex + 1)
    .filter((s) => s.uses_ai_already).length;
  const cumulativeCharsCopied = (activeStepIndex + 1) * 3420;

  // Execute the primary interactive action in the current simulated app window and advance
  const handleInteractiveToolAction = (actionLabel, customSnippet) => {
    setClipboardCopiedAtStep(activeStepIndex);
    setPastedSteps((prev) => ({ ...prev, [currentStep.id]: true }));
    if (customSnippet) {
      setClipboardText(customSnippet);
    }
    if (onEmitCustomTelemetry) {
      onEmitCustomTelemetry({
        persona_id: persona.id,
        app_name: currentStep.app,
        window_title: `${actionLabel} (${currentStep.action_title})`,
        action_type: currentStep.uses_ai_already
          ? 'DISCONNECTED_AI_SILO'
          : 'HUMAN_GLUE_HANDOFF',
        content_snippet: customSnippet || currentStep.raw_payload_preview || currentStep.detail,
        used_ai_tool: Boolean(currentStep.uses_ai_already),
      });
    }
    // Advance to next tool after short tactile beat
    setTimeout(() => {
      onStepClick(nextStep, nextStepIdx);
    }, 320);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 select-none">
      {/* =====================================================================
         LEFT 8 COLS: THE LIVE INTERACTIVE WORKSTATION OS SIMULATOR
         ===================================================================== */}
      <div className="lg:col-span-8 bg-[#080c14] border border-slate-800/90 rounded-xl overflow-hidden shadow-2xl flex flex-col min-h-[680px]">
        {/* 1. INSTITUTIONAL WORKSTATION TOP CHROME BAR */}
        <div className="bg-[#0b111e] px-3.5 py-2 border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="h-3.5 w-[1px] bg-slate-800" />
            <span className="font-mono text-[11px] font-bold tracking-wider uppercase text-slate-200">
              WORKSTATION // {persona.name.toUpperCase()} ({persona.role})
            </span>
            <span className="hidden md:inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded bg-slate-900 text-emerald-400 border border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              HEAVYRAIN_DAEMON_v2.4: OBSERVING
            </span>
          </div>

          {/* Mode Toggle: Manual Multi-Tool Simulation vs. HeavyRain Cohesive Micro-App */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowMondayIntercept((v) => !v)}
              className="px-2.5 py-1 rounded bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 font-mono text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition"
            >
              <Bell className="w-3 h-3 text-sky-400" />
              Monday 8AM Intercept
            </button>

            <div className="flex items-center bg-[#060911] p-0.5 rounded-lg border border-slate-800 font-mono text-[11px]">
              <button
                onClick={() => onToggleBetaMvp(false)}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  !mvpBetaMode
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                1. WITHOUT HEAVYRAIN (7 Apps)
              </button>
              <button
                onClick={() => onToggleBetaMvp(true)}
                className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 cursor-pointer ${
                  mvpBetaMode
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                    : 'text-emerald-400 hover:bg-slate-900'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                2. WITH HEAVYRAIN ({persona.mvp.version})
              </button>
            </div>
          </div>
        </div>

        {/* 2. LIVE HUMAN-GLUE TAX TELEMETRY RIBBON (Tabular Monospace Institutional Metrics) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-slate-800/80 border-b border-slate-800/90 bg-[#0a0f1a] font-mono">
          <div className="px-3 py-2">
            <div className="text-[10px] text-slate-500 uppercase">Workflow Mode</div>
            <div className={`text-xs font-bold mt-0.5 ${mvpBetaMode ? 'text-emerald-400' : 'text-rose-400'}`}>
              {mvpBetaMode ? 'UNIFIED MICRO-APP' : `STEP ${activeStepIndex + 1} OF ${steps.length} (MANUAL)`}
            </div>
          </div>
          <div className="px-3 py-2">
            <div className="text-[10px] text-slate-500 uppercase">Time Elapsed / Run</div>
            <div className="text-xs font-bold text-white tabular-nums mt-0.5">
              {mvpBetaMode ? (
                <span className="text-emerald-400">01m 30s (-96%)</span>
              ) : (
                <span>
                  {elapsedMinutes.toFixed(1)}m <span className="text-slate-500">/ {totalFragMinutes}m</span>
                </span>
              )}
            </div>
          </div>
          <div className="px-3 py-2">
            <div className="text-[10px] text-slate-500 uppercase">Disconnected AI Silos</div>
            <div className="text-xs font-bold text-violet-300 tabular-nums mt-0.5">
              {mvpBetaMode ? '0 Silos (Orchestrated)' : `${elapsedAiSilos} / ${aiSiloCount} AI Tabs Used`}
            </div>
          </div>
          <div className="px-3 py-2">
            <div className="text-[10px] text-slate-500 uppercase">Human Copy-Paste Glue</div>
            <div className="text-xs font-bold text-amber-300 tabular-nums mt-0.5">
              {mvpBetaMode ? '0 Manual Handoffs' : `${elapsedGlueSteps} Handoffs (${cumulativeCharsCopied.toLocaleString()} chars)`}
            </div>
          </div>
          <div className="px-3 py-2 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Privacy & Signal Gate</div>
              <div className="text-[11px] font-bold text-sky-400 mt-0.5">98% SOC2 • Local Filter</div>
            </div>
            <button
              onClick={onOpenDiscernmentTab}
              title="Inspect how HeavyRain ignores personal Airbnb/iMessage & news drama"
              className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* OPTIONAL OVERLAY: MONDAY 8:00 AM AGENT INTERCEPT DRAWER */}
        {showMondayIntercept && (
          <div className="p-4 bg-[#0d1526] border-b border-sky-500/40 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300">
                  <CloudRain className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase text-sky-400 font-bold">
                    HEAVYRAIN AMBIENT OS INTERCEPT • MONDAY 08:00:00 EST
                  </div>
                  <div className="text-sm font-bold text-white">
                    {persona.mvp.name} ({persona.mvp.version}) — Compiled from Last Week's Subtask Graph
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowMondayIntercept(false)}
                className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed bg-[#070b12] p-3 rounded-lg border border-slate-800 font-mono">
              "{persona.mvp.weekly_agent_pitch}"
            </p>
            <div className="flex items-center justify-between pt-1">
              <span className="font-mono text-[11px] text-slate-400">
                Replaces {persona.mvp.replaces_steps.length} manual steps • Saves {persona.hours_saved_by_heavyrain} hrs/wk
              </span>
              <button
                onClick={() => {
                  setShowMondayIntercept(false);
                  onToggleBetaMvp(true);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                MOUNT WEEK 2 BETA MICRO-APP IN WORKSTATION →
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
           MAIN WORKSTATION VIEWPORT:
           EITHER (A) WITHOUT HEAVYRAIN: INTERACTIVE MULTI-TOOL OS SIMULATOR
           OR     (B) WITH HEAVYRAIN: COHESIVE INSTITUTIONAL MICRO-APP
           =================================================================== */}
        {mvpBetaMode ? (
          <CohesiveInstitutionalMicroApp
            persona={persona}
            onExitBeta={() => onToggleBetaMvp(false)}
            onEmitCustomTelemetry={onEmitCustomTelemetry}
            onTriggerLiveMutation={onTriggerLiveMutation}
            onSwitchPersona={onSwitchPersona}
          />
        ) : (
          <div className="flex-1 flex flex-col justify-between bg-[#060a10]">
            {/* STEP PROGRESS & INTERACTIVE MISSION CONTROLLER BAR */}
            <div className="px-4 py-2.5 bg-[#0b101b] border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                {steps.map((step, idx) => {
                  const isActive = idx === activeStepIndex;
                  const isDone = idx < activeStepIndex || pastedSteps[step.id];
                  return (
                    <React.Fragment key={step.id}>
                      <button
                        onClick={() => onStepClick(step, idx)}
                        className={`px-2.5 py-1 rounded font-mono text-[11px] flex items-center gap-1.5 transition cursor-pointer shrink-0 border ${
                          isActive
                            ? 'bg-sky-500/20 text-sky-200 border-sky-400 font-bold shadow-sm'
                            : isDone
                            ? 'bg-slate-900/90 text-emerald-300 border-emerald-500/30'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-[10px] opacity-75">{step.step_number}.</span>
                        <span>{step.app}</span>
                        {step.uses_ai_already && (
                          <span className="px-1 py-0.2 rounded bg-violet-500/30 text-violet-200 text-[9px]">
                            AI
                          </span>
                        )}
                      </button>
                      {idx < steps.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={onToggleAutoPlay}
                  className={`px-2.5 py-1 rounded font-mono text-[11px] font-semibold flex items-center gap-1 border cursor-pointer transition ${
                    isAutoPlaying
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {isAutoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  {isAutoPlaying ? 'PAUSE AUTO-SIM' : 'AUTO-PLAY 7 APPS'}
                </button>
              </div>
            </div>

            {/* ACTIVE SIMULATED DESKTOP APPLICATION WINDOW (LOOKS & BEHAVES LIKE THE REAL TOOL!) */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <SimulatedDesktopToolWindow
                persona={persona}
                step={currentStep}
                stepIndex={activeStepIndex}
                nextStep={nextStep}
                clipboardText={clipboardText}
                browserSubTab={browserSubTab}
                setBrowserSubTab={setBrowserSubTab}
                onExecuteAction={handleInteractiveToolAction}
                onOpenDiscernmentTab={onOpenDiscernmentTab}
                onSwitchPersona={onSwitchPersona}
              />
            </div>

            {/* BOTTOM DESKTOP OS TASKBAR DOCK & LIVE CLIPBOARD BUFFER */}
            <div className="px-4 py-2 bg-[#0b111e] border-t border-slate-800/90 flex flex-wrap items-center justify-between gap-3">
              {/* App Dock Icons */}
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] uppercase text-slate-500 mr-1">OS DOCK:</span>
                {steps.map((s, idx) => {
                  const active = idx === activeStepIndex;
                  return (
                    <button
                      key={s.id}
                      onClick={() => onStepClick(s, idx)}
                      title={`Switch to ${s.app}: ${s.action_title}`}
                      className={`px-2 py-1 rounded text-[11px] font-mono flex items-center gap-1 cursor-pointer transition ${
                        active
                          ? 'bg-sky-500 text-slate-950 font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      <span>{s.app.split(' ')[0]}</span>
                      {s.is_human_glue && !active && (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Live OS Clipboard Buffer Inspector */}
              <div className="flex items-center gap-2 bg-[#060911] px-3 py-1 rounded border border-slate-800 font-mono text-[11px] max-w-md">
                <Clipboard className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-slate-500 shrink-0">CLIPBOARD:</span>
                <span className="text-amber-300 truncate">{clipboardText}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================================
         RIGHT 4 COLS: INSTITUTIONAL HEAVYRAIN TELEMETRY & GOVERNANCE RAIL
         ===================================================================== */}
      <div className="lg:col-span-4 bg-[#080c14] border border-slate-800/90 rounded-xl overflow-hidden shadow-2xl flex flex-col min-h-[680px]">
        {/* Institutional Right Rail Header */}
        <div className="bg-[#0b111e] px-3.5 py-2.5 border-b border-slate-800/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-sky-400">
              HEAVYRAIN // CONTROL PLANE
            </span>
          </div>
          <button
            onClick={onOpenDomTab}
            className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 cursor-pointer"
          >
            DOM API CONTRACT →
          </button>
        </div>

        {/* 4 Precision Control Plane Tabs */}
        <div className="grid grid-cols-4 border-b border-slate-800/90 bg-[#0a0f1a] font-mono text-[11px]">
          {[
            { id: 'dag', label: '1. DAG Graph' },
            { id: 'privacy', label: '2. Signal/Noise' },
            { id: 'dedup', label: '3. Org DNA' },
            { id: 'stream', label: '4. OS Stream' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setRightTelemetryTab(t.id)}
              className={`py-2 px-1 font-semibold border-b-2 transition cursor-pointer ${
                rightTelemetryTab === t.id
                  ? 'border-sky-400 text-sky-300 bg-sky-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Right Rail Body */}
        <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3 overflow-y-auto">
          {rightTelemetryTab === 'dag' && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-[#0b111e] border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="text-sky-400 font-bold uppercase">SUBTASK GRAPH SYNTHESIS</span>
                  <span className="text-rose-400 font-bold">{humanGlueCount} HUMAN-GLUE NODES</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {persona.name} already invokes <strong>{persona.current_ai_tools_used.join(', ')}</strong>, but acts as manual copy-paste middleware across {steps.length} desktop windows.
                </p>
              </div>

              {/* DAG Nodes List */}
              <div className="space-y-1.5 font-mono">
                {steps.map((s, idx) => {
                  const isCurr = idx === activeStepIndex && !mvpBetaMode;
                  const isReplaced = persona.mvp.replaces_steps.includes(s.id);
                  return (
                    <div
                      key={s.id}
                      onClick={() => {
                        if (mvpBetaMode) onToggleBetaMvp(false);
                        onStepClick(s, idx);
                      }}
                      className={`p-2 rounded border text-[11px] flex items-center justify-between cursor-pointer transition ${
                        isCurr
                          ? 'bg-sky-500/15 border-sky-400 text-white'
                          : 'bg-[#0b101b] border-slate-800/80 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-[10px] text-slate-500">0{s.step_number}</span>
                        <span className="truncate font-semibold">{s.app}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {s.uses_ai_already && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                            AI_SILO
                          </span>
                        )}
                        {s.is_human_glue && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            GLUE
                          </span>
                        )}
                        {isReplaced && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                            → AUTO
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => onToggleBetaMvp(!mvpBetaMode)}
                className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                {mvpBetaMode
                  ? 'RETURN TO 7-APP MANUAL SIMULATION'
                  : `COMPILE & RUN ${persona.mvp.name.toUpperCase()} →`}
              </button>
            </div>
          )}

          {rightTelemetryTab === 'privacy' && (
            <div className="space-y-3 font-mono">
              <div className="p-3 rounded-lg bg-[#0b111e] border border-amber-500/30 space-y-1">
                <div className="text-[10px] font-bold text-amber-300 uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  ON-DEVICE PRIVACY & RELEVANCE STACK-RANKER
                </div>
                <p className="text-[11px] text-slate-300 font-sans">
                  HeavyRain discerns personal life & passive news reading from high-ROI firm workflows before any data leaves the device:
                </p>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="p-2.5 rounded-lg bg-rose-950/25 border border-rose-500/30">
                  <div className="flex justify-between font-bold text-rose-300">
                    <span>1. Fiancée Text + Airbnb Honeymoon</span>
                    <span>0% WORK</span>
                  </div>
                  <div className="text-[10px] text-slate-300 font-sans mt-1">
                    <strong>Verdict: 🔒 PURGED ON DEVICE.</strong> Personal iMessage & Positano Airbnb tabs are dropped in local RAM. Never logged; zero tool built.
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="flex justify-between font-bold text-slate-300">
                    <span>2. Morning News: Tech Drama / Sports</span>
                    <span>8% WORK</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-sans mt-1">
                    <strong>Verdict: 🔇 IGNORED NOISE.</strong> Passive reading with zero downstream CRM/Excel action is filtered out.
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-sky-950/30 border border-sky-500/30">
                  <div className="flex justify-between font-bold text-sky-300">
                    <span>3. News: Sector Deal → Affinity CRM</span>
                    <span>78% USER / 34% ORG</span>
                  </div>
                  <div className="text-[10px] text-slate-300 font-sans mt-1">
                    <strong>Verdict: 👤 LOCAL SKILL ONLY.</strong> Builds a 1-click Deal Clipper for {persona.name.split(' ')[0]}, but doesn't push firm-wide.
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30">
                  <div className="flex justify-between font-bold text-emerald-300">
                    <span>4. {persona.mvp.name}</span>
                    <span>98% USER / 95% ORG</span>
                  </div>
                  <div className="text-[10px] text-slate-300 font-sans mt-1">
                    <strong>Verdict: 🏢 FIRM-WIDE MVP.</strong> High weekly repetition + cross-team overlap → Promoted to governed Meridian app.
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenDiscernmentTab}
                className="w-full py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold cursor-pointer"
              >
                Open Full Signal vs. Noise Simulator →
              </button>
            </div>
          )}

          {rightTelemetryTab === 'dedup' && (
            <div className="space-y-3">
              {persona.dedup_match ? (
                <>
                  <div className="p-3 rounded-lg bg-violet-950/30 border border-violet-500/40 space-y-1.5">
                    <div className="flex items-center justify-between font-mono text-[10px] text-violet-300 font-bold">
                      <span>CROSS-ORG DNA MATCH</span>
                      <span>{persona.dedup_match.overlap_score_pct}% OVERLAP</span>
                    </div>
                    <div className="text-xs font-bold text-white">
                      {persona.name} ↔ {persona.dedup_match.target_persona_name}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {persona.dedup_match.recommendation}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0b101b] border border-slate-800 space-y-2 text-xs">
                    <div className="font-mono text-[10px] uppercase text-slate-400 font-bold">
                      SHARED FIRM CORE MODULES (REUSED):
                    </div>
                    {persona.dedup_match.shared_subtasks.map((st, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-violet-200 font-mono text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{st}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-slate-800 text-[11px] text-sky-300">
                      <strong>Custom Persona Delta:</strong> {persona.dedup_match.custom_delta_needed}
                    </div>
                  </div>

                  <button
                    onClick={() => onSwitchPersona(persona.dedup_match.target_persona_id)}
                    className="w-full py-2 rounded-lg bg-violet-500 hover:bg-violet-400 text-white font-mono font-bold text-xs cursor-pointer"
                  >
                    SWITCH TO {persona.dedup_match.target_persona_name.toUpperCase()} WORKSTATION →
                  </button>
                </>
              ) : (
                <div className="p-3 rounded-lg bg-[#0b101b] border border-slate-800 text-xs text-slate-300">
                  Claire Sterling oversees all firm-wide deduplication consolidations across Deal Sourcing, Discovery, Diligence, and IR.
                </div>
              )}
            </div>
          )}

          {rightTelemetryTab === 'stream' && (
            <div className="space-y-2 font-mono">
              <div className="text-[10px] uppercase text-slate-400 font-bold">
                LIVE /API/OBSERVE KERNEL STREAM
              </div>
              <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
                {liveEvents.slice(0, 10).map((ev) => (
                  <div
                    key={ev.id}
                    className="p-2 rounded bg-[#0b101b] border border-slate-800/90 text-[10px] space-y-0.5"
                  >
                    <div className="flex justify-between text-sky-400">
                      <span className="font-bold">[{ev.app_name}]</span>
                      <span className="text-slate-500">{ev.timestamp}</span>
                    </div>
                    <div className="text-slate-200 truncate">{ev.window_title}</div>
                    <div className="text-slate-500 truncate">{ev.content_snippet}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Always-Visible Bottom Telemetry Footer */}
          <div className="pt-2.5 border-t border-slate-800/90 font-mono text-[10px] text-slate-400 flex items-center justify-between">
            <span>LATENCY: 12ms • GEMINI-4-ARGON</span>
            <span className="text-emerald-400">● ENCLAVE SECURE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   SIMULATED DESKTOP APPLICATION WINDOW (AUTHENTIC TOOL-BY-TOOL EXPERIENCE)
   Renders the real-feeling UI for Outlook, Affinity CRM, Chrome/LinkedIn/Airbnb,
   Claude/Gemini Terminal, Granola Live Audio Recorder, Excel Grid, and Slack!
   ============================================================================ */
function SimulatedDesktopToolWindow({
  persona,
  step,
  stepIndex,
  nextStep,
  clipboardText,
  browserSubTab,
  setBrowserSubTab,
  onExecuteAction,
  onOpenDiscernmentTab,
  onSwitchPersona,
}) {
  if (!step) return null;
  const appLower = step.app.toLowerCase();

  // Determine which authentic simulated desktop app surface to render
  const isCalendarOrMail = appLower.includes('outlook') || appLower.includes('inbox') || appLower.includes('calendar');
  const isCrmOrVdr = appLower.includes('affinity') || appLower.includes('vdr') || appLower.includes('notion');
  const isSnipping = appLower.includes('snipping');
  const isBrowserOrSearch = appLower.includes('google') || appLower.includes('linkedin') || appLower.includes('guidepoint');
  const isGranolaCall = appLower.includes('granola') || appLower.includes('zoom');
  const isAiChat = appLower.includes('claude') || appLower.includes('gemini');
  const isExcel = appLower.includes('excel') || appLower.includes('ddq');
  const isSlack = appLower.includes('slack');

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#0b111e] border border-slate-700/80 rounded-xl overflow-hidden shadow-xl">
      {/* Simulated Application Window Titlebar */}
      <div className="px-3.5 py-2 bg-[#111827] border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 font-mono text-[10px] font-bold uppercase">
            WINDOW #{step.step_number}: {step.app}
          </span>
          <span className="text-xs font-bold text-white">{step.action_title}</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px]">
          {step.uses_ai_already && (
            <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/40">
              ● DISCONNECTED AI SILO
            </span>
          )}
          {step.is_human_glue && (
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
              ⚠ MANUAL COPY-PASTE REQUIRED ({step.duration_mins}m)
            </span>
          )}
        </div>
      </div>

      {/* Simulated Application Interior Canvas */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        {/* CASE 1: OUTLOOK CALENDAR / INBOX CLIENT */}
        {isCalendarOrMail && (
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <div className="font-mono text-[10px] uppercase text-rose-300 font-bold">
                    OUTLOOK DESKTOP ALERT • T-15:00 COUNTDOWN
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white">
                    {persona.workspace_messages?.[0]?.subject_or_room || step.action_title}
                  </div>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-rose-300 bg-rose-950/60 px-2.5 py-1 rounded border border-rose-500/30">
                00:14:52
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-5 bg-[#070b12] border border-slate-800 rounded-lg p-2.5 space-y-1.5">
                <div className="font-mono text-[10px] text-slate-500 uppercase">INBOX / CALENDAR THREADS</div>
                {persona.workspace_messages.map((m) => (
                  <div
                    key={m.id}
                    className="p-2 rounded bg-slate-900/90 border border-slate-800 text-xs space-y-0.5"
                  >
                    <div className="flex justify-between font-mono text-[10px] text-sky-400">
                      <span>{m.sender}</span>
                      <span>{m.timestamp}</span>
                    </div>
                    <div className="font-semibold text-white truncate">{m.subject_or_room}</div>
                    <div className="text-[11px] text-slate-400 truncate">{m.preview}</div>
                  </div>
                ))}
              </div>
              <div className="md:col-span-7 bg-[#070b12] border border-slate-800 rounded-lg p-3 flex flex-col justify-between font-mono text-xs">
                <div className="space-y-2">
                  <div className="text-[10px] text-slate-400 border-b border-slate-800 pb-1.5">
                    FROM: {persona.workspace_messages?.[0]?.sender} | SUBJECT: {persona.workspace_messages?.[0]?.subject_or_room}
                  </div>
                  <div className="text-slate-200 whitespace-pre-line leading-relaxed font-sans text-xs">
                    {persona.workspace_messages?.[0]?.full_body}
                  </div>
                </div>
                <div className="mt-3 p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-amber-300">
                  ⚡ Friction: {step.friction_note}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CASE 2: AFFINITY CRM / INTRALINKS VDR / NOTION */}
        {isCrmOrVdr && !isCalendarOrMail && (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-[#070b12] px-3 py-2 rounded-lg border border-slate-800 font-mono text-xs">
              <span className="text-sky-400 font-bold">
                {persona.id === 'devon'
                  ? 'INTRALINKS VDR // Project_Velocity_CIM_2026.pdf (88 Pages)'
                  : 'AFFINITY CRM // MERIDIAN DEAL PIPELINE DATABASE'}
              </span>
              <span className="text-slate-400">QUERY: "VeloceAI / Supply-Chain"</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 font-mono text-xs">
              <div className="p-3 rounded-lg bg-[#070b12] border border-slate-800">
                <div className="text-[10px] text-slate-500">ENTITY / DEAL RECORD</div>
                <div className="text-sm font-bold text-white mt-1">VeloceAI Inc. (Series B)</div>
                <div className="text-[11px] text-emerald-400 mt-0.5">$8.4M ARR (+140% YoY)</div>
              </div>
              <div className="p-3 rounded-lg bg-[#070b12] border border-slate-800">
                <div className="text-[10px] text-slate-500">PRIOR TOUCHPOINT LOG</div>
                <div className="text-xs text-slate-200 mt-1">Met CEO Liam Chen 4 mos ago</div>
                <div className="text-[11px] text-amber-300 mt-0.5">Notes scattered across 3 emails</div>
              </div>
              <div className="p-3 rounded-lg bg-[#070b12] border border-rose-500/30">
                <div className="text-[10px] text-rose-400">CRM SYNC STATUS</div>
                <div className="text-xs font-bold text-rose-300 mt-1">6 Fields Out-of-Date</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Requires manual copy-paste</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#070b12] border border-slate-800 font-mono text-xs text-slate-300">
              <div className="text-[10px] text-sky-400 uppercase mb-1">RAW DATA PAYLOAD TO COPY:</div>
              {step.raw_payload_preview} — "{step.detail}"
            </div>
          </div>
        )}

        {/* CASE 3: WINDOWS SNIPPING TOOL (DEVON'S PDF SCREENSHOT DUCT-TAPE) */}
        {isSnipping && (
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-amber-500/10 border border-dashed border-amber-400 flex items-center justify-between font-mono text-xs">
              <span className="text-amber-300 font-bold flex items-center gap-2">
                <Scissors className="w-4 h-4" />
                WIN+SHIFT+S // SNIPPING PDF PAGE 47: ADJUSTED EBITDA BRIDGE TABLE
              </span>
              <span className="text-rose-300">9 MANUAL SCREENSHOTS PER CIM</span>
            </div>
            <div className="p-3.5 rounded-lg bg-[#070b12] border-2 border-dashed border-sky-400/60 font-mono text-xs space-y-1.5">
              <div className="text-[10px] text-sky-400 uppercase">
                [SELECTED PDF IMAGE REGION — NON-SELECTABLE WATERMARKED TABLE]
              </div>
              <div className="grid grid-cols-4 text-slate-300 border-b border-slate-800 pb-1 font-bold">
                <span>Line Item (PDF p.47)</span>
                <span>FY24A</span>
                <span>FY25A</span>
                <span>FY26E (CIM)</span>
              </div>
              <div className="grid grid-cols-4 text-slate-200">
                <span>GAAP Operating Income</span>
                <span>($1.4M)</span>
                <span>$0.3M</span>
                <span>$1.24M</span>
              </div>
              <div className="grid grid-cols-4 text-amber-300">
                <span>(+) Footnote 4: Cap Software R&D</span>
                <span>+$0.4M</span>
                <span>+$0.7M</span>
                <span>+$1.12M [13.3% Rev!]</span>
              </div>
            </div>
          </div>
        )}

        {/* CASE 4: CHROME BROWSER (WORK SIGNAL TABS + PERSONAL AIRBNB HONEYMOON / DRAMA NOISE TABS!) */}
        {isBrowserOrSearch && (
          <div className="space-y-3">
            {/* Realistic Browser Tab Bar with Personal Airbnb & News Drama Tabs */}
            <div className="flex items-center gap-1.5 bg-[#070b12] p-1.5 rounded-lg border border-slate-800 overflow-x-auto font-mono text-[11px]">
              <button
                onClick={() => setBrowserSubTab('work_signal')}
                className={`px-2.5 py-1 rounded flex items-center gap-1.5 cursor-pointer ${
                  browserSubTab === 'work_signal'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Globe className="w-3 h-3" />
                {persona.id === 'elena'
                  ? 'LinkedIn / Guidepoint (24 Exec Bios)'
                  : 'Google News: VeloceAI Series B'}
              </button>
              <button
                onClick={() => setBrowserSubTab('personal_airbnb')}
                className={`px-2.5 py-1 rounded flex items-center gap-1.5 cursor-pointer ${
                  browserSubTab === 'personal_airbnb'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                    : 'text-rose-300/70 hover:text-rose-200 border border-rose-500/20'
                }`}
              >
                <Lock className="w-3 h-3" />
                💬 iMessage + Airbnb: Positano Honeymoon (Test Privacy Gate)
              </button>
              <button
                onClick={() => setBrowserSubTab('news_drama')}
                className={`px-2.5 py-1 rounded flex items-center gap-1.5 cursor-pointer ${
                  browserSubTab === 'news_drama'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                    : 'text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <EyeOff className="w-3 h-3" />
                📰 WSJ Celebrity/Tech Drama (Test Noise Filter)
              </button>
            </div>

            {browserSubTab === 'work_signal' && (
              <div className="p-3.5 rounded-lg bg-[#070b12] border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between font-mono text-[10px] text-emerald-400">
                  <span>⚡ HEAVYRAIN CLASSIFIER: WORK_SIGNAL (94% RELEVANCE)</span>
                  <span>ACTION: EXTRACT TO DEAL BRIEF</span>
                </div>
                <div className="font-bold text-white">{step.action_title}</div>
                <p className="text-slate-300">{step.detail}</p>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-sky-300">
                  {step.raw_payload_preview}
                </div>
              </div>
            )}

            {browserSubTab === 'personal_airbnb' && (
              <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-500/40 space-y-2 text-xs">
                <div className="flex items-center justify-between font-mono text-[10px] text-rose-300 font-bold">
                  <span>🔒 HEAVYRAIN ON-DEVICE PRIVACY GATE: PERSONAL LIFE DETECTED (0% WORK RELEVANCE)</span>
                  <span>STATUS: PURGED IN LOCAL RAM</span>
                </div>
                <div className="font-bold text-white">
                  iMessage from Fiancée: "Babe!! Look at these 3 cliffside Airbnbs in Positano for our October honeymoon 😍"
                </div>
                <p className="text-slate-300">
                  User browses Airbnb.com rates ($680/nt) & Delta flights for 14 mins. HeavyRain's local classifier sees zero connection to Meridian Crest entities or CRM, immediately drops the telemetry on-device, and <strong>never builds a tool or reports to the org</strong>.
                </p>
              </div>
            )}

            {browserSubTab === 'news_drama' && (
              <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-700 space-y-2 text-xs">
                <div className="flex items-center justify-between font-mono text-[10px] text-amber-300 font-bold">
                  <span>🔇 HEAVYRAIN RELEVANCE RANKER: PASSIVE DRAMA / NOISE (8% RELEVANCE)</span>
                  <span>STATUS: IGNORED BELOW THRESHOLD</span>
                </div>
                <div className="font-bold text-white">
                  Morning News Browsing: Silicon Valley CEO Feud & NBA Box Scores (18 mins)
                </div>
                <p className="text-slate-300">
                  Because the investor reads passively with zero downstream copy-paste into Affinity CRM or Excel, HeavyRain classifies this as non-actionable noise—whereas reading a Supply-Chain AI funding article and copying it into CRM triggers a Deal Clipper skill!
                </p>
              </div>
            )}
          </div>
        )}

        {/* CASE 5: CLAUDE 3.7 SKILL / GEMINI 4 PROMPT TERMINAL (DISCONNECTED AI SILO) */}
        {isAiChat && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-[#070b12] border border-violet-500/40 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-violet-300 font-bold">
                <span>MANUAL PROMPT INPUT (REQUIRES CTRL+V)</span>
                <span>3,420 TOKENS</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[11px] leading-relaxed">
                {persona.workspace_messages?.find((m) => m.channel === 'claude' || m.channel === 'gemini')
                  ?.full_body || step.detail}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#070b12] border border-slate-800 flex flex-col justify-between space-y-2">
              <div>
                <div className="text-[10px] text-emerald-400 font-bold uppercase">
                  AI SILO OUTPUT (TRAPPED IN BROWSER TAB)
                </div>
                <p className="text-[11px] text-slate-300 font-sans mt-1.5 leading-relaxed">
                  {step.friction_note} Even though the AI output is good, {persona.name.split(' ')[0]} now has to manually copy-paste it into the next app!
                </p>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[10px] text-sky-300">
                {step.raw_payload_preview}
              </div>
            </div>
          </div>
        )}

        {/* CASE 6: ZOOM + GRANOLA LIVE CALL RECORDER */}
        {isGranolaCall && (
          <div className="p-3.5 rounded-lg bg-[#070b12] border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-emerald-400 font-bold flex items-center gap-2">
                <Mic className="w-4 h-4 animate-pulse" />
                GRANOLA.EXE + ZOOM // LIVE CALL RECORDING (44m 12s)
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                6,420 WORDS CAPTURED
              </span>
            </div>
            {/* Animated Audio Bars */}
            <div className="flex items-center gap-1 h-8 px-3 bg-slate-900 rounded border border-slate-800">
              {[40, 85, 60, 95, 45, 75, 90, 50, 80, 65, 95, 55, 70, 85, 45, 90, 60, 75].map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}%` }}
                  className="flex-1 bg-gradient-to-t from-sky-500 to-emerald-400 rounded-sm opacity-80 animate-pulse"
                />
              ))}
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-200 space-y-1">
              <div className="text-sky-400 font-bold">LIVE TRANSCRIPT STREAM:</div>
              <div>"We crossed $8.4M ARR up 140% YoY; main bottleneck is 60-day enterprise security review..."</div>
              <div className="text-rose-300 text-[10px] pt-1">
                ⚠ Silo Bottleneck: When call ends, transcript sits in Granola until manually exported to Gemini & CRM!
              </div>
            </div>
          </div>
        )}

        {/* CASE 7: MICROSOFT EXCEL MASTER IC MODEL / THESIS MATRIX */}
        {isExcel && (
          <div className="space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between bg-emerald-950/30 border border-emerald-500/30 px-3 py-1.5 rounded">
              <span className="text-emerald-300 font-bold">
                EXCEL.EXE // {step.raw_payload_preview}
              </span>
              <span className="text-[10px] text-amber-300">fx =SUM(D4:D8)-D9 [MANUAL MAPPING]</span>
            </div>
            <div className="overflow-x-auto bg-[#070b12] border border-slate-800 rounded-lg">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                    <th className="py-1.5 px-2.5 border-r border-slate-800">ROW</th>
                    <th className="py-1.5 px-2.5 border-r border-slate-800">MERIDIAN STANDARD LINE ITEM</th>
                    <th className="py-1.5 px-2.5 border-r border-slate-800">SOURCE</th>
                    <th className="py-1.5 px-2.5">STATUS / VALUE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  <tr>
                    <td className="py-1.5 px-2.5 border-r border-slate-800 text-slate-500">04</td>
                    <td className="py-1.5 px-2.5 border-r border-slate-800">Q3 Verified ARR / Revenue</td>
                    <td className="py-1.5 px-2.5 border-r border-slate-800 text-sky-400">Manual Paste</td>
                    <td className="py-1.5 px-2.5 text-emerald-400 font-bold">$8,400,000 (+140% YoY)</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2.5 border-r border-slate-800 text-slate-500">05</td>
                    <td className="py-1.5 px-2.5 border-r border-slate-800">Footnote 4 / Thesis Score</td>
                    <td className="py-1.5 px-2.5 border-r border-slate-800 text-amber-300">Human Glue Check</td>
                    <td className="py-1.5 px-2.5 text-rose-300 font-bold">Requires 15m Manual Reconciliation</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CASE 8: SLACK WORKSPACE INTERRUPTIONS */}
        {isSlack && (
          <div className="p-3.5 rounded-lg bg-[#070b12] border border-rose-500/30 space-y-2.5">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-rose-300 font-bold flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" />
                SLACK.EXE // CROSS-TEAM BOTTLENECK ALERT
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                BLOCKS 2 INVESTORS
              </span>
            </div>
            <div className="p-3 rounded bg-slate-900 border border-slate-800 text-xs space-y-1">
              <div className="font-mono text-[10px] text-sky-400">
                {persona.workspace_messages?.[persona.workspace_messages.length - 1]?.sender}
              </div>
              <div className="text-slate-200">
                "{persona.workspace_messages?.[persona.workspace_messages.length - 1]?.full_body || step.detail}"
              </div>
            </div>
          </div>
        )}

        {/* INTERACTIVE ACTION FOOTER INSIDE THE SIMULATED WINDOW */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            <strong className="text-slate-200">Why HeavyRain Is Needed Here:</strong> {step.friction_note}
          </div>

          <button
            onClick={() =>
              handleInteractiveActionLabel(step, nextStep, onExecuteAction)
            }
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-sky-500 hover:from-amber-400 hover:to-sky-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer transition"
          >
            <Copy className="w-3.5 h-3.5" />
            {getInteractiveButtonText(step, nextStep)}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function getInteractiveButtonText(step, nextStep) {
  const app = step.app.toLowerCase();
  if (app.includes('snipping')) return `SNIP TABLE (WIN+SHIFT+S) & SEND TO ${nextStep.app.toUpperCase()}`;
  if (app.includes('claude') || app.includes('gemini')) return `PASTE PROMPT (CTRL+V), RUN AI & COPY TO ${nextStep.app.toUpperCase()}`;
  if (app.includes('granola')) return `FINISH 44M CALL & EXPORT TRANSCRIPT TO ${nextStep.app.toUpperCase()}`;
  if (app.includes('excel')) return `PASTE & RECONCILE CELLS (CTRL+V) → NEXT: ${nextStep.app.toUpperCase()}`;
  return `EXECUTE IN ${step.app.split(' ')[0].toUpperCase()} (CTRL+C) & SWITCH TO ${nextStep.app.split(' ')[0].toUpperCase()}`;
}

function handleInteractiveActionLabel(step, nextStep, onExecuteAction) {
  onExecuteAction(
    `Executed ${step.app} -> Handoff to ${nextStep.app}`,
    step.raw_payload_preview || step.detail
  );
}

/* ============================================================================
   MODE B: COHESIVE INSTITUTIONAL MICRO-APP (WEEK 2 BETA + LIVE TELEMETRY MUTATION)
   ============================================================================ */
function CohesiveInstitutionalMicroApp({
  persona,
  onExitBeta,
  onEmitCustomTelemetry,
  onTriggerLiveMutation,
  onSwitchPersona,
}) {
  const [telemetryFeed, setTelemetryFeed] = useState([
    `[TELEMETRY_DAEMON] Mounted ${persona.mvp.name} (${persona.mvp.version}) in SOC2 Enclave`,
  ]);
  const [mutating, setMutating] = useState(false);
  const [mutationData, setMutationData] = useState(null);

  // Interactive states inside the built finance apps
  const [marcusShowDeprecatedTicker, setMarcusShowDeprecatedTicker] = useState(false);
  const [marcusRisksText, setMarcusRisksText] = useState(
    '1. 60-day enterprise InfoSec review bottleneck\n2. Top-2 Fortune 500 logo concentration (41% ARR)\n3. On-prem deployment margin drag in Q1'
  );
  const [marcusSynced, setMarcusSynced] = useState(false);

  const [elenaRoleFilter, setElenaRoleFilter] = useState('all');
  const [elenaVetoCol, setElenaVetoCol] = useState('CIO Security Sign-Off (> $150k ACV)');
  const [elenaSynced, setElenaSynced] = useState(false);

  const [devonDisallowCapRD, setDevonDisallowCapRD] = useState(true);
  const [devonSynced, setDevonSynced] = useState(false);

  const [priyaBoldNetIrr, setPriyaBoldNetIrr] = useState(true);
  const [priyaSynced, setPriyaSynced] = useState(false);

  const pushTelemetry = (feature, status, detail) => {
    const line = `[${new Date().toLocaleTimeString()}] ${status}: ${feature} — ${detail}`;
    setTelemetryFeed((prev) => [line, ...prev].slice(0, 6));
    if (onEmitCustomTelemetry) {
      onEmitCustomTelemetry({
        persona_id: persona.id,
        app_name: persona.mvp.name,
        window_title: `Beta Telemetry (${status}): ${feature}`,
        action_type: `BETA_${status}`,
        content_snippet: detail,
        used_ai_tool: true,
      });
    }
  };

  const runGeminiMutation = async () => {
    setMutating(true);
    const res = await onTriggerLiveMutation(telemetryFeed.join(' | '));
    setMutationData(res);
    setMutating(false);
  };

  return (
    <div className="p-4 flex-1 flex flex-col justify-between bg-[#060a10] space-y-4">
      {/* Micro-App Institutional Header */}
      <div className="p-3 rounded-lg bg-emerald-950/25 border border-emerald-500/40 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
              AUTONOMOUS WEEKLY MVP • {persona.mvp.version}
            </span>
            <span className="text-sky-300">{persona.mvp.security_tier}</span>
          </div>
          <div className="text-sm font-bold text-white mt-1">{persona.mvp.name}</div>
          <div className="text-xs text-slate-300">{persona.mvp.tagline}</div>
        </div>
        <button
          onClick={onExitBeta}
          className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-300 border border-slate-700 cursor-pointer"
        >
          ← COMPARE W/ 7-APP MANUAL FLOW
        </button>
      </div>

      {/* PERSONA-SPECIFIC INSTITUTIONAL FINTECH WORKBENCH */}
      {persona.id === 'marcus' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-lg bg-[#0b111e] border border-slate-800 space-y-2.5">
            <div className="flex justify-between font-mono text-[10px]">
              <span className="text-sky-400 font-bold">MODULE 1 // T-20M PRE-CALL DOSSIER HUD</span>
              <span className="text-emerald-400">ADOPTED: 100% (14/14 CALLS)</span>
            </div>
            <div className="p-2.5 rounded bg-[#070b12] border border-slate-800 font-mono text-xs space-y-1">
              <div className="text-white font-bold">VeloceAI (Series B) — Liam Chen, CEO</div>
              <div className="text-emerald-400">ARR: $8.4M (+140% YoY) • Burn: $280k/mo • Prior CRM: 4m ago</div>
            </div>
            <div className="space-y-1">
              <div className="font-mono text-[10px] text-slate-400">CLICK QUESTION TO PIN TO ZOOM HUD:</div>
              {[
                '1. Net Dollar Retention across Fortune 500 logistics cohort?',
                '2. Gross margin impact of 60-day custom deployment?',
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => pushTelemetry('T-20m Pre-Call HUD', 'ADOPTED', `Pinned question #${i + 1}`)}
                  className="w-full text-left p-2 rounded bg-slate-900 hover:bg-sky-500/15 border border-slate-800 text-xs text-slate-200 flex justify-between cursor-pointer"
                >
                  <span>{q}</span>
                  <span className="font-mono text-[10px] text-sky-400">PIN +</span>
                </button>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-mono text-[10px]">
              <span className="text-slate-500">v1.0 Public Comp Ticker (0 Clicks in Week 1):</span>
              <button
                onClick={() => {
                  setMarcusShowDeprecatedTicker(!marcusShowDeprecatedTicker);
                  pushTelemetry('Public Comp Ticker', 'IGNORED', '0% usage -> Pruned in v1.2');
                }}
                className="text-rose-400 hover:underline cursor-pointer"
              >
                {marcusShowDeprecatedTicker ? 'Hide Deprecated Widget' : 'Inspect Pruned Widget'}
              </button>
            </div>
            {marcusShowDeprecatedTicker && (
              <div className="p-2 rounded bg-rose-950/30 border border-rose-500/30 text-[11px] text-rose-200 font-mono">
                [AUTO-PRUNED IN v1.2]: Public Comps (DSGX 11.2x, SPSC 9.8x) removed due to 0 clicks during Series A/B calls.
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-lg bg-[#0b111e] border border-slate-800 flex flex-col justify-between space-y-2.5">
            <div className="space-y-2">
              <div className="flex justify-between font-mono text-[10px]">
                <span className="text-amber-300 font-bold">MODULE 2 // GRANOLA → IC DEAL NOTE & CRM</span>
                <span className="text-amber-400">v1.2 AUTO-MUTATED FIELD</span>
              </div>
              <label className="block font-mono text-[10px] text-slate-300">
                ✨ "Top 3 Diligence Risks" (Promoted after Marcus typed manually 11/14 times):
              </label>
              <textarea
                rows={3}
                value={marcusRisksText}
                onChange={(e) => {
                  setMarcusRisksText(e.target.value);
                  pushTelemetry('IC Deal Risks Block', 'MANUAL_OVERRIDE', 'Edited risk bullets -> Updating prompt');
                }}
                className="w-full rounded bg-[#070b12] border border-amber-500/40 p-2 font-mono text-xs text-slate-100"
              />
            </div>
            <button
              onClick={() => {
                setMarcusSynced(true);
                pushTelemetry('1-Click Deal Team + Affinity Sync', 'ADOPTED', 'Synced 6 CRM fields & sent IC email');
              }}
              className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs cursor-pointer"
            >
              {marcusSynced ? '✓ SENT TO DEAL TEAM & SYNCED 6 AFFINITY FIELDS' : '1-CLICK SEND IC NOTE & SYNC AFFINITY CRM →'}
            </button>
          </div>
        </div>
      )}

      {persona.id === 'elena' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-lg bg-[#0b111e] border border-slate-800 space-y-2.5">
            <div className="flex justify-between font-mono text-[10px]">
              <span className="text-violet-300 font-bold">BATCH PERSONA RANKER (24 BIOS)</span>
              <span className="text-emerald-400">ADOPTED: 96%</span>
            </div>
            <div className="flex gap-1.5 font-mono text-[10px]">
              {['all', 'budget_holder', 'no_budget'].map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setElenaRoleFilter(f);
                    pushTelemetry('Persona Fit Ranker', 'ADOPTED', `Filtered 24 bios by ${f}`);
                  }}
                  className={`px-2 py-1 rounded uppercase cursor-pointer ${
                    elenaRoleFilter === f ? 'bg-violet-500 text-white font-bold' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="space-y-1.5 font-mono text-xs">
              {[
                { name: 'Rachel Kim (VP Global Logistics)', score: '98% FIT', tag: 'budget_holder' },
                { name: 'Marcus Thorne (CSCO @ FreightCorp)', score: '94% FIT', tag: 'budget_holder' },
                { name: 'David Lin (Warehouse Ops Dir)', score: '31% [NO BUDGET]', tag: 'no_budget' },
              ]
                .filter((x) => elenaRoleFilter === 'all' || x.tag === elenaRoleFilter)
                .map((x, i) => (
                  <div key={i} className="p-2 rounded bg-[#070b12] border border-slate-800 flex justify-between">
                    <span className="text-slate-200">{x.name}</span>
                    <span className={x.tag === 'budget_holder' ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                      {x.score}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0b111e] border border-slate-800 flex flex-col justify-between space-y-2.5">
            <div className="space-y-2">
              <div className="flex justify-between font-mono text-[10px]">
                <span className="text-sky-400 font-bold">FORKED MARCUS CALL CORE + THESIS MATRIX</span>
                <button onClick={() => onSwitchPersona('marcus')} className="text-violet-300 underline cursor-pointer">
                  68% SHARED DNA →
                </button>
              </div>
              <div className="p-2 rounded bg-[#070b12] border border-slate-800 font-mono text-[11px] space-y-1">
                <div>Call #6 (Rachel Kim): Score 9/10 • Payback: 75d</div>
                <div className="text-amber-300">✨ v1.1 Auto-Extracted Veto Column: {elenaVetoCol}</div>
              </div>
              <input
                type="text"
                value={elenaVetoCol}
                onChange={(e) => {
                  setElenaVetoCol(e.target.value);
                  pushTelemetry('Thesis Heatmap Matrix', 'MANUAL_OVERRIDE', `Updated Veto Holder: ${e.target.value}`);
                }}
                className="w-full rounded bg-[#070b12] border border-amber-500/40 px-2.5 py-1.5 font-mono text-xs text-white"
              />
            </div>
            <button
              onClick={() => {
                setElenaSynced(true);
                pushTelemetry('18-Call Thesis Matrix Sync', 'ADOPTED', 'Synced 18 Granola calls to IC Matrix');
              }}
              className="w-full py-2.5 rounded-lg bg-violet-500 hover:bg-violet-400 text-white font-mono font-bold text-xs cursor-pointer"
            >
              {elenaSynced ? '✓ 18 DISCOVERY CALLS SYNCED TO MASTER MATRIX' : '1-CLICK AGGREGATE 18 GRANOLA CALLS →'}
            </button>
          </div>
        </div>
      )}

      {persona.id === 'devon' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
          <div className="p-3.5 rounded-lg bg-[#0b111e] border border-slate-800 space-y-2">
            <div className="text-[10px] text-emerald-400 font-bold">
              DIRECT PDF-TO-EXCEL COA MAPPER (ZERO SCREENSHOTS)
            </div>
            <div className="p-2 rounded bg-[#070b12] border border-slate-800 flex justify-between">
              <span>GAAP Operating Income (PDF p.47)</span>
              <span className="text-white font-bold">$1,240,000</span>
            </div>
            <div
              onClick={() => {
                setDevonDisallowCapRD(!devonDisallowCapRD);
                pushTelemetry('Footnote 4 Cap R&D Flag', 'MANUAL_OVERRIDE', 'Toggled Cap R&D add-back rule');
              }}
              className="p-2.5 rounded bg-amber-500/15 border border-amber-500/40 flex justify-between cursor-pointer"
            >
              <span>⚠ Footnote 4: Cap Software R&D (13.3% Rev)</span>
              <span className="text-rose-300 font-bold">
                {devonDisallowCapRD ? '-$1,120,000 (Disallowed)' : '+$0 (Allowed)'}
              </span>
            </div>
            <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 flex justify-between font-bold">
              <span className="text-emerald-300">Meridian Underwritten EBITDA:</span>
              <span className="text-white">{devonDisallowCapRD ? '$940,000' : '$2,060,000'}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0b111e] border border-slate-800 flex flex-col justify-between space-y-2">
            <div>
              <div className="flex justify-between text-[10px] text-sky-400 font-bold">
                <span>LIVE VERIFIED KPI PIPE → PRIYA (IR)</span>
                <button onClick={() => onSwitchPersona('priya')} className="underline cursor-pointer">
                  62% SHARED BRIDGE →
                </button>
              </div>
              <p className="text-xs text-slate-300 font-sans mt-1.5">
                Exposes verified Q3 ARR & NDR directly to Priya's LP Instant Desk—eliminating 7 weekly Slack interruptions.
              </p>
            </div>
            <button
              onClick={() => {
                setDevonSynced(true);
                pushTelemetry('Native .XLSX Export + IR Pipe', 'ADOPTED', 'Exported IC model & synced KPI feed');
              }}
              className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
            >
              {devonSynced ? '✓ EXPORTED .XLSX & PUBLISHED TO PRIYA' : '1-CLICK EXPORT .XLSX & PUBLISH KPI FEED →'}
            </button>
          </div>
        </div>
      )}

      {(persona.id === 'priya' || persona.id === 'claire') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
          <div className="p-3.5 rounded-lg bg-[#0b111e] border border-slate-800 space-y-2">
            <div className="text-[10px] text-amber-300 font-bold">
              VERIFIED KPI PULL FROM DEVON'S MODEL (0 SLACK PINGS)
            </div>
            <div className="p-2.5 rounded bg-[#070b12] border border-slate-800 space-y-1">
              <div className="flex justify-between">
                <span>Fund III AI Logistics Exposure:</span>
                <span className="text-white font-bold">22.4% NAV (6 Co's)</span>
              </div>
              <div className="flex justify-between">
                <span>Verified Q3 ARR Growth / NDR:</span>
                <span className="text-emerald-400 font-bold">+114.2% YoY / 131.5% NDR</span>
              </div>
            </div>
            <button
              onClick={() => {
                setPriyaBoldNetIrr(!priyaBoldNetIrr);
                pushTelemetry('SEC Gross/Net IRR Footnote', 'MANUAL_OVERRIDE', 'Toggled Net IRR highlight');
              }}
              className="w-full py-1.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold cursor-pointer"
            >
              {priyaBoldNetIrr ? '✓ SEC Rule: Net IRR (24.8%) & Gross IRR (29.1%) Side-by-Side' : 'Toggle SEC Net/Gross IRR'}
            </button>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0b111e] border border-slate-800 flex flex-col justify-between space-y-2">
            <div className="p-2.5 rounded bg-[#070b12] border border-slate-800 text-[11px] text-slate-200 font-sans">
              <strong>Auto-Drafted Reply to David Thorne (CalSTRS 1:00 PM IC):</strong> Meridian Fund III's verified Q3 exposure across 6 vertical AI holdings is 22.4% of NAV (+114.2% YoY ARR, 131.5% NDR).
            </div>
            <button
              onClick={() => {
                setPriyaSynced(true);
                pushTelemetry('CalSTRS Compliant Reply', 'ADOPTED', 'Sent verified LP reply in 8s');
              }}
              className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
            >
              {priyaSynced ? '✓ SENT CITED REPLY TO CALSTRS & LOGGED IN CRM' : '1-CLICK SEND COMPLIANT CALSTRS REPLY →'}
            </button>
          </div>
        </div>
      )}

      {/* LIVE SELF-MUTATING BETA TELEMETRY FOOTER */}
      <div className="p-3 rounded-lg bg-[#0b111e] border border-slate-800 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px]">
        <div className="flex-1 min-w-[260px]">
          <div className="text-[10px] text-amber-300 font-bold uppercase">
            PASSIVE BETA TELEMETRY STREAM (WEEK 1 → WEEK 2 SELF-EVOLUTION):
          </div>
          <div className="text-emerald-300 truncate mt-0.5">{telemetryFeed[0]}</div>
          {mutationData?.live_gemini_mutation_spec && (
            <div className="text-violet-300 text-[10px] mt-1 line-clamp-2">
              Argon v1.3 Spec: {String(mutationData.live_gemini_mutation_spec)}
            </div>
          )}
        </div>
        <button
          onClick={runGeminiMutation}
          disabled={mutating}
          className="px-3 py-1.5 rounded bg-violet-500/20 hover:bg-violet-500/30 text-violet-200 border border-violet-500/40 font-bold text-xs cursor-pointer shrink-0"
        >
          {mutating ? 'SYNTHESIZING v1.3...' : 'AUTO-MUTATE v1.3 VIA GEMINI 4 ARGON →'}
        </button>
      </div>
    </div>
  );
}
