"use client";

import { PartyRow } from "@/components/partyrow/PartyRow";
import { PartyDetailPopup } from "@/feature/party/partyDetailPopup";
import { supabase } from "@/lib/clientSupabase";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

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
  eventId?: number;
  label1?: string;
  label2?: string;
  label3?: string;
  locationLatitude?: number;
  locationLongitude?: number;
};

export const MyPartyBody = () => {
  const { data: session } = useSession();
  const [partyList, setPartyList] = useState<PartyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedParty, setSelectedParty] = useState<PartyItem | null>(null);
  const [selectedPartyId, setSelectedPartyId] = useState<number | null>(null);

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
      eventId: typeof party.event_id === "number" ? party.event_id : undefined,
      label1: tags[0],
      label2: tags[1],
      label3: tags[2],
    };
  }, []);

  const loadMyParties = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      setLoading(true);

      const [
        { data: ownedParties, error: ownedError },
        { data: appliedParties, error: appliedError },
      ] = await Promise.all([
        supabase.from("parties").select("id").eq("owner_id", session.user.id),
        supabase
          .from("party_applications")
          .select("party_id")
          .eq("user_id", session.user.id),
      ]);

      if (ownedError) {
        console.error("내 파티 조회 실패:", ownedError);
      }
      if (appliedError) {
        console.error("신청 파티 조회 실패:", appliedError);
      }

      const partyIds = new Set<number>();
      (ownedParties ?? []).forEach((item) => {
        if (typeof item.id === "number") partyIds.add(item.id);
      });
      (appliedParties ?? []).forEach((item) => {
        if (typeof item.party_id === "number") partyIds.add(item.party_id);
      });

      if (partyIds.size === 0) {
        setPartyList([]);
        return;
      }

      const { data, error } = await supabase
        .from("parties")
        .select("*, events ( title )")
        .in("id", Array.from(partyIds))
        .not("status", "in", "(disbanded,deleted)")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("파티 목록 조회 실패:", error);
        setPartyList([]);
        return;
      }

      setPartyList((data ?? []).map(mapParty));
    } finally {
      setLoading(false);
    }
  }, [mapParty, session?.user?.id]);

  useEffect(() => {
    void loadMyParties();
  }, [loadMyParties]);

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
      {partyList.length === 0 ? (
        <div className="flex items-center justify-center py-10 text-sm text-foreground/60">
          활동한 파티가 없어.
        </div>
      ) : (
        partyList.map((party, index) => {
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
                  />
                </div>
              }
              currentUserId={session.user.id}
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
