'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { EventSkeletonGrid } from '@/feature/event/EventSkeletonGrid';
import { EventTitle } from '@/feature/event/EventTitle';
import { FilterHeader } from '@/feature/event/FilterHeader';
import { EventCard } from '@/feature/event/EventCard';
import { EmptyIcon } from '@/components/status/EmptyIcon';
import EventPanel from '@/components/header/panels/eventpanel';
import { useEventFilterStore } from '@/stores/eventFilterStore';
import { panelstore } from '@/stores/panelstore';

/* ===========================
   Interface
=========================== */
interface EventItem {
    id: number;
    region: string;
    title: string;
    startDate: string;
    endDate: string;
    overview: string;
    imageUrl: string;
    event_images: string;
}

export default function Page() {
    /* ===========================
        Hook
    =========================== */
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);
    const [total, setTotal] = useState(0);

    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const isFetchingRef = useRef(false);

    const openpanel = panelstore((state) => state.openpanel);
    const isPanel = openpanel !== null; // 패널 상태

    /* 필터링 */
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

    /* ===========================
        API Fetch
    =========================== */
    const fetchEvents = async (currentOffset: number, force = false) => {
        if (!force && (isFetchingRef.current || !hasMore)) return;

        isFetchingRef.current = true;
        setLoading(true);

        try {
            const res = await fetch(
                `/api/events?limit=12&offset=${currentOffset}` +
                `&category=${encodeURIComponent(category)}` +
                `&region=${encodeURIComponent(region)}` +
                `&month=${encodeURIComponent(month)}` +
                `&keyword=${encodeURIComponent(keyword)}`,
                { cache: 'no-store' }
            );

            if (!res.ok) throw new Error('❌ Event API Request Fail');

            const json = await res.json();
            const list = json.data ?? [];

            setTotal(json.pagination.total);

            const mapped: EventItem[] = list.map((item: any) => {
                const addressRegion = item.address?.split(' ') ?? [];
                return {
                    id: item.id,
                    title: item.title,
                    startDate: item.start_date,
                    endDate: item.end_date,
                    region:
                        addressRegion.length >= 2
                            ? `${addressRegion[0]} ${addressRegion[1]}`
                            : addressRegion[0] ?? '',
                    imageUrl: item.main_image ?? '/error/no-image.svg',
                    event_images: item.event_images,
                    overview: item.overview ?? '',
                };
            });

            setEvents((prev) => {
                const merged = [...prev, ...mapped];
                return Array.from(new Map(merged.map((e) => [e.id, e])).values());
            });

            setHasMore(json.pagination?.hasMore ?? mapped.length === 12);
        } catch (e) {
            console.error('❌ Event Data Loading Fail:', e);
        } finally {
            setLoading(false);
            isFetchingRef.current = false;
        }
    };

    /* ===========================
        Initial Load
    =========================== */
    useEffect(() => {
        setEvents([]);
        setHasMore(true);
        setOffset(0);
        fetchEvents(0, true);
    }, [keyword, category, region, month]);

    useEffect(() => {
        if (offset === 0) return;
        fetchEvents(offset);
    }, [offset]);

    /* ===========================
        Infinite Scroll Observer
    =========================== */
    useEffect(() => {
        if (!loadMoreRef.current || loading || !hasMore) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isFetchingRef.current) {
                    setOffset((prev) => prev + 12);
                }
            },
            { rootMargin: '200px' }
        );

        observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [hasMore, loading, isPanel]);

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

                {loading && events.length === 0 && <EventSkeletonGrid count={12} isPanel={isPanel}/>}

                {!loading && events.length === 0 && !hasMore && <EmptyIcon />}

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
                            <Link key={item.id} href={`/eventpage/${item.id}`} className="block cursor-pointer">
                                <EventCard
                                    id={item.id}
                                    region={item.region}
                                    title={item.title}
                                    startDate={item.startDate}
                                    endDate={item.endDate}
                                    imageUrl={item.imageUrl}
                                />
                            </Link>
                        ))}
                    </div>
                )}

                {loading && events.length > 0 && <EventSkeletonGrid count={4} isPanel={isPanel} />}
                {hasMore && <div ref={loadMoreRef} className="h-10" />}
            </div>
        </div>
    );

    return <EventPanel>{content}</EventPanel>;
}
