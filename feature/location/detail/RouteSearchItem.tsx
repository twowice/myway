import { Button } from "@/components/ui/button";
import { Icon24 } from "@/components/icons/icon24";
import { Path } from "@/app/api/map/odsay/odsay";
import { RouteStopoverItem } from "./RouteStopoverItem";
import { makeRouteBarSegments, RouteProgressBar } from "./RouteProgressBar";
import { formatKoreanTime } from "@/utills/date/dateFormat";
import { getSegmentColor } from "@/utills/route/routeSegmentColors";

function makeTransitRows(path: Path) {
  const transits = path.subPath
    .filter(
      (s: any) =>
        !(s.trafficType === 3 && s.distance === 0 && s.sectionTime === 0)
    )
    .filter((s: any) => s.trafficType === 1 || s.trafficType === 2);

  return transits.map((s: any) => {
    const lane0 = s.lane?.[0];

    const lineLabel =
      s.trafficType === 1
        ? String(lane0?.name)
            .replace(/^수도권\s*/g, "") // 맨 앞의 "수도권" + 뒤 공백(있으면) 제거
            .trim() ?? "지하철"
        : lane0?.busNo
        ? `${lane0?.busNo}번 버스`
        : lane0?.name
        ? `${lane0?.name}번 버스`
        : "버스";

    const stationName = s.startName ? `${s.startName}` : "";

    const way = s.way ? `${s.way}행` : "";

    const color = getSegmentColor(s);

    return { lineLabel, stationName, way, color };
  });
}

const PATH_TYPE_LABEL: Record<number, string> = {
  1: "지하철",
  2: "버스",
  3: "지하철+버스",
};

export function RouteSearchItem({
  index,
  path,
  fromName,
  toName,
  departAt = new Date(),
}: {
  index: number;
  path: Path;
  fromName: string;
  toName: string;
  departAt?: Date;
}) {
  const label =
    index === 0 ? "최적" : PATH_TYPE_LABEL[path.pathType] ?? "알 수 없음";

  const depart = departAt ?? new Date();
  const arrival = new Date(depart.getTime() + path.info.totalTime * 60 * 1000);

  const arrivalText = `${formatKoreanTime(arrival)} 도착`;
  const departText = formatKoreanTime(depart);

  const transitRows = makeTransitRows(path);

  const segments = makeRouteBarSegments(path);

  return (
    <div className="rounded-2xl bg-secondary/60 p-5" onClick={() => {}}>
      {/* 헤더 */}
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

      {/* 진행 바 */}
      <RouteProgressBar segments={segments} />

      {/* 본문(출발/노선/도착) */}
      <div className="mt-4 space-y-1">
        <RouteStopoverItem
          leftLabel="출발"
          mainText={fromName}
          rightText={departText}
        />

        {transitRows.map((r, idx) => (
          <RouteStopoverItem
            key={`${r.lineLabel}-${r.stationName}-${idx}`}
            leftLabel={r.lineLabel} // 수도권 n호선이 “지하철” 자리로
            mainText={r.stationName} // 역 이름이 “수도권 n호선” 자리로
            rightText={r.way}
            accent
            color={r.color}
          />
        ))}

        <RouteStopoverItem leftLabel="도착" mainText={toName} />
      </div>
    </div>
  );
}
