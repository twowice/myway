"use client";

import { CheckboxComponent } from "@/components/basic/checkbox";
import PartyPanel from "@/components/header/panels/partypanel";
import { Icon24 } from "@/components/icons/icon24";
import { EllipsisPagination } from "@/components/pagination/pagination";
import { PartyRow } from "@/components/partyrow/PartyRow";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/searchBar";
import { PartyCreatePopup } from "@/feature/party/partyCreatePopup";
import { PartyDetailPopup } from "@/feature/party/partyDetailPopup";
import { fetchParties } from "@/lib/party/party";
import { useCallback, useEffect, useState } from "react";

export default function Party() {
  const [partyList, setPartyList] = useState<any[]>([]);
  const [selectedParty, setSelectedParty] = useState<any>(null);
  const [selectedPartyId, setSelectedPartyId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 16;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const mapParty = useCallback((party: any) => {
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
      date,
      time,
      hostId: party.owner_id ? String(party.owner_id) : undefined,
      eventName: party.event_name ?? undefined,
      label1: tags[0],
      label2: tags[1],
      label3: tags[2],
    };
  }, []);

  const loadParties = useCallback(async () => {
    try {
      const offset = (currentPage - 1) * itemsPerPage;
      const response = await fetchParties({
        limit: itemsPerPage,
        offset,
      });
      setPartyList(response.data.map(mapParty));
      setTotalCount(response.pagination.total);
    } catch (error) {
      console.error("파티 목록 조회 실패:", error);
      setPartyList([]);
      setTotalCount(0);
    }
  }, [currentPage, itemsPerPage, mapParty]);

  useEffect(() => {
    void loadParties();
  }, [loadParties]);

  const handleCreate = (create: any) => {
    console.log("파티 생성:", create);
    void loadParties();
  };

  const handleApply = (updatedParty: any) => {
    console.log("파티 신청 완료:", updatedParty);
    if (selectedPartyId !== null) {
      const localIndex = selectedPartyId - (currentPage - 1) * itemsPerPage;
      const updatedList = [...partyList];
      if (localIndex >= 0 && localIndex < updatedList.length) {
        updatedList[localIndex] = updatedParty;
      }
      setPartyList(updatedList);
    }
    setSelectedParty(null);
    setSelectedPartyId(null);
  };

  const handleWithdraw = (updatedParty: any) => {
    console.log("파티 철회 완료:", updatedParty);
    if (selectedPartyId !== null) {
      const localIndex = selectedPartyId - (currentPage - 1) * itemsPerPage;
      const updatedList = [...partyList];
      if (localIndex >= 0 && localIndex < updatedList.length) {
        updatedList[localIndex] = updatedParty;
      }
      setPartyList(updatedList);
    }
    setSelectedParty(null);
    setSelectedPartyId(null);
  };

  const handleEdit = (updatedParty: any) => {
    console.log("파티 수정:", updatedParty);
    if (selectedPartyId !== null) {
      const localIndex = selectedPartyId - (currentPage - 1) * itemsPerPage;
      const updatedList = [...partyList];
      if (localIndex >= 0 && localIndex < updatedList.length) {
        updatedList[localIndex] = {
          ...updatedList[localIndex],
          ...updatedParty,
        };
        setSelectedParty({
          ...updatedList[localIndex],
        });
      }
      setPartyList(updatedList);
    }
  };

  const handleSelect = (party: any, index: number) => {
    setSelectedParty(party);
    setSelectedPartyId(index);
  };

  const handleDetailClose = () => {
    setSelectedParty(null);
    setSelectedPartyId(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedParty(null);
    setSelectedPartyId(null);
  };

  const handleDelete = (partyId: string) => {
    setPartyList((prev) => prev.filter((p) => p.id !== partyId));
    setSelectedParty(null);
    setSelectedPartyId(null);
  };

  return (
    <PartyPanel>
      <div className="bg-white w-full h-full flex flex-col gap-6">
        {/* 컨트롤 영역 */}
        <div className="shrink-0 flex flex-col gap-2">
          <div className="flex flex-row justify-between">
            <h1 className="text-[24px] font-semibold">파티 모집</h1>
            <PartyCreatePopup
              trigger={
                <Button className="flex items-center">
                  새 파티
                  <Icon24 name="add" className="text-secondary" />
                </Button>
              }
              onSave={handleCreate}
            />
          </div>
          <SearchBar />
          <div className="p-2">
            <CheckboxComponent
              options={[
                { value: "applicable", label: "신청 가능" },
                { value: "applicable_deadline", label: "신청 마감" },
              ]}
            />
          </div>
        </div>

        {/* 파티 목록 - 스크롤 영역 */}
        <div className="flex-1 flex flex-col gap-2">
          {partyList.length === 0 ? (
            <div className="flex flex-1 items-center justify-center text-foreground/60 font-semibold">
              존재하는 파티가 없습니다.
            </div>
          ) : (
            partyList.map((party, index) => {
              const isFull = party.current_members === party.max_members;
              const actualIndex = (currentPage - 1) * itemsPerPage + index;
              const isSelected = selectedPartyId === actualIndex;
              return (
                <PartyDetailPopup
                  key={party.id}
                  party={party}
                  trigger={
                    <div
                      className={isFull ? "opacity-50" : "cursor-pointer"}
                      onClick={() => handleSelect(party, actualIndex)}
                    >
                      <PartyRow
                        index={actualIndex}
                        partyName={party.partyName}
                        current_members={party.current_members}
                        max_members={party.max_members}
                        isSelected={isSelected}
                      />
                    </div>
                  }
                  currentUserId="currentUser"
                  onApply={handleApply}
                  onWithdraw={handleWithdraw}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onClose={handleDetailClose}
                />
              );
            })
          )}
        </div>

        {/* 페이지네이션 - 하단 고정 */}
        <div className="shrink-0 flex items-center justify-center h-14">
          {totalPages > 0 && (
            <EllipsisPagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </PartyPanel>
  );
}
