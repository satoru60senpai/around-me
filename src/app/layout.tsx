import type { Metadata, Viewport } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FF7F6B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Around Me — Trouvez ce qu'il vous faut, autour de vous",
  description:
    "Around Me vous aide à trouver les commerces et services autour de vous à Lomé : réparation, café, pharmacie, coiffure, transport… Appelez, écrivez sur WhatsApp, ou suivez l'itinéraire.",
  applicationName: "Around Me",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Around Me",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${quicksand.variable} antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
