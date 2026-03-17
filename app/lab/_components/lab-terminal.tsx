'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Shield, Brain, Workflow, Radio, Terminal } from 'lucide-react';
import { trackLabLaunch } from '@/lib/analytics';

export interface TermLine {
  text: string;
  type: 'system' | 'body' | 'brain' | 'purpose' | 'edge' | 'info' | 'success' | 'error' | 'header' | 'blank';
  phase?: number;
}

export interface ScenarioData {
  id: string;
  pkg_id: string | null;
  title: string;
  subtitle: string;
  terminal_steps: TermLine[];
  graph_states: {
    body_active: string;
    body_done: string;
    brain_active: string;
    brain_done: string;
    purpose_active: string;
    purpose_done: string;
    edge_active: string;
    edge_done: string;
  };
  success_metrics: string;
}

const colorMap: Record<string, string> = {
  system: 'text-gray-400',
  body: 'text-green-400',
  brain: 'text-cyan-400',
  purpose: 'text-purple-400',
  edge: 'text-amber-400',
  info: 'text-blue-300',
  success: 'text-emerald-400',
  error: 'text-red-400',
  header: 'text-terminal',
  blank: '',
};

const phaseInfo = [
  { icon: Shield, label: 'The Body', color: 'text-green-400', phase: 1 },
  { icon: Brain, label: 'The Brain', color: 'text-cyan-400', phase: 2 },
  { icon: Workflow, label: 'The Purpose', color: 'text-purple-400', phase: 3 },
  { icon: Radio, label: 'The Edge', color: 'text-amber-400', phase: 4 },
];

interface LabTerminalProps {
  scenario: ScenarioData;
  onPhaseChange?: (phase: number) => void;
  onCompleteChange?: (complete: boolean) => void;
  onRunningChange?: (running: boolean) => void;
}

export default function LabTerminal({ scenario, onPhaseChange, onCompleteChange, onRunningChange }: LabTerminalProps) {
  const [lines, setLines] = useState<TermLine[]>([]);
  const [isRunning, setIsRunningState] = useState(false);
  const [currentPhase, setCurrentPhaseState] = useState(0);
  const [isComplete, setIsCompleteState] = useState(false);
  const termRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setIsRunning = (v: boolean) => { setIsRunningState(v); onRunningChange?.(v); };
  const setCurrentPhase = (v: number) => { setCurrentPhaseState(v); onPhaseChange?.(v); };
  const setIsComplete = (v: boolean) => { setIsCompleteState(v); onCompleteChange?.(v); };

  const scrollToBottom = useCallback(() => {
    if (termRef?.current) {
      termRef.current.scrollTop = termRef.current.scrollHeight;
    }
  }, []);

  const runSimulation = useCallback(() => {
    trackLabLaunch();
    setLines([]);
    setIsRunning(true);
    setCurrentPhase(0);
    setIsComplete(false);

    const steps = scenario.terminal_steps;
    let i = 0;
    const addLine = () => {
      if (i >= (steps?.length ?? 0)) {
        setIsRunning(false);
        setIsComplete(true);
        return;
      }
      const line = steps?.[i];
      if (line) {
        // Detect phase from explicit phase field
        if (typeof line.phase === 'number') {
          setCurrentPhase(line.phase);
        }
        setLines((prev) => [...(prev ?? []), line]);
      }
      i++;

      // Variable speed for realism
      const lineText = line?.text ?? '';
      let delay = 60;
      if (lineText === '') delay = 200;
      else if (lineText?.includes?.('━━━')) delay = 600;
      else if (lineText?.includes?.('Analyzing') || lineText?.includes?.('Loading') || lineText?.includes?.('Initializing') || lineText?.includes?.('Receiving') || lineText?.includes?.('Scanning') || lineText?.includes?.('Correlating') || lineText?.includes?.('Deobfuscating')) delay = 400;
      else if (lineText?.includes?.('✓')) delay = 250;
      else if (lineText?.includes?.('╔') || lineText?.includes?.('╚')) delay = 100;
      else delay = 80 + Math.random() * 80;

      timeoutRef.current = setTimeout(addLine, delay);
    };

    addLine();
  }, [scenario]);

  useEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);

  useEffect(() => {
    return () => {
      if (timeoutRef?.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Reset when scenario changes
  useEffect(() => {
    if (timeoutRef?.current) clearTimeout(timeoutRef.current);
    setLines([]);
    setIsRunningState(false);
    setCurrentPhaseState(0);
    setIsCompleteState(false);
  }, [scenario.id]);

  const handleReset = () => {
    if (timeoutRef?.current) clearTimeout(timeoutRef.current);
    setLines([]);
    setIsRunning(false);
    setCurrentPhase(0);
    setIsComplete(false);
  };

  return (
    <div className="space-y-4">
      {/* Phase indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {phaseInfo?.map((p, i) => {
          const Icon = p?.icon;
          const isActive = currentPhase === (p?.phase ?? 0);
          const isDone = currentPhase > (p?.phase ?? 0) || isComplete;
          return (
            <div
              key={p?.label ?? i}
              className={`flex items-center gap-2 px-3 py-2 rounded-md font-mono text-xs transition-all duration-300 ${
                isActive ? 'glass-card border border-terminal/30 shadow-lg' : isDone ? 'bg-muted/30' : 'bg-muted/10'
              }`}
            >
              {Icon ? <Icon className={`w-4 h-4 ${isActive ? p?.color ?? '' : isDone ? 'text-emerald-400' : 'text-muted-foreground/40'}`} /> : null}
              <span className={isActive ? (p?.color ?? '') : isDone ? 'text-emerald-400' : 'text-muted-foreground/40'}>
                {p?.label ?? ''}
              </span>
              {isDone && !isActive ? <span className="ml-auto text-emerald-400">✓</span> : null}
              {isActive ? <span className="ml-auto w-1.5 h-1.5 rounded-full bg-current animate-pulse" /> : null}
            </div>
          );
        })}
      </div>

      {/* Terminal */}
      <div className="rounded-lg overflow-hidden border border-terminal/20 shadow-2xl shadow-terminal/5">
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-muted/80 border-b border-terminal/10">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <Terminal className="w-3.5 h-3.5 text-muted-foreground ml-2" />
            <span className="font-mono text-xs text-muted-foreground truncate max-w-[260px] sm:max-w-none">
              soac-lab — {scenario.title.toLowerCase().replace(/\s+/g, '-')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              disabled={!isRunning && (lines?.length ?? 0) === 0}
              className="p-1.5 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={runSimulation}
              disabled={isRunning}
              className="flex items-center gap-1 px-3 py-1 rounded bg-terminal/20 text-terminal text-xs font-mono hover:bg-terminal/30 disabled:opacity-30 border border-terminal/30 transition-all"
            >
              <Play className="w-3 h-3" />
              {isRunning ? 'Running...' : 'Run Simulation'}
            </button>
          </div>
        </div>

        {/* Terminal body */}
        <div
          ref={termRef}
          className="terminal-bg p-4 h-[500px] overflow-y-auto font-mono text-[13px] leading-relaxed"
        >
          {(lines?.length ?? 0) === 0 && !isRunning ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground/50">
              <Terminal className="w-12 h-12 mb-4" />
              <p className="font-mono text-sm">{scenario.title}</p>
              <p className="font-mono text-xs mt-1 text-center max-w-md">{scenario.subtitle}</p>
              <p className="font-mono text-[10px] mt-4 text-muted-foreground/30">lab_safety_policy: SIMULATE mode | No production systems affected</p>
            </div>
          ) : null}
          {lines?.map?.((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
              className={`${colorMap?.[line?.type ?? ''] ?? ''} whitespace-pre-wrap break-all`}
            >
              {line?.text === '' ? '\u00A0' : line?.text ?? ''}
            </motion.div>
          )) ?? null}
          {isRunning ? (
            <span className="inline-block w-2 h-4 bg-terminal animate-blink" />
          ) : null}
        </div>
      </div>
    </div>
  );
}
