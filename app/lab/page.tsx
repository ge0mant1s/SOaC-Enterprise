import { Suspense } from 'react';
import NavBar from '../components/nav-bar';
import Footer from '../components/footer';
import ScenarioGallery from './_components/scenario-gallery';
import LabClient from './_components/lab-client';

export default function LabPage() {
  return (
    <main className="min-h-screen">
      <NavBar />
      <div className="pt-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="font-mono text-3xl sm:text-4xl font-bold text-foreground mb-3">
              The <span className="text-terminal animate-glow">Lab</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
              Watch the SOaC Distributed Intelligence Architecture in action. Run simulations, explore scenario packages, and deploy them in your own environment.
            </p>
          </div>

          {/* Client component that reads ?pkg= and renders LabContainer */}
          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <span className="font-mono text-sm text-muted-foreground animate-pulse">Loading scenario...</span>
            </div>
          }>
            <LabClient />
          </Suspense>

          {/* Scenario gallery driven by packages.json */}
          <ScenarioGallery />
        </div>
      </div>
      <Footer />
    </main>
  );
}
