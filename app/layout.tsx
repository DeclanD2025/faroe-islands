import type { Metadata, Viewport } from "next";
import { Anton, Caveat, Geist_Mono, Newsreader } from "next/font/google";
import { TopNav } from "@/components/top-nav";
import { FolioEdge } from "@/components/folio-edge";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const NAV_ITEMS = [
  { href: "/",          label: "Journey" },
  { href: "/itinerary", label: "Days" },
  { href: "/places",    label: "Map" },
  { href: "/match-day", label: "Match" },
  { href: "/packing",   label: "Prepare" },
];

export const metadata: Metadata = {
  title: "Faroe Islands · July 2026",
  description:
    "Motherwell v HB — a private field guide to the Suðuroy base, the Tórsvøllur tie, and the ferry mission in between.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Faroe Trip",
  },
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#FBF8F1" }],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${caveat.variable} ${anton.variable} ${geistMono.variable} h-full`}
    >
      <head>
        <link rel="apple-touch-icon" href="/faroe-icon.svg" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-full text-ink bg-paper antialiased">
        <FolioEdge />
        <TopNav items={NAV_ITEMS} />
        <main id="journey" className="pb-24">{children}</main>
        <footer className="border-t border-stone mt-32 py-10">
          <div className="mx-auto max-w-[68rem] px-6 sm:px-8 text-[12.5px] text-bone">
            <div className="flex flex-wrap items-baseline justify-between gap-y-2">
              <p className="font-serif italic">
                Faroe Islands · {new Date("2026-07-28").toLocaleDateString("en-GB", { day: "numeric", month: "long" })} to {new Date("2026-08-01").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} · Declan + guest · Motherwell v HB
              </p>
              <p className="font-serif italic">
                A private field guide — not a Trip OS dashboard.
              </p>
            </div>
          </div>
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
