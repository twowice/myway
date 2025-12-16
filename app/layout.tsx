"use client";

import Header from "@/components/header/header";
import MapSection from "@/components/ui/Map/MapSection";
import MapScriptLoader from "@/components/ui/Map/mapScriptLoader";
import MapCanvas from "@/components/ui/Map/mapCanvars";

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <MapScriptLoader />
        <Header />
        <main className="grow flex flex-row min-h-screen relative overflow-hidden ms-20 h-full">
          <div className="grow relative z-30 p-4">{children}</div>
          <MapCanvas />
          <div className=" absolute inset-0 z-10 w-full h-full pointer-events-none">
            <MapSection />
          </div>
        </main>
      </body>
    </html>
  );
}
