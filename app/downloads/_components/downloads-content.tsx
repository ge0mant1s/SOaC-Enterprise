'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ExternalLink,
  Download,
  Shield,
  Brain,
  Zap,
  Radio,
  Package,
  ScrollText,
  Tag,
  Filter,
  Terminal,
  FileText,
  Play,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const GH_BLOB = 'https://github.com/ge0mant1s/SOaC-Enterprise/blob/main';
const GH_RAW  = 'https://raw.githubusercontent.com/ge0mant1s/SOaC-Enterprise/main';
const GH_TREE = 'https://github.com/ge0mant1s/SOaC-Enterprise/tree/main';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type Pillar = 'start-here' | 'the-body' | 'the-brain' | 'the-purpose' | 'the-edge' | 'packages' | 'releases';
type Audience = 'CISO/Board' | 'SOC/IR' | 'Detection Eng' | 'Engineers' | 'Platform/Cloud' | 'Operators' | 'All';

interface Asset {
  id: string;
  title: string;
  description: string;
  pillar: Pillar;
  audiences: Audience[];
  githubUrl: string;
  rawUrl?: string;        // raw.githubusercontent.com URL for direct download
  isFolder?: boolean;
  localDownload?: string; // path served by /api/downloads/file
  version?: string;       // version badge label e.g. "v1.1 | March 2026"
}

interface PkgEntry {
  id: string;
  name: string;
  description: string;
  audiences: Audience[];
  mitre: string[];
  githubFolder: string;
  labPkg: string;
}

/* ------------------------------------------------------------------ */
/*  Pillar metadata                                                    */
/* ------------------------------------------------------------------ */
const pillarMeta: Record<Pillar, { label: string; emoji: string; icon: React.ComponentType<{ className?: string }>; color: string; border: string; bg: string }> = {
  'start-here':   { label: '\u{1F680} Start Here', emoji: '\u{1F680}', icon: Zap, color: 'text-yellow-400', border: 'border-yellow-400/20', bg: 'bg-yellow-400/10' },
  'the-body':     { label: '\u{1F6E1}\uFE0F The Body \u2014 Telemetry & Detections', emoji: '\u{1F6E1}\uFE0F', icon: Shield, color: 'text-green-400', border: 'border-green-400/20', bg: 'bg-green-400/10' },
  'the-brain':    { label: '\u{1F9E0} The Brain \u2014 Reasoning & Governance', emoji: '\u{1F9E0}', icon: Brain, color: 'text-blue-400', border: 'border-blue-400/20', bg: 'bg-blue-400/10' },
  'the-purpose':  { label: '\u26A1 The Purpose \u2014 CLAW Playbooks-as-Code', emoji: '\u26A1', icon: Zap, color: 'text-purple-400', border: 'border-purple-400/20', bg: 'bg-purple-400/10' },
  'the-edge':     { label: '\u{1F310} The Edge \u2014 Enforcement & Policy-as-Code', emoji: '\u{1F310}', icon: Radio, color: 'text-cyan-400', border: 'border-cyan-400/20', bg: 'bg-cyan-400/10' },
  'packages':     { label: '\u{1F4E6} Packages \u2014 All 11 Bundles', emoji: '\u{1F4E6}', icon: Package, color: 'text-amber-400', border: 'border-amber-400/20', bg: 'bg-amber-400/10' },
  'releases':     { label: '\u{1F4CB} Releases & Changelog', emoji: '\u{1F4CB}', icon: ScrollText, color: 'text-gray-400', border: 'border-gray-400/20', bg: 'bg-gray-400/10' },
};

/* ------------------------------------------------------------------ */
/*  Asset data                                                         */
/* ------------------------------------------------------------------ */
const assets: Asset[] = [
  // Start Here
  { id: 'wp', title: 'SOaC Enterprise White Paper v1.1 (Mar 2026)', description: 'Executive overview of the SOaC Distributed Intelligence Architecture for board-level presentation.', pillar: 'start-here', audiences: ['CISO/Board'], githubUrl: `${GH_BLOB}/docs/soac_enterprise_white_paper_2026_v1.1.pdf`, localDownload: 'downloads/soac_enterprise_white_paper_2026_v1.1.pdf', version: 'v1.1 | March 2026' },
  { id: 'claw-spec-pdf', title: 'CLAW Playbook Schema v1.0 Spec (PDF)', description: 'Formal specification of the CLAW YAML schema — the contract between human operators and automated response.', pillar: 'start-here', audiences: ['SOC/IR', 'Engineers'], githubUrl: `${GH_BLOB}/docs/specs/claw_playbook_schema_v1.0_spec.pdf`, localDownload: 'downloads/claw_playbook_schema_v1.0_spec.pdf' },
  { id: 'quick-start', title: 'Quick Start Validation Script', description: 'Python script to validate your SOaC deployment end-to-end in under 5 minutes.', pillar: 'start-here', audiences: ['Operators'], githubUrl: `${GH_BLOB}/quick_start_validation.py` },
  { id: 'compliance', title: 'Compliance Matrix', description: 'Maps SOaC controls to NIST, MITRE, ISO 27001, and SOC2 requirements.', pillar: 'start-here', audiences: ['CISO/Board'], githubUrl: `${GH_BLOB}/SOaC_Enterprise_Compliance_Matrix.md` },
  { id: 'ciso-guide', title: 'CISO Transformation Guide (PDF)', description: 'From reactive risk to programmable resilience — strategic framework for evaluating and executing SOaC adoption.', pillar: 'start-here', audiences: ['CISO/Board'], githubUrl: `${GH_BLOB}/docs/executive/ciso_transformation_guide.pdf`, localDownload: 'downloads/docs/executive/ciso_transformation_guide.pdf' },
  { id: 'tmpl-claw', title: 'CLAW Playbook Template v1.0', description: 'Canonical YAML schema for all CLAW automated response playbooks. Every playbook in every package MUST conform to this template.', pillar: 'start-here', audiences: ['SOC/IR', 'Engineers'], githubUrl: `${GH_BLOB}/core/templates/claw_playbook_v1.0.yaml` },
  { id: 'tmpl-detection', title: 'Detection Rule Template v1.0', description: 'Canonical YAML schema for all detection rules. Multi-platform support (Splunk, Sentinel, CrowdStrike, Sigma).', pillar: 'start-here', audiences: ['Engineers', 'SOC/IR'], githubUrl: `${GH_BLOB}/core/templates/detection_rule_v1.0.yaml` },
  { id: 'tmpl-policy', title: 'Policy-as-Code Template v1.0', description: 'Canonical YAML schema for policy definitions. Covers environment constraints, action controls, and compliance mapping.', pillar: 'start-here', audiences: ['CISO/Board', 'Engineers'], githubUrl: `${GH_BLOB}/core/templates/policy_v1.0.yaml` },
  { id: 'tmpl-metadata', title: 'Package Metadata Template v1.0', description: 'Required metadata.yml manifest for every SOaC package. Declares identity, threat coverage, artifacts, and validation status.', pillar: 'start-here', audiences: ['Engineers', 'Operators'], githubUrl: `${GH_BLOB}/core/templates/metadata_v1.0.yaml` },
  { id: 'soc-runbook', title: 'SOC / IR Deployment Runbook (PDF)', description: 'Operational playbook for SOC analysts and incident responders — lab setup, scenario execution, CLAW deployment, and procedures.', pillar: 'start-here', audiences: ['SOC/IR'], githubUrl: `${GH_BLOB}/docs/operations/soc_ir_deployment_runbook.pdf`, localDownload: 'downloads/docs/operations/soc_ir_deployment_runbook.pdf' },
  { id: 'arch-ref', title: 'Architecture Reference (PDF)', description: 'Technical blueprint covering all four pillars, data flow, integration points, security model, and deployment topology.', pillar: 'start-here', audiences: ['Engineers', 'Platform/Cloud'], githubUrl: `${GH_BLOB}/docs/technical/soac_architecture_diagram.pdf`, localDownload: 'downloads/docs/technical/soac_architecture_diagram.pdf' },
  { id: 'soac-harness', title: 'SOaC Harness — CLI Validation Engine', description: 'Offline, CI-ready CLI that validates Playbooks, Detections, Policies, and Package Metadata at Level 1 (Schema) and Level 2 (Cross-Reference).', pillar: 'start-here', audiences: ['Engineers', 'Operators'], githubUrl: `${GH_TREE}/tools/soac-harness`, isFolder: true, version: 'v2.0.0' },
  { id: 'soac-ci-yml', title: 'GitHub Actions CI Pipeline', description: 'Ready-made soac-ci.yml workflow that runs Level 1 + Level 2 harness validation on every push and PR to main.', pillar: 'start-here', audiences: ['Engineers', 'Operators'], githubUrl: `${GH_BLOB}/.github/workflows/soac-ci.yml` },

  // The Body
  { id: 'sample-alert', title: 'Sample Identity Theft Alert (JSON)', description: 'Example AitM phishing alert payload showing the telemetry structure SOaC consumes.', pillar: 'the-body', audiences: ['SOC/IR'], githubUrl: `${GH_BLOB}/samples_identity_theft_alert.json` },
  { id: 'vendor-packs', title: 'Vendor Packs (Sigma/KQL/SPL/LQL)', description: 'Detection rules in all major SIEM query languages, ready to deploy.', pillar: 'the-body', audiences: ['Detection Eng'], githubUrl: `${GH_TREE}/packages/vendor_packs`, isFolder: true },
  { id: 'all-packages-body', title: 'All 11 Package Folders', description: 'Browse the full set of detection + response packages on GitHub.', pillar: 'the-body', audiences: ['All'], githubUrl: `${GH_TREE}/packages`, isFolder: true },

  // The Brain
  { id: 'ai-gov', title: 'AI Governance Baseline (YAML)', description: 'Prompt injection defense, data-leakage prevention, and decision authority matrix for Claude Security AI.', pillar: 'the-brain', audiences: ['Platform/Cloud'], githubUrl: `${GH_BLOB}/brain/ai/governance/ai_governance_baseline.yaml`, rawUrl: `${GH_RAW}/brain/ai/governance/ai_governance_baseline.yaml` },
  { id: 'compliance-brain', title: 'Compliance Matrix', description: 'Maps SOaC controls to NIST, MITRE, ISO 27001, and SOC2 requirements.', pillar: 'the-brain', audiences: ['CISO/Board'], githubUrl: `${GH_BLOB}/SOaC_Enterprise_Compliance_Matrix.md` },

  // The Purpose
  { id: 'claw-spec-pdf2', title: 'CLAW Schema v1.0 Spec (PDF)', description: 'Full specification defining the YAML contract for automated response playbooks.', pillar: 'the-purpose', audiences: ['Engineers'], githubUrl: `${GH_BLOB}/docs/specs/claw_playbook_schema_v1.0_spec.pdf`, localDownload: 'downloads/claw_playbook_schema_v1.0_spec.pdf' },
  { id: 'claw-schema-md', title: 'CLAW Schema (Markdown)', description: 'Human-readable schema reference for CLAW playbooks.', pillar: 'the-purpose', audiences: ['Engineers'], githubUrl: `${GH_BLOB}/docs/specs/claw_playbook_schema_v1.0.md` },
  { id: 'master-orch', title: 'Master Orchestrator (Python)', description: 'The central orchestration engine that executes CLAW playbooks.', pillar: 'the-purpose', audiences: ['Platform/Cloud'], githubUrl: `${GH_BLOB}/master_orchestrator.py` },
  { id: 'requirements', title: 'Requirements', description: 'Python dependencies for running the orchestrator and validation scripts.', pillar: 'the-purpose', audiences: ['Operators'], githubUrl: `${GH_BLOB}/requirements.txt` },

  // The Edge
  { id: 'edge-api', title: 'Edge API Spec', description: 'HMAC-signed enforcement API for distributed policy enforcement at the network edge.', pillar: 'the-edge', audiences: ['Platform/Cloud'], githubUrl: `${GH_BLOB}/edge/specs/edge_api_spec_v1.md`, rawUrl: `${GH_RAW}/edge/specs/edge_api_spec_v1.md` },
  { id: 'lab-safety', title: 'Lab Safety Policy (YAML)', description: 'Policy-as-code controlling lab vs. staging vs. production behavior boundaries.', pillar: 'the-edge', audiences: ['SOC/IR'], githubUrl: `${GH_BLOB}/brain/policy/lab_safety_policy.yaml`, rawUrl: `${GH_RAW}/brain/policy/lab_safety_policy.yaml` },

  // Releases
  { id: 'roadmap', title: 'Release 1.0 Roadmap', description: 'Milestone plan and delivery timeline for the SOaC 1.0 release.', pillar: 'releases', audiences: ['All'], githubUrl: `${GH_BLOB}/RELEASE_1.0_ROADMAP.md` },
  { id: 'contributing', title: 'Contributing Guide', description: 'How to contribute detection rules, playbooks, and documentation to SOaC.', pillar: 'releases', audiences: ['All'], githubUrl: `${GH_BLOB}/CONTRIBUTING.md` },
  { id: 'coc', title: 'Code of Conduct', description: 'Community standards for respectful, inclusive collaboration.', pillar: 'releases', audiences: ['All'], githubUrl: `${GH_BLOB}/CODE_OF_CONDUCT.md` },
];

/* ------------------------------------------------------------------ */
/*  Package data (all 11)                                              */
/* ------------------------------------------------------------------ */
const packages: PkgEntry[] = [
  { id: 'pkg-001', name: 'Identity-led Intrusion Defense', description: 'AitM phishing, session hijacking, and identity attacks across Okta, Entra ID, Azure AD.', audiences: ['CISO/Board', 'Detection Eng', 'SOC/IR'], mitre: ['T1557.001', 'T1078.004', 'T1539'], githubFolder: 'packages/001_identity_intrusion_defense', labPkg: '001' },
  { id: 'pkg-002', name: 'Ransomware Containment & Response', description: 'Automated host isolation, process kill, forensic snapshot, and SOC notification.', audiences: ['SOC/IR', 'Detection Eng', 'Platform/Cloud'], mitre: ['T1486', 'T1059', 'T1068', 'T1490'], githubFolder: 'packages/002_ransomware_containment', labPkg: '002' },
  { id: 'pkg-003', name: 'Supply Chain & npm Compromise', description: 'Detect malicious npm packages, dependency confusion, and software supply chain attacks.', audiences: ['Detection Eng', 'Platform/Cloud'], mitre: ['T1195.002', 'T1059.007', 'T1027'], githubFolder: 'packages/003_supply_chain_defense', labPkg: '003' },
  { id: 'pkg-004', name: 'BYOVD & Kernel Exploit Defense', description: 'Bring Your Own Vulnerable Driver and kernel-level exploitation detection.', audiences: ['Detection Eng', 'SOC/IR', 'Platform/Cloud'], mitre: ['T1068', 'T1014', 'T1547.006'], githubFolder: 'packages/004_byovd_defense', labPkg: '004' },
  { id: 'pkg-005', name: 'SEO Poisoning & Gootloader Defense', description: 'SEO poisoning campaigns and Gootloader malware delivery via compromised sites.', audiences: ['Detection Eng', 'SOC/IR'], mitre: ['T1189', 'T1059.007', 'T1071.001'], githubFolder: 'packages/005_seo_poisoning_defense', labPkg: '005' },
  { id: 'pkg-006', name: 'Credential Harvesting & Phishing Kit', description: 'Detection of credential harvesting infrastructure and phishing kit deployment patterns.', audiences: ['SOC/IR', 'Detection Eng'], mitre: ['T1598', 'T1566.002', 'T1056.004'], githubFolder: 'packages/006_credential_harvesting', labPkg: '006' },
  { id: 'pkg-007', name: 'Cloud IAM Privilege Escalation', description: 'Detect and respond to IAM role chaining, cross-account pivoting, and cloud privilege abuse.', audiences: ['Platform/Cloud', 'Detection Eng'], mitre: ['T1078.004', 'T1548', 'T1484'], githubFolder: 'packages/007_cloud_iam_privesc', labPkg: '007' },
  { id: 'pkg-008', name: 'Lateral Movement & RDP Abuse', description: 'Detect RDP tunneling, pass-the-hash, and network-layer lateral movement techniques.', audiences: ['SOC/IR', 'Detection Eng'], mitre: ['T1021.001', 'T1550.002', 'T1570'], githubFolder: 'packages/008_lateral_movement', labPkg: '008' },
  { id: 'pkg-009', name: 'Data Exfiltration & Staging', description: 'Detect data staging, compression, and exfiltration over C2 and legitimate channels.', audiences: ['SOC/IR', 'Detection Eng', 'CISO/Board'], mitre: ['T1560', 'T1041', 'T1567'], githubFolder: 'packages/009_data_exfiltration', labPkg: '009' },
  { id: 'pkg-010', name: 'Living off the Land (LOLBins)', description: 'Detect abuse of legitimate system binaries for execution, persistence, and defense evasion.', audiences: ['Detection Eng', 'SOC/IR'], mitre: ['T1218', 'T1059.001', 'T1036'], githubFolder: 'packages/010_lolbins_defense', labPkg: '010' },
  { id: 'pkg-011', name: 'Insider Threat & Anomalous Behavior', description: 'Behavioral analytics for detecting insider threat indicators and anomalous access patterns.', audiences: ['CISO/Board', 'SOC/IR', 'Platform/Cloud'], mitre: ['T1078', 'T1530', 'T1213'], githubFolder: 'packages/011_insider_threat', labPkg: '011' },
];

/* ------------------------------------------------------------------ */
/*  Audience colour helper                                             */
/* ------------------------------------------------------------------ */
function audienceColor(a: Audience) {
  switch (a) {
    case 'CISO/Board': return 'bg-amber-900/30 text-amber-400';
    case 'SOC/IR': return 'bg-red-900/30 text-red-400';
    case 'Detection Eng': return 'bg-green-900/30 text-green-400';
    case 'Engineers': return 'bg-purple-900/30 text-purple-400';
    case 'Platform/Cloud': return 'bg-blue-900/30 text-blue-400';
    case 'Operators': return 'bg-cyan-900/30 text-cyan-400';
    default: return 'bg-gray-900/30 text-gray-400';
  }
}

/* ------------------------------------------------------------------ */
/*  Asset Card                                                         */
/* ------------------------------------------------------------------ */
function AssetCard({ asset, pillar }: { asset: Asset; pillar: Pillar }) {
  const pm = pillarMeta[pillar];
  return (
    <div className={`glass-card rounded-lg border ${pm.border} p-4 flex flex-col gap-3`}>
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-mono text-sm font-semibold text-foreground">{asset.title}</h4>
          {asset.version && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-terminal/20 text-terminal border border-terminal/30">
              {asset.version}
            </span>
          )}
        </div>
        <p className="font-mono text-xs text-muted-foreground mt-1 leading-relaxed">{asset.description}</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${pm.bg} ${pm.color}`}>
          {pillarMeta[pillar].emoji} {pillar.replace(/-/g, ' ')}
        </span>
        {asset.audiences.map((a) => (
          <span key={a} className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${audienceColor(a)}`}>{a}</span>
        ))}
      </div>
      <div className="flex gap-2 mt-auto">
        <a
          href={asset.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs bg-terminal/20 text-terminal border border-terminal/30 hover:bg-terminal/30 transition-all"
        >
          <ExternalLink className="w-3 h-3" />
          View on GitHub
        </a>
        {asset.localDownload && (
          <a
            href={`/api/downloads/file?path=${encodeURIComponent(asset.localDownload)}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs bg-muted/50 text-foreground border border-border hover:bg-muted transition-all"
          >
            <Download className="w-3 h-3" />
            Download
          </a>
        )}
        {!asset.localDownload && asset.rawUrl && (
          <a
            href={asset.rawUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs bg-muted/50 text-foreground border border-border hover:bg-muted transition-all"
          >
            <Download className="w-3 h-3" />
            Download
          </a>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Package Card                                                       */
/* ------------------------------------------------------------------ */
function PackageCard({ pkg }: { pkg: PkgEntry }) {
  const pm = pillarMeta.packages;
  return (
    <div className={`glass-card rounded-lg border ${pm.border} p-4 flex flex-col gap-3`}>
      <div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-amber-400 bg-amber-900/30 px-1.5 py-0.5 rounded">{pkg.id.toUpperCase()}</span>
          <h4 className="font-mono text-sm font-semibold text-foreground">{pkg.name}</h4>
        </div>
        <p className="font-mono text-xs text-muted-foreground mt-1 leading-relaxed">{pkg.description}</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {pkg.audiences.map((a) => (
          <span key={a} className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${audienceColor(a)}`}>{a}</span>
        ))}
        {pkg.mitre.map((m) => (
          <span key={m} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-red-900/20 text-red-300">{m}</span>
        ))}
      </div>
      <div className="flex gap-2 mt-auto">
        <a
          href={`${GH_TREE}/${pkg.githubFolder}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs bg-terminal/20 text-terminal border border-terminal/30 hover:bg-terminal/30 transition-all"
        >
          <ExternalLink className="w-3 h-3" />
          View on GitHub
        </a>
        <Link
          href={`/lab?pkg=${pkg.labPkg}`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 transition-all"
        >
          <Play className="w-3 h-3" />
          Run Lab
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Pillar filter                                                      */
/* ------------------------------------------------------------------ */
const PILLARS: Pillar[] = ['start-here', 'the-body', 'the-brain', 'the-purpose', 'the-edge', 'packages', 'releases'];
const AUDIENCES: Audience[] = ['CISO/Board', 'SOC/IR', 'Detection Eng', 'Engineers', 'Platform/Cloud', 'Operators', 'All'];

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export default function DownloadsContent() {
  const [pillarFilter, setPillarFilter] = useState<Pillar | 'all'>('all');
  const [audienceFilter, setAudienceFilter] = useState<Audience | 'all'>('all');

  const filteredAssets = assets.filter((a) => {
    if (pillarFilter !== 'all' && a.pillar !== pillarFilter) return false;
    if (audienceFilter !== 'all' && !a.audiences.includes(audienceFilter)) return false;
    return true;
  });

  const filteredPackages = packages.filter((p) => {
    if (pillarFilter !== 'all' && pillarFilter !== 'packages') return false;
    if (audienceFilter !== 'all' && !p.audiences.includes(audienceFilter)) return false;
    return true;
  });

  const showPackages = pillarFilter === 'all' || pillarFilter === 'packages';

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Download className="w-6 h-6 text-terminal" />
          <h1 className="font-mono text-2xl sm:text-3xl font-bold text-foreground">
            Downloads <span className="text-terminal">Catalog</span>
          </h1>
        </div>
        <p className="text-sm text-muted-foreground font-mono max-w-2xl">
          Every artifact aligned to SOaC\'s five pillars. GitHub is the source of truth — direct downloads are provided where files are available locally.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-8 flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Pillar:</span>
          <select
            value={pillarFilter}
            onChange={(e) => setPillarFilter(e.target.value as Pillar | 'all')}
            className="bg-muted/50 border border-border rounded-md px-2 py-1 font-mono text-xs text-foreground focus:outline-none focus:border-terminal/50"
          >
            <option value="all">All Pillars</option>
            {PILLARS.map((p) => (
              <option key={p} value={p}>{pillarMeta[p].label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Tag className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Audience:</span>
          <select
            value={audienceFilter}
            onChange={(e) => setAudienceFilter(e.target.value as Audience | 'all')}
            className="bg-muted/50 border border-border rounded-md px-2 py-1 font-mono text-xs text-foreground focus:outline-none focus:border-terminal/50"
          >
            <option value="all">All Audiences</option>
            {AUDIENCES.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Asset sections by pillar */}
      {PILLARS.filter((p) => p !== 'packages').map((pillar) => {
        const items = filteredAssets.filter((a) => a.pillar === pillar);
        if (items.length === 0) return null;
        const pm = pillarMeta[pillar];
        const Icon = pm.icon;
        return (
          <motion.section
            key={pillar}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex items-center gap-2 mb-4">
              <Icon className={`w-5 h-5 ${pm.color}`} />
              <h2 className={`font-mono text-lg font-bold ${pm.color}`}>{pm.label}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((a) => <AssetCard key={a.id} asset={a} pillar={pillar} />)}
            </div>
          </motion.section>
        );
      })}

      {/* Packages section */}
      {showPackages && filteredPackages.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Package className={`w-5 h-5 ${pillarMeta.packages.color}`} />
            <h2 className={`font-mono text-lg font-bold ${pillarMeta.packages.color}`}>{pillarMeta.packages.label}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPackages.map((p) => <PackageCard key={p.id} pkg={p} />)}
          </div>
        </motion.section>
      )}

      {/* Empty state */}
      {filteredAssets.length === 0 && filteredPackages.length === 0 && (
        <div className="text-center py-20">
          <p className="font-mono text-sm text-muted-foreground">No assets match the selected filters.</p>
        </div>
      )}
    </div>
  );
}
