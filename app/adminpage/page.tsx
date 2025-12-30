'use client';

import { Icon36 } from '@/components/icons/icon36';
import Event from '@/feature/admin/event';
import Notice from '@/feature/admin/notice';
import PartyReport from '@/feature/admin/party-report';
import UserReport from '@/feature/admin/user-report';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type MenuType = 'event' | 'notice' | 'user-report' | 'party-report' | null;

export default function Admin() {
   // const router = useRouter();
   // const { data: session, status } = useSession();
   const [selectedMenu, setSelectedMenu] = useState<MenuType>('event');
   const [hasNotification, setHasNotification] = useState(false);

   // useEffect(() => {
   //    //로딩 시 대기
   //    if (status === 'loading') return;

   //    //로그인 되어있지 않음
   //    if (!session) {
   //       router.push('/loginpage');
   //       return;
   //    }

   //    // 관리자 아님
   //    if (session.user.role !== 'admin') {
   //       router.push('/');
   //       return;
   //    }
   // }, [session, status, router]);

   // // 로딩중 또는 권한 확인
   // if (status === 'loading' || !session || session.user.role !== 'admin') {
   //    return (
   //       <div className="flex items-center justify-center h-screen">
   //          <p>로딩 중...</p>
   //       </div>
   //    );
   // }
   return (
      <div className="h-screen w-screen flex overflow-hidden">
         <div className="flex flex-col w-80 max-w-130 bg-primary/20 h-full p-6 gap-8">
            <div className="flex justify-between">
               <div className="flex gap-3">
                  <div className="flex flex-col justify-center items-center">
                     <svg
                        width="22"
                        height="17"
                        viewBox="0 0 20 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="transition-all duration-300 group-hover:scale-110"
                     >
                        <path
                           d="M2.29102 0C2.49429 0 2.68666 0.0629354 2.84766 0.170898L3.47754 3.09766L3.5625 3.49316H4.20703L5.57812 7.47656C5.8839 8.36482 7.13541 8.37973 7.46191 7.49902L7.72559 6.78711C7.80753 6.56588 7.80847 6.32253 7.72852 6.10059L6.78809 3.49316H13.042L12.0889 6.09277C12.006 6.3189 12.0081 6.56788 12.0938 6.79297L12.377 7.53906C12.7101 8.41329 13.9545 8.39174 14.2578 7.50684L16.5967 0.675781C16.7352 0.271872 17.115 0.000352107 17.542 0H18.8486C19.5525 0 20.0361 0.707597 19.7803 1.36328L15.168 13.1865C15.0181 13.5701 14.6482 13.8223 14.2363 13.8223H12.8232C12.419 13.8219 12.054 13.5787 11.8994 13.2051L10.8438 10.6543C10.5024 9.82946 9.33385 9.83122 8.99512 10.6572L7.95117 13.2021C7.79723 13.5773 7.43186 13.8221 7.02637 13.8223H5.59668C5.18445 13.822 4.81442 13.5688 4.66504 13.1846L0.0683594 1.3623C-0.186132 0.707032 0.298056 0.00034257 1.00098 0H2.29102ZM8.62109 7.7168C8.30983 7.71719 8.05673 8.27979 8.05664 8.97363C8.05664 9.66764 8.30977 10.2301 8.62109 10.2305C8.93229 10.2298 9.18457 9.66745 9.18457 8.97363C9.18448 8.27998 8.93224 7.71751 8.62109 7.7168ZM11.2363 7.7168C10.9251 7.71734 10.6719 8.27982 10.6719 8.97363C10.6719 9.66755 10.9251 10.2299 11.2363 10.2305C11.5476 10.2299 11.7998 9.66753 11.7998 8.97363C11.7998 8.27984 11.5475 7.71738 11.2363 7.7168Z"
                           fill="#0077D4"
                        />
                        <path
                           d="M3.49609 12.3945L3.23926 13.1416C3.10036 13.5448 2.7194 13.8161 2.29297 13.8164H1.00293C0.30008 13.816 -0.184127 13.1093 0.0703125 12.4541L1.79785 8.00781L3.49609 12.3945ZM19.7822 12.4531C20.0377 13.1085 19.5539 13.8159 18.8506 13.8164H17.5439C17.1171 13.816 16.7372 13.5444 16.5986 13.1406L16.3457 12.4023L18.0469 8.00586L19.7822 12.4531ZM3.5625 3.48535H9.21289C9.5968 3.87526 10.2467 3.87542 10.6309 3.48535H16.2842L17.5088 6.62598L15.8428 10.9326L14.2598 6.30957C13.9565 5.4249 12.7133 5.40373 12.3799 6.27734L12.0957 7.02344C12.0101 7.2485 12.008 7.49753 12.0908 7.72363L13.8252 12.4531C14.0638 13.1052 13.581 13.7961 12.8867 13.7969H12.085C11.6524 13.7966 11.268 13.5177 11.1338 13.1064L10.8691 12.2939C10.5691 11.3742 9.26795 11.3743 8.96777 12.2939L8.70215 13.1064C8.56805 13.5175 8.18428 13.7964 7.75195 13.7969H6.96094C6.26876 13.7963 5.78598 13.1093 6.02051 12.458L7.73047 7.71582C7.8103 7.49403 7.80935 7.25037 7.72754 7.0293L7.46387 6.31738C7.13737 5.4368 5.886 5.45185 5.58008 6.33984L4 10.9287L2.33496 6.62695L3.56055 3.47656L3.5625 3.48535Z"
                           fill="#0077D4"
                        />
                     </svg>
                     <h1 className="text-xl font-extrabold text-[#007DE4] tracking-tight">Myway</h1>
                  </div>
                  {/* <div>
                     <div className="font-semibold text-base">Myway</div>
                     <div className="font-regular text-base">Management</div>
                  </div> */}
               </div>
               <div className="relative">
                  <Icon36 name="alert" />
                  {hasNotification && <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>}
               </div>
            </div>
            <div className="flex flex-col gap-10">
               <div className="flex flex-col gap-4">
                  <div className="text-xl">이벤트 및 공지사항</div>
                  <div>
                     <button
                        onClick={() => setSelectedMenu('event')}
                        className={`flex w-full gap-1 text-base items-center p-2 rounded-xl hover:bg-primary/8 transition-colors ${selectedMenu === 'event' && 'text-primary font-semibold'}`}
                     >
                        <Icon36 name="bigcalendar" className="active:text-primary" />
                        이벤트 관리
                     </button>
                     <button
                        onClick={() => setSelectedMenu('notice')}
                        className={`flex w-full gap-1 text-base items-center p-2 rounded-xl hover:bg-primary/8 transition-colors ${selectedMenu === 'notice' && 'text-primary font-semibold'}`}
                     >
                        <Icon36 name="notice36" className="active:text-primary" />
                        공지사항 관리
                     </button>
                  </div>
               </div>
               <div className="flex flex-col gap-4">
                  <div className="text-xl">신고</div>
                  <div>
                     <button
                        onClick={() => setSelectedMenu('user-report')}
                        className={`flex w-full gap-1 text-base items-center p-2 rounded-xl hover:bg-primary/8 transition-colors ${selectedMenu === 'user-report' && 'text-primary font-semibold'}`}
                     >
                        <Icon36 name="user" className="active:text-primary" />
                        사용자 신고 관리
                     </button>
                     <button
                        onClick={() => setSelectedMenu('party-report')}
                        className={`flex w-full gap-1 text-base items-center p-2 rounded-xl hover:bg-primary/8 transition-colors ${selectedMenu === 'party-report' && 'text-primary font-semibold'}`}
                     >
                        <Icon36 name="party" className="active:text-primary" />
                        파티 신고 관리
                     </button>
                  </div>
               </div>
            </div>
         </div>
         <div className="flex flex-col flex-1 h-full p-6 overflow-hidden">
            {selectedMenu === 'event' && <Event />}
            {selectedMenu === 'notice' && <Notice />}
            {selectedMenu === 'user-report' && <UserReport />}
            {selectedMenu === 'party-report' && <PartyReport />}
         </div>
      </div>
   );
}
