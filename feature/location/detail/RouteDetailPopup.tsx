"use client";

import { InfomationPopup } from "@/components/popup/infomation";
import { panelstore } from "@/stores/panelstore";
import { cn } from "@/lib/utils";
import { RouteDetailBody } from "./RouteDetailBody";
import type { Path } from "@/app/api/map/odsay/odsay";

export const RouteDetailPopup = ({
  children,
  open,
  onOpenChange,
  title = "상세 경로",
  path,
  fromName,
  toName,
  departAt,
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  path: Path;
  fromName: string;
  toName: string;
  departAt?: Date;
}) => {
  const { openpanel } = panelstore();
  const isLocationPanelOpen = openpanel === "location";

  return (
    <InfomationPopup
      dialogTrigger={children}
      title={title}
      hideOverlay
      position="top-left"
      preventOutsideClose
      allowOutsideInteraction
      open={open}
      onOpenChange={onOpenChange}
      className={cn(
        "w-[360px] md:w-[420px]",
        isLocationPanelOpen
          ? "left-[calc(4rem+25rem+24px)] md:left-[calc(5rem+37.5rem+24px)]"
          : "left-[calc(4rem+24px)] md:left-[calc(5rem+24px)]"
      )}
      body={
        <RouteDetailBody
          path={path}
          fromName={fromName}
          toName={toName}
          departAt={departAt}
        />
      }
    ></InfomationPopup>
  );
};
