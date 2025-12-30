import { cn } from "@/lib/utils";

type RouteDetailItemProps = {
  leftLabel?: string;
  badgeLabel: string;
  mainText: string;
  subText?: string;
  rightBadge?: string;
  rightText?: string;
  variant?: "start" | "end" | "transit";
  color?: string;
};

const makeHexAlpha = (color?: string, alpha = "1A") => {
  if (!color || !color.startsWith("#")) return undefined;
  if (color.length === 7) return `${color}${alpha}`;
  if (color.length === 9) return `${color.slice(0, 7)}${alpha}`;
  return undefined;
};

export const RouteDetailItem = ({
  leftLabel,
  badgeLabel,
  mainText,
  subText,
  rightBadge,
  rightText,
  variant = "transit",
  color = "#007de4",
}: RouteDetailItemProps) => {
  const isTransit = variant === "transit";
  const badgeStyle = isTransit
    ? {
        borderColor: color,
        color,
        backgroundColor: makeHexAlpha(color),
      }
    : undefined;

  const badgeClass = cn(
    "text-[12px] font-semibold text-center",
    isTransit
      ? "min-w-[56px] min-h-[52px] rounded-xl border-2 px-2 py-3 leading-tight"
      : "min-w-[52px] min-h-[52px] rounded-xl px-2 py-2 leading-tight text-secondary-foreground font-normal",
    variant === "start" ? "bg-[#BDBDBD]" : "",
    variant === "end" ? "bg-[#F4A7A7]" : ""
  );

  const leftLabelClass = cn(
    variant === "start" || variant === "end" ? "text-primary" : "font-semibold"
  );

  return (
    <div className="grid grid-cols-[44px_1fr_auto] items-start gap-2">
      <span
        className={cn(
          "flex h-full items-center justify-center text-[12px] text-muted-foreground text-center",
          leftLabelClass
        )}
        style={{ color }}
      >
        {leftLabel}
      </span>

      <div className="flex h-full items-center gap-3">
        <div
          className={cn(
            badgeClass,
            "flex h-full w-[50px] items-center justify-center"
          )}
          style={badgeStyle}
        >
          {badgeLabel}
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-[14px] font-semibold text-foreground">
            {mainText}
          </p>
          {subText && (
            <p className="text-[12px] text-muted-foreground">{subText}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        {rightBadge && (
          <span className="rounded-xl p-2 border border-[#DEE3EA] bg-secondary text-[12px] text-muted-foreground text-semibold">
            {rightBadge}
          </span>
        )}
        {rightText && (
          <span className="text-[12px] text-muted-foreground whitespace-nowrap">
            {rightText}
          </span>
        )}
      </div>
    </div>
  );
};
