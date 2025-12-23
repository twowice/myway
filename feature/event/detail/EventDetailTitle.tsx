"use client";

import { Icon24 } from '@/components/icons/icon24';
import { useState, useEffect } from "react";

interface EventDetailTitleProps {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    region: string;
    imageUrl: string;
}

export function EventDetailTitle({ id, region, title, startDate, endDate }: EventDetailTitleProps) {

    const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const fetchLikeStatus = async () => {
            try {
                const res = await fetch(`/api/events/${id}/like`);
                if (!res.ok) return;

                const data = await res.json();
                setLiked(data.liked);

            } catch (e) { console.error("❌ Event Like Status Fail:", e); }
            finally { setLoading(false); }
        };

        fetchLikeStatus();
    }, [id])

    /* ===========================
        API Fetch
    =========================== */
    const eventLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (isProcessing) return; // 연타 방지
        setIsProcessing(true);

        const prevLiked = liked;
        setLiked(!prevLiked);

        try {
            const res = await fetch(`/api/events/${id}/like`, {
                method: "POST",
            });

            if (!res.ok) throw new Error("Like API fail");
            const data = await res.json();
            setLiked(data.liked);

        } catch (e) { console.error("❌ Event Like Fail:", e); setLiked(prevLiked); }
        finally { setIsProcessing(false); }
    }

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
                {!loading && (
                    <button
                        onClick={eventLike}
                        disabled={isProcessing}
                        className='
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
                        {liked ? (
                            <Icon24 name="likefill" className="text-red-500" />
                        ) : (
                            <Icon24 name="likedef" className="text-gray-400" />
                        )}
                    </button>
                )}
            </div>
        </div>
    )
}