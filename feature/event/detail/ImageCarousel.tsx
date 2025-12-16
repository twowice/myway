"use client";

import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function ImageCarousel({ images }: { images: string[] }) {
    return (
        <div className="relative w-full">
            <ScrollArea className="w-full rounded-xl border">
                <div
                    className="flex gap-3 p-3 md:gap-4 md:p-4"
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
                                rounded-lg
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
                        bg-transparent
                        [&>div]:bg-gray-500
                        [&>div]:hover:bg-gray-600
                    " />
            </ScrollArea>
        </div>
    );
}
