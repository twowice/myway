"use client";

import { Segment } from "@/components/tabs/segment/segment";

export const MyLikeBody = () => {
  return (
    <Segment
      contents={[
        {
          value: "event",
          title: "이벤트",
          content: (
            <div className="text-sm text-foreground/70">
              좋아요한 이벤트
            </div>
          ),
        },
        {
          value: "party",
          title: "파티",
          content: (
            <div className="text-sm text-foreground/70">
              좋아요한 파티
            </div>
          ),
        },
      ]}
    />
  );
};
