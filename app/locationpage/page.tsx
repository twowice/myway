"use client";

import { Button } from "@/components/ui/button";
import { RouteSearchBar } from "@/feature/location/RouteSearchBar";
import { RouteSearchHistoryItem } from "@/feature/location/RouteSearchHistory";
import { useState } from "react";

export default function Location() {
  const [isDuringSearching, setIsDuringSearching] = useState(false);

  const histories = [
    { order: 1, departure: "해운대 해수욕장", destination: "벡스코" },
  ];
  const search = () => {};

  return (
    <div className="bg-white p-4 flex flex-col gap-6">
      <p className="text-[32px]">안녕하세요, 00님</p>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between">
          <h1 className="text-[24px] font-semibold">길찾기</h1>
          <Button disabled={isDuringSearching} onClick={search}>
            길찾기
          </Button>
        </div>
        <RouteSearchBar order={1} total={2} />
        <RouteSearchBar order={2} total={2} />
      </div>

      <div className="flex gap-0 flex-col">
        <RouteSearchHistoryItem
          order={1}
          departure="해운대 해수욕장"
          destination="벡스코"
        />
        <RouteSearchHistoryItem
          order={2}
          departure="해운대 해수욕장"
          destination="벡스코"
        />
        <RouteSearchHistoryItem
          order={3}
          departure="해운대 해수욕장"
          destination="벡스코"
        />
        <RouteSearchHistoryItem
          order={4}
          departure="해운대 해수욕장"
          destination="벡스코"
        />
        <RouteSearchHistoryItem
          order={5}
          departure="해운대 해수욕장"
          destination="벡스코"
        />
        <RouteSearchHistoryItem
          order={6}
          departure="해운대 해수욕장"
          destination="벡스코"
        />
      </div>
    </div>
  );
}
