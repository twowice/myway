"use client";

import { panelstore } from "@/stores/panelstore";
import SlidePanel from "../slidepanel";
import Tab from "@/components/ui/tab";
import { MyProfileBody } from "@/feature/mypage/MyprofileBody";

export default function MypagePanel() {
  const { openpanel, setopenpanel } = panelstore();

  const tabItems = [
    {
      value: "profile",
      label: "내프로필",
      content: <MyProfileBody />,
    },
    {
      value: "party",
      label: "내 파티 활동",
      content: <div className="text-sm text-foreground/70">내 파티 활동</div>,
    },
    {
      value: "liked",
      label: "좋아요",
      content: <div className="text-sm text-foreground/70">좋아요 목록</div>,
    },
  ];

  return (
    <SlidePanel
      isopen={openpanel === "mypage"}
      onclose={() => setopenpanel(null)}
      title="마이페이지"
    >
      <div className="flex flex-col gap-3 h-full">
        <p className="text-[24px] font-semibold">마이페이지</p>
        <Tab items={tabItems} className="flex-1 min-h-0" />
      </div>
    </SlidePanel>
  );
}
