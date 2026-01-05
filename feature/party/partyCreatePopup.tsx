"use client";

import { TwoFunctionPopup } from "@/components/popup/twofunction";
import Tag from "@/components/tag/tag";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createParty } from "@/lib/party/party";
import { useEffect, useState } from "react";
import { EventSearchBar } from "../event/EventSearchBar";
import { PlaceSearchBar } from "../location/search/PlaceSearchBar";

export type PartyCreate = {
  partyName: string;
  max_members: string;
  description?: string;
  location?: string;
  locationLatitude?: number;
  locationLongitude?: number;
  date?: string;
  time?: string;
  label1?: string;
  label2?: string;
  label3?: string;
  eventName?: string;
  eventId?: number;
};

type PartyCreatePopupProps = {
  trigger: React.ReactNode;
  onSave: (data: PartyCreate) => void;
  initialData?: Partial<PartyCreate>;
};

export const PartyCreatePopup = ({
  trigger,
  onSave,
  initialData,
}: PartyCreatePopupProps) => {
  const [create, setCreate] = useState<PartyCreate>({
    partyName: "",
    max_members: "",
    location: "",
    locationLatitude: undefined,
    locationLongitude: undefined,
    date: "",
    time: "",
    description: "",
    label1: "",
    label2: "",
    label3: "",
    eventName: "",
    eventId: -1,
  });
  const [tagInput, setTagInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      setCreate({
        partyName: initialData.partyName || "",
        max_members: initialData.max_members || "",
        location: initialData.location || "",
        locationLatitude: initialData.locationLatitude,
        locationLongitude: initialData.locationLongitude,
        date: initialData.date || "",
        time: initialData.time || "",
        description: initialData.description || "",
        eventName: initialData.eventName || "",
        label1: initialData.label1 || "",
        label2: initialData.label2 || "",
        label3: initialData.label3 || "",
      });
    } else {
      setCreate({
        partyName: "",
        max_members: "",
        location: "",
        locationLatitude: undefined,
        locationLongitude: undefined,
        date: "",
        time: "",
        description: "",
        label1: "",
        label2: "",
        label3: "",
        eventName: "",
      });
    }
  }, [initialData]);

  useEffect(() => {}, [create]);

  const isFormValid = Boolean(
    create.partyName.trim() &&
      create.eventName?.trim() &&
      create.eventId &&
      create.eventId > 0 &&
      create.max_members &&
      parseInt(create.max_members) >= 1 &&
      create.location?.trim() &&
      create.date &&
      create.time &&
      create.description?.trim()
  );

  const handleSave = async () => {
    if (!create.partyName.trim()) {
      alert("파티명을 입력해주세요.");
      return;
    }
    if (!create.eventName?.trim() || !create.eventId || create.eventId <= 0) {
      alert("이벤트명을 입력해주세요.");
      return;
    }
    if (!create.max_members || parseInt(create.max_members) < 1) {
      alert("최대 인원을 입력해주세요.");
      return;
    }
    if (!create.location?.trim()) {
      alert("장소를 입력해주세요.");
      return;
    }
    if (!create.date) {
      alert("날짜를 입력해주세요.");
      return;
    }
    if (!create.time) {
      alert("시간을 입력해주세요.");
      return;
    }
    if (!create.description?.trim()) {
      alert("파티 소개를 입력해주세요.");
      return;
    }
    if (!isFormValid) return;

    try {
      await createParty(create);
    } catch (error) {
      console.error("파티 생성 실패:", error);
      alert(
        error instanceof Error
          ? error.message
          : "파티 생성에 실패했어요. 잠시 후 다시 시도해주세요."
      );
      return;
    }
    onSave(create);
    handleCancel();
    setIsOpen(false);
  };

  const handleCancel = () => {
    setCreate({
      partyName: "",
      max_members: "",
      location: "",
      locationLatitude: undefined,
      locationLongitude: undefined,
      date: "",
      time: "",
      description: "",
      label1: "",
      label2: "",
      label3: "",
      eventName: "",
    });
    setTagInput("");
  };

  const handleAddTag = () => {
    const value = tagInput.trim();
    if (!value) return;
    if (!create.label1) {
      setCreate({ ...create, label1: value });
    } else if (!create.label2) {
      setCreate({ ...create, label2: value });
    } else if (!create.label3) {
      setCreate({ ...create, label3: value });
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagNumber: 1 | 2 | 3) => {
    setCreate({
      ...create,
      [`label${tagNumber}`]: "",
    });
  };

  const PopupBody = (
    <div className="flex flex-col gap-4 h-full overflow-y-auto">
      {/* 파티명 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          파티명
          <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          value={create.partyName}
          onChange={(e) => setCreate({ ...create, partyName: e.target.value })}
          placeholder="파티 명을 입력하세요."
        />
      </div>
      {/* 일정 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          일정
          <span className="text-red-500">*</span>
        </label>
        <Input
          type="datetime-local"
          value={
            create.date && create.time ? `${create.date}T${create.time}` : ""
          }
          onChange={(e) => {
            if (e.target.value) {
              const [date, time] = e.target.value.split("T");
              setCreate({ ...create, date, time });
            }
          }}
        />
      </div>
      {/* 이벤트명 */}
      <EventSearchBar create={create} setCreate={setCreate} />
      {/* 최대 인원 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          최대 인원
          <span className="text-red-500">*</span>
        </label>
        <Input
          type="number"
          value={create.max_members}
          onChange={(e) =>
            setCreate({ ...create, max_members: e.target.value })
          }
          placeholder="1"
          min={1}
        />
      </div>
      {/* 위치 */}
      <PlaceSearchBar create={create} setCreate={setCreate} />
      {/* 파티 소개 */}
      <div className="flex flex-col gap-2 flex-1">
        <label className="text-sm font-medium text-gray-700">
          파티 소개
          <span className="text-red-500">*</span>
        </label>
        <Textarea
          value={create.description}
          onChange={(e) =>
            setCreate({ ...create, description: e.target.value })
          }
          placeholder="파티에 대한 소개설명을 입력하세요."
          className="resize-none flex-1"
        />
      </div>
      {/* 태그 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          해시태그
          <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddTag();
            }
          }}
          placeholder="태그 입력 후 Enter (최대 3개)"
          disabled={!!create.label3}
        />
        <div className="flex gap-2 flex-wrap">
          {create.label1 && (
            <Tag
              label={`# ${create.label1}`}
              removable={true}
              onRemove={() => handleRemoveTag(1)}
            />
          )}
          {create.label2 && (
            <Tag
              label={`# ${create.label2}`}
              removable={true}
              onRemove={() => handleRemoveTag(2)}
            />
          )}
          {create.label3 && (
            <Tag
              label={`# ${create.label3}`}
              removable={true}
              onRemove={() => handleRemoveTag(3)}
            />
          )}
        </div>
      </div>
    </div>
  );
  return (
    <TwoFunctionPopup
      dialogTrigger={trigger}
      title="새 파티"
      body={PopupBody}
      leftTitle="취소"
      leftCallback={() => {
        handleCancel();
        setIsOpen(false);
      }}
      rightTitle="등록"
      rightCallback={() => {
        void handleSave();
      }}
      closeOnRight={false}
      className="w-150 h-[calc(100vh-40px)]"
      hideOverlay={true}
      position="top-left"
      preventOutsideClose={true}
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          handleCancel();
        }
      }}
    />
  );
};
