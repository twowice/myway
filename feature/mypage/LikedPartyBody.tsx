"use client";

import { PartyRow } from "@/components/partyrow/PartyRow";
import { ComboboxComponent } from "@/components/basic/combo";
import { PartyDetailPopup } from "@/feature/party/partyDetailPopup";
import { fetchLikedMyParties } from "@/lib/mypage/party";
import { fetchLikedParties, togglePartyLike } from "@/lib/party/party";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";

type PartyItem = {
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
  eventCategory?: string;
  eventId?: number;
  label1?: string;
  label2?: string;
  label3?: string;
  locationLatitude?: number;
  locationLongitude?: number;
};

export const LikedPartyBody = () => {
  const { data: session } = useSession();
  const [partyList, setPartyList] = useState<PartyItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [likedPartyIds, setLikedPartyIds] = useState<Set<string>>(new Set());
  const [selectedParty, setSelectedParty] = useState<PartyItem | null>(null);
  const [selectedPartyId, setSelectedPartyId] = useState<number | null>(null);

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

  const normalizeCategory = (party: any) => {
    const cat1 = party?.events?.cat1;
    if (cat1 === "A02") {
      return "A02";
    }
    return "etc";
  };

  const mapParty = useCallback((party: any): PartyItem => {
    const gatheringDate = party?.gathering_date;
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

    const tags = Array.isArray(party?.tags) ? party.tags : [];

    return {
      id: String(party.id),
      partyName: party.name ?? "",
      current_members: party.current_members ?? 0,
      max_members: party.max_members ?? 0,
      description: party.description ?? "",
      location: party.location_name ?? "",
      locationLatitude:
        typeof party.location_latitude === "number"
          ? party.location_latitude
          : undefined,
      locationLongitude:
        typeof party.location_longitude === "number"
          ? party.location_longitude
          : undefined,
      date,
      time,
      hostId: party.owner_id ? String(party.owner_id) : undefined,
      eventName: party?.events?.title ?? undefined,
      eventCategory: normalizeCategory(party),
      eventId: typeof party.event_id === "number" ? party.event_id : undefined,
      label1: tags[0],
      label2: tags[1],
      label3: tags[2],
    };
  }, []);

  const loadLikedParties = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      setLoading(true);
      const data = await fetchLikedMyParties();
      const mapped = (data?.data ?? []).map(mapParty);
      setPartyList(mapped);
      setLikedPartyIds(new Set(mapped.map((party) => party.id)));
    } finally {
      setLoading(false);
    }
  }, [mapParty, session?.user?.id]);

  useEffect(() => {
    void loadLikedParties();
  }, [loadLikedParties]);

  useEffect(() => {
    if (!session?.user?.id) {
      setLikedPartyIds(new Set());
      return;
    }

    const loadLikedPartyIds = async () => {
      try {
        const response = await fetchLikedParties();
        setLikedPartyIds(new Set(response.partyIds.map(String)));
      } catch (error) {
        console.error("좋아요 목록 조회 실패:", error);
        setLikedPartyIds(new Set());
      }
    };

    void loadLikedPartyIds();
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
      if (!result.liked) {
        setPartyList((prev) => prev.filter((party) => party.id !== partyId));
        if (selectedParty?.id === partyId) {
          setSelectedParty(null);
          setSelectedPartyId(null);
        }
      }
    } catch (error) {
      console.error("파티 좋아요 처리 실패:", error);
    }
  };

  const filteredParties = useMemo(() => {
    if (categoryFilter === "all") return partyList;
    return partyList.filter((party) => party.eventCategory === categoryFilter);
  }, [categoryFilter, partyList]);

  if (!session?.user?.id) {
    return (
      <div className="rounded-md bg-primary-foreground p-4 text-sm text-foreground/70">
        좌측 하단에 위치한 로그인 완료하신 후에 이용하실 수 있습니다.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-sm text-foreground/60">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground/70">이벤트 카테고리</p>
        <ComboboxComponent
          options={categoryOptions}
          value={categoryFilter}
          onValueChange={setCategoryFilter}
          width="w-[220px]"
          height="h-9"
        />
      </div>

      {filteredParties.length === 0 ? (
        <div className="flex items-center justify-center py-10 text-sm text-foreground/60">
          좋아요한 파티가 없습니다.
        </div>
      ) : (
        filteredParties.map((party, index) => {
          const actualIndex = index;
          const isSelected = selectedPartyId === actualIndex;
          return (
            <PartyDetailPopup
              key={party.id}
              party={party}
              trigger={
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedParty(party);
                    setSelectedPartyId(actualIndex);
                  }}
                >
                  <PartyRow
                    index={actualIndex}
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
              currentUserId={session.user.id}
              liked={likedPartyIds.has(party.id)}
              onToggleLike={handleToggleLike}
              onClose={() => {
                setSelectedParty(null);
                setSelectedPartyId(null);
              }}
            />
          );
        })
      )}
    </div>
  );
};
