'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

interface GraphStates {
  body_active: string;
  body_done: string;
  brain_active: string;
  brain_done: string;
  purpose_active: string;
  purpose_done: string;
  edge_active: string;
  edge_done: string;
}

interface LabGraphProps {
  currentPhase: number;
  isComplete: boolean;
  isRunning: boolean;
  graphStates?: GraphStates;
  successMetrics?: string;
}

/* ── Build node metadata from graph states ── */
function buildNodeMeta(graphStates?: GraphStates) {
  const gs = graphStates ?? {
    body_active: 'Detecting Phish...',
    body_done: 'Threat Detected',
    brain_active: 'Analyzing Intent...',
    brain_done: 'Decision: APPROVE',
    purpose_active: 'Executing Playbook...',
    purpose_done: 'Playbook Complete',
    edge_active: 'Blocking Session...',
    edge_done: 'Edges Enforced',
  };
  return [
    {
      id: 1,
      label: 'The Body',
      sub: 'Telemetry',
      icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
      activeStatus: gs.body_active,
      doneStatus: gs.body_done,
      color: { h: '#4ade80', r: 'rgba(74,222,128,0.15)', b: 'rgba(74,222,128,0.5)', g: 'rgba(74,222,128,0.25)' },
    },
    {
      id: 2,
      label: 'The Brain',
      sub: 'Reasoning',
      icon: 'M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7zM9 21v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1z',
      activeStatus: gs.brain_active,
      doneStatus: gs.brain_done,
      color: { h: '#22d3ee', r: 'rgba(34,211,238,0.15)', b: 'rgba(34,211,238,0.5)', g: 'rgba(34,211,238,0.25)' },
    },
    {
      id: 3,
      label: 'The Purpose',
      sub: 'Logic',
      icon: 'M3 3h6v6H3zM15 3h6v6h-6zM9 15h6v6H9zM3 9l6 6M15 9l-6 6M15 15l6-6',
      activeStatus: gs.purpose_active,
      doneStatus: gs.purpose_done,
      color: { h: '#c084fc', r: 'rgba(192,132,252,0.15)', b: 'rgba(192,132,252,0.5)', g: 'rgba(192,132,252,0.25)' },
    },
    {
      id: 4,
      label: 'The Edge',
      sub: 'Enforcement',
      icon: 'M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83',
      activeStatus: gs.edge_active,
      doneStatus: gs.edge_done,
      color: { h: '#fbbf24', r: 'rgba(251,191,36,0.15)', b: 'rgba(251,191,36,0.5)', g: 'rgba(251,191,36,0.25)' },
    },
  ];
}

type NodeMetaItem = ReturnType<typeof buildNodeMeta>[number];

/* ── Desktop layout constants ── */
const D_NODE_W = 150;
const D_NODE_H = 120;
const D_GAP = 60;
const D_TOTAL_W = 4 * D_NODE_W + 3 * D_GAP;
const D_SVG_W = D_TOTAL_W + 40;
const D_SVG_H = D_NODE_H + 80;

/* ── Mobile layout constants ── */
const M_NODE_W = 260;
const M_NODE_H = 80;
const M_GAP = 40;
const M_TOTAL_H = 4 * M_NODE_H + 3 * M_GAP;
const M_SVG_W = M_NODE_W + 40;
const M_SVG_H = M_TOTAL_H + 40;

export default function LabGraph({ currentPhase, isComplete, isRunning, graphStates, successMetrics }: LabGraphProps) {
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const NODE_META = buildNodeMeta(graphStates);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const metricsText = successMetrics ?? 'Detection → Enforcement: 4.7s (simulated)';

  return (
    <div className="glass-card rounded-lg p-4 sm:p-6 border border-terminal/20 mb-6" ref={containerRef}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-4 h-4 text-terminal" />
        <h3 className="font-mono text-sm font-semibold text-foreground">Intelligence Flow</h3>
        {isRunning && !isComplete && (
          <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-mono bg-terminal/10 text-terminal border border-terminal/20 animate-pulse">
            LIVE
          </span>
        )}
        {isComplete && (
          <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
            ✓ COMPLETE
          </span>
        )}
      </div>

      {/* SVG Graph */}
      <div className="w-full overflow-hidden">
        {isMobile ? (
          <MobileGraph currentPhase={currentPhase} isComplete={isComplete} isRunning={isRunning} nodeMeta={NODE_META} />
        ) : (
          <DesktopGraph currentPhase={currentPhase} isComplete={isComplete} isRunning={isRunning} nodeMeta={NODE_META} />
        )}
      </div>

      {/* Timing footer */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 pt-3 border-t border-terminal/10 flex items-center justify-center gap-3 flex-wrap"
          >
            <span className="font-mono text-[10px] text-emerald-400">{metricsText}</span>
            <span className="font-mono text-[10px] text-muted-foreground/40">·</span>
            <span className="font-mono text-[10px] text-muted-foreground/50">Zero manual intervention</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════ Shared inner graph props ════════════════════════ */
interface InnerGraphProps {
  currentPhase: number;
  isComplete: boolean;
  isRunning: boolean;
  nodeMeta: NodeMetaItem[];
}

/* ════════════════════════════ DESKTOP GRAPH (horizontal) ════════════════════════════ */
function DesktopGraph({ currentPhase, isComplete, isRunning, nodeMeta }: InnerGraphProps) {
  return (
    <svg
      viewBox={`0 0 ${D_SVG_W} ${D_SVG_H}`}
      className="w-full"
      style={{ maxHeight: 220 }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {nodeMeta.map((n) => (
          <filter key={`glow-${n.id}`} id={`glow-${n.id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
            <feColorMatrix values={`0 0 0 0 ${parseInt(n.color.h.slice(1, 3), 16) / 255} 0 0 0 0 ${parseInt(n.color.h.slice(3, 5), 16) / 255} 0 0 0 0 ${parseInt(n.color.h.slice(5, 7), 16) / 255} 0 0 0 0.35 0`} />
            <feBlend in="SourceGraphic" />
          </filter>
        ))}
        <radialGradient id="packet">
          <stop offset="0%" stopColor="#4ade80" stopOpacity="1" />
          <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Connection lines + animated data packets */}
      {nodeMeta.slice(0, -1).map((node, i) => {
        const x1 = 20 + i * (D_NODE_W + D_GAP) + D_NODE_W;
        const x2 = 20 + (i + 1) * (D_NODE_W + D_GAP);
        const cy = 20 + D_NODE_H / 2;
        const edgeActive = currentPhase > node.id || isComplete;
        const edgeTransiting = currentPhase === node.id;

        return (
          <g key={`edge-${i}`}>
            <line
              x1={x1} y1={cy} x2={x2} y2={cy}
              stroke={edgeActive ? '#34d399' : edgeTransiting ? node.color.b : 'rgba(63,63,70,0.4)'}
              strokeWidth={edgeActive ? 2.5 : 2}
              strokeDasharray={edgeTransiting ? '6 4' : 'none'}
              style={{ transition: 'stroke 0.5s, stroke-width 0.3s' }}
            />
            <polygon
              points={`${x2},${cy} ${x2 - 8},${cy - 5} ${x2 - 8},${cy + 5}`}
              fill={edgeActive ? '#34d399' : edgeTransiting ? node.color.b : 'rgba(63,63,70,0.3)'}
              style={{ transition: 'fill 0.5s' }}
            />
            {edgeTransiting && (
              <circle r="5" fill={node.color.h} opacity="0.9">
                <animate attributeName="cx" from={x1} to={x2} dur="1.2s" repeatCount="indefinite" />
                <animate attributeName="cy" values={`${cy}`} dur="1.2s" repeatCount="indefinite" />
                <animate attributeName="r" values="3;6;3" dur="1.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1.2s" repeatCount="indefinite" />
              </circle>
            )}
            {edgeActive && (
              <circle r="3" fill="#34d399" opacity="0.6">
                <animate attributeName="cx" from={x1} to={x2} dur="2s" repeatCount="indefinite" />
                <animate attributeName="cy" values={`${cy}`} dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {nodeMeta.map((node, i) => {
        const x = 20 + i * (D_NODE_W + D_GAP);
        const y = 20;
        const cx = x + D_NODE_W / 2;
        const cy = y + D_NODE_H / 2;
        const isActive = currentPhase === node.id;
        const isDone = currentPhase > node.id || isComplete;
        const isIdle = !isActive && !isDone;

        const borderColor = isActive ? node.color.b : isDone ? 'rgba(52,211,153,0.4)' : 'rgba(63,63,70,0.3)';
        const fillColor = isActive ? node.color.r : isDone ? 'rgba(52,211,153,0.06)' : 'rgba(30,30,36,0.5)';

        return (
          <g key={node.id}>
            <rect
              x={x} y={y} width={D_NODE_W} height={D_NODE_H} rx={10}
              fill={fillColor}
              stroke={borderColor}
              strokeWidth={isActive ? 2 : 1.5}
              filter={isActive ? `url(#glow-${node.id})` : undefined}
              style={{ transition: 'fill 0.5s, stroke 0.5s' }}
            />

            {isActive && (
              <rect x={x} y={y} width={D_NODE_W} height={D_NODE_H} rx={10} fill="none" stroke={node.color.h} strokeWidth={1.5}>
                <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                <animate attributeName="stroke-width" values="1.5;4;1.5" dur="2s" repeatCount="indefinite" />
              </rect>
            )}

            <g transform={`translate(${cx - 10}, ${y + 12}) scale(0.83)`}>
              <path
                d={node.icon}
                fill="none"
                stroke={isActive ? node.color.h : isDone ? '#34d399' : 'rgba(161,161,170,0.35)'}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transition: 'stroke 0.5s' }}
              />
            </g>

            <text
              x={cx} y={y + 50}
              textAnchor="middle"
              className="font-mono"
              fontSize={11}
              fontWeight={600}
              fill={isActive ? node.color.h : isDone ? '#34d399' : 'rgba(161,161,170,0.6)'}
              style={{ transition: 'fill 0.5s' }}
            >
              {node.label}
            </text>

            <text
              x={cx} y={y + 64}
              textAnchor="middle"
              className="font-mono"
              fontSize={9}
              fill={isActive ? 'rgba(161,161,170,0.8)' : isDone ? 'rgba(161,161,170,0.5)' : 'rgba(161,161,170,0.35)'}
              style={{ transition: 'fill 0.5s' }}
            >
              {node.sub}
            </text>

            {isActive && (
              <g>
                <rect
                  x={cx - 52} y={y + D_NODE_H - 26} width={104} height={20} rx={10}
                  fill={node.color.r}
                  stroke={node.color.b}
                  strokeWidth={0.5}
                />
                <text
                  x={cx} y={y + D_NODE_H - 12.5}
                  textAnchor="middle"
                  className="font-mono"
                  fontSize={9}
                  fontWeight={600}
                  fill={node.color.h}
                >
                  {node.activeStatus}
                </text>
              </g>
            )}
            {isDone && !isActive && (
              <g>
                <rect
                  x={cx - 46} y={y + D_NODE_H - 26} width={92} height={20} rx={10}
                  fill="rgba(52,211,153,0.1)"
                  stroke="rgba(52,211,153,0.3)"
                  strokeWidth={0.5}
                />
                <text
                  x={cx} y={y + D_NODE_H - 12.5}
                  textAnchor="middle"
                  className="font-mono"
                  fontSize={9}
                  fontWeight={600}
                  fill="#34d399"
                >
                  {node.doneStatus}
                </text>
              </g>
            )}
            {isIdle && !isRunning && (
              <text
                x={cx} y={y + D_NODE_H - 12}
                textAnchor="middle"
                className="font-mono"
                fontSize={9}
                fill="rgba(161,161,170,0.35)"
              >
                Idle
              </text>
            )}

            {isDone && !isActive && (
              <g>
                <circle cx={x + D_NODE_W - 6} cy={y + 6} r={8} fill="#059669" />
                <path d={`M${x + D_NODE_W - 10} ${y + 6} l3 3 5-5`} stroke="white" strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            )}

            {isActive && (
              <circle cx={x + D_NODE_W - 6} cy={y + 6} r={5} fill={node.color.h}>
                <animate attributeName="r" values="4;7;4" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ════════════════════════════ MOBILE GRAPH (vertical) ════════════════════════════ */
function MobileGraph({ currentPhase, isComplete, isRunning, nodeMeta }: InnerGraphProps) {
  return (
    <svg
      viewBox={`0 0 ${M_SVG_W} ${M_SVG_H}`}
      className="w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {nodeMeta.map((n) => (
          <filter key={`mglow-${n.id}`} id={`mglow-${n.id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
            <feColorMatrix values={`0 0 0 0 ${parseInt(n.color.h.slice(1, 3), 16) / 255} 0 0 0 0 ${parseInt(n.color.h.slice(3, 5), 16) / 255} 0 0 0 0 ${parseInt(n.color.h.slice(5, 7), 16) / 255} 0 0 0 0.3 0`} />
            <feBlend in="SourceGraphic" />
          </filter>
        ))}
      </defs>

      {/* Connection lines + data packets */}
      {nodeMeta.slice(0, -1).map((node, i) => {
        const cx = M_SVG_W / 2;
        const y1 = 20 + i * (M_NODE_H + M_GAP) + M_NODE_H;
        const y2 = 20 + (i + 1) * (M_NODE_H + M_GAP);
        const edgeActive = currentPhase > node.id || isComplete;
        const edgeTransiting = currentPhase === node.id;

        return (
          <g key={`medge-${i}`}>
            <line
              x1={cx} y1={y1} x2={cx} y2={y2}
              stroke={edgeActive ? '#34d399' : edgeTransiting ? node.color.b : 'rgba(63,63,70,0.4)'}
              strokeWidth={edgeActive ? 2.5 : 2}
              strokeDasharray={edgeTransiting ? '6 4' : 'none'}
              style={{ transition: 'stroke 0.5s' }}
            />
            <polygon
              points={`${cx},${y2} ${cx - 5},${y2 - 8} ${cx + 5},${y2 - 8}`}
              fill={edgeActive ? '#34d399' : edgeTransiting ? node.color.b : 'rgba(63,63,70,0.3)'}
              style={{ transition: 'fill 0.5s' }}
            />
            {edgeTransiting && (
              <circle r="4" cx={cx} fill={node.color.h} opacity="0.9">
                <animate attributeName="cy" from={y1} to={y2} dur="1.2s" repeatCount="indefinite" />
                <animate attributeName="r" values="3;5;3" dur="1.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0.3;0.9" dur="1.2s" repeatCount="indefinite" />
              </circle>
            )}
            {edgeActive && (
              <circle r="3" cx={cx} fill="#34d399" opacity="0.5">
                <animate attributeName="cy" from={y1} to={y2} dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0.15;0.5" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {nodeMeta.map((node, i) => {
        const x = 20;
        const y = 20 + i * (M_NODE_H + M_GAP);
        const cx = x + M_NODE_W / 2;
        const cy = y + M_NODE_H / 2;
        const isActive = currentPhase === node.id;
        const isDone = currentPhase > node.id || isComplete;
        const isIdle = !isActive && !isDone;

        const borderColor = isActive ? node.color.b : isDone ? 'rgba(52,211,153,0.4)' : 'rgba(63,63,70,0.3)';
        const fillColor = isActive ? node.color.r : isDone ? 'rgba(52,211,153,0.06)' : 'rgba(30,30,36,0.5)';

        return (
          <g key={`m-${node.id}`}>
            <rect
              x={x} y={y} width={M_NODE_W} height={M_NODE_H} rx={10}
              fill={fillColor} stroke={borderColor} strokeWidth={isActive ? 2 : 1.5}
              filter={isActive ? `url(#mglow-${node.id})` : undefined}
              style={{ transition: 'fill 0.5s, stroke 0.5s' }}
            />

            {isActive && (
              <rect x={x} y={y} width={M_NODE_W} height={M_NODE_H} rx={10} fill="none" stroke={node.color.h} strokeWidth={1.5}>
                <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                <animate attributeName="stroke-width" values="1.5;3.5;1.5" dur="2s" repeatCount="indefinite" />
              </rect>
            )}

            <g transform={`translate(${x + 14}, ${cy - 10}) scale(0.83)`}>
              <path
                d={node.icon}
                fill="none"
                stroke={isActive ? node.color.h : isDone ? '#34d399' : 'rgba(161,161,170,0.35)'}
                strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                style={{ transition: 'stroke 0.5s' }}
              />
            </g>

            <text
              x={x + 44} y={cy - 5}
              className="font-mono"
              fontSize={12} fontWeight={600}
              fill={isActive ? node.color.h : isDone ? '#34d399' : 'rgba(161,161,170,0.6)'}
              style={{ transition: 'fill 0.5s' }}
            >
              {node.label}
            </text>

            <text
              x={x + 44} y={cy + 10}
              className="font-mono"
              fontSize={9}
              fill={isActive ? 'rgba(161,161,170,0.8)' : isDone ? 'rgba(161,161,170,0.5)' : 'rgba(161,161,170,0.35)'}
              style={{ transition: 'fill 0.5s' }}
            >
              {node.sub}
            </text>

            {isActive && (
              <g>
                <rect
                  x={x + M_NODE_W - 120} y={cy - 9} width={108} height={18} rx={9}
                  fill={node.color.r} stroke={node.color.b} strokeWidth={0.5}
                />
                <text
                  x={x + M_NODE_W - 66} y={cy + 3}
                  textAnchor="middle"
                  className="font-mono" fontSize={8} fontWeight={600}
                  fill={node.color.h}
                >
                  {node.activeStatus}
                </text>
              </g>
            )}
            {isDone && !isActive && (
              <g>
                <rect
                  x={x + M_NODE_W - 110} y={cy - 9} width={98} height={18} rx={9}
                  fill="rgba(52,211,153,0.1)" stroke="rgba(52,211,153,0.3)" strokeWidth={0.5}
                />
                <text
                  x={x + M_NODE_W - 61} y={cy + 3}
                  textAnchor="middle"
                  className="font-mono" fontSize={8} fontWeight={600}
                  fill="#34d399"
                >
                  {node.doneStatus}
                </text>
              </g>
            )}
            {isIdle && !isRunning && (
              <text
                x={x + M_NODE_W - 30} y={cy + 4}
                textAnchor="middle" className="font-mono" fontSize={9}
                fill="rgba(161,161,170,0.35)"
              >
                Idle
              </text>
            )}

            {isDone && !isActive && (
              <g>
                <circle cx={x + M_NODE_W - 6} cy={y + 6} r={7} fill="#059669" />
                <path d={`M${x + M_NODE_W - 10} ${y + 6} l3 3 4-4`} stroke="white" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            )}
            {isActive && (
              <circle cx={x + M_NODE_W - 6} cy={y + 6} r={4} fill={node.color.h}>
                <animate attributeName="r" values="3;6;3" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        );
      })}
    </svg>
  );
}
