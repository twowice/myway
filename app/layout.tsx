"use client";

import Header from "@/components/header/header";
import MapSection from "@/components/ui/Map/MapSection";
import MapScriptLoader from "@/components/ui/Map/mapScriptLoader";
import MapCanvas from "@/components/ui/Map/mapCanvars";

import "./globals.css";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { mainmenu } from "@/components/header/headermenu";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();
  //관리자 주소를 입력해주세요
  if (path.startsWith("/admin")) {
    return (
      <html lang="ko">
        <body>
          <div className="flex min-h-screen justify-start">{children}</div>
        </body>
      </html>
    );
  }

  return (
    <html lang="ko">
      <body>
        <MapScriptLoader />
        <Header />
        <main className="grow flex flex-row min-h-screen relative overflow-hidden ms-16 lg:ms-20 h-full">
          {/**지도 필요하시지 않으신 경우 해당 페이지에서 전체 페이지 크기를 w-screen으로 설정해주세요*/}
          {path !== "/" && (
            <div
              className={cn(
                path.startsWith(mainmenu[0].href) ? "w-full" : "w-100",
                "relative z-30 overflow-auto"
              )}
            >
              {children}
            </div>
          )}
          {!path.startsWith(mainmenu[0].href) && <MapCanvas />}
          {!path.startsWith(mainmenu[0].href) && (
            <div className="ms-100 absolute inset-0 z-10 w-full h-full pointer-events-none">
              <MapSection />
            </div>
          )}
        </main>
      </body>
    </html>
  );
}
