# Worklog — Around Me (Lomé, Togo)

Application mobile-first "Around Me" — trouver des commerces autour de soi à Lomé.
Stack : Next.js 16 (App Router) + TypeScript + Tailwind 4 + shadcn/ui + Prisma/SQLite + PWA + Capacitor (APK).

Design system (issu de la maquette) :
- Couleurs : Ivoire #FFF8F0 (fond), Corail #FF7F6B (primaire), Sauge #8AA376 (secondaire/WhatsApp), Brun #3E2723 (texte)
- Typo : Quicksand (400–700)
- Écrans : 01 Accueil · 02 Résultats · 03 Fiche · 04 Carte (+ Favoris, Profil)
- Données de démonstration fictives (13 commerces de Lomé) — disclaimer obligatoire dans l'app.

---
Task ID: 1
Agent: Z.ai Code (orchestrateur)
Task: Exploration projet & vérification environnement

Work Log:
- Vérifié package.json : Next 16.1.1, React 19, Tailwind 4, shadcn/ui complet, Prisma 6, framer-motion, zustand, @tanstack/react-query, sharp présents.
- Installé : leaflet, @capacitor/core, @capacitor/android, @capacitor/cli, @types/leaflet.
- Environnement : Java OpenJDK 21 installé (/usr/lib/jvm/java-21-openjdk-amd64), keytool dispo, 8 Go disque libre, 4 Go RAM, 2 CPU. Pas d'ANDROID_HOME (à installer).
- Dev server tourne sur port 3000 (dev.log OK). Git repo existant (branche main).
- Prisma : schema par défaut (User/Post) à remplacer par Business. DB: db/custom.db.

Stage Summary:
- Environnement prêt. Capacitor + Leaflet installés. Java 21 OK pour build Android. BASE_PATH du design system défini ci-dessus.

---
Task ID: 4-b
Agent: general-purpose (Android setup)
Task: Installer SDK Android + scaffold Capacitor + build test

Work Log:
- Cmdline-tools téléchargés (commandlinetools-linux-11076708, ~150MB) → /home/z/tools/android-sdk/cmdline-tools/latest/bin/sdkmanager. Licences acceptées (yes | sdkmanager --licenses, exit 0).
- `bunx cap add android` exécuté depuis /home/z/my-project (Capacitor CLI, non interactif) → android/ créé depuis le template Capacitor 8 (appId me.aroundme.lome, webDir out copié dans android/app/src/main/assets/public, capacitor.config.json généré).
- Packages SDK installés via sdkmanager : platform-tools 37.0.1, platforms;android-35 (rev 2), platforms;android-36 (rev 2), build-tools;35.0.0, build-tools;36.0.0 → /home/z/tools/android-sdk/.
- android/local.properties créé : sdk.dir=/home/z/tools/android-sdk.
- android/gradle.properties : org.gradle.jvmargs=-Xmx1536m -XX:MaxMetaspaceSize=512m (ajout MaxMetaspaceSize ; android.useAndroidX=true déjà présent du template).
- variables.gradle du template : minSdk 24, compileSdk 36, targetSdk 36, AGP 8.13.0, Gradle wrapper 8.14.3-all.
- PROBLÈME rencontré : le "Java 21" du système n'était que openjdk-21-jre-headless (pas de javac) → premier gradlew assembleDebug échoué : "Toolchain installation '/usr/lib/jvm/java-21-openjdk-amd64' does not provide the required capabilities: [JAVA_COMPILER]". apt install impossible (pas de root/sudo).
- SOLUTION : JDK Temurin 21.0.12.1+1 téléchargé depuis api.adoptium.net et extrait dans /home/z/tools/jdks/jdk-21.0.12.1+1 (javac 21.0.12.1 OK). Build relancé avec JAVA_HOME pointant dessus.
- BUILD : `JAVA_HOME=/home/z/tools/jdks/jdk-21.0.12.1+1 ANDROID_HOME=/home/z/tools/android-sdk ./gradlew assembleDebug --no-daemon` → BUILD SUCCESSFUL in 1m 29s (93 tasks), second run après échec javac (le premier run avait déjà téléchargé la distribution Gradle 8.14.3 + deps AGP).
- APK copié : /tmp/test-build.apk (4.1MB, "Android package (APK) ... with APK Signing Block").
- Aucune modification de src/, prisma/, package.json, bun.lock, capacitor.config.ts, out/ (git status : seul android/ est nouveau).

Stage Summary:
- (a) Toolchain build : SUCCÈS — assembleDebug OK.
- (b) APK debug : /home/z/my-project/android/app/build/outputs/apk/debug/app-debug.apk (copie de test : /tmp/test-build.apk, 4.1MB).
- (c) Android SDK : /home/z/tools/android-sdk (+ cmdline-tools/latest) ; JDK de build : /home/z/tools/jdks/jdk-21.0.12.1+1 (le JRE système java-21 n'a pas javac — utiliser ce JDK pour tout build Gradle).
- (d) Template Capacitor 8 requiert compileSdk 36 / targetSdk 36 / minSdk 24 (variables.gradle), AGP 8.13.0, Gradle 8.14.3 ; build-tools 36.0.0 (35.0.0 aussi installé par précaution).
- Next : remplacer le placeholder out/ par le vrai export Next (next build avec output export) puis `bunx cap sync android`, signer l'APK (keystore) pour release.

---
Task ID: 2
Agent: Z.ai Code (orchestrateur)
Task: Générer les visuels (icônes + photos commerces)

Work Log:
- scripts/make-icons.ts : icônes SVG→PNG (corail #FF7F6B, cible blanche) : icon-192/512, maskable, apple-touch-icon, favicons → public/icons/.
- scripts/gen-images.ts : 12 photos de commerces générées par IA (1152x864 → JPEG ~78, 98–242 Ko) → public/images/shops/.
- scripts/make-launcher-icons.ts : icônes launcher Android (mipmap 5 densités, adaptive foreground, round) + 11 splash screens ivoire → android/app/src/main/res/.

Stage Summary:
- Assets complets et cohérents avec le design system. PWA icons + launcher Android + splashes prêts.

---
Task ID: 3
Agent: Z.ai Code (orchestrateur)
Task: Backend Prisma + API

Work Log:
- prisma/schema.prisma : modèle Business (champs JSON stringifiés : tags/services/payments).
- src/data/businesses.ts : source unique — 13 commerces fictifs de Lomé (Tokoin, Adidogomé, Bè, Kodjoviakopé...), 10 catégories, 8 zones.
- src/lib/business-logic.ts : haversine, isOpenNow (UTC+0 = Lomé), recherche multi-token normalisée (accents), formatage FR (450 m / 1,3 km), liens wa.me + Google Maps.
- API : GET /api/businesses (q, category, lat/lng, maxKm, openNow, verified, payments, sort) + GET /api/businesses/[slug]. Testés : filtre category=reparation → 3 résultats.
- bun run db:push + bun prisma/seed.ts → 13 commerces en base (db/custom.db).

Stage Summary:
- API fullstack opérationnelle avec distances + statut d'ouverture calculés côté serveur.

---
Task ID: 4-a
Agent: Z.ai Code (orchestrateur)
Task: Frontend complet (6 écrans + design system)

Work Log:
- globals.css : tokens Tailwind 4 (ivoire/corail/sauge/brun), scrollbar douce, safe-areas, styles Leaflet.
- layout.tsx : Quicksand (next/font), metadata FR, viewport cover + themeColor corail, appleWebApp, icônes.
- store Zustand persisté (favoris + zone), TanStack Query, api-client avec fallback dataset local (mode APK hors-ligne).
- Composants : AppShell (splash + AnimatePresence), BottomNav 5 onglets, Home (zone, greeting, recherche, chips populaires, 10 catégories, "Autour de moi"), Résultats (recherche live, chips filtres actifs, cartes), FilterSheet (vaul Drawer : tri, distance, ouvert, vérifiés, paiements), Fiche (hero, étoiles, infos, services, paiements, prix, barre sticky Appeler/WhatsApp/Itinéraire), Carte (Leaflet + OSM, marqueurs corail/sauge, dot utilisateur, bottom card), Favoris, Profil (zone picker, partage, à propos).
- Lint vert (react-hooks/set-state-in-effect corrigé via useSyncExternalStore).

Stage Summary:
- Les 4 écrans de la maquette + Favoris/Profil sont pixel-conformes au design system. Vérifié par agent-browser : accueil, catégories→résultats (3 réparation), fiche (liens tel/wa/maps), carte OSM Lomé + marqueurs + bottom card, filtre "Moins de 2 km" → 2 résultats, changement de zone (Adidogomé → distances recalculées), favoris avec toast, rendu desktop (conteneur 430px centré).

---
Task ID: 5
Agent: Z.Code (orchestrateur)
Task: PWA + APK final

Work Log:
- manifest.ts (force-static pour l'export) + public/sw.js (cache-first statique, network-first pages, /api toujours réseau).
- next.config.ts : output export si NEXT_PUBLIC_OFFLINE_MODE=1, images unoptimized.
- Export statique : mv src/app/api /tmp && NEXT_PUBLIC_OFFLINE_MODE=1 bunx next build → out/ (4 pages statiques) && restore api.
- bunx cap sync android → assets/public (3,1 Mo).
- Keystore : android/around-me.keystore (alias aroundme, pass aroundme2025) + signingConfig release dans app/build.gradle. versionName 0.1.0.
- gradlew assembleDebug assembleRelease → BUILD SUCCESSFUL en 1m29s.
- APKs : app-debug.apk (6,7 Mo) et app-release.apk (5,2 Mo, signature vérifiée apksigner : CN=Around Me). Copié vers AroundMe-v0.1.0.apk à la racine.

Stage Summary:
- APK Android signé et installable (minSdk 24 / target 36). PWA installable (manifest + SW + icônes). Le fallback local permet à l'APK de fonctionner 100% hors-ligne.

---
Task ID: 6
Agent: Z.Code (orchestrateur)
Task: Vérification navigateur (agent-browser)

Work Log:
- agent-browser : viewport 400x850 et 1280x800, captures de tous les écrans, parcours complets testés (voir 4-a).
- Console : aucun erreur runtime (uniquement logs Fast Refresh dev).
- Corrections issues de la vérification : doublon "Réparation · Réparation" dans la fiche (dédupe tags), manifest force-static, lint setState-in-effect.

Stage Summary:
- Toutes les interactions principales validées en conditions réelles avant livraison.
