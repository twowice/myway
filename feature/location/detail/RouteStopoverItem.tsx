import { Icon24 } from "@/components/icons/icon24";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TYPE_LABEL: Record<number, string> = {
  1: "지하철",
  2: "버스",
  3: "도보",
};

export function RouteStopoverItem({
  leftLabel,
  mainText,
  rightText,
  accent,
  color = "secondary-foreground",
  nextStation,
}: {
  leftLabel: string; //  "2호선" 같은 라벨
  mainText: string; // "해운대해수욕장" | "~역" 등
  rightText?: string; // "신도림행"
  accent?: boolean; // 강조(노선명 bold)
  color?: string;
  nextStation?: string;
}) {
  return (
    <div className="grid grid-cols-[64px_1fr_auto] md:grid-cols-[84px_1fr_auto] items-center gap-3 py-1">
      <span
        className={cn("text-[12px] md:text-[14px] text-muted-foreground")}
        style={color.startsWith("#") ? { color: color } : undefined}
      >
        {leftLabel}
      </span>

      <span
        className={
          accent
            ? "text-[12px] md:text-[14px] font-semibold opacity-70"
            : "text-[12px] md:text-[14px] font-semibold opacity-70"
        }
      >
        {mainText}
      </span>

      {rightText ? (
        <span className="text-[12px] md:text-[14px] text-muted-foreground whitespace-nowrap">
          {rightText}
        </span>
      ) : (
        <Button variant={"ghost"}>
          <Icon24 name={"sharedef"} />
        </Button>
      )}
    </div>
  );
}
