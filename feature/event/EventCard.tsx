/* ===========================
    Event Card
=========================== */

"use client";
import { useState, useEffect } from "react";
import { Icon24 } from '@/components/icons/icon24';

interface FilterCardProps {
    id: number;
    region: string;
    title: string;
    startDate: string;
    endDate: string;
    imageUrl: string;
}

export function EventCard({ id, title, startDate, endDate, region, imageUrl }: FilterCardProps) {

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

        if(isProcessing) return; // 연타 방지
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
        <div className="w-full h-auto overflow-hidden ">
            <div className='relative w-full h-[300px]'>
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover rounded-[8px]"
                />
                {!loading && (
                    <button onClick={eventLike} disabled={isProcessing} className={`absolute top-2 right-2 w-[36px] h-[36px] bg-white/70 rounded-full shadow-sm cursor-pointer flex items-center justify-center ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}>
                        {liked ? (
                            <Icon24 name="likefill" className="text-red-500" />
                        ) : (
                            <Icon24 name="likedef" className="text-gray-400" />
                        )}
                    </button>
                )}

            </div>

            <div className='flex flex-col gap-[7px] mt-[12px]'>
                <span className="text-[24px] font-bold text-[#04152F]">{title}</span>
                <span className="text-[14px] font-regular text-[#616161]">{startDate} ~ {endDate}</span>
                <span className="text-[14px] font-regular text-[#848484]">{region}</span>
            </div>
        </div>
    );
}
