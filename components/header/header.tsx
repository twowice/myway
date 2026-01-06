"use client";

import { Icon36 } from "@/components/icons/icon36";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import clsx from "clsx";
import { useEffect } from "react";
import { mainmenu } from "./headermenu";
import { panelstore } from "@/stores/panelstore";
import WithdrawButton from "@/feature/login/withdrawbutton";

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
    await signOut({ callbackUrl: '/eventpage' });  // ← 로그아웃 후에도 eventpage로
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
              router.push("/eventpage");  // ← / 대신 /eventpage로 변경
              router.refresh();
              setopenpanel("event");  // ← 패널도 event로 열기
            }}
          >
            <div className="flex flex-col items-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 20 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-all duration-300"
              >
                <path d="M2.29102 0C2.49429 6.29411e-05 2.68668 0.062875 2.84766 0.170898L3.47754 3.09766L3.5625 3.49316H4.20703L5.57812 7.47656C5.88388 8.36475 7.13433 8.37954 7.46094 7.49902L7.72461 6.78711C7.80657 6.56583 7.80754 6.32257 7.72754 6.10059L6.78711 3.49316H13.042L12.0889 6.09277C12.006 6.31882 12.0072 6.56795 12.0928 6.79297L12.377 7.53906C12.7102 8.41314 13.9546 8.3918 14.2578 7.50684L16.5957 0.675781C16.7342 0.271749 17.1149 0.000282817 17.542 0H18.8486C19.5523 8.46606e-05 20.0359 0.707689 19.7803 1.36328L15.167 13.1865C15.0171 13.5698 14.6479 13.8221 14.2363 13.8223H12.8232C12.419 13.822 12.0541 13.5786 11.8994 13.2051L10.8438 10.6543C10.5023 9.82951 9.33286 9.83124 8.99414 10.6572L7.9502 13.2021C7.79615 13.5773 7.43098 13.8223 7.02539 13.8223H5.5957C5.1837 13.8218 4.81337 13.5686 4.66406 13.1846L0.0683594 1.3623C-0.186165 0.70712 0.297244 0.000583676 1 0H2.29102ZM8.62012 7.7168C8.30907 7.71776 8.05575 8.28014 8.05566 8.97363C8.05566 9.66729 8.30901 10.2295 8.62012 10.2305C8.93137 10.2299 9.18359 9.66753 9.18359 8.97363C9.18351 8.2799 8.93131 7.71738 8.62012 7.7168ZM11.2363 7.7168C10.9249 7.71686 10.6719 8.27952 10.6719 8.97363C10.6719 9.66785 10.9249 10.2304 11.2363 10.2305C11.5476 10.2299 11.7998 9.66753 11.7998 8.97363C11.7998 8.27984 11.5475 7.71738 11.2363 7.7168Z" fill="#0077D4"/>
                <path d="M3.49512 12.3936L3.23828 13.1416C3.09939 13.5448 2.71936 13.816 2.29297 13.8164H1.00195C0.299193 13.8158 -0.184224 13.1093 0.0703125 12.4541L1.79785 8.00684L3.49512 12.3936ZM19.7822 12.4531C20.0376 13.1085 19.5539 13.8159 18.8506 13.8164H17.5439C17.1169 13.8161 16.7362 13.5446 16.5977 13.1406L16.3447 12.4033L18.0469 8.00586L19.7822 12.4531ZM3.5625 3.48535H9.21289C9.59676 3.875 10.2457 3.87514 10.6299 3.48535H16.2842L17.5088 6.62598L15.8418 10.9336L14.2598 6.30957C13.9566 5.42467 12.7123 5.40347 12.3789 6.27734L12.0947 7.02344C12.0092 7.24846 12.008 7.49758 12.0908 7.72363L13.8242 12.4531C14.063 13.1054 13.5803 13.7964 12.8857 13.7969H12.084C11.6515 13.7966 11.2679 13.5177 11.1338 13.1064L10.8682 12.2939C10.5681 11.3742 9.26685 11.3742 8.9668 12.2939L8.70215 13.1064C8.568 13.5177 8.18351 13.7966 7.75098 13.7969H6.96094C6.26866 13.7965 5.78509 13.1094 6.01953 12.458L7.72949 7.71582C7.8094 7.49396 7.80842 7.25045 7.72656 7.0293L7.46289 6.31738C7.1363 5.43693 5.88595 5.45185 5.58008 6.33984L4 10.9277L2.33496 6.62598L3.55957 3.47656L3.5625 3.48535Z" fill="#0077D4"/>
              </svg>
              <h1 className="text-lg font-bold text-primary tracking-tight">
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