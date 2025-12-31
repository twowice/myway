"use client";
import { useRef, useState, useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { Drawer, DrawerContent, DrawerHeader, DrawerDescription, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { TwoFunctionPopup } from '@/components/popup/twofunction'
import { RadioComponent } from '@/components/basic/radio'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Icon24 } from "@/components/icons/icon24";
import { useSession } from 'next-auth/react'

interface PartyDrawerProps {
    eventId: string; // 이벤트 아이디
    name: string; // 이벤트 명
}

interface ChatMessage {
    roomId: string; // 이벤트 명
    createdAt: number; // 만든 날짜
    sender: string; // 유저 닉네임
    senderId: string; // 유저 아이디
    maskedSender?: string; // 숨겨진 유저 닉네임
    message: string; // 채팅 메시지
}

interface ReportPayload {
    createdAt: number;
    reportedUserId: string; // 신고 대상 "아이디"
    reportedUserName: string; // 신고 대상 "닉네임"
    reporterUserId: string; // 신고한 유저 "아이디"
    reporterUserName: string; // 신고한 유저 "닉네임"
    reportContent: string; // 신고자가 작성한 사유
    reportChat: string; // 신고 대상 채팅 원문
    reportDate: string; // 사건 발생 일시
    category: string; // 카테고리
    addOpinion?: string; //추가 의견
}

export function PartyDrawer({ name }: PartyDrawerProps) {
    /* ===========================
       Chatting State
    =========================== */
    const { data: session } = useSession(); // 로그인 된 아이디

    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const socketRef = useRef<ReturnType<typeof getSocket> | null>(null); // 소켓 1회 생성
    if (!socketRef.current) socketRef.current = getSocket();
    const socket = socketRef.current;

    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [myUserId, setMyUserId] = useState("");
    const [total, setTotal] = useState(0);
    const [count, setCount] = useState(0);

    const bottomRef = useRef<HTMLDivElement | null>(null);

    /* ===========================
       Report State
    =========================== */
    const [reportCategory, setReportCategory] = useState("");
    const [reportContent, setReportContent] = useState("");
    const [addOpinion, setAddOpinion] = useState("");


    // 로그인 된 아이디 가져옴 (MySender)
    useEffect(() => {
        if (session?.user?.id) setMyUserId(session.user.id);
    }, [session])

    // Drawer 열릴 때 소켓 연결
    useEffect(() => {
        if (!open || !myUserId) return;
        if (!socket.connected) socket.connect();

        socket.on("connect", () => { socket.emit("join_room", name); });

        /* -------------------------- 방 꽉참 -------------------------- */
        socket.on("room_full", ({ roomId, limit }) => {
            alert(`❌ '${roomId}' 방은 이미 ${limit}명으로 가득 찼습니다!`);
        });

        /* ---------------------- 접속자 수 표시 ----------------------- */
        socket.on("room_count", ({ roomId, count }) => {
            if (roomId === name) setCount(count);
        });

        /* ------------------ 방 입장 시 과거 메시지 ------------------ */
        socket.on("room_history", ({ messages, totalMessageCount }) => {
            setMessages(messages);
            setTotal(totalMessageCount)
        });

        /* ---------------------- 새 메시지 수신 ----------------------- */
        socket.on("receive_message", (data: ChatMessage) => {
            setMessages(prev => [...prev, data]);
            setTotal(prev => prev + 1);
        });

        return () => {
            socket.off("connect");
            socket.off("room_full");
            socket.off("room_count");
            socket.off("room_history");
            socket.off("receive_message");
            socket.disconnect();
        };
    }, [open, name, myUserId, socket])

    // 메시지 변경 시 스크롤 하단 이동
    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        })
    }, [messages])

    // 메시지 전송
    const handleSend = () => {
        if (!socket || !socket.connected) { alert("서버와 연결되지 않았습니다."); return; }
        if (!input.trim() || !session?.user?.id || !session?.user?.name) return;
        if (input.length > 100) { alert("메시지는 100자 이내로 작성해주세요."); return; }

        const messageData: ChatMessage = {
            roomId: name,
            sender: session.user.name,
            senderId: session.user.id,
            message: input,
            createdAt: Date.now(),
        };

        socket.emit("send_message", messageData);
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
                            {messages.map((msg, idx) => {
                                const isMine = msg.senderId === myUserId;

                                return (
                                    <div
                                        key={`${msg.senderId}-${msg.createdAt}`}
                                        className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className="flex flex-col max-w-[75%] gap-1">

                                            {/* 상대방 이름 (내 메시지는 숨김) */}
                                            {!isMine && (
                                                <span className="text-xs text-gray-500">
                                                    {msg.maskedSender ?? msg.sender}
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
                                                            <Icon24 name="notify" viewBox="0 0 24 24" className="cursor-pointer text-[#FF5F57]"
                                                                onClick={() => {
                                                                    setReportCategory("");
                                                                    setReportContent("");
                                                                    setAddOpinion("");
                                                                }} />
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
                                                                        value={reportCategory}
                                                                        onValueChange={(value) => setReportCategory(value)}
                                                                    />
                                                                </div>

                                                                {/* 신고 내용 */}
                                                                <div className="flex flex-col gap-1.5">
                                                                    <p className="text-sm font-medium text-[#04152F]">신고 내용</p>
                                                                    <Textarea placeholder="신고 사유를 입력해주세요" rows={4} className="resize-none h-[96px]" value={reportContent} onChange={(e) => setReportContent(e.target.value)} />
                                                                </div>
                                                                
                                                                {/* 추가 의견 */}
                                                                <div className="flex flex-col gap-1.5">
                                                                    <p className="text-sm font-medium text-[#04152F]">
                                                                        추가 의견 <span className="text-xs text-muted-foreground">(선택)</span>
                                                                    </p>
                                                                    <Input placeholder="추가로 전달할 내용이 있다면 입력하세요" value={addOpinion} onChange={(e) => setAddOpinion(e.target.value)} />
                                                                </div>
                                                            </div>
                                                        }
                                                        leftTitle="수정"
                                                        rightTitle="적용"
                                                        leftCallback={() => console.log("수정")}
                                                        rightCallback={() => {
                                                            if (!reportCategory) { alert("카테고리를 선택해주세요."); return; }
                                                            if (!reportContent.trim()) { alert("사유를 입력해주세요."); return; }
                                                            if (!session?.user?.id) { alert("로그인이 필요합니다."); return; }

                                                            if (reportContent.length > 100) { alert("내용을 100자 이내로 작성해주세요."); return; }
                                                            if (addOpinion.length > 100) { alert("추가 의견을 100자 이내로 작성해주세요."); return; }

                                                            const reportData: ReportPayload = {
                                                                createdAt: Date.now(),
                                                                reportedUserId: msg.senderId,
                                                                reportedUserName: msg.sender,

                                                                reporterUserId: session?.user?.id ?? "",
                                                                reporterUserName: session?.user?.name ?? "",

                                                                reportContent: reportContent,
                                                                reportChat: msg.message,
                                                                reportDate: new Date(msg.createdAt).toISOString(),

                                                                category: reportCategory,
                                                                addOpinion: addOpinion || undefined,
                                                            }

                                                            console.log("신고 데이터", reportData)

                                                            setReportCategory("");
                                                            setReportContent("");
                                                            setAddOpinion("");
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </div>

                                    </div>
                                );
                            })}
                            <div ref={bottomRef} />
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
