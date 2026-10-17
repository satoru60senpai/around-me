'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Switch } from '@/components/ui/switch';
import { useApp } from '@/store/app';

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full px-3.5 py-2 text-[12px] font-bold transition-all active:scale-95',
        active
          ? 'bg-corail text-white shadow-[0_3px_10px_rgba(255,127,107,0.35)]'
          : 'bg-white text-brun-soft ring-1 ring-black/5'
      )}
    >
      {children}
    </button>
  );
}

function Row({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between py-1">
      <span className="text-[13px] font-semibold text-brun">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}

export function FilterSheet() {
  const open = useApp((s) => s.filterSheetOpen);
  const setOpen = useApp((s) => s.setFilterSheetOpen);
  const filters = useApp((s) => s.filters);
  const setFilters = useApp((s) => s.setFilters);
  const resetFilters = useApp((s) => s.resetFilters);

  const togglePayment = (p: string) => {
    const has = filters.payments.includes(p);
    setFilters({
      payments: has ? filters.payments.filter((x) => x !== p) : [...filters.payments, p],
    });
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="mx-auto max-w-[430px] rounded-t-[26px] bg-ivoire px-1">
        <DrawerHeader className="pb-2 pt-3">
          <DrawerTitle className="text-left text-[17px] font-bold text-brun">Filtres</DrawerTitle>
          <DrawerDescription className="text-left text-[11.5px] text-brun-soft">
            Affinez les commerces autour de vous
          </DrawerDescription>
        </DrawerHeader>

        <div className="soft-scroll max-h-[52vh] space-y-5 overflow-y-auto px-5 pb-4">
          {/* Tri */}
          <section>
            <p className="mb-2 text-[10.5px] font-bold uppercase tracking-[0.16em] text-brun/45">Trier par</p>
            <div className="flex gap-2">
              <Chip active={filters.sort === 'distance'} onClick={() => setFilters({ sort: 'distance' })}>
                Distance
              </Chip>
              <Chip active={filters.sort === 'rating'} onClick={() => setFilters({ sort: 'rating' })}>
                Meilleures notes
              </Chip>
            </div>
          </section>

          {/* Distance max */}
          <section>
            <p className="mb-2 text-[10.5px] font-bold uppercase tracking-[0.16em] text-brun/45">Distance</p>
            <div className="flex gap-2">
              <Chip active={filters.maxKm == null} onClick={() => setFilters({ maxKm: null })}>
                Tous
              </Chip>
              {[1, 2, 5].map((km) => (
                <Chip key={km} active={filters.maxKm === km} onClick={() => setFilters({ maxKm: km })}>
                  Moins de {km} km
                </Chip>
              ))}
            </div>
          </section>

          {/* Interrupteurs */}
          <section className="space-y-1">
            <Row label="Ouvert maintenant" checked={filters.openNow} onChange={(v) => setFilters({ openNow: v })} />
            <Row
              label="Commerces vérifiés uniquement"
              checked={filters.verifiedOnly}
              onChange={(v) => setFilters({ verifiedOnly: v })}
            />
          </section>

          {/* Paiements */}
          <section>
            <p className="mb-2 text-[10.5px] font-bold uppercase tracking-[0.16em] text-brun/45">Paiements acceptés</p>
            <div className="flex gap-2">
              {['Flooz', 'TMoney', 'Espèces'].map((p) => (
                <Chip key={p} active={filters.payments.includes(p)} onClick={() => togglePayment(p)}>
                  {p}
                </Chip>
              ))}
            </div>
          </section>
        </div>

        <div
          className="flex gap-2 px-5 pt-2"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 24px)' }}
        >
          <Button
            variant="outline"
            className="h-11 flex-1 rounded-full border-brun/15 bg-white text-[13px] font-bold text-brun"
            onClick={resetFilters}
          >
            Effacer
          </Button>
          <Button
            className="h-11 flex-[2] rounded-full bg-corail text-[13px] font-bold text-white shadow-[0_6px_16px_rgba(255,127,107,0.4)] hover:bg-corail-deep"
            onClick={() => setOpen(false)}
          >
            Voir les résultats
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
