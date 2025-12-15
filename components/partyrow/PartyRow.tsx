"use client";

import { Icon24 } from "@/components/icons/icon24";

interface PartyRowProps {
  index: number;
  partyName: string;
  current_members: number;
  max_members: number;
}

export function PartyRow({
  index,
  partyName,
  current_members,
  max_members,
}: PartyRowProps) {
  return (
    <div className="flex items-center justify-between w-full px-4 py-3 bg-[#007DE4]/10 rounded-[4px]">
      <div className="flex items-center gap-4">
        <span className="text-foreground font-semibold text-[16px]">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="text-[16px] font-medium text-[var(--foreground)]">
          {partyName}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-[14px] text-[var(--foreground)]">
          {current_members}/{max_members}
        </span>

        <button className="cursor-pointer">
            <Icon24 name="likedef" />
        </button>

        <button className="cursor-pointer">
            <Icon24 name="notify" className="cursor-pointer"/>
        </button>
      </div>
    </div>
  );
}
