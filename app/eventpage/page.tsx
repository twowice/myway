'use client';
import Link from 'next/link'
import { useEffect, useState } from 'react';
import { EventTitle } from '@/feature/event/EventTitle';
import { FilterHeader } from '@/feature/event/FilterHeader';
import { EventCard } from '@/feature/event/EventCard';
import { EmptyIcon } from '@/components/status/EmptyIcon';
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
    const [loading, setLoading] = useState(true);

    const onSearch = (keyword: string) => {
        console.log("INPUT검색 중...", keyword);
    };


    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch("/api/events", {
                    method: "GET",
                    cache: "no-store",
                });

                if (!res.ok) throw new Error("❌ Event API Request Fail")
                const data = await res.json();

                console.log("Events Data: ", data);
                const mapped: EventItem[] = data.map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    startDate: item.start_date,
                    endDate: item.end_date,
                    region: item.region,
                    imageUrl: item.image?.[0] ?? "/placeholder.png",
                }));

                setEvents(mapped);
            } catch (e) { console.error("❌ Event Data Roading Fail:", e); setEvents([]);}
            finally { setLoading(false); }
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
                <>
                    <EventTitle count={events.length} />
                    <FilterHeader onSearch={onSearch} />
                    {!loading && events.length > 0 && (
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
                    )}
                    
                    {/* 데이터가 0 일때 */}
                    {!loading && events.length === 0 && <EmptyIcon />}
                </>
            </div>
        </div>
    )
}