'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  BadgeCheck,
  Download,
  MapPin,
  MessageCircle,
  Share2,
  ShieldCheck,
} from 'lucide-react';
import { ZONES } from '@/data/businesses';
import { cn } from '@/lib/utils';
import { captureInstall, canInstall, promptInstall } from '@/lib/pwa';
import { useApp } from '@/store/app';
import { SectionLabel } from './bits';

export function ProfileScreen() {
  const zone = useApp((s) => s.zone);
  const setZone = useApp((s) => s.setZone);
  const [installable, setInstallable] = useState(false);

  useEffect(() => {
    const check = () => setInstallable(canInstall());
    check();
    window.addEventListener('am:can-install', check);
    return () => window.removeEventListener('am:can-install', check);
  }, []);

  const shareApp = async () => {
    const data = {
      title: 'Around Me',
      text: "Trouvez ce qu'il vous faut, autour de vous — Lomé 🇹🇬",
      url: window.location.origin,
    };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(window.location.origin);
        toast.success('Lien copié, partagez-le ! 🔗');
      }
    } catch {
      /* annulé */
    }
  };

  const onInstall = async () => {
    const ok = await promptInstall();
    if (ok) toast.success('Around Me a été installée 🎉');
  };

  const rowClass =
    'flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3.5 text-left ring-1 ring-black/5 transition-transform active:scale-[0.98]';

  return (
    <div className="flex min-h-full flex-col">
      {/* En-tête profil */}
      <header className="flex items-center gap-4 px-5 pt-7">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-corail to-corail-deep text-[20px] font-bold text-white shadow-[0_6px_16px_rgba(255,127,107,0.45)]">
          K
        </span>
        <div>
          <h1 className="flex items-center gap-1.5 text-[19px] font-bold text-brun">
            Koffi
            <BadgeCheck size={16} className="text-sauge" />
          </h1>
          <p className="text-[12px] text-brun-soft">Habite à Lomé 🇹🇬</p>
        </div>
      </header>

      {/* Zone */}
      <section className="mt-6 px-5" aria-label="Ma zone">
        <SectionLabel>Ma zone</SectionLabel>
        <p className="mt-1.5 flex items-center gap-1 text-[11.5px] text-brun-soft">
          <MapPin size={12} className="text-corail" /> Les distances sont calculées depuis ce quartier.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {ZONES.map((z) => (
            <button
              key={z.key}
              type="button"
              onClick={() => setZone(z.key)}
              aria-pressed={zone === z.key}
              className={cn(
                'rounded-full px-3.5 py-2 text-[12px] font-bold transition-all active:scale-95',
                zone === z.key
                  ? 'bg-corail text-white shadow-[0_3px_10px_rgba(255,127,107,0.35)]'
                  : 'bg-white text-brun-soft ring-1 ring-black/5'
              )}
            >
              {z.label}
            </button>
          ))}
        </div>
      </section>

      {/* Application */}
      <section className="mt-6 px-5" aria-label="Application">
        <SectionLabel>Application</SectionLabel>
        <div className="mt-3 flex flex-col gap-2">
          {installable && (
            <button type="button" onClick={onInstall} className={rowClass}>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-corail-soft text-corail-deep">
                <Download size={16} />
              </span>
              <span className="flex-1">
                <span className="block text-[13px] font-bold text-brun">Installer l&apos;application</span>
                <span className="block text-[10.5px] text-brun-soft">Ajouter Around Me à l&apos;écran d&apos;accueil</span>
              </span>
            </button>
          )}
          <button type="button" onClick={shareApp} className={rowClass}>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-corail-soft text-corail-deep">
              <Share2 size={16} />
            </span>
            <span className="flex-1">
              <span className="block text-[13px] font-bold text-brun">Partager Around Me</span>
              <span className="block text-[10.5px] text-brun-soft">Fais découvrir l&apos;app à tes proches</span>
            </span>
          </button>
          <a
            href="https://wa.me/22890000000?text=Bonjour%20Around%20Me%2C%20je%20voudrais%20ajouter%20mon%20commerce%20%F0%9F%8F%AA"
            target="_blank"
            rel="noreferrer"
            className={rowClass}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sauge-soft text-sauge-deep">
              <MessageCircle size={16} />
            </span>
            <span className="flex-1">
              <span className="block text-[13px] font-bold text-brun">Ajouter mon commerce</span>
              <span className="block text-[10.5px] text-brun-soft">Écrivez-nous sur WhatsApp</span>
            </span>
          </a>
        </div>
      </section>

      {/* À propos */}
      <section className="mt-6 px-5" aria-label="À propos">
        <SectionLabel>À propos</SectionLabel>
        <div className="mt-3 rounded-3xl bg-white p-4 ring-1 ring-black/5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-corail text-white">
              <ShieldCheck size={18} />
            </span>
            <div>
              <p className="text-[14px] font-bold text-brun">Around Me</p>
              <p className="text-[10.5px] font-semibold text-brun-soft">Version 0.1.0 · Prototype V0</p>
            </div>
          </div>
          <p className="mt-3 text-[11.5px] leading-relaxed text-brun-soft">
            Find what you need. — Trouvez ce qu&apos;il vous faut, autour de vous. Around Me vous aide
            à localiser, appeler, écrire et vous rendre chez les commerces proches de vous à Lomé.
          </p>
          <hr className="my-3 border-brun/8" />
          <p className="text-[9.5px] leading-relaxed text-brun/40">
            ⚠️ Données de démonstration uniquement. Les commerces, numéros, avis et prix affichés
            sont fictifs et ne représentent aucun établissement réel. Conforme à l&apos;exigence du
            cahier des charges.
          </p>
          <p className="mt-2 text-[10px] font-bold text-brun/50">Made with ❤️ à Lomé</p>
        </div>
      </section>

      <div className="mt-auto" />
    </div>
  );
}
