import NavBar from '@/app/components/nav-bar';
import Footer from '@/app/components/footer';
import EvidenceViewer from './_components/evidence-viewer';
import packagesData from '@/data/packages.json';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props {
  params: { id: string };
}

export default function EvidencePage({ params }: Props) {
  const pkg = packagesData.find((p) => p.id === params.id);
  if (!pkg) return notFound();

  const num = pkg.id.replace('pkg-', '');

  return (
    <main className="min-h-screen">
      <NavBar />
      <div className="pt-16">
        <EvidenceViewer packageId={pkg.id} packageName={pkg.name} packageNum={num} mitre={pkg.mitre} />
      </div>
      <Footer />
    </main>
  );
}
