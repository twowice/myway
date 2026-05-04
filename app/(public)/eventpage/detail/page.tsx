'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EmptyIcon } from '@/components/status/EmptyIcon';
import { EventCard } from '@/feature/event/EventCard';
import { EventSkeletonGrid } from '@/feature/event/EventSkeletonGrid';
import { EventTitle } from '@/feature/event/EventTitle';
import { FilterHeader } from '@/feature/event/FilterHeader';
import { fetchEventsPage } from '@/lib/event/event';
import { fetchLikedEventIds } from '@/lib/mypage/event';
import { useEventFilterStore } from '@/stores/eventFilterStore';
import type { EventItem } from '@/types/event';

const LIMIT = 12;

export default function Page() {
    const { status } = useSession();
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);
    const [total, setTotal] = useState(0);

    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const isFetchingRef = useRef(false);
    const hasMoreRef = useRef(true);

    const isPanel = false;

    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('A02');

    const region = useEventFilterStore((state) => state.region);
    const setRegion = useEventFilterStore((state) => state.setRegion);

    const [month, setMonth] = useState('all');

    const handleFilterChange = (filter: { category: string; region: string; month: string }) => {
        setCategory(filter.category);
        setRegion(filter.region);
        setMonth(filter.month);
    };

    const { data: likedEventIds = [] } = useQuery({
        queryKey: ['liked-event-ids'],
        queryFn: fetchLikedEventIds,
        enabled: status === 'authenticated',
        select: (data) => data.eventIds,
    });

    const likedEventIdSet = useMemo(() => new Set(likedEventIds), [likedEventIds]);

    const fetchEvents = useCallback(async (currentOffset: number, force = false) => {
        if (!force && (isFetchingRef.current || !hasMoreRef.current)) return;

        isFetchingRef.current = true;
        setLoading(true);

        try {
            const result = await fetchEventsPage({
                limit: LIMIT,
                offset: currentOffset,
                category,
                region,
                month,
                keyword,
            });

            setTotal(result.pagination.total);

            setEvents((prev) => {
                const merged = [...prev, ...result.mapped];
                return Array.from(new Map(merged.map((event) => [event.id, event])).values());
            });

            const nextHasMore = result.pagination?.hasMore ?? result.mapped.length === LIMIT;
            hasMoreRef.current = nextHasMore;
            setHasMore(nextHasMore);
        } catch (e) {
            console.error('Event Data Loading Fail:', e);
        } finally {
            setLoading(false);
            isFetchingRef.current = false;
        }
    }, [category, keyword, month, region]);

    useEffect(() => {
        setEvents([]);
        setHasMore(true);
        hasMoreRef.current = true;
        setOffset(0);
        fetchEvents(0, true);
    }, [fetchEvents]);

    useEffect(() => {
        if (offset === 0) return;
        fetchEvents(offset);
    }, [fetchEvents, offset]);

    useEffect(() => {
        if (!loadMoreRef.current || loading || !hasMore) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isFetchingRef.current) {
                    setOffset((prev) => prev + LIMIT);
                }
            },
            { rootMargin: '200px' }
        );

        observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [hasMore, loading]);

    return (
        <div
            className="
                w-full
                justify-center
                pt-[70px]
                px-[16px]
                sm:px-[32px]
                lg:px-[80px]
                xl:px-[100px]
            "
        >
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

                {loading && events.length === 0 && <EventSkeletonGrid count={12} />}

                {!loading && events.length === 0 && !hasMore && <EmptyIcon />}

                {events.length > 0 && (
                    <div
                        className="
                            grid
                            gap-x-[16px]
                            gap-y-[16px]
                            grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
                        "
                    >
                        {events.map((item) => (
                            <Link key={item.id} href={`/eventpage/${item.id}`} className="block cursor-pointer">
                                <EventCard
                                    id={item.id}
                                    region={item.region}
                                    title={item.title}
                                    startDate={item.startDate}
                                    endDate={item.endDate}
                                    imageUrl={item.imageUrl}
                                    initialLiked={likedEventIdSet.has(item.id)}
                                />
                            </Link>
                        ))}
                    </div>
                )}

                {loading && events.length > 0 && <EventSkeletonGrid count={4} />}

                {hasMore && <div ref={loadMoreRef} className="h-10" />}
            </div>
        </div>
    );
}
