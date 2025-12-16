"use client";

import { EllipsisPagination } from "@/components/pagination/pagination";
import { Segment } from "@/components/tabs/segment/segment";
import { Button } from "@/components/ui/button";
import Tab from "@/components/ui/tab";
import { useCallback, useState } from "react";

export default function MyPage() {
  const [page, setPage] = useState(1);
  const totalPages = 20; // 실제로는 서버에서 받아오거나 계산된 총 페이지 수

  // Callback 함수들
  const handleMainClick = useCallback((id: number) => {
    console.log(`[메인 클릭] Route ID: ${id}`);
    alert(`[메인 클릭] Route ID: ${id}`);
  }, []);

  const handleShare = useCallback((id: number) => {
    console.log(`[공유 버튼 클릭] Route ID: ${id}`);
    alert(`[공유 버튼 클릭] Route ID: ${id}`);
    // 실제로는 여기에 공유 로직 (예: URL 복사, 소셜 미디어 공유 모달) 구현
  }, []);

  const handleRouteClick = useCallback((id: number) => {
    console.log(`[경로 버튼 클릭] Route ID: ${id}`);
    alert(`[경로 버튼 클릭] Route ID: ${id}`);
    // 실제로는 여기에 경로 상세 페이지로 이동하는 로직 구현
  }, []);

  const uploadImage = (file: File) => {
    console.log("uploadImage : ", URL.createObjectURL(file));
    return 400;
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 min-h-screen w-100 gap-4">
      <EllipsisPagination
        currentPage={page}
        totalPages={totalPages}
        handlePageChange={() => {}}
      />
      <Segment
        contents={[
          {
            value: "event",
            title: "이벤트",
            content: <Button variant={"ghost"}>이벤트 테스트합니다.</Button>,
          },
          {
            value: "route",
            title: "경로",
            content: (
              <div>
                <Button variant={"default"}>경로 세그먼트 테스트합니다.</Button>
                <p>글글글글그륵륵</p>
              </div>
            ),
          },
        ]}
      />
      <Tab
        items={[
          {
            value: "테스트1",
            label: "테스트1",
            content: <p>테스트1 중입니다.</p>,
          },
          {
            value: "테스트2",
            label: "테스트2",
            content: <p>테스트2 중입니다.</p>,
          },
        ]}
      />
    </div>
  );
}
