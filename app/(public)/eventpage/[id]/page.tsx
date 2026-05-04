"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { EventDetailTitle } from '@/feature/event/detail/EventDetailTitle';
import { EventDetailSum } from '@/feature/event/detail/EventDetailSum';
import { PartyDrawer } from '@/feature/event/detail/PartyDrawer';
import { PartyRow } from '@/components/partyrow/PartyRow'
import NaverMapContainer from "@/components/map/NaverMapContainer";
import { EmptyIcon } from '@/components/status/EmptyIcon';
import { LoadingBounce } from '@/components/status/LoadingBounce';
import { parseHomepageUrl } from '@/feature/event/url';
import { fetchEventDetail, mapEventPartyItem } from '@/lib/event/event';
import { fetchLikedParties, fetchParties, togglePartyLike } from '@/lib/party/party';
import { PartyDetailPopup } from '@/feature/party/partyDetailPopup';
import type { EventDetail, EventPartyListItem } from '@/types/event';

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [partyList, setPartyList] = useState<EventPartyListItem[]>([]);
  const [partyLoading, setPartyLoading] = useState(true);
  const [likedPartyIds, setLikedPartyIds] = useState<Set<string>>(new Set());
  const [selectedParty, setSelectedParty] = useState<EventPartyListItem | null>(null);
  const [selectedPartyId, setSelectedPartyId] = useState<number | null>(null);

  const region = event?.address.split(" ") ?? [];
  const imageUrl = event?.main_image ?? "/error/no-image.svg";
  const price = event?.price && event.price.trim() !== "" ? event.price : "요금 정보 없음";
  const homepageUrl = parseHomepageUrl(event?.homepage);

  /* ===========================
      API Fetch
  =========================== */
  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      setLoading(true);
      try {
        const eventDetail = await fetchEventDetail(id);
        setEvent(eventDetail);
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

    const fetchPartyList = async () => {
      setPartyLoading(true);
      try {
        const response = await fetchParties({ eventId });
        const parties = Array.isArray(response.data) ? response.data : [];
        setPartyList(parties.map((party) => mapEventPartyItem(party, event?.title)));
      } catch (error) {
        console.error("파티 목록 조회 실패:", error);
        setPartyList([]);
      } finally {
        setPartyLoading(false);
      }
    };

    fetchPartyList();
  }, [event?.title, id]);

  const handleApply = (updatedParty: EventPartyListItem) => {
    setPartyList((prev) =>
      prev.map((party) =>
        party.id === updatedParty.id ? { ...party, ...updatedParty } : party
      )
    );
    setSelectedParty(null);
    setSelectedPartyId(null);
  };

  const handleWithdraw = (updatedParty: EventPartyListItem) => {
    setPartyList((prev) =>
      prev.map((party) =>
        party.id === updatedParty.id ? { ...party, ...updatedParty } : party
      )
    );
    setSelectedParty(null);
    setSelectedPartyId(null);
  };

  const handleEdit = (updatedParty: EventPartyListItem) => {
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

  const handleSelect = (party: EventPartyListItem, index: number) => {
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
    <div className="w-full max-w-[960px] mx-auto flex flex-col space-y-4 md:space-y-6 lg:space-y-[22px] pb-[80px] pt-[70px] px-[16px] sm:px-[24px] lg:px-[32px]">
      {/* 타이틀 */}
      <EventDetailTitle
        id={id}
        region={region.length >= 2 ? `${region[0]} ${region[1]}` : region[0] ?? ""}
        title={event.title}
        startDate={event.start_date}
        endDate={event.end_date}
        imageUrl={imageUrl}
      />

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
