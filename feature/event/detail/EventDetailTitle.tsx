"use client";

import { Icon24 } from '@/components/icons/icon24';

interface EventDetailTitleProps {
    title: string;
    startDate: string;
    endDate: string;
    region: string;
    imageUrl: string;
}

export function EventDetailTitle({ region, title, startDate, endDate }: EventDetailTitleProps) {
    return (
        <div className="flex flex-col gap-1 md:gap-2">
            <span className="
                text-lg
                md:text-2xl
                lg:text-[32px]
                font-normal
                text-[var(--primary)]">
                {region}
            </span>

            <span className="
                text-2xl
                md:text-3xl
                lg:text-[40px]
                font-normal
                text-[#04152F]
                leading-tight
                break-words">
                {title}
            </span>

            <div className="flex items-center justify-between gap-3">
                <span className="
                    text-sm
                    md:text-base
                    lg:text-[24px]
                    font-normal
                    text-[#B3B3B3]">
                    {startDate} ~ {endDate}
                </span>
                <button className='
                    w-9 h-9
                    md:w-10 md:h-10
                    bg-white/70
                    rounded-full
                    shadow-sm
                    cursor-pointer
                    flex
                    items-center
                    justify-center
                    shrink-0
                    hover:bg-white
                    transition'>
                    <Icon24 name="likedef" />
                </button>
            </div>
        </div>
    )
}