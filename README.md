# 📍 Around Me — Trouvez ce qu'il vous faut, autour de vous

Application mobile-first de recherche de commerces et services à **Lomé, Togo** 🇹🇬.

> *Find what you need.* — Rechercher, comparer, appeler, écrire sur WhatsApp et s'y rendre.

![Design](https://img.shields.io/badge/Design-Ivoire%20·%20Corail%20·%20Sauge%20·%20Brun-FF7F6B) ![Stack](https://img.shields.io/badge/Next.js%2016-TypeScript-blue) ![PWA](https://img.shields.io/badge/PWA-installable-8AA376) ![APK](https://img.shields.io/badge/APK-signé-3E2723)

## ✨ Fonctionnalités

- 🔍 **Recherche** par mot-clé (insensible aux accents) + 10 catégories (Manger, Café, Acheter, Argent, Services, Beauté, Téléphone, Réparation, Santé, Transport)
- 📍 **Distances réelles** calculées (Haversine) depuis votre position GPS ou votre quartier (8 zones de Lomé)
- 🕐 **Statut d'ouverture en direct** (fuseau Africa/Lomé) — *Ouvert · ferme à 19 h*
- 🎛️ **Filtres** : distance (1/2/5 km), ouvert maintenant, vérifiés, moyens de paiement (Flooz, TMoney, Espèces), tri par distance ou note
- 🏪 **Fiche établissement** : photos IA, avis, services, paiements, prix indicatifs, adresse
- 📞 **Actions** : Appeler (`tel:`), WhatsApp (`wa.me` pré-rempli), Itinéraire (Google Maps)
- 🗺️ **Carte interactive** (Leaflet + OpenStreetMap) avec marqueurs colorés et fiche en bas
- ❤️ **Favoris** persistants (localStorage)
- 📶 **Fonctionne hors-ligne** (dataset embarqué en secours si l'API est injoignable)

## 🧱 Stack technique

| Couche | Techno |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| UI | Tailwind CSS 4 + shadcn/ui + Lucide + Framer Motion + Quicksand |
| Backend | API Routes Next.js |
| BDD | Prisma ORM + SQLite |
| État | Zustand (persist) + TanStack Query |
| Carte | Leaflet + tuiles OpenStreetMap |
| Mobile | PWA (manifest + service worker) + Capacitor 8 (APK Android) |

## 🚀 Démarrage (web)

```bash
bun install
bun run db:push        # crée la base SQLite
bun prisma/seed.ts     # insère les 13 commerces de démo
bun run dev            # http://localhost:3000
```

## 📱 Construire l'APK Android

```bash
# 1. Export statique (l'API est retirée temporairement : l'app embarque le dataset)
mv src/app/api /tmp/api-backup
NEXT_PUBLIC_OFFLINE_MODE=1 bunx next build
mv /tmp/api-backup src/app/api

# 2. Synchroniser Capacitor
bunx cap sync android

# 3. Compiler (JDK 21 + Android SDK requis)
cd android && JAVA_HOME=/chemin/vers/jdk21 ./gradlew assembleRelease
# → android/app/build/outputs/apk/release/app-release.apk
```

Le keystore de démo est fourni (`android/around-me.keystore`, alias `aroundme`, mot de passe `aroundme2025`) — **générez le vôtre** pour une mise en production.

### iOS
Aucun APK n'existe pour iOS. Deux options : installer la **PWA** depuis Safari (« Sur l'écran d'accueil »), ou compiler le projet Capacitor iOS (`npx cap add ios`) avec un Mac + Xcode.

## 📲 Installer la PWA (sans APK)

Ouvrez l'app dans Chrome/Edge → menu → **« Installer l'application »** (ou Safari → Partager → Sur l'écran d'accueil).

## ⚠️ Données de démonstration

Les commerces, numéros, avis et prix affichés sont **fictifs** et ne représentent aucun établissement réel (conforme au cahier des charges du prototype V0).

## 🗂️ Structure

```
src/
├── app/                  # Page unique + API routes + manifest PWA
│   └── api/businesses/   # GET liste (filtres/tri) + GET détail
├── components/app/       # AppShell, écrans (accueil, résultats, fiche, carte, favoris, profil)
├── data/businesses.ts    # Source unique des données démo (seed + fallback hors-ligne)
├── lib/                  # Logique métier pure (distance, horaires, recherche)
├── store/                # Zustand (écran courant, filtres, favoris, zone)
└── hooks/                # TanStack Query wrappers
android/                  # Projet Capacitor (APK)
scripts/                  # Génération icônes / images IA / launchers
```

---
Made with ❤️ à Lomé · Around Me V0
