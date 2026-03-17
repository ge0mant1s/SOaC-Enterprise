// GA4 analytics helpers
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_ID || '';

export function isAnalyticsEnabled(): boolean {
  return !!GA_MEASUREMENT_ID && typeof window !== 'undefined';
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function gtagEvent(
  action: string,
  params?: Record<string, string | number | boolean>
) {
  if (!isAnalyticsEnabled() || !window.gtag) return;
  window.gtag('event', action, params);
}

// Custom SOaC events
export const trackLabLaunch = () => gtagEvent('lab_launch');

export const trackPackageDownload = (packageId: string) =>
  gtagEvent('package_download', { package_id: packageId });

export const trackWhitepaperView = () => gtagEvent('whitepaper_view');

export const trackGithubPivot = (url: string) =>
  gtagEvent('github_pivot', { link_url: url });
