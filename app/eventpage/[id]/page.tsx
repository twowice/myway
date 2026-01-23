"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { EventDetailTitle } from '@/feature/event/detail/EventDetailTitle';
import { EventDetailSum } from '@/feature/event/detail/EventDetailSum';
import { PartyDrawer } from '@/feature/event/detail/PartyDrawer';
import { ImageCarousel } from '@/feature/event/detail/ImageCarousel';
import { PartyRow } from '@/components/partyrow/PartyRow'
import NaverMapContainer from "@/components/map/NaverMapContainer";
import { EmptyIcon } from '@/components/status/EmptyIcon';
import { LoadingBounce } from '@/components/status/LoadingBounce';
import { parseHomepageUrl } from '@/feature/event/url';
import { fetchLikedParties, fetchParties, togglePartyLike } from '@/lib/party/party';
import { PartyDetailPopup } from '@/feature/party/partyDetailPopup';

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
  price?: string | null;
  insta_url?: string | null;
}

interface PartyListItem {
  id: string;
  partyName: string;
  current_members: number;
  max_members: number;
  description?: string;
  location?: string;
  date?: string;
  time?: string;
  hostId?: string;
  eventName?: string;
  eventId?: number;
  locationLatitude?: number;
  locationLongitude?: number;
  label1?: string;
  label2?: string;
  label3?: string;
}

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [partyList, setPartyList] = useState<PartyListItem[]>([]);
  const [partyLoading, setPartyLoading] = useState(true);
  const [likedPartyIds, setLikedPartyIds] = useState<Set<string>>(new Set());
  const [selectedParty, setSelectedParty] = useState<PartyListItem | null>(null);
  const [selectedPartyId, setSelectedPartyId] = useState<number | null>(null);

  const region = event?.address.split(" ") ?? [];
  const imageUrl = event?.main_image ?? "/error/no-image.svg";
  const images = event?.event_images?.filter(img => !img.is_main).map(img => img.image_url) ?? [];
  const carousImages = images.length > 0 ? images : ["/error/no-image.svg"];
  const price = event?.price && event.price.trim() !== "" ? event.price : "요금 정보 없음";
  const insta_url = event?.insta_url ?? "https://www.instagram.com/";
  const homepageUrl = parseHomepageUrl(event?.homepage);

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

  useEffect(() => {
    if (!session?.user?.id) {
      setLikedPartyIds(new Set());
      return;
    }

    const loadLikedParties = async () => {
      try {
        const response = await fetchLikedParties();
        setLikedPartyIds(new Set(response.partyIds.map(String)));
      } catch (error) {
        console.error("좋아요 목록 조회 실패:", error);
        setLikedPartyIds(new Set());
      }
    };

    loadLikedParties();
  }, [session?.user?.id]);

  const handleToggleLike = async (partyId: string) => {
    if (!session?.user?.id) return;
    try {
      const result = await togglePartyLike(partyId);
      setLikedPartyIds((prev) => {
        const next = new Set(prev);
        if (result.liked) {
          next.add(partyId);
        } else {
          next.delete(partyId);
        }
        return next;
      });
    } catch (error) {
      console.error("파티 좋아요 처리 실패:", error);
    }
  };

  useEffect(() => {
    if (!id) return;
    const eventId = Number(id);
    if (!Number.isFinite(eventId)) {
      setPartyList([]);
      setPartyLoading(false);
      return;
    }

    const mapParty = (party: unknown): PartyListItem => {
      const data = party as {
        id?: number;
        name?: string;
        current_members?: number;
        max_members?: number;
        description?: string;
        location_name?: string;
        location_latitude?: number;
        location_longitude?: number;
        gathering_date?: string;
        owner_id?: string;
        tags?: string[];
        event_id?: number;
        events?: { title?: string };
      };
      const gatheringDate = data.gathering_date;
      let date: string | undefined;
      let time: string | undefined;
      if (typeof gatheringDate === "string" && gatheringDate.includes("T")) {
        const [datePart, timePart] = gatheringDate.split("T");
        date = datePart;
        const cleanTime = timePart
          .replace("Z", "")
          .split(".")[0]
          .split("+")[0]
          .slice(0, 5);
        time = cleanTime;
      }
      const tags = Array.isArray(data.tags) ? data.tags : [];

      return {
        id: String(data.id ?? ""),
        partyName: data.name ?? "",
        current_members: data.current_members ?? 0,
        max_members: data.max_members ?? 0,
        description: data.description ?? "",
        location: data.location_name ?? "",
        date,
        time,
        hostId: data.owner_id ? String(data.owner_id) : undefined,
        eventName: data.events?.title ?? event?.title,
        eventId: typeof data.event_id === "number" ? data.event_id : undefined,
        locationLatitude:
          typeof data.location_latitude === "number"
            ? data.location_latitude
            : undefined,
        locationLongitude:
          typeof data.location_longitude === "number"
            ? data.location_longitude
            : undefined,
        label1: tags[0],
        label2: tags[1],
        label3: tags[2],
      };
    };

    const fetchPartyList = async () => {
      setPartyLoading(true);
      try {
        const response = await fetchParties({ eventId });
        const parties = Array.isArray(response.data) ? response.data : [];
        setPartyList(parties.map(mapParty));
      } catch (error) {
        console.error("파티 목록 조회 실패:", error);
        setPartyList([]);
      } finally {
        setPartyLoading(false);
      }
    };

    fetchPartyList();
  }, [event?.title, id]);

  const handleApply = (updatedParty: PartyListItem) => {
    setPartyList((prev) =>
      prev.map((party) =>
        party.id === updatedParty.id ? { ...party, ...updatedParty } : party
      )
    );
    setSelectedParty(null);
    setSelectedPartyId(null);
  };

  const handleWithdraw = (updatedParty: PartyListItem) => {
    setPartyList((prev) =>
      prev.map((party) =>
        party.id === updatedParty.id ? { ...party, ...updatedParty } : party
      )
    );
    setSelectedParty(null);
    setSelectedPartyId(null);
  };

  const handleEdit = (updatedParty: PartyListItem) => {
    setPartyList((prev) =>
      prev.map((party) =>
        party.id === updatedParty.id ? { ...party, ...updatedParty } : party
      )
    );
    if (selectedParty?.id === updatedParty.id) {
      setSelectedParty({ ...selectedParty, ...updatedParty });
    }
  };

  const handleDelete = (partyId: string) => {
    setPartyList((prev) => prev.filter((party) => party.id !== partyId));
    setSelectedParty(null);
    setSelectedPartyId(null);
  };

  const handleSelect = (party: PartyListItem, index: number) => {
    setSelectedParty(party);
    setSelectedPartyId(index);
  };

  const handleDetailClose = () => {
    setSelectedParty(null);
    setSelectedPartyId(null);
  };

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
        {homepageUrl && (
          <a
            href={homepageUrl}
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
        )}
      </div>

      {/* 파티 리스트 */}
      <span className='mt-[80px] text-[20px] font-semibold text-[#04152F] '>
        파티 모집 현황
      </span>

      <div className="flex flex-col gap-3">
        {partyLoading ? (
          <div className="py-6">
            <LoadingBounce />
          </div>
        ) : partyList.length === 0 ? (
          <div className="flex items-center justify-center text-foreground/60 font-semibold py-6">
            존재하는 파티가 없습니다.
          </div>
        ) : (
          partyList.map((party, index) => {
            const isSelected = selectedPartyId === index;
            return (
              <PartyDetailPopup
                key={party.id}
                party={party}
                trigger={
                  <div onClick={() => handleSelect(party, index)}>
                    <PartyRow
                      index={index}
                      partyId={party.id}
                      partyName={party.partyName}
                      current_members={party.current_members}
                      max_members={party.max_members}
                      isSelected={isSelected}
                      liked={likedPartyIds.has(party.id)}
                      onToggleLike={handleToggleLike}
                    />
                  </div>
                }
                currentUserId={session?.user?.id}
                liked={likedPartyIds.has(party.id)}
                onToggleLike={handleToggleLike}
                onApply={handleApply}
                onWithdraw={handleWithdraw}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onClose={handleDetailClose}
                position="center"
              />
            );
          })
        )}
      </div>

      {/* 우측 하단 플로팅 버튼 */}
      <PartyDrawer eventId={id} name={event.title} />
    </div>
  );
}
