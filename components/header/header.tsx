"use client";

import { Icon36 } from "@/components/icons/icon36";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import clsx from "clsx";
import { useEffect } from "react";
import { mainmenu } from "./headermenu";
import { panelstore } from "@/stores/panelstore";
// 추가된 임포트
import WithdrawButton from "@/feature/login/withdrawbutton";  // ← 이 줄 추가

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { openpanel, setopenpanel, togglepanel } = panelstore();

  // 페이지 이동 시 자동으로 패널 열기
  useEffect(() => {
    const current = mainmenu.find((item) => pathname.startsWith(item.href));
    if (current) {
      setopenpanel(current.panelkey);
    }
  }, [pathname, setopenpanel]);

  const handlemenuclick = (href: string, panelkey: string) => {
    if (pathname.startsWith(href)) {
      togglepanel(panelkey);
    } else {
      router.push(href);
    }
  };

  const currenttitle =
    mainmenu.find((m) => m.panelkey === openpanel)?.name || "메뉴";

  const handlelogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <>
      {/* 사이드바 */}
      <aside className="fixed inset-y-0 left-0 z-50 w-16 lg:w-20 bg-secondary border-r border-gray-200 shadow-2xl">
        <div className="flex flex-col h-full">
          {/* 로고 */}
          <div
            className="h-16 flex items-center justify-center border-b border-gray-200 px-4 cursor-pointer select-none group shrink-0"
            onClick={() => {
              router.push("/");
              router.refresh();
              setopenpanel(null);
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <svg
                width="22"
                height="17"
                viewBox="0 0 20 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-all duration-300 group-hover:scale-110"
              >
                {/* SVG 내용 생략 (기존 그대로) */}
              </svg>
              <h1 className="text-xl font-bold text-primary tracking-tight">
                Myway
              </h1>
            </div>
          </div>

          {/* 메뉴 */}
          <nav className="flex-1 overflow-y-auto px-1 py-8 scrollbar-hide">
            <div className="space-y-12">
              {mainmenu.map((item) => {
                const isactive = openpanel === item.panelkey;

                return (
                  <button
                    key={item.name}
                    onClick={() => handlemenuclick(item.href, item.panelkey)}
                    className={clsx(
                      "w-full flex flex-col items-center gap-2 py-3 rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer",
                      isactive && "bg-blue-50"
                    )}
                  >
                    <Icon36
                      name={item.icon}
                      className={clsx(
                        "w-8 h-8 lg:w-9 lg:h-9 transition-colors duration-300",
                        isactive ? "text-primary" : "text-foreground"
                      )}
                    />
                    <span
                      className={clsx(
                        "text-[11px] lg:text-xs font-medium transition-colors duration-300",
                        isactive ? "text-primary" : "text-foreground"
                      )}
                    >
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* 로그인/로그아웃 영역 */}
          <div className="p-2 border-t border-gray-200 shrink-0">
            {status === 'loading' ? (
              <div className="w-full py-3 text-center text-sm text-gray-400">
                로딩중...
              </div>
            ) : session ? (
              // 로그인된 상태
              <div className="flex flex-col items-center gap-2">
                {session.user.image && (
                  <img 
                    src={session.user.image} 
                    alt="프로필" 
                    className="w-10 h-10 rounded-full border-2 border-gray-200"
                  />
                )}
                <span className="text-[10px] text-gray-600 truncate w-full text-center px-1">
                  {session.user.name}
                </span>
                <button
                  onClick={handlelogout}
                  className="w-full py-2 text-xs font-medium text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                >
                  로그아웃
                </button>
                {/* ← 여기 아래에 회원탈퇴 버튼 추가 */}
                <WithdrawButton />
              </div>
            ) : (
              // 로그인 안 된 상태
              <button
                onClick={() => router.push("/loginpage")}
                className="w-full py-3 text-center text-base font-medium text-foreground hover:text-primary transition-colors cursor-pointer"
              >
                로그인
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}