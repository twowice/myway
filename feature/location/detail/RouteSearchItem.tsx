import React from "react";
import { Button } from "@/components/ui/button";
import { Icon24 } from "@/components/icons/icon24";
import { Path } from "@/app/api/map/odsay/odsay";
import { RouteStopoverItem } from "./RouteStopoverItem";
import { makeRouteBarSegments, RouteProgressBar } from "./RouteProgressBar";
import { formatKoreanTime } from "@/utills/date/dateFormat";
import { getSegmentColor } from "@/utills/route/routeColors";

type Props = {
  index: number;
  path: Path;
  fromName: string;
  toName: string;
  departAt?: Date;
  onShare?: () => void;
} & React.HTMLAttributes<HTMLDivElement>;

const PATH_TYPE_LABEL: Record<number, string> = {
  1: "지하철",
  2: "버스",
  3: "지하철+버스",
  11: "기차",
  12: "버스",
  20: "시외/고속버스",
};

function getTrainLineLabel(s: any) {
  const TRAIN_TYPE_LABEL: Record<number, string> = {
    1: "KTX",
    2: "새마을",
    3: "무궁화",
    4: "통근열차",
    5: "누리로",
    6: "공항철도",
    7: "ITX-청춘",
  };
  const base = TRAIN_TYPE_LABEL[Number(s.trainType)] ?? "기차";
  const sp = s.trainSpSeatYn === "Y" ? "(특실)" : "";
  return `${base}${sp}`;
}

function getTerminalBusLineLabel(s: any) {
  const lane0 = s.lane?.[0];
  if (lane0?.name) return String(lane0.name);
  return "시외/고속버스";
}

function makeTransitRows(path: Path) {
  const transits = path.subPath
    .filter(
      (s: any) =>
        !((s.trafficType === 3 && s.sectionTime === 0) || s.distance === 0)
    )
    .filter(
      (s: any) =>
        s.trafficType === 1 ||
        s.trafficType === 2 ||
        s.trafficType === 4 ||
        s.trafficType === 6
    );

  return transits.map((s: any) => {
    const lane0 = s.lane?.[0];

    const lineLabel =
      s.trafficType === 1
        ? String(lane0?.name ?? "")
            .replace(/^수도권\s*/g, "")
            .trim() || "지하철"
        : s.trafficType === 4
        ? getTrainLineLabel(s)
        : s.trafficType === 6
        ? getTerminalBusLineLabel(s)
        : lane0?.busNo
        ? `${lane0?.busNo}번 버스`
        : lane0?.name
        ? `${lane0?.name}번 버스`
        : "버스";

    return {
      lineLabel,
      stationName: s.startName ? `${s.startName}` : "",
      way: s.way ? `${s.way}행` : "",
      color: getSegmentColor(s),
      distance: s.distance,
    };
  });
}

export const RouteSearchItem = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      index,
      path,
      fromName,
      toName,
      departAt = new Date(),
      onShare,
      onClick,
      className,
      ...rest
    },
    ref
  ) => {
    const label =
      index === 0 ? "최적" : PATH_TYPE_LABEL[path.pathType] ?? "알 수 없음";

    const arrival = new Date(
      departAt.getTime() + path.info.totalTime * 60 * 1000
    );
    const arrivalText = `${formatKoreanTime(arrival)} 도착`;
    const departText = formatKoreanTime(departAt);

    const transitRows = makeTransitRows(path);
    const segments = makeRouteBarSegments(path);

    return (
      <div
        ref={ref}
        {...rest}
        className={`rounded-2xl bg-secondary/60 p-5 ${className ?? ""}`}
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {label === "최적" && (
              <span className="text-primary font-semibold text-[12px] md:text-[14px]">
                {label}
              </span>
            )}
            <div className="flex flex-row gap-2 items-center">
              <div className="flex items-baseline gap-1">
                <span className="text-[16px] md:text-[18px] font-bold">
                  {path.info.totalTime}
                </span>
                <span className="text-[12px] md:text-[14px]">분</span>
              </div>

              <span className="text-muted-foreground text-[12px] md:text-[14px]">
                {arrivalText}
              </span>
            </div>
          </div>

          <Button variant="ghost" size="icon" className="rounded-full">
            <Icon24 name="go" className="h-6 w-6" />
          </Button>
        </div>

        <RouteProgressBar segments={segments} />

        <div className="mt-4 space-y-1">
          <RouteStopoverItem
            leftLabel="출발"
            mainText={fromName}
            rightText={departText}
          />

          {transitRows.map((r, idx) => (
            <RouteStopoverItem
              key={`${r.lineLabel}-${r.stationName}-${idx}`}
              leftLabel={r.lineLabel}
              mainText={r.stationName}
              rightText={r.way}
              accent
              color={r.color}
            />
          ))}

          <RouteStopoverItem
            leftLabel="도착"
            mainText={toName}
            onShare={onShare}
          />
        </div>
      </div>
    );
  }
);

RouteSearchItem.displayName = "RouteSearchItem";
