'use client';

import { useSearchParams } from 'next/navigation';
import LabContainer from './lab-container';

export default function LabClient() {
  const searchParams = useSearchParams();
  const pkgId = searchParams?.get('pkg') ?? null;

  return <LabContainer pkgId={pkgId} />;
}
