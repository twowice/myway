'use client';
import Link from 'next/link'
import { useEffect, useState } from 'react';
import { EventTitle } from '@/feature/event/EventTitle';
import { FilterHeader } from '@/feature/event/FilterHeader';
import { EventCard } from '@/feature/event/EventCard';

interface EventItem {
    id: number;
    title: string;
    startDate: string;
    endDate: string;
    region: string;
    imageUrl: string;
}

export default function Page() {
    const [events, setEvents] = useState<EventItem[]>([]);
    const onSearch = (keyword: string) => {
        console.log("INPUT검색 중...", keyword);
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // const res = await fetch("/api/events");
                // const data = await res.json();
                
                /* 더미 데이터 */
                const data: EventItem[] = [
                    {
                        id: 1,
                        title: "광복로 겨울빛 트리축제",
                        startDate: "2025.12.05",
                        endDate: "2026.02.22",
                        region: "부산 중구",
                        imageUrl: "/1.png"
                    },
                    {
                        id: 2,
                        title: "부산 불꽃축제",
                        startDate: "2025.10.05",
                        endDate: "2025.10.12",
                        region: "부산 해운대",
                        imageUrl: "/1.png"
                    },
                    {
                        id: 3,
                        title: "해운대 빛축제",
                        startDate: "2025.11.20",
                        endDate: "2026.01.20",
                        region: "부산 해운대구",
                        imageUrl: "/1.png"
                    },
                    {
                        id: 4,
                        title: "송도 해상 케이블카 축제",
                        startDate: "2025.04.12",
                        endDate: "2025.04.20",
                        region: "부산 서구",
                        imageUrl: "/1.png"
                    },
                    {
                        id: 5,
                        title: "삼락 생태공원 봄꽃축제",
                        startDate: "2025.03.28",
                        endDate: "2025.04.12",
                        region: "부산 사상구",
                        imageUrl: "/1.png"
                    },
                    {
                        id: 6,
                        title: "기장 멸치축제",
                        startDate: "2025.05.01",
                        endDate: "2025.05.05",
                        region: "부산 기장군",
                        imageUrl: "/1.png"
                    },
                    {
                        id: 7,
                        title: "부산 국제록페스티벌",
                        startDate: "2025.09.15",
                        endDate: "2025.09.17",
                        region: "부산 사상구",
                        imageUrl: "/1.png"
                    },
                    {
                        id: 8,
                        title: "부산 국제영화제",
                        startDate: "2025.10.03",
                        endDate: "2025.10.12",
                        region: "부산 해운대구",
                        imageUrl: "/1.png"
                    }
                ];

                setEvents(data);
            } catch (e) { console.error("이벤트 데이터 불러오는 중 오류:", e) }
        };

        fetchEvents();
    }, []);

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

                <EventTitle count={124} />
                <FilterHeader onSearch={onSearch} />

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
                    {events.map((item) => (
                        <Link
                            key={item.id}
                            href={`/eventpage/${item.id}`}
                            className="block cursor-pointer">
                            <EventCard
                                title={item.title}
                                startDate={item.startDate}
                                endDate={item.endDate}
                                region={item.region}
                                imageUrl={item.imageUrl}
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}