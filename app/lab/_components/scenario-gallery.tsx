'use client';

import Link from 'next/link';
import { ExternalLink, Play, MessageSquare, GitBranch, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { GITHUB_DISCUSSIONS } from '@/lib/constants';
import packagesData from '@/data/packages.json';

const stakeholderLabels: Record<string, string> = {
  ciso: 'CISO',
  detection: 'Detection Eng',
  soc: 'SOC / IR',
  platform: 'Platform / Cloud',
};

export default function ScenarioGallery() {
  return (
    <section className="mt-16">
      <div className="text-center mb-8">
        <h2 className="font-mono text-2xl font-bold text-foreground mb-2">
          Scenario <span className="text-terminal">Gallery</span>
        </h2>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">
          Each scenario maps to an open-source SOaC package. Clone the artifacts, run them in your lab, or discuss with the community.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {packagesData.map((pkg, i) => (
          <motion.div
            key={pkg.id}
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card rounded-lg p-5 flex flex-col border border-border hover:border-terminal/30 transition-all"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 rounded-md bg-terminal/10">
                <Shield className="w-5 h-5 text-terminal" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-mono font-semibold text-sm text-foreground leading-tight mb-1">
                  {pkg.name}
                </h3>
                <div className="flex flex-wrap gap-1">
                  {pkg.mitre.map((t) => (
                    <span key={t} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-red-900/30 text-red-300 border border-red-500/30">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed mb-3 flex-1">
              {pkg.summary}
            </p>

            {/* Stakeholder tags */}
            <div className="flex flex-wrap gap-1 mb-4">
              {pkg.stakeholders.map((s) => (
                <span key={s} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-terminal/15 text-emerald-300 border border-terminal/25">
                  {stakeholderLabels[s] || s}
                </span>
              ))}
            </div>

            {/* Artifacts on GitHub */}
            <a
              href={pkg.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-mono text-emerald-300 hover:underline mb-4"
            >
              <GitBranch className="w-3.5 h-3.5" />
              {pkg.repo_path}
              <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
            </a>

            {/* CTAs */}
            <div className="flex items-center gap-2 pt-3 border-t border-border">
              <Link
                href={`/lab?pkg=${pkg.id}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-terminal/20 text-emerald-300 text-xs font-mono border border-terminal/30 hover:bg-terminal/30 transition-all"
              >
                <Play className="w-3 h-3" />
                Run Scenario
              </Link>
              <a
                href={GITHUB_DISCUSSIONS}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-muted/50 text-gray-300 text-xs font-mono border border-border hover:border-terminal/30 hover:text-foreground transition-all"
              >
                <MessageSquare className="w-3 h-3" />
                Discuss
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
