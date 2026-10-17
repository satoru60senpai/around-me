import type { NextConfig } from "next";

const isOfflineExport = process.env.NEXT_PUBLIC_OFFLINE_MODE === "1";

const nextConfig: NextConfig = {
  // "standalone" pour le serveur web du sandbox ;
  // "export" pour générer les fichiers statiques embarqués dans l'APK (Capacitor).
  output: isOfflineExport ? "export" : "standalone",
  images: {
    // Local images only → simplifie l'export statique et l'APK hors-ligne.
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
