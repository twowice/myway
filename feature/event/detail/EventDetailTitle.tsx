"use client";

interface EventDetailTitleProps {
    title: string;
    startDate: string;
    endDate: string;
    region: string;
    imageUrl: string;
}

export function EventDetailTitle({ region, title, startDate, endDate }: EventDetailTitleProps) {
    return (
        <div className="flex items-end gap-2">
            <span className="text-[32px] front-normal text-[var(--primary)]">
                {region}
            </span>

            <span className="text-[32px] front-normal">
                {title}
            </span>

            <span>
                {startDate} ~ {endDate}
            </span>
        </div>
    )
}