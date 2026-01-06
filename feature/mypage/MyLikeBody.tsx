"use client";

import { Segment } from "@/components/tabs/segment/segment";
import { LikedEventBody } from "@/feature/mypage/LikedEventBody";
import { LikedPartyBody } from "@/feature/mypage/LikedPartyBody";

export const MyLikeBody = () => {
  return (
    <Segment
      contents={[
        {
          value: "event",
          title: "이벤트",
          content: <LikedEventBody />,
        },
        {
          value: "party",
          title: "파티",
          content: <LikedPartyBody />,
        },
      ]}
    />
  );
};
