'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Package, ExternalLink, Terminal, Download, Lock, Info, FileArchive, Loader2, ShieldCheck } from 'lucide-react';
import { useSession } from 'next-auth/react';
import packagesData from '@/data/packages.json';
import { GITHUB_REPO } from '@/lib/constants';
import { trackGithubPivot, trackPackageDownload } from '@/lib/analytics';
import PackageBundler from './package-bundler';

const stakeholderLabels: Record<string, string> = {
  ciso: 'CISO',
  detection: 'Detection Eng',
  soc: 'SOC / IR',
  platform: 'Platform',
};

export default function PackagesContent() {
  const { data: session } = useSession() || {};
  const [bundlerPkg, setBundlerPkg] = useState<typeof packagesData[number] | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handlePackageDownload = useCallback((pkgId: string, repoUrl: string) => {
    setDownloadingId(pkgId);
    trackPackageDownload(pkgId);

    // Try local file first, fall back to GitHub repo
    const localPath = `downloads/packages/${pkgId}.zip`;
    const a = document.createElement('a');
    a.href = `/api/downloads/file?path=${encodeURIComponent(localPath)}`;
    a.download = `${pkgId}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => setDownloadingId(null), 2000);
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="text-center mb-6">
        <h1 className="font-mono text-3xl sm:text-4xl font-bold text-foreground mb-3">
          SOaC <span className="text-terminal">Packages</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Each package bundles detections, playbooks, policies, and lab scenarios for a specific threat domain.
          All code is free on GitHub. Downloads are for convenience and lab integration.
        </p>
      </motion.div>

      {/* Explainer */}
      <motion.div
        initial={{ y: 10 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-card rounded-lg p-4 border border-terminal/10 mb-10 flex items-start gap-3"
      >
        <Info className="w-4 h-4 text-terminal shrink-0 mt-0.5" />
        <p className="text-xs text-gray-300 leading-relaxed">
          <span className="text-gray-100 font-semibold">How packages map to GitHub:</span> The{' '}
          <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer" className="text-terminal hover:underline">GitHub repository</a>{' '}
          is the source of truth for all SOaC artifacts. This portal mirrors the packages for discovery, lab demos, and gated convenience downloads.
          Every package card links directly to its source in the repo.
        </p>
      </motion.div>

      {/* Package Grid */}
      <div className="space-y-4">
        {packagesData.map((pkg, i) => {
          const isDownloading = downloadingId === pkg.id;
          return (
            <motion.div
              key={pkg.id}
              id={pkg.id}
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1 + i * 0.04 }}
              className="glass-card rounded-lg p-6 border border-terminal/10 hover:border-terminal/25 transition-all scroll-mt-24"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Package className="w-4 h-4 text-terminal shrink-0" />
                    <h3 className="font-mono font-semibold text-sm text-foreground">{pkg.name}</h3>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-muted text-gray-400">{pkg.id}</span>
                    {(pkg as any).evidence?.verdict === 'PASS' && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-900/30 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> VERIFIED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed mb-3">{pkg.summary}</p>

                  {/* MITRE tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {pkg.mitre.map((t) => (
                      <span key={t} className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-red-900/30 text-red-300 border border-red-400/30">{t}</span>
                    ))}
                    {pkg.stakeholders.map((s) => (
                      <span key={s} className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-terminal/15 text-emerald-300 border border-terminal/25">
                        {stakeholderLabels[s] || s}
                      </span>
                    ))}
                  </div>

                  {/* Includes */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {pkg.includes.map((inc, j) => (
                      <span key={j} className="text-[10px] text-gray-400 font-mono">✓ {inc}</span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2 shrink-0">
                  <a
                    href={pkg.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackGithubPivot(pkg.repo_url)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-mono bg-muted/50 text-gray-200 border border-border hover:border-terminal/30 transition-all whitespace-nowrap"
                  >
                    View on GitHub
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                  <Link
                    href={`/lab?pkg=${pkg.id}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-mono bg-purple-900/30 text-purple-300 border border-purple-400/30 hover:bg-purple-900/40 transition-all whitespace-nowrap"
                  >
                    <Terminal className="w-3 h-3" />
                    Run Lab
                  </Link>
                  <Link
                    href={`/packages/${pkg.id}/evidence`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-mono bg-emerald-900/30 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-900/40 transition-all whitespace-nowrap"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    Evidence
                  </Link>
                  <button
                    onClick={() => setBundlerPkg(pkg)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-mono bg-amber-900/30 text-amber-300 border border-amber-400/30 hover:bg-amber-900/40 transition-all whitespace-nowrap"
                  >
                    <FileArchive className="w-3 h-3" />
                    Custom Export
                  </button>
                  {session?.user ? (
                    <button
                      onClick={() => handlePackageDownload(pkg.id, pkg.repo_url)}
                      disabled={isDownloading}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-mono bg-terminal/20 text-terminal border border-terminal/30 hover:bg-terminal/30 transition-all whitespace-nowrap disabled:opacity-60"
                    >
                      {isDownloading ? (
                        <><Loader2 className="w-3 h-3 animate-spin" /> Downloading...</>
                      ) : (
                        <><Download className="w-3 h-3" /> Download ZIP</>
                      )}
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-mono bg-muted/30 text-gray-300 border border-border transition-all whitespace-nowrap"
                    >
                      <Lock className="w-3 h-3" />
                      Login to Download
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Package Bundler Modal */}
      {bundlerPkg && (
        <PackageBundler pkg={bundlerPkg} onClose={() => setBundlerPkg(null)} />
      )}
    </div>
  );
}
