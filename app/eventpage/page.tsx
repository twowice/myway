'use client';
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react';
import { EventSkeletonGrid } from '@/feature/event/EventSkeletonGrid';
import { EventTitle } from '@/feature/event/EventTitle';
import { FilterHeader } from '@/feature/event/FilterHeader';
import { EventCard } from '@/feature/event/EventCard';
import { EmptyIcon } from '@/components/status/EmptyIcon';

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
    const [events, setEvents] = useState<EventItem[]>([]); // 이벤트 데이터
    const [loading, setLoading] = useState(false); // 스켈레톤 (로딩)
    const [hasMore, setHasMore] = useState(true); // 컨텐츠가 더 있는 지 여부 [false시 무한 스크롤 중단]
    const [offset, setOffset] = useState(0); // 무한 스크롤에 필요한 offset [12개 단위로 증가]
    const [total, setTotal] = useState(0); // 이벤트 개수
    const loadMoreRef = useRef<HTMLDivElement | null>(null); // 하단 화면 감시용 sentinel
    const isFetchingRef = useRef(false); // 리엑트 state가 아닌 즉시 반영되는 플래그 [Observer 중복 트리거 방지 & fetch 중복 호출 차단]

    /* 필터링 */
    const [keyword, setKeyword] = useState(""); // 입력 검색
    const [category, setCategory] = useState('A02'); // 축제, 공연, 전시 ... [DEFAULT: 축제]
    const [region, setRegion] = useState("all"); // 서울, 대구, 부산 ...
    const [month, setMonth] = useState("all"); // 1월, 2월, 3월 ...
    const handleFilterChange = (filter: { category: string; region: string; month: string }) => { // FiterHeader 에서 호출
        setCategory(filter.category);
        setRegion(filter.region);
        setMonth(filter.month);
    };

    /* ===========================
        API Fetch
    =========================== */
    const fetchEvents = async (currentOffset: number, force = false) => { // [요청 페이지 위치, 초기로딩/필터변경 전용]
        if (!force && (isFetchingRef.current || !hasMore)) return; // [force=true, 중복 요청 차단, 마지막페이지 이후 차단]
        isFetchingRef.current = true; // observer가 또 트리거 돼도 무시
        setLoading(true);

        try {
             const res = await fetch(
                `/api/events?limit=12&offset=${currentOffset}` +
                `&category=${encodeURIComponent(category)}` +
                `&region=${encodeURIComponent(region)}` +
                `&month=${encodeURIComponent(month)}` +
                `&keyword=${encodeURIComponent(keyword)}`,
                { cache: 'no-store' } // 항상 최신 데이터
        );

            if (!res.ok) throw new Error("❌ Event API Request Fail")

            const json = await res.json();
            const list = json.data ?? [];

            setTotal(json.pagination.total);
            
            // 데이터 매핑
            const mapped: EventItem[] = list.map((item: any) => {
                const addressRegion = item.address?.split(" ") ?? [];
                return {
                    id: item.id,
                    title: item.title, // 제목
                    startDate: item.start_date, // 행사 시작일
                    endDate: item.end_date, // 행사 종료일
                    region: 
                        addressRegion.length >= 2
                            ? `${addressRegion[0]} ${addressRegion[1]}`
                            : addressRegion[0] ?? "", // 주소(XX시 XX구)
                    imageUrl: item.main_image ?? "/error/no-image.svg", // 메인 이미지
                    etcImgUrl: item.event_images,
                };
            });

            // 이벤트 누적 + 중복 제거
            setEvents(prev => {
                const merged = [...prev, ...mapped];
                return Array.from(new Map(merged.map(e => [e.id, e])).values());
            });
            
            // 이번 페이지가 12개면 다음페이지 존재
            setHasMore(
                json.pagination?.hasMore ?? mapped.length === 12
            );
        } catch (e) { console.error("❌ Event Data Roading Fail:", e); }
        finally { setLoading(false); isFetchingRef.current = false; } // observer 활성화
    };


    /* ===========================
       Initial Load
    =========================== */
    useEffect(() => {
        setEvents([]); // 이벤트
        setHasMore(true); // 무한스크롤
        setOffset(0); // 무한스크롤 offset
        fetchEvents(0, true); // api 요청 [요청페이지 위치, 초기로딩/필터변경 전용]
    }, [keyword, category, region, month])

    useEffect(() => {
        if (offset === 0) return;
        fetchEvents(offset);
    }, [offset]);

    /* ===========================
       Infinite Scroll Observer
    =========================== */
    useEffect(() => {
        if (!loadMoreRef.current || loading || !hasMore) return; // 이미 로딩중이거나 마지막 페이지면 중단

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isFetchingRef.current) { // sentinel 보임 & ref로 중복 방어
                    setOffset(prev => prev + 12);
                }
            },
            { rootMargin: '200px' }
        );

        observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [hasMore, loading, setOffset]);

    /* ===========================
       Render
    =========================== */
    return (
        <div className="
            pt-[70px] 
            w-full 
            justify-center

            px-[16px]
            sm:px-[32px]
            lg:px-[80px]
            xl:px-[100px]
        ">
            <div className="flex flex-col space-y-[22px]">
                <>
                    <EventTitle count={total} />
                    <FilterHeader 
                        onSearch={setKeyword}
                        category={category}
                        region={region}
                        month={month}
                        onFilterChange={handleFilterChange}
                    />

                    {/* 데이터 로딩중 */}
                    {loading && events.length === 0 && (<EventSkeletonGrid count={12} />)}

                    {/* 데이터 없음 */}
                    {!loading && events.length === 0 && !hasMore && <EmptyIcon />}

                    {/* 데이터 리스트 */}
                    {events.length > 0 && (
                        <div className="
                            grid 
                            grid-cols-1
                            sm:grid-cols-2
                            lg:grid-cols-3
                            xl:grid-cols-4
                            gap-x-[16px]
                            gap-y-[16px]
                            "
                        >
                            {events.map((item, idx) => (
                                <Link
                                    key={item.id}
                                    href={`/eventpage/${item.id}`}
                                    className="block cursor-pointer">
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

                    {/* 무한 스크롤 트리거 */}
                    {loading && events.length > 0 && <EventSkeletonGrid count={4} />}
                    {hasMore && (<div ref={loadMoreRef} className='h-10' />)}

                </>
            </div>
        </div>
    )
}