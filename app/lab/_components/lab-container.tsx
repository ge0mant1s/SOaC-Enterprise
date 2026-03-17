'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Download, Lock, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import LabTerminal from './lab-terminal';
import type { ScenarioData } from './lab-terminal';
import LabGraph from './lab-graph';
import scenariosJson from '@/data/scenarios.json';
import packagesData from '@/data/packages.json';

interface LabContainerProps {
  pkgId?: string | null;
}

export default function LabContainer({ pkgId }: LabContainerProps) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const { data: session } = useSession() || {};

  // Resolve scenario
  const scenarioKey = pkgId && (scenariosJson as Record<string, ScenarioData>)[pkgId] ? pkgId : 'general';
  const scenario = (scenariosJson as Record<string, ScenarioData>)[scenarioKey];

  // Resolve package info for CTA
  const pkg = pkgId ? packagesData.find(p => p.id === pkgId) : null;

  return (
    <>
      {/* Scenario header */}
      <div className="mb-6 text-center">
        <h2 className="font-mono text-xl sm:text-2xl font-bold text-foreground mb-1">
          {scenario.title}
        </h2>
        <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
          {scenario.subtitle}
        </p>
        {pkg && (
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-terminal/10 text-terminal border border-terminal/20">
              {pkg.id.toUpperCase()}
            </span>
            <a
              href={pkg.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-mono text-muted-foreground hover:text-terminal transition-colors flex items-center gap-1"
            >
              {pkg.repo_path}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

      {/* Graph visualizer */}
      <LabGraph
        currentPhase={currentPhase}
        isComplete={isComplete}
        isRunning={isRunning}
        graphStates={scenario.graph_states}
        successMetrics={scenario.success_metrics}
      />

      {/* Terminal */}
      <LabTerminal
        scenario={scenario}
        onPhaseChange={setCurrentPhase}
        onCompleteChange={setIsComplete}
        onRunningChange={setIsRunning}
      />

      {/* Post-simulation CTA */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ delay: 0.3 }}
            className="mt-8 glass-card rounded-lg p-6 border border-terminal/20 text-center"
          >
            {pkg ? (
              <>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Package className="w-5 h-5 text-terminal" />
                  <h3 className="font-mono text-lg font-bold text-foreground">Deploy This Package</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-5 max-w-lg mx-auto">
                  Clone the artifacts, review the code, and deploy <span className="text-terminal font-mono">{pkg.id.toUpperCase()}</span> in your own environment.
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  {session ? (
                    <a
                      href={`/api/downloads/file?path=${encodeURIComponent(`downloads/packages/${pkg.id}.zip`)}`}
                      download={`${pkg.id}.zip`}
                      className="flex items-center gap-2 px-4 py-2 rounded-md bg-terminal/20 text-terminal text-sm font-mono border border-terminal/30 hover:bg-terminal/30 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Download Package {pkg.id.replace('pkg-', '').padStart(3, '0')}
                    </a>
                  ) : (
                    <Link
                      href="/login"
                      className="flex items-center gap-2 px-4 py-2 rounded-md bg-terminal/20 text-terminal text-sm font-mono border border-terminal/30 hover:bg-terminal/30 transition-all"
                    >
                      <Lock className="w-4 h-4" />
                      Sign In to Download
                    </Link>
                  )}
                  <a
                    href={pkg.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-muted/50 text-foreground text-sm font-mono border border-border hover:border-terminal/30 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Code on GitHub
                  </a>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-mono text-lg font-bold text-foreground mb-3">Explore Scenario Packages</h3>
                <p className="text-sm text-muted-foreground mb-5 max-w-lg mx-auto">
                  Each SOaC package bundles detections, playbooks, and policies for a specific threat domain. Pick one below and run its scenario.
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <Link
                    href="/packages"
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-terminal/20 text-terminal text-sm font-mono border border-terminal/30 hover:bg-terminal/30 transition-all"
                  >
                    <Package className="w-4 h-4" />
                    Browse Packages
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
