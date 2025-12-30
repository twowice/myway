"use client";
import { useRef, useState } from "react";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerDescription,
    DrawerTitle,
    DrawerClose,
} from "@/components/ui/drawer";
import { TwoFunctionPopup } from '@/components/popup/twofunction'
import { RadioComponent } from '@/components/basic/radio'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState(false);
    const total = 10;
    const count = 3;

    const mySenderId = "aadfa";
    const messages = [
        { roomId: "사천에어쇼", createdAt: 1765556979899, sender: "aadfa", maskedSender: "aad**", message: "안녕하세요!" },
        { roomId: "사천에어쇼", createdAt: 1765556970378, sender: "aadfa", maskedSender: "aad**", message: "축제 언제 가세요?" },
        { roomId: "사천에어쇼", createdAt: 1765556970378, sender: "adfad", maskedSender: "adf**", message: "저는 토요일에 갈 예정이에요!" },
        { roomId: "사천에어쇼", createdAt: 1765556979899, sender: "aadfa", maskedSender: "aad**", message: "안녕하세요!" },
        { roomId: "사천에어쇼", createdAt: 1765556970378, sender: "aadfa", maskedSender: "aad**", message: "축제 언제 가세요?" },
        { roomId: "사천에어쇼", createdAt: 1765556970378, sender: "adfad", maskedSender: "adf**", message: "저는 토요일에 갈 예정이에요!" },
        { roomId: "사천에어쇼", createdAt: 1765556979899, sender: "aadfa", maskedSender: "aad**", message: "안녕하세요!" },
        { roomId: "사천에어쇼", createdAt: 1765556970378, sender: "aadfa", maskedSender: "aad**", message: "축제 언제 가세요?" },
        { roomId: "사천에어쇼", createdAt: 1765556970378, sender: "adfad", maskedSender: "adf**", message: "저는 토요일에 갈 예정이에요!" },
        { roomId: "사천에어쇼", createdAt: 1765556979899, sender: "aadfa", maskedSender: "aad**", message: "안녕하세요!" },
        { roomId: "사천에어쇼", createdAt: 1765556970378, sender: "aadfa", maskedSender: "aad**", message: "축제 언제 가세요?" },
        { roomId: "사천에어쇼", createdAt: 1765556970378, sender: "adfad", maskedSender: "adf**", message: "저는 토요일에 갈 예정이에요!" },
        { roomId: "사천에어쇼", createdAt: 1765556979899, sender: "aadfa", maskedSender: "aad**", message: "안녕하세요!" },
        { roomId: "사천에어쇼", createdAt: 1765556970378, sender: "aadfa", maskedSender: "aad**", message: "축제 언제 가세요?" },
        { roomId: "사천에어쇼", createdAt: 1765556970378, sender: "adfad", maskedSender: "adf**", message: "저는 토요일에 갈 예정이에요!" },
    ];

    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;

        console.log("보낼 메시지:", input);

        // TODO: socket.emit("send_message", {...})

        setInput("");
    };


    return (
        <>
            {/* 플로팅 버튼 */}
            <button
                ref={buttonRef}
                onClick={() => {
                    buttonRef.current?.blur();
                    setOpen(true);
                }}
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
                <DrawerContent className="right-0 left-auto h-full w-[90%] sm:w-[420px] rounded-none flex flex-col">
                    <DrawerHeader>
                        <div className="flex items-center justify-between w-full pb-[24px]">
                            <div className="flex flex-col">
                                <DrawerTitle className="text-lg font-semibold">
                                    {name}
                                </DrawerTitle>
                                <DrawerDescription className="sr-only">축제 실시간 채팅 Drawer</DrawerDescription>
                                <span className="text-sm text-gray-500">
                                    <p className="sr-only">실시간 채팅 Drawer</p>
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

                    <div className="px-4 pb-6 flex flex-col gap-[15px] flex-1 overflow-hidden">
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
                            <p>{total}개의 톡</p>
                            <p>현재 {count}명 참여중</p>
                        </div>

                        <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-1 border rounded-[4px] pt-[8px] pb-[8px] pr-[12px] pl-[12px]">
                            {messages
                                .filter(msg => msg.roomId === name) // roomId 기준 (안 섞여있으면 제거 가능)
                                .map((msg, idx) => {
                                    const isMine = msg.sender === mySenderId;

                                    return (
                                        <div
                                            key={idx}
                                            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                                        >
                                            <div className="flex flex-col max-w-[75%] gap-1">

                                                {/* 상대방 이름 (내 메시지는 숨김) */}
                                                {!isMine && (
                                                    <span className="text-xs text-gray-500">
                                                        {msg.maskedSender}
                                                    </span>
                                                )}

                                                {/* 말풍선 */}
                                                <div
                                                    className={`
                                                        px-3
                                                        py-2
                                                        rounded-[14px]
                                                        text-sm
                                                        leading-relaxed
                                                        break-words
                                                        ${isMine ? "bg-[var(--primary)] text-white rounded-br-sm" : "bg-[#F1F1F1] text-[#04152F] rounded-bl-sm"}
                                                    `}
                                                >
                                                    {msg.message}
                                                </div>

                                                <div className={`flex items-center gap-1 text-[10px] text-gray-400 ${isMine ? "justify-end" : "justify-start"}`}>

                                                    {/* 시간 */}
                                                    <span className={`text-[10px] text-gray-400 ${isMine ? "text-right" : "text-left"}`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </span>

                                                    {!isMine && (
                                                        <TwoFunctionPopup
                                                            dialogTrigger={
                                                                <Icon24 name="notify" viewBox="0 0 24 24" className="cursor-pointer text-[#FF5F57]" />
                                                            }
                                                            title="사용자 신고 처리"
                                                            body={
                                                                <div className="flex flex-col gap-5 w-full pb-5 pt-2 max-h-[60vh] overflow-y-auto px-1 pe-3">
                                                                    {/* 카테고리 */}
                                                                    <div className="flex flex-col gap-2">
                                                                        <p className="text-sm font-medium text-[#04152F]">카테고리</p>
                                                                        <RadioComponent
                                                                            options={[
                                                                                { value: '부정적인 언어', label: '부정적인 언어' },
                                                                                { value: '도배', label: '도배' },
                                                                                { value: '광고', label: '광고' },
                                                                                { value: '사기', label: '사기' },
                                                                                { value: '기타', label: '기타' },
                                                                            ]}
                                                                            className="flex flex-col gap-3"
                                                                            itemGap="gap-2"
                                                                        />
                                                                    </div>

                                                                    {/* 신고 내용 */}
                                                                    <div className="flex flex-col gap-1.5">
                                                                        <p className="text-sm font-medium text-[#04152F]">신고 내용</p>
                                                                        <Textarea placeholder="신고 사유를 입력해주세요" rows={4} className="resize-none h-[96px]" />
                                                                    </div>

                                                                    {/* 채팅 내역 */}
                                                                    <div className="flex flex-col gap-1.5">
                                                                        <p className="text-sm font-medium text-[#04152F]">채팅 내역</p>
                                                                        <Input placeholder="관련 채팅 내용을 입력해주세요" />
                                                                    </div>

                                                                    {/* 발생 일시 */}
                                                                    <div className="flex flex-col gap-1.5">
                                                                        <p className="text-sm font-medium text-[#04152F]">발생 일시</p>
                                                                        <Input type="datetime-local" />
                                                                    </div>

                                                                    {/* 추가 의견 */}
                                                                    <div className="flex flex-col gap-1.5">
                                                                        <p className="text-sm font-medium text-[#04152F]">
                                                                            추가 의견 <span className="text-xs text-muted-foreground">(선택)</span>
                                                                        </p>
                                                                        <Input placeholder="추가로 전달할 내용이 있다면 입력하세요" />
                                                                    </div>
                                                                </div>
                                                            }
                                                            leftTitle="수정"
                                                            rightTitle="적용"
                                                            leftCallback={() => console.log("수정")}
                                                            rightCallback={() => console.log("적용")}
                                                        />
                                                    )}
                                                </div>
                                            </div>

                                        </div>
                                    );
                                })}
                        </div>
                        {/* ======================= 채팅 입력 ======================= */}
                        <div className="flex items-center gap-[10px]">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="메시지를 입력하세요"
                                className="flex-1 h-[40px]"
                            />

                            <button
                                onClick={handleSend}
                                className="
                                    w-[100px]
                                    h-[40px]
                                    bg-[var(--primary)]
                                    text-white
                                    flex
                                    items-center
                                    justify-center
                                    hover:opacity-90
                                    transition
                                    rounded-[4px]
                                    cursor-pointer
                                "
                            >
                                전송
                            </button>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}
