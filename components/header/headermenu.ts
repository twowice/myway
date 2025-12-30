export const mainmenu = [
  { name: '이벤트',    icon: 'event',     href: '/eventpage',   panelkey: 'event' },
  { name: '길찾기',    icon: 'location',  href: '/locationpage', panelkey: 'location' },
  { name: '파티 모집', icon: 'matching',  href: '/partypage',   panelkey: 'party' },
  { name: '마이페이지', icon: 'profile',  href: '/mypage',      panelkey: 'mypage' },
  { name: '더보기',    icon: 'more',      href: '/morepage',    panelkey: 'more' },
] as const;

export type panelkey = typeof mainmenu[number]['panelkey'] | null;