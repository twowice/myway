"use client";

import { useState } from "react";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerClose,
} from "@/components/ui/drawer";
import { Icon24 } from "@/components/icons/icon24";

interface PartyDrawerProps {
    eventId: string;
    name: string;
}

interface ChatMessage {
    roomId: string;
    createdAt: number;
    sender: string;
    maskedSender: string;
    message?: string;
}

export function PartyDrawer({ eventId, name }: PartyDrawerProps) {
    const [open, setOpen] = useState(false);
    const total = 10;
    const count = 3;

    const mySenderId = "aadfa";
    const messages = [
        { roomId: "광복로 겨울빛 트리 축제", createdAt: 1765556979899, sender: "aadfa", maskedSender: "aad**", message: "안녕하세요!" },
        { roomId: "광복로 겨울빛 트리 축제", createdAt: 1765556970378, sender: "aadfa", maskedSender: "aad**", message: "축제 언제 가세요?" },
        { roomId: "광복로 겨울빛 트리 축제", createdAt: 1765556970378, sender: "adfad", maskedSender: "adf**", message: "저는 토요일에 갈 예정이에요!" },
    ];

    return (
        <>
            {/* 플로팅 버튼 */}
            <button
                onClick={() => setOpen(true)}
                className="
                fixed
                bottom-6
                right-6
                md:bottom-8
                md:right-8
                w-14
                h-14
                rounded-full
                bg-[var(--primary)]
                text-white
                flex
                items-center
                justify-center
                shadow-lg
                hover:opacity-90
                transition
                z-50
                cursor-pointer
                "
            >
                <Icon24 name="talk" viewBox="0 0 36 34" className="bg-[#white]" />
            </button>

            {/* Drawer */}
            <Drawer open={open} onOpenChange={setOpen} direction="right">
                <DrawerContent
                    className="
                        right-0
                        left-auto
                        h-full
                        w-[90%]
                        sm:w-[420px]
                        rounded-none
                    "
                >
                    <DrawerHeader>
                        <div className="flex items-center justify-between w-full pb-[24px]">
                            <div className="flex flex-col">
                                <DrawerTitle className="text-lg font-semibold">
                                    {name}
                                </DrawerTitle>
                                <span className="text-sm text-gray-500">
                                    실시간 채팅
                                </span>
                            </div>

                            <DrawerClose className="cursor-pointer">
                                <Icon24
                                    name="doubleclose"
                                    viewBox="0 0 36 34"
                                    className="text-[#04152F] hover:opacity-70 transition"
                                />
                            </DrawerClose>
                        </div>
                    </DrawerHeader>

                    <div className="px-4 pb-6 flex flex-col gap-4">
                        <div className="
                            flex
                            flex-col
                            items-center
                            justify-center
                            gap-1
                            px-[20px]
                            py-3
                            bg-[#F5F5F5]
                            rounded-[10px]
                            text-sm
                            text-[#767676]
                        ">
                            <p>
                                {total}개의 톡
                            </p>
                            <p>
                                현재 {count}명 참여중
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 overflow-y-auto max-h-[420px] pr-1">
                            
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}
