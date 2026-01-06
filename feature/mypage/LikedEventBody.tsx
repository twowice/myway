"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
} from "react";
import { useSession } from "next-auth/react";
import { ComboboxComponent } from "@/components/basic/combo";
import { EventCard } from "@/feature/event/EventCard";
import { fetchLikedEventIds, fetchLikedEvents } from "@/lib/mypage/event";
import { EventCardSkeleton } from "../event/EventSkeletonGrid";

interface EventItem {
  id: number;
  region: string;
  title: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  eventCategory?: string;
}

export const LikedEventBody = () => {
  const { data: session } = useSession();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [likedEventIds, setLikedEventIds] = useState<number[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categoryOptions = useMemo(
    () => [
      { value: "all", label: "전체" },
      { value: "A02", label: "축제" },
      { value: "performance", label: "공연" },
      { value: "exhibition", label: "전시" },
      { value: "popup", label: "팝업" },
      { value: "etc", label: "기타" },
    ],
    []
  );

  const normalizeCategory = (event: any) => {
    const cat1 = event?.cat1;
    if (cat1 === "A02") {
      return "A02";
    }
    return "etc";
  };

  const loadLikedEvents = useCallback(
    async (silent = false) => {
      if (!session?.user?.id) return;
      if (!silent) setLoading(true);

      try {
        const [json, likedIdsResponse] = await Promise.all([
          fetchLikedEvents(),
          fetchLikedEventIds(),
        ]);
        const list = json.data ?? [];
        const mapped: EventItem[] = list.map((item: any) => {
          const addressRegion = item.address?.split(" ") ?? [];
          return {
            id: item.id,
            title: item.title,
            startDate: item.start_date,
            endDate: item.end_date,
            region:
              addressRegion.length >= 2
                ? `${addressRegion[0]} ${addressRegion[1]}`
                : addressRegion[0] ?? "",
            imageUrl: item.main_image ?? "/error/no-image.svg",
            eventCategory: normalizeCategory(item),
          };
        });
        setEvents(mapped);
        setLikedEventIds(likedIdsResponse.eventIds ?? []);
      } catch (error) {
        console.error("이벤트 좋아요 통신 실패", error);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [session?.user?.id]
  );

  useEffect(() => {
    void loadLikedEvents();
  }, [loadLikedEvents]);

  const likedEventIdSet = useMemo(
    () => new Set(likedEventIds),
    [likedEventIds]
  );

  useEffect(() => {
    if (likedEventIdSet.size === 0) return;
    const originalFetch = window.fetch;

    window.fetch = async (input, init) => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
          ? input.toString()
          : input.url;
      const method = (
        init?.method ?? (input instanceof Request ? input.method : "GET")
      ).toUpperCase();

      if (method === "GET") {
        const match = url.match(/\/api\/events\/(\d+)\/like(?:\?|$)/);
        if (match) {
          const eventId = Number(match[1]);
          const liked = likedEventIdSet.has(eventId);
          return new Response(JSON.stringify({ liked }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      }

      return originalFetch(input, init);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [likedEventIdSet]);

  const handleCardClickCapture = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (!target.closest("button")) return;
      window.setTimeout(() => {
        void loadLikedEvents(true);
      }, 200);
    },
    [loadLikedEvents]
  );

  if (!session?.user?.id) {
    return (
      <div className="rounded-md bg-primary-foreground p-4 text-sm text-foreground/70">
        좌측 하단에 위치한 로그인 완료하신 후에 이용하실 수 있습니다.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, idx: number) => (
          <EventCardSkeleton key={idx} isPanel={true} />
        ))}
      </div>
    );
  }

  const filteredEvents =
    categoryFilter === "all"
      ? events
      : events.filter((event) => event.eventCategory === categoryFilter);

  return (
    <div
      className="flex flex-col gap-2"
      onClickCapture={handleCardClickCapture}
    >
      <div className="flex items-center justify-start gap-3">
        <p className="text-sm text-foreground/70">이벤트 카테고리</p>
        <ComboboxComponent
          options={categoryOptions}
          value={categoryFilter}
          onValueChange={setCategoryFilter}
          width="w-[220px]"
          height="h-9"
        />
      </div>

      {filteredEvents.length === 0 ? (
        <div className="flex items-center justify-center py-10 text-sm text-foreground/60">
          좋아요한 이벤트가 없습니다.
        </div>
      ) : (
        filteredEvents.map((item) => (
          <Link
            key={item.id}
            href={`/eventpage/${item.id}`}
            className="block cursor-pointer"
          >
            <EventCard
              id={item.id}
              region={item.region}
              title={item.title}
              startDate={item.startDate}
              endDate={item.endDate}
              imageUrl={item.imageUrl}
            />
          </Link>
        ))
      )}
    </div>
  );
};
