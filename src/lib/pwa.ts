'use client';

/** Gestion du prompt d'installation PWA (beforeinstallprompt) */

interface BipEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferred: BipEvent | null = null;

export function captureInstall(): void {
  if (typeof window === 'undefined') return;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e as BipEvent;
    window.dispatchEvent(new Event('am:can-install'));
  });
}

export function canInstall(): boolean {
  return deferred != null;
}

export async function promptInstall(): Promise<boolean> {
  if (!deferred) return false;
  try {
    await deferred.prompt();
    const res = await deferred.userChoice;
    deferred = null;
    return res.outcome === 'accepted';
  } catch {
    return false;
  }
}
