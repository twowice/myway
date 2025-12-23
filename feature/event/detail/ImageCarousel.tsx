"use client";

import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function ImageCarousel({ images }: { images: string[] }) {
    return (
        <div className="relative w-full">
            <ScrollArea className="w-full rounded-md">
                <div
                    className="flex gap-3 md:gap-4 pb-4"
                >
                    {images.map((src, index) => (
                        <div
                            key={index}
                            className="
                                relative
                                h-[180px] w-[260px]
                                md:h-[220px] md:w-[320px]
                                lg:h-[240px] lg:w-[360px]
                                flex-shrink-0
                                overflow-hidden
                                rounded-md
                            "
                        >
                            <Image
                                src={src}
                                alt={`event-image-${index}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal"
                    className="
                        h-[12px]
                        bg-[var(--scroll-bar-bottom-bg)]
                        rounded-[20px]
                        [&>div]:h-[12px]
                        [&>div]:rounded-[20px]
                        [&>div]:bg-[var(--scroll-bar-bottom-bg)]
                        [&>div]:hover:bg-[var(--scroll-bar-bottom)]
                    " />
            </ScrollArea>
        </div>
    );
}
