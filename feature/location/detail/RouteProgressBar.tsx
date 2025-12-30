import { getSegmentColor } from "@/utills/route/routeColors";

export type BarSeg = { color: string; ratio: number };

export function makeRouteBarSegments(path: any): BarSeg[] {
  const subs = (path.subPath ?? [])
    .filter(
      (s: any) =>
        !(s.trafficType === 3 && s.distance === 0 && s.sectionTime === 0)
    )
    .filter((s: any) => (s.sectionTime ?? 0) > 0);

  const total =
    subs.reduce((acc: number, s: any) => acc + (s.sectionTime ?? 0), 0) || 1;

  const raw: BarSeg[] = subs.map((s: any) => ({
    color: getSegmentColor(s),
    ratio: (s.sectionTime ?? 0) / total,
  }));

  const merged: BarSeg[] = [];
  for (const seg of raw) {
    const last = merged[merged.length - 1];
    if (last && last.color === seg.color) last.ratio += seg.ratio;
    else merged.push({ ...seg });
  }

  return merged;
}

export function RouteProgressBar({
  segments,
}: {
  segments: { color: string; ratio: number }[];
}) {
  return (
    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#D9D9D9]">
      <div className="flex h-full w-full">
        {segments.map((s, i) => (
          <div
            key={i}
            className="h-full"
            style={{ width: `${s.ratio * 100}%`, backgroundColor: s.color }}
          />
        ))}
      </div>
    </div>
  );
}
