import NavBar from './components/nav-bar';
import Footer from './components/footer';
import LandingHero from './components/landing-hero';
import ThreatLandscape from './components/threat-landscape';
import ArchitectureOverview from './components/architecture-overview';
import OpenByDesign from './components/open-by-design';
import StakeholderTiles from './components/stakeholder-tiles';
import InterestForm from './components/interest-form';

export default function Home() {
  return (
    <main className="min-h-screen">
      <NavBar />
      <div className="pt-16">
        <LandingHero />
        <ArchitectureOverview />
        <OpenByDesign />
        <StakeholderTiles />
        <ThreatLandscape />
        <section className="py-20">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
              <InterestForm />
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
