import { RouteDetailItem } from "./RouteDetailItem";
import { makeRouteBarSegments, RouteProgressBar } from "./RouteProgressBar";
import type { Path } from "@/app/api/map/odsay/odsay";
import { formatKoreanTime } from "@/utills/date/dateFormat";
import { getSegmentColor } from "@/utills/route/routeColors";

type RouteDetailBodyProps = {
  path: Path;
  fromName: string;
  toName: string;
  departAt?: Date;
};

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

function getTransitLineLabel(s: any) {
  const lane0 = s.lane?.[0];
  if (s.trafficType === 1) {
    return (
      String(lane0?.name ?? "")
        .replace(/^수도권\s*/g, "")
        .trim() || "지하철"
    );
  }
  if (s.trafficType === 4) return getTrainLineLabel(s);
  if (s.trafficType === 6) return getTerminalBusLineLabel(s);
  if (lane0?.busNo) return `${lane0?.busNo}번 버스`;
  if (lane0?.name) return `${lane0?.name}번 버스`;
  return "버스";
}

function formatTime24(d: Date) {
  return d.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatDistance(distance?: number) {
  if (!Number.isFinite(distance)) return undefined;
  return `${Math.round(Number(distance))}m`;
}

function getExitLabel(name?: string, exit?: string | number) {
  if (!name || exit == null || exit === "") return undefined;
  return `${name} ${exit}번 출구`;
}

export const RouteDetailBody = ({
  path,
  fromName,
  toName,
  departAt,
}: RouteDetailBodyProps) => {
  const subPaths = path?.subPath ?? [];
  const segments = makeRouteBarSegments(path);
  const startTime = departAt ?? new Date();
  const arrival = new Date(
    startTime.getTime() + (path?.info?.totalTime ?? 0) * 60 * 1000
  );
  const arrivalText = `${formatKoreanTime(arrival)} 도착`;
  const labelText = PATH_TYPE_LABEL[path.pathType] ?? "경로";

  const firstWalk = subPaths.find((s: any) => s?.trafficType === 3);
  const lastWalk = [...subPaths]
    .reverse()
    .find((s: any) => s?.trafficType === 3);

  const firstTransit = subPaths.find(
    (s: any) =>
      s?.trafficType === 1 ||
      s?.trafficType === 2 ||
      s?.trafficType === 4 ||
      s?.trafficType === 6
  );

  const transitSegments = subPaths.filter(
    (s: any) =>
      s?.trafficType === 1 ||
      s?.trafficType === 2 ||
      s?.trafficType === 4 ||
      s?.trafficType === 6
  );

  const startExit = getExitLabel(
    firstTransit?.startName,
    firstTransit?.startExitNo
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-[16px] font-bold">{path.info.totalTime}</span>
            <span className="text-[12px] text-muted-foreground">분</span>
          </div>
          <span className="text-[12px] text-muted-foreground">
            {arrivalText}
          </span>
        </div>
        <RouteProgressBar segments={segments} />
      </div>

      <div className="flex flex-col gap-4 pt-2">
        <RouteDetailItem
          leftLabel={formatTime24(startTime)}
          badgeLabel="출발"
          mainText={fromName}
          rightBadge={formatDistance(firstWalk?.distance)}
          rightText={startExit}
          variant="start"
        />

        {transitSegments.map((segment: any, index: number) => {
          const lineLabel = getTransitLineLabel(segment);
          const lineColor = getSegmentColor(segment);
          const timeText = segment?.sectionTime
            ? `${segment.sectionTime}분`
            : labelText;
          const endExit = getExitLabel(segment?.endName, segment?.endExitNo);
          const mainText =
            segment?.startName && segment?.endName
              ? `${segment.startName} → ${segment.endName}`
              : segment?.startName ?? lineLabel;

          return (
            <RouteDetailItem
              key={`${segment?.startName}-${segment?.endName}-${index}`}
              leftLabel={timeText}
              badgeLabel={lineLabel}
              mainText={mainText}
              subText={segment?.way ? `${segment.way}행` : undefined}
              rightText={endExit}
              variant="transit"
              color={lineColor}
            />
          );
        })}

        <RouteDetailItem
          leftLabel={formatTime24(arrival)}
          badgeLabel="도착"
          mainText={toName}
          rightBadge={formatDistance(lastWalk?.distance)}
          variant="end"
        />
      </div>
    </div>
  );
};
