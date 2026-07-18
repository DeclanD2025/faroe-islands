import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Faroe Islands · July 2026",
  description: "Motherwell v HB trip planner — Suðuroy & the Tórshavn tie, July 2026",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Faroe Trip",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "theme-color": "#0a0e0f",
  },
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/itinerary", label: "Itinerary" },
  { href: "/places", label: "Hikes & Sights" },
  { href: "/match-day", label: "Match Day" },
  { href: "/packing", label: "Packing" },
  { href: "/info", label: "Travel Info" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="apple-touch-icon" href="/faroe-icon.svg" />
        <meta name="theme-color" content="#0a0e0f" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-full flex flex-col">
        <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-storm/80 backdrop-blur-xl">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-cream hover:text-golden transition-colors"
            >
              🇫🇴 Faroe Islands
            </Link>
            <div className="flex items-center gap-1 overflow-x-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-fog transition-colors hover:bg-white/[0.04] hover:text-cream whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-white/[0.06] py-8 text-center text-sm text-fog/60">
          <p>Faroe Islands · 28 Jul – 1 Aug 2026 · Declan &amp; Friend · Motherwell v HB</p>
        </footer>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js').catch(() => {});
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
