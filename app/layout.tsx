import type { Metadata, Viewport } from "next";
import { Cinzel, Geist_Mono, Inter } from "next/font/google";
import { RailNav } from "@/components/rail-nav";
import { MobileNav } from "@/components/mobile-nav";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const NAV_ITEMS = [
  { href: "/",          label: "Now" },
  { href: "/itinerary", label: "Trip" },
  { href: "/places",    label: "Map" },
  { href: "/explore",   label: "Explore" },
  { href: "/match-day", label: "Match" },
  { href: "/packing",   label: "Prepare" },
  { href: "/hikes",     label: "Hikes" },
];

export const metadata: Metadata = {
  title: "Faroe Islands · 27 Jul – 1 Aug 2026",
  description:
    "Motherwell v HB · private expedition log for the Suðuroy base, the Tórsvøllur tie, and the ferries in between.",
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#F2EFE7" }],
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
      className={`${inter.variable} ${geistMono.variable} ${cinzel.variable} h-full`}
    >
      <body className="min-h-full text-basalt bg-wool antialiased">
        <RailNav items={NAV_ITEMS} />
        <MobileNav items={NAV_ITEMS} />
        <main id="expedition" className="pb-24 pl-0 sm:pt-0 sm:pl-28 lg:pl-36">
          {children}
        </main>
        <footer className="border-t border-basalt/15 mt-24 py-10 pl-0 sm:pl-28 lg:pl-36">
          <div className="mx-auto max-w-[64rem] px-6 sm:px-8 caption">
            <div className="flex flex-wrap items-baseline justify-between gap-y-3">
              <p>
                Faroe Islands ·{" "}
                <span className="tnum">
                  {new Date("2026-07-27").toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
                {" — "}
                <span className="tnum">
                  {new Date("2026-08-01").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>{" "}
                · Declan + guest · HB Tórshavn v Motherwell
              </p>
              <p>A private expedition log — not a trip dashboard.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
