'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  ArrowLeft,
  FileJson,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Terminal,
  Clock,
  BarChart3,
  ExternalLink,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
interface CoverageEntry {
  technique_id: string;
  tactic: string;
  exercised_by_scenario: boolean;
  exercised_at_steps: number[];
}

interface TimelineEntry {
  step: number;
  phase: string;
  pillar: string;
  artifact_type: string;
  mitre_match: string[];
  text: string;
}

interface Manifest {
  schema_version: string;
  harness_level: number;
  package_id: string;
  package_name: string;
  scenario_id: string;
  scenario_title: string;
  generated_at: string;
  summary: {
    total_steps: number;
    body_steps: number;
    brain_steps: number;
    purpose_steps: number;
    edge_steps: number;
    detection_triggers: number;
    playbook_actions: number;
    mitre_techniques_declared: number;
    mitre_techniques_exercised: number;
    coverage_pct: number;
  };
  mitre_coverage: CoverageEntry[];
  replay_timeline: TimelineEntry[];
  artifacts_used: Record<string, string>;
  verdict: 'PASS' | 'PARTIAL' | 'FAIL';
  verdict_reason: string;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const verdictConfig = {
  PASS: { icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-900/30', border: 'border-emerald-400/30', label: 'PASS' },
  PARTIAL: { icon: ShieldAlert, color: 'text-amber-400', bg: 'bg-amber-900/30', border: 'border-amber-400/30', label: 'PARTIAL' },
  FAIL: { icon: ShieldX, color: 'text-red-400', bg: 'bg-red-900/30', border: 'border-red-400/30', label: 'FAIL' },
};

const pillarColors: Record<string, string> = {
  body: 'text-cyan-400',
  brain: 'text-purple-400',
  purpose: 'text-amber-400',
  edge: 'text-red-400',
  unknown: 'text-gray-400',
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch { return iso; }
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
interface Props {
  packageId: string;
  packageName: string;
  packageNum: string;
  mitre: string[];
}

export default function EvidenceViewer({ packageId, packageName, packageNum, mitre }: Props) {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [report, setReport] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'mitre' | 'timeline' | 'report'>('overview');

  useEffect(() => {
    async function load() {
      try {
        const [mRes, rRes] = await Promise.all([
          fetch(`/packages/${packageNum}/evidence/evidence-manifest.json`),
          fetch(`/packages/${packageNum}/evidence/replay-report.md`),
        ]);
        if (!mRes.ok) throw new Error(`Manifest ${mRes.status}`);
        const mData = await mRes.json();
        const rText = rRes.ok ? await rRes.text() : '';
        setManifest(mData);
        setReport(rText);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load evidence');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [packageNum]);

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="animate-pulse font-mono text-terminal">Loading evidence bundle…</div>
      </div>
    );
  }

  if (error || !manifest) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <ShieldX className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-300 font-mono">{error || 'Evidence not found'}</p>
        <Link href="/packages" className="mt-4 inline-block text-terminal hover:underline text-sm font-mono">← Back to Packages</Link>
      </div>
    );
  }

  const v = verdictConfig[manifest.verdict];
  const VerdictIcon = v.icon;
  const s = manifest.summary;

  const tabs = [
    { key: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { key: 'mitre' as const, label: 'MITRE Coverage', icon: ShieldCheck },
    { key: 'timeline' as const, label: 'Timeline', icon: Clock },
    { key: 'report' as const, label: 'Full Report', icon: FileText },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <Link href="/packages" className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-terminal transition-colors mb-6">
        <ArrowLeft className="w-3 h-3" /> Back to Packages
      </Link>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-start gap-4 flex-wrap">
          <div className={`p-3 rounded-lg ${v.bg} border ${v.border}`}>
            <VerdictIcon className={`w-8 h-8 ${v.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-mono text-2xl sm:text-3xl font-bold text-foreground mb-1">
              Evidence: <span className="text-terminal">{packageName}</span>
            </h1>
            <div className="flex items-center gap-3 flex-wrap text-xs font-mono text-gray-400">
              <span className="px-2 py-0.5 rounded bg-muted">{packageId}</span>
              <span className={`px-2 py-0.5 rounded ${v.bg} ${v.color} border ${v.border} font-semibold`}>
                {v.label}
              </span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(manifest.generated_at)}</span>
              <span>Harness Level {manifest.harness_level}</span>
            </div>
            <p className="mt-2 text-sm text-gray-300">{manifest.verdict_reason}</p>
          </div>
        </div>
      </motion.div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 overflow-x-auto border-b border-terminal/10 pb-px">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono whitespace-nowrap transition-all border-b-2 -mb-px ${
                isActive
                  ? 'border-terminal text-terminal'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
              }`}
            >
              <TabIcon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        {activeTab === 'overview' && <OverviewTab manifest={manifest} />}
        {activeTab === 'mitre' && <MitreTab manifest={manifest} />}
        {activeTab === 'timeline' && <TimelineTab manifest={manifest} />}
        {activeTab === 'report' && <ReportTab report={report} packageNum={packageNum} />}
      </motion.div>

      {/* Raw file links */}
      <div className="mt-10 pt-6 border-t border-terminal/10 flex flex-wrap gap-3">
        <a
          href={`/packages/${packageNum}/evidence/evidence-manifest.json`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-mono bg-muted/50 text-gray-300 border border-border hover:border-terminal/30 transition-all"
        >
          <FileJson className="w-3.5 h-3.5" /> evidence-manifest.json <ExternalLink className="w-3 h-3 opacity-40" />
        </a>
        <a
          href={`/packages/${packageNum}/evidence/replay-report.md`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-mono bg-muted/50 text-gray-300 border border-border hover:border-terminal/30 transition-all"
        >
          <FileText className="w-3.5 h-3.5" /> replay-report.md <ExternalLink className="w-3 h-3 opacity-40" />
        </a>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Overview Tab                                                        */
/* ------------------------------------------------------------------ */
function OverviewTab({ manifest }: { manifest: Manifest }) {
  const s = manifest.summary;
  const stats = [
    { label: 'Total Steps', value: s.total_steps, color: 'text-foreground' },
    { label: 'Detection Triggers', value: s.detection_triggers, color: 'text-cyan-400' },
    { label: 'Playbook Actions', value: s.playbook_actions, color: 'text-amber-400' },
    { label: 'MITRE Declared', value: s.mitre_techniques_declared, color: 'text-red-400' },
    { label: 'MITRE Validated', value: s.mitre_techniques_exercised, color: 'text-emerald-400' },
    { label: 'Coverage', value: `${s.coverage_pct}%`, color: 'text-terminal' },
  ];

  const pillars = [
    { label: 'The Body', value: s.body_steps, color: 'bg-cyan-400', total: s.total_steps },
    { label: 'The Brain', value: s.brain_steps, color: 'bg-purple-400', total: s.total_steps },
    { label: 'The Purpose', value: s.purpose_steps, color: 'bg-amber-400', total: s.total_steps },
    { label: 'The Edge', value: s.edge_steps, color: 'bg-red-400', total: s.total_steps },
  ];

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((st) => (
          <div key={st.label} className="glass-card rounded-lg p-4 border border-terminal/10 text-center">
            <div className={`text-2xl font-mono font-bold ${st.color}`}>{st.value}</div>
            <div className="text-[10px] font-mono text-gray-400 mt-1">{st.label}</div>
          </div>
        ))}
      </div>

      {/* Pillar breakdown */}
      <div className="glass-card rounded-lg p-5 border border-terminal/10">
        <h3 className="font-mono text-sm font-semibold text-foreground mb-4">Pillar Step Distribution</h3>
        <div className="space-y-3">
          {pillars.map((p) => {
            const pct = p.total > 0 ? (p.value / p.total) * 100 : 0;
            return (
              <div key={p.label}>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-gray-300">{p.label}</span>
                  <span className="text-gray-400">{p.value} steps ({Math.round(pct)}%)</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full ${p.color} transition-all duration-500`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Artifacts referenced */}
      <div className="glass-card rounded-lg p-5 border border-terminal/10">
        <h3 className="font-mono text-sm font-semibold text-foreground mb-3">Artifacts Referenced</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Object.entries(manifest.artifacts_used ?? {}).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2 text-xs font-mono">
              <span className="text-gray-400 capitalize">{key.replace('_', ' ')}:</span>
              <span className="text-gray-200 truncate">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MITRE Tab                                                           */
/* ------------------------------------------------------------------ */
function MitreTab({ manifest }: { manifest: Manifest }) {
  return (
    <div className="glass-card rounded-lg border border-terminal/10 overflow-hidden">
      <div className="p-4 border-b border-terminal/10">
        <h3 className="font-mono text-sm font-semibold text-foreground">MITRE ATT&CK Technique Coverage</h3>
        <p className="text-[10px] font-mono text-gray-400 mt-1">
          Coverage is scoped to declared techniques from metadata.yml — not the full MITRE matrix.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-terminal/10">
              <th className="text-left p-3 text-gray-400">Technique</th>
              <th className="text-left p-3 text-gray-400">Tactic</th>
              <th className="text-center p-3 text-gray-400">Validated</th>
              <th className="text-left p-3 text-gray-400">Steps</th>
            </tr>
          </thead>
          <tbody>
            {manifest.mitre_coverage.map((c) => (
              <tr key={c.technique_id} className="border-b border-terminal/5 hover:bg-terminal/5 transition-colors">
                <td className="p-3">
                  <a
                    href={`https://attack.mitre.org/techniques/${c.technique_id.replace('.', '/')}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-300 hover:text-red-200 hover:underline"
                  >
                    {c.technique_id}
                  </a>
                </td>
                <td className="p-3 text-gray-300">{c.tactic}</td>
                <td className="p-3 text-center">
                  {c.exercised_by_scenario ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400 mx-auto" />
                  )}
                </td>
                <td className="p-3 text-gray-400">
                  {c.exercised_at_steps.length > 0 ? c.exercised_at_steps.slice(0, 8).join(', ') + (c.exercised_at_steps.length > 8 ? '…' : '') : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Timeline Tab                                                        */
/* ------------------------------------------------------------------ */
function TimelineTab({ manifest }: { manifest: Manifest }) {
  const [filter, setFilter] = useState<string>('all');
  const tl = manifest.replay_timeline ?? [];
  const pillars = ['all', ...Array.from(new Set(tl.map((t) => t.pillar)))];
  const filtered = filter === 'all' ? tl : tl.filter((t) => t.pillar === filter);
  // Show first 60 + expandable
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? filtered : filtered.slice(0, 60);

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {pillars.map((p) => (
          <button
            key={p}
            onClick={() => { setFilter(p); setShowAll(false); }}
            className={`px-3 py-1.5 rounded text-xs font-mono border transition-all ${
              filter === p
                ? 'bg-terminal/20 text-terminal border-terminal/40'
                : 'bg-muted/30 text-gray-400 border-border hover:text-gray-200'
            }`}
          >
            {p === 'all' ? 'All pillars' : p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Timeline list */}
      <div className="glass-card rounded-lg border border-terminal/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-terminal/10">
                <th className="text-left p-3 text-gray-400 w-12">#</th>
                <th className="text-left p-3 text-gray-400 w-20">Phase</th>
                <th className="text-left p-3 text-gray-400 w-20">Pillar</th>
                <th className="text-left p-3 text-gray-400 w-24">Artifact</th>
                <th className="text-left p-3 text-gray-400 w-28">MITRE</th>
                <th className="text-left p-3 text-gray-400">Step Text</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((entry) => (
                <tr key={entry.step} className="border-b border-terminal/5 hover:bg-terminal/5 transition-colors">
                  <td className="p-3 text-gray-500">{entry.step}</td>
                  <td className="p-3 text-gray-300">{entry.phase}</td>
                  <td className={`p-3 ${pillarColors[entry.pillar] || pillarColors.unknown}`}>{entry.pillar}</td>
                  <td className="p-3 text-gray-300">{entry.artifact_type || '—'}</td>
                  <td className="p-3">
                    {entry.mitre_match.length > 0 ? (
                      <div className="flex gap-1 flex-wrap">
                        {entry.mitre_match.map((m) => (
                          <span key={m} className="px-1 py-0.5 rounded bg-red-900/30 text-red-300 text-[9px]">{m}</span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                  <td className="p-3 text-gray-300 max-w-xs truncate" title={entry.text}>{entry.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 60 && !showAll && (
          <div className="p-3 text-center border-t border-terminal/10">
            <button
              onClick={() => setShowAll(true)}
              className="text-xs font-mono text-terminal hover:underline"
            >
              Show all {filtered.length} steps ↓
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Report Tab                                                          */
/* ------------------------------------------------------------------ */
function ReportTab({ report, packageNum }: { report: string; packageNum: string }) {
  if (!report) {
    return (
      <div className="glass-card rounded-lg p-8 border border-terminal/10 text-center">
        <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-3" />
        <p className="text-sm font-mono text-gray-300">Report not available.</p>
      </div>
    );
  }

  // Simple markdown to HTML (headings, tables, bold, code, links)
  const html = report
    .replace(/^### (.+)$/gm, '<h5 class="font-mono font-semibold text-foreground mt-6 mb-2">$1</h5>')
    .replace(/^## (.+)$/gm, '<h4 class="font-mono font-semibold text-foreground text-lg mt-8 mb-3">$1</h4>')
    .replace(/^# (.+)$/gm, '<h3 class="font-mono font-bold text-foreground text-xl mt-8 mb-4">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-muted text-terminal text-xs">$1</code>')
    .replace(/^\|(.+)$/gm, (match) => {
      const cells = match.split('|').filter(Boolean).map((c) => c.trim());
      if (cells.every((c) => /^[-:]+$/.test(c))) return ''; // separator row
      const isHeader = match.includes('---');
      const tag = isHeader ? 'th' : 'td';
      return `<tr>${cells.map((c) => `<${tag} class="p-2 text-left text-xs font-mono border-b border-terminal/10 text-gray-300">${c}</${tag}>`).join('')}</tr>`;
    })
    .replace(/(<tr>.*<\/tr>\n?)+/gs, '<table class="w-full mb-4">$&</table>')
    .replace(/\n(?!<)/g, '<br/>');

  return (
    <div className="glass-card rounded-lg p-6 border border-terminal/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-sm font-semibold text-foreground">replay-report.md</h3>
        <a
          href={`/packages/${packageNum}/evidence/replay-report.md`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-mono text-gray-400 hover:text-terminal flex items-center gap-1"
        >
          Raw file <ExternalLink className="w-3 h-3" />
        </a>
      </div>
      <div
        className="prose-invert text-sm font-mono text-gray-300 leading-relaxed overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
