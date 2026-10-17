'use client';

import Image from 'next/image';
import { toast } from 'sonner';
import {
  ChevronLeft,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Search,
  Share2,
} from 'lucide-react';
import type { Business } from '@/data/businesses';
import { categoryLabel, formatDays, formatDistance, formatHoursRange, mapsDirectionsLink, whatsappLink } from '@/lib/business-logic';
import { useActiveCoords, useApp } from '@/store/app';
import { useBusiness } from '@/hooks/use-businesses';
import { AroundMeChip, InfoRow, OpenBadge, PaymentChips, SectionLabel, Stars } from './bits';

export function DetailScreen() {
  const slug = useApp((s) => s.selectedSlug);
  const back = useApp((s) => s.backToResults);
  const favorites = useApp((s) => s.favorites);
  const toggleFavorite = useApp((s) => s.toggleFavorite);
  const coords = useActiveCoords();
  const { data: b, isLoading } = useBusiness(slug, coords);

  if (isLoading || !b) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-3 px-8 text-center">
        <Search size={22} className="animate-pulse text-brun/25" />
        <p className="text-[13px] font-semibold text-brun-soft">Chargement de la fiche…</p>
      </div>
    );
  }

  return <DetailContent b={b} back={back} favorites={favorites} toggleFavorite={toggleFavorite} />;
}

function DetailContent({
  b,
  back,
  favorites,
  toggleFavorite,
}: {
  b: Business;
  back: () => void;
  favorites: string[];
  toggleFavorite: (slug: string) => void;
}) {
  const isFav = favorites.includes(b.slug);

  const share = async () => {
    const data = { title: b.name, text: `${b.name} — Around Me, Lomé`, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Lien copié dans le presse-papiers');
      }
    } catch {
      /* annulé */
    }
  };

  const onFav = () => {
    toggleFavorite(b.slug);
    toast.success(isFav ? 'Retiré des favoris' : 'Ajouté aux favoris ❤️');
  };

  return (
    <div className="flex min-h-full flex-col">
      {/* Hero */}
      <div className="relative h-[236px] shrink-0">
        <Image src={b.image} alt={b.name} fill priority sizes="430px" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-brun/25" />
        <button
          type="button"
          onClick={back}
          aria-label="Retour aux résultats"
          className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-brun shadow-md active:scale-95"
        >
          <ChevronLeft size={19} />
        </button>
        <div className="absolute right-4 top-4 flex gap-2">
          <button
            type="button"
            onClick={share}
            aria-label="Partager"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-brun shadow-md active:scale-95"
          >
            <Share2 size={16} />
          </button>
          <button
            type="button"
            onClick={onFav}
            aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            aria-pressed={isFav}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-md active:scale-95"
          >
            <Heart size={16} className={isFav ? 'fill-corail text-corail' : 'text-brun'} />
          </button>
        </div>
      </div>

      {/* Feuille de contenu */}
      <div className="relative -mt-5 flex-1 rounded-t-[26px] bg-ivoire px-5 pb-4 pt-5">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-[21px] font-bold leading-tight text-brun">{b.name}</h1>
          {b.verified && <span className="mt-1.5"><VerifiedBadgeInline /></span>}
        </div>
        <p className="mt-1 text-[11.5px] font-medium text-brun-soft">
          {[categoryLabel(b.category), ...b.tags.filter((t) => t.toLowerCase() !== categoryLabel(b.category).toLowerCase())].join(' · ')}
        </p>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <Stars value={b.rating} />
          <span className="text-[12px] text-brun-soft">
            <b className="text-brun">{b.rating.toFixed(1).replace('.', ',')}</b> ({b.reviews} avis)
          </span>
          <AroundMeChip label="Fiche Around Me" />
        </div>

        <hr className="my-4 border-brun/8" />

        {/* Infos clés */}
        <div className="space-y-3.5">
          <InfoRow icon={MapPin} tint="#FFE9E3" color="#E8604C">
            <p className="text-[12.5px] font-semibold leading-snug text-brun">
              {b.address}
              {b.distanceKm != null && (
                <span className="text-corail-deep"> · {formatDistance(b.distanceKm)}</span>
              )}
            </p>
          </InfoRow>
          <InfoRow icon={Clock} tint="#EAF0DF" color="#6E8A5C">
            <OpenBadge b={b} />
            <p className="mt-0.5 text-[11.5px] text-brun-soft">
              {formatDays(b)} · {formatHoursRange(b)}
            </p>
          </InfoRow>
          <InfoRow icon={Phone} tint="#F3E7D8" color="#8C6D4F">
            <p className="text-[12.5px] font-bold text-brun">{b.phone}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-brun-soft">
              {b.whatsapp ? (
                <>
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-sauge" />
                  WhatsApp disponible
                </>
              ) : (
                'Appel uniquement'
              )}
            </p>
          </InfoRow>
        </div>

        {/* Services */}
        {b.services.length > 0 && (
          <section className="mt-5" aria-label="Services">
            <SectionLabel>Services</SectionLabel>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {b.services.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-brun/8 bg-white px-3 py-1.5 text-[11.5px] font-semibold text-brun"
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Paiements */}
        <section className="mt-5" aria-label="Paiements">
          <SectionLabel>Paiements</SectionLabel>
          <div className="mt-2">
            <PaymentChips items={b.payments} size="md" />
          </div>
        </section>

        {/* Indication prix */}
        {b.priceHint && (
          <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-corail/25 bg-corail-soft p-3.5">
            <span className="text-[15px] leading-none">💰</span>
            <p className="text-[12px] leading-relaxed text-brun">
              <b>{b.priceHint}</b>
              <span className="text-brun-soft"> · mis à jour il y a {b.priceUpdatedDays ?? 1} j</span>
            </p>
          </div>
        )}

        {/* À propos */}
        <section className="mt-5" aria-label="À propos">
          <SectionLabel>À propos</SectionLabel>
          <p className="mt-2 text-[12.5px] leading-relaxed text-brun-soft">{b.description}</p>
        </section>
      </div>

      {/* Barre d'actions */}
      <div
        className="sticky bottom-0 z-20 mt-2 border-t border-brun/5 bg-white/95 px-4 pt-3 backdrop-blur-md"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 12px)' }}
      >
        <div className="flex gap-2">
          <a
            href={`tel:${b.phoneDial}`}
            className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-corail text-[13px] font-bold text-white shadow-[0_6px_16px_rgba(255,127,107,0.4)] transition-transform active:scale-[0.97]"
            aria-label={`Appeler ${b.name}`}
          >
            <Phone size={15} /> Appeler
          </a>
          {b.whatsapp && (
            <a
              href={whatsappLink(b)}
              target="_blank"
              rel="noreferrer"
              className="flex h-11 items-center justify-center gap-1.5 rounded-full bg-sauge px-3.5 text-[13px] font-bold text-white shadow-[0_6px_16px_rgba(138,163,118,0.4)] transition-transform active:scale-[0.97]"
              aria-label={`Écrire sur WhatsApp à ${b.name}`}
            >
              <MessageCircle size={15} /> WhatsApp
            </a>
          )}
          <a
            href={mapsDirectionsLink(b)}
            target="_blank"
            rel="noreferrer"
            className="flex h-11 items-center justify-center gap-1.5 rounded-full border border-brun/15 bg-white px-3.5 text-[13px] font-bold text-brun transition-transform active:scale-[0.97]"
            aria-label={`Itinéraire vers ${b.name}`}
          >
            <Navigation size={14} /> Itinéraire
          </a>
        </div>
      </div>
    </div>
  );
}

function VerifiedBadgeInline() {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-sauge-soft px-2 py-1 text-[10px] font-bold text-sauge-deep">
      ✓ Vérifié
    </span>
  );
}
