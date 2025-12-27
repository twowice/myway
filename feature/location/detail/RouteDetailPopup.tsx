"use client";

import { InfomationPopup } from "@/components/popup/infomation";
import { panelstore } from "@/stores/panelstore";
import { cn } from "@/lib/utils";
import { RouteDetailBody } from "./RouteDetailBody";

export const RouteDetailPopup = ({
  children,
  open,
  onOpenChange,
  title = "상세 경로",
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
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
      body={<RouteDetailBody />}
    ></InfomationPopup>
  );
};
