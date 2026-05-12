'use client';

import Link from 'next/link';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { EmptyIcon } from '@/components/status/EmptyIcon';
import EventPanel from '@/components/header/panels/eventpanel';
import { EventCard } from '@/feature/event/EventCard';
import { EventSkeletonGrid } from '@/feature/event/EventSkeletonGrid';
import { EventTitle } from '@/feature/event/EventTitle';
import { FilterHeader } from '@/feature/event/FilterHeader';
import { fetchEventsPage } from '@/lib/event/event';
import { fetchLikedEventIds } from '@/lib/mypage/event';
import { useEventFilterStore } from '@/stores/eventFilterStore';
import { panelstore } from '@/stores/panelstore';
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button';

const LIMIT = 4;

export default function Page() {
    const { status } = useSession();
    const openpanel = panelstore((state) => state.openpanel);
    const isPanel = openpanel !== null;

    const keyword = useEventFilterStore((state) => state.keyword);
    const setKeyword = useEventFilterStore((state) => state.setKeyword);

    const region = useEventFilterStore((state) => state.region);
    const setRegion = useEventFilterStore((state) => state.setRegion);

    const [category, setCategory] = useState('A02');
    const [month, setMonth] = useState('all');

    const handleFilterChange = (filter: { category: string; region: string; month: string }) => {
        setCategory(filter.category);
        setRegion(filter.region);
        setMonth(filter.month);
    };

    const {
        data,
        isLoading,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        error,
    } = useInfiniteQuery({
        queryKey: ['events', { keyword, category, region, month }],
        queryFn: ({ pageParam }) =>
            fetchEventsPage({
                limit: LIMIT,
                offset: pageParam,
                category,
                region,
                month,
                keyword,
            }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) =>
            lastPage.pagination?.hasMore ? lastPage.pagination.nextOffset ?? undefined : undefined,
    });

    const pages = useMemo(() => data?.pages ?? [], [data?.pages]);
    const total = pages[0]?.pagination?.total ?? 0;

    const events = useMemo(() => {
        const merged = pages.flatMap((p) => p.mapped);
        return Array.from(new Map(merged.map((event) => [event.id, event])).values());
    }, [pages]);

    const { data: likedEventIds = [] } = useQuery({
        queryKey: ['liked-event-ids'],
        queryFn: fetchLikedEventIds,
        enabled: status === 'authenticated',
        select: (data) => data.eventIds,
    });

    const likedEventIdSet = useMemo(() => new Set(likedEventIds), [likedEventIds]);

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
    const router = useRouter();
    const handleCardClick = (id: number) => { setSelectedCardId(prev => (prev === id ? null : id)) };
    const setFocusedEvent = useEventFilterStore((state) => state.setFocusedEvent);

    useEffect(() => {
        if (!loadMoreRef.current) return;
        if (!hasNextPage) return;

        const el = loadMoreRef.current;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { rootMargin: '200px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage, isPanel]);

    const content = (
        <div className={`w-full justify-center ${isPanel ? 'px-[16px]' : 'pt-[70px] px-[16px]'}`}>
            <div className="flex flex-col space-y-[22px]">
                <EventTitle count={total} />

                <FilterHeader
                    onSearch={setKeyword}
                    category={category}
                    region={region}
                    month={month}
                    onFilterChange={handleFilterChange}
                    isPanel={isPanel}
                />

                {isLoading && events.length === 0 && <EventSkeletonGrid count={12} isPanel={isPanel} />}

                {!isLoading && events.length === 0 && !hasNextPage && <EmptyIcon />}

                {error && <div className="text-sm text-red-500">데이터를 불러오는데 실패했어요.</div>}

                {events.length > 0 && (
                    <div
                        className={`
                            grid
                            gap-x-[16px]
                            gap-y-[16px]
                            ${isPanel ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}
                        `}
                    >
                        {events.map((item) => (
                            <div 
                                key={item.id}
                                className={`relative cursor-pointer rounded-[10px] transition 
                                    ${selectedCardId === item.id ? 'ring-3 ring-primary ring-offset-2' : ''
                                }`}
                                onClick={() => handleCardClick(item.id)}
                            >
                                <EventCard
                                    id={item.id}
                                    region={item.region}
                                    title={item.title}
                                    startDate={item.startDate}
                                    endDate={item.endDate}
                                    imageUrl={item.imageUrl}
                                    initialLiked={likedEventIdSet.has(item.id)}
                                />

                                {selectedCardId === item.id && (
                                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[10px] bg-black/25 backdrop-blur-[2px]">
                                        <div className='flex gap-2'>
                                            <Button
                                                variant="outline"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // 지도 마커 삽입
                                                    if(item.latitude == null || item.longitude == null) return;

                                                    setFocusedEvent({
                                                        id: item.id,
                                                        title: item.title,
                                                        latitude: item.latitude,
                                                        longitude: item.longitude,
                                                    });
                                                }}
                                            >
                                                위치
                                            </Button>

                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/eventpage/${item.id}`);
                                                }}
                                            >
                                                상세
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {isFetchingNextPage && events.length > 0 && <EventSkeletonGrid count={4} isPanel={isPanel} />}

                {hasNextPage && <div ref={loadMoreRef} className="h-10" />}
            </div>
        </div>
    );

    return <EventPanel>{content}</EventPanel>;
}
