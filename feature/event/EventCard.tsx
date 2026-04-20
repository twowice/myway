"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Icon24 } from "@/components/icons/icon24";
import { toggleEventLike } from "@/lib/event/event";
import type { LikedEventIdsResponse } from "@/lib/mypage/event";

interface FilterCardProps {
    id: number;
    region: string;
    title: string;
    startDate: string;
    endDate: string;
    imageUrl: string;
    initialLiked?: boolean;
}

export function EventCard({ id, title, startDate, endDate, region, imageUrl, initialLiked = false }: FilterCardProps) {
    const { status } = useSession();
    const queryClient = useQueryClient();
    const [liked, setLiked] = useState(initialLiked);
    const [isProcessing, setIsProcessing] = useState(false);

    const eventLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (status !== "authenticated") return;
        if (isProcessing) return;

        setIsProcessing(true);

        const prevLiked = liked;
        setLiked(!prevLiked);

        try {
            const data = await toggleEventLike(id);
            setLiked(data.liked);
            queryClient.setQueryData<LikedEventIdsResponse>(['liked-event-ids'], (oldData) => {
                const eventIds = new Set(oldData?.eventIds ?? []);

                if (data.liked) {
                    eventIds.add(id);
                } else {
                    eventIds.delete(id);
                }

                return { eventIds: Array.from(eventIds) };
            });
        } catch (e) {
            console.error("Event Like Fail:", e);
            setLiked(prevLiked);
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        setLiked(initialLiked);
    }, [initialLiked]);

    return (
        <div className="w-full h-auto overflow-hidden ">
            <div className="relative w-full h-[300px]">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover rounded-[8px]"
                />
                {status !== "loading" && (
                    <button
                        onClick={eventLike}
                        disabled={isProcessing}
                        className={`absolute top-2 right-2 w-[36px] h-[36px] bg-white/70 rounded-full shadow-sm cursor-pointer flex items-center justify-center ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {liked ? (
                            <Icon24 name="likefill" className="text-red-500" />
                        ) : (
                            <Icon24 name="likedef" className="text-gray-400" />
                        )}
                    </button>
                )}
            </div>

            <div className="flex flex-col gap-[7px] mt-[12px]">
                <span className="text-[24px] font-bold text-[#04152F]">{title}</span>
                <span className="text-[14px] font-regular text-[#616161]">{startDate} ~ {endDate}</span>
                <span className="text-[14px] font-regular text-[#848484]">{region}</span>
            </div>
        </div>
    );
}
