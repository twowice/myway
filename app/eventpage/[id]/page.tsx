"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { EventDetailTitle } from '@/feature/event/detail/EventDetailTitle';
import { EventDetailSum } from '@/feature/event/detail/EventDetailSum';
import { PartyDrawer } from '@/feature/event/detail/PartyDrawer';
import { ImageCarousel } from '@/feature/event/detail/ImageCarousel';
import { PartyRow } from '@/components/partyrow/PartyRow'
import NaverMapContainer from "@/components/map/NaverMapContainer";
import { EmptyIcon } from '@/components/status/EmptyIcon';
import { LoadingBounce } from '@/components/status/LoadingBounce';

/* ===========================
   Interface
=========================== */
interface EventImage {
  image_url: string;
  is_main: boolean;
}

interface EventData {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  address: string;
  address2: string;
  latitude: number;
  longitude: number;
  phone: string;
  main_image: string;
  homepage?: string;
  overview?: string;
  event_images?: EventImage[];
  price?: number | null;
  insta_url?: string | null;
} 

export default function Page() {
  const partyList = [
    {
      id: 1,
      partyName: "부산 불꽃축제 같이 가요",
      current_members: 2,
      max_members: 4,
    },
    {
      id: 2,
      partyName: "재즈 페스티벌 혼행 탈출",
      current_members: 3,
      max_members: 5,
    },
    {
      id: 3,
      partyName: "푸드트럭 투어 파티",
      current_members: 1,
      max_members: 3,
    },
  ];

  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  const region = event?.address.split(" ") ?? [];
  const imageUrl = event?.main_image ?? "/error/no-image.svg";
  const images = event?.event_images?.filter(img => !img.is_main).map(img => img.image_url) ?? [];
  const carousImages = images.length > 0 ? images : ["/error/no-image.svg"];
  const price = event?.price ?? 0;
  const insta_url = event?.insta_url ?? "https://www.instagram.com/";

  /* ===========================
      API Fetch
  =========================== */
  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/events/${id}`);
        if (!res.ok) throw new Error("Failed to fetch event");
        
        const json = await res.json();
        console.log(json.data)

        setEvent(json.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <LoadingBounce />;
  if (!event) return <EmptyIcon />;

  return (
    <div className="flex flex-col space-y-4 md:space-y-6 lg:space-y-[22px] pb-[80px] pt-[70px] px-[16px] sm:px-[32px] lg:px-[80px] xl:px-[100px]">
      {/* 타이틀 */}
      <EventDetailTitle
        id={id}
        region={region.length >= 2 ? `${region[0]} ${region[1]}` : region[0] ?? ""}
        title={event.title}
        startDate={event.start_date}
        endDate={event.end_date}
        imageUrl={imageUrl}
      />

      {/* 이미지 */}
      <ImageCarousel images={carousImages} />

      {/* 설명 */}
      <p className="text-sm md:text-base text-gray-700 leading-relaxed pb-[80px] pt-[10px]">
        {event.overview}
      </p>

      <span className='text-xl md:text-2xl lg:text-[36px] font-semibold'>
        {event.title}는 이렇게 구성되어 있어요
      </span>

      {/* 디테일 */}
      <EventDetailSum
        imageUrl={event.main_image}
        startDate={event.start_date}
        endDate={event.end_date}
        price={price}
        region={event.address}
        phone={event.phone}
        insta_url={insta_url}
      />

      {/* 지도 */}
      <div className="flex items-center gap-3">
        <div className="w-full h-[260px] md:h-[320px] lg:h-[353px] rounded-xl overflow-hidden border">
          <NaverMapContainer
            lat={event.latitude}
            lng={event.longitude}
          />
        </div>
      </div>

      {/* 홈페이지 버튼 */}
      <div className="w-full h-[45px] bg-[var(--primary)] text-[#F1F5FA] rounded-[4px] flex items-center justify-center gap-4 cursor-pointer hover:opacity-80">
        <a
          href={event.homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="
            w-full h-[45px]
            bg-[var(--primary)]
            text-[#F1F5FA]
            rounded-[4px]
            flex items-center justify-center
            cursor-pointer
            hover:opacity-80
            transition
          "
        >
          홈페이지 바로가기
        </a>
      </div>

      {/* 파티 리스트 */}
      <span className='mt-[80px] text-[20px] font-semibold text-[#04152F] '>
        파티 모집 현황
      </span>

      <div className="flex flex-col gap-3">
        {partyList.map((party, index) => (
          <PartyRow
            key={party.id}
            index={index}
            partyName={party.partyName}
            current_members={party.current_members}
            max_members={party.max_members}
          />
        ))}
      </div>

      {/* 우측 하단 플로팅 버튼 */}
      <PartyDrawer eventId={id} name={event.title} />
    </div>
  );
}
