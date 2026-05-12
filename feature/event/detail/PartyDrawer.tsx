"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioComponent } from "@/components/basic/radio";
import { TwoFunctionPopup } from "@/components/popup/twofunction";
import { Icon24 } from "@/components/icons/icon24";
import { getSocket } from "@/lib/socket";

interface PartyDrawerProps {
    eventId: string; // 이벤트 아이디
    name: string; // 이벤트 명
}

// 채팅 메시지 한개 TYPE
interface ChatMessage {
    roomId: string; // 이벤트 명
    createdAt: number; // 만든 날짜
    sender: string; // 유저 닉네임
    senderId: string; // 유저 아이디
    maskedSender?: string; // 숨겨진 유저 닉네임
    message: string; // 채팅 메시지
}

// 채팅 서버 get_messages 응답 TYPE
interface MessagesResponse {
    ok: boolean; // 요청 성공 여부
    messages: ChatMessage[]; // 이번에 받은 메시지 목록
    nextCursor: string | null; // 다음 페이지 커서
    hasMore: boolean; // 더 가져올 메시지 여부
    totalRoomMessageCount?: number; // 방 전체 메시지 개수
    pageMessageCount?: number; // 이번 페이지에서 가져온 메시지 개수
    error?: string;
}

// 신고 API에 보낼 TYPE
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
    addOpinion?: string; // 추가 의견
}

// 신고 카테고리 상수
const REPORT_CATEGORIES = [
    "부정적인 언어",
    "도배",
    "광고",
    "사기",
    "기타",
].map((category) => ({
    value: category,
    label: category,
}));

export function PartyDrawer({ name }: PartyDrawerProps) {
    const { data: session } = useSession(); // 로그인 세션
    const isLoggedIn = !!session?.user?.id; // 유저 아이디가 있으면 로그인 상태

    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const socketRef = useRef<ReturnType<typeof getSocket> | null>(null); // 소켓 인스턴스
    const scrollRef = useRef<HTMLDivElement | null>(null); // 스크롤 컨테이너
    const bottomRef = useRef<HTMLDivElement | null>(null); // 맨 아래의 기준점
    const shouldScrollToBottomRef = useRef(false); // 메시지가 바뀌고 아래로 스크롤해야 하는지
    const scrollBehaviorRef = useRef<ScrollBehavior>("auto"); // 스크롤 방식
    const paginatedLoadSucceededRef = useRef(false); // get_messages 초기 로드 성공 저장
    const lastSeenTotalRef = useRef(0); // 마지막으로 확인한 전체 메시지 개수

    if (!socketRef.current) socketRef.current = getSocket();
    const socket = socketRef.current;

    const [open, setOpen] = useState(false); // Drawer 열림 여부
    const [input, setInput] = useState(""); // 채팅 입력 값
    const [messages, setMessages] = useState<ChatMessage[]>([]); // 화면에 보여줄 메시지
    const [myUserId, setMyUserId] = useState(""); // 현재 로그인한 내 유저 ID
    const [total, setTotal] = useState(0); // 전체 채팅 개수
    const [unreadCount, setUnreadCount] = useState(0); // Drawer가 닫힌 동안 생긴 새 메시지 수
    const [count, setCount] = useState(0); // 현재 방 참여자 수

    // 이전 메시지 페이지네이션 상태
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false); // 신고 제출 중 여부
    const [isReportOpen, setIsReportOpen] = useState(false); // 신고 팝업 여부
    const [reportTarget, setReportTarget] = useState<ChatMessage | null>(null); // 신고 대상 메시지
    // 신고 폼 입력 값
    const [reportCategory, setReportCategory] = useState("");
    const [reportContent, setReportContent] = useState("");
    const [addOpinion, setAddOpinion] = useState("");
    // 신고 폼 초기화
    const resetReportForm = useCallback(() => {
        setReportCategory("");
        setReportContent("");
        setAddOpinion("");
    }, []);
    // 신고 버튼을 눌렀을 때 실행
    const openReportPopup = useCallback((message: ChatMessage) => {
        resetReportForm(); // 초기화
        setReportTarget(message); // 저장
        setIsReportOpen(true); // 합엽 염
    }, [resetReportForm]);

    // 채팅창을 맨 아래로 내리는 함수
    const scrollToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
        requestAnimationFrame(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }

            bottomRef.current?.scrollIntoView({ behavior });
        });
    }, []);

    // 메시지 로드 
    const loadMessages = useCallback((cursor?: string | null) => {
        return new Promise<MessagesResponse>((resolve) => {
            socket.timeout(5000).emit(
                "get_messages",
                {
                    roomId: name,
                    limit: 20,
                    cursor,
                },
                // 실패 시
                (error: Error | null, data?: MessagesResponse) => {
                    if (error || !data) {
                        resolve({
                            ok: false,
                            messages: [],
                            nextCursor: null,
                            hasMore: false,
                            error: error?.message ?? "메시지를 불러오지 못했습니다.",
                        });
                        return;
                    }

                    resolve(data); // 성공 시 서버 응답 반환
                }
            );
        });
    }, [name, socket]);

    // 이전 메시지 로드
    const loadOlderMessages = useCallback(async () => {
        if (!hasMore || isLoadingMore || !nextCursor || !scrollRef.current) return;

        const container = scrollRef.current;
        const prevScrollHeight = container.scrollHeight;

        setIsLoadingMore(true);

        try {
            const data = await loadMessages(nextCursor);
            if (!data.ok) return;

            setMessages((prev) => [...data.messages, ...prev]);
            setNextCursor(data.nextCursor); // 다음 커서 갱신
            setHasMore(data.hasMore); // 더보기 여부 갱신

            requestAnimationFrame(() => {
                container.scrollTop = container.scrollHeight - prevScrollHeight;
            });
        } finally {
            setIsLoadingMore(false);
        }
    }, [hasMore, isLoadingMore, loadMessages, nextCursor]);

    // 신고 API 요청
    const submitReport = async (reportData: ReportPayload) => {
        try {
            const res = await fetch("/api/report", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reportData),
            });

            if (!res.ok) throw new Error("Report API Request Fail");

            alert("신고가 접수되었습니다.");
        } catch (error) {
            console.error("Report Data Loading Fail:", error);
        }
    };

    // 메시지 전송
    const handleSend = () => {
        if (!socket.connected) {
            alert("서버와 연결되지 않았습니다.");
            return;
        }

        if (!input.trim() || !session?.user?.id || !session?.user?.name) return;

        if (input.length > 100) {
            alert("메시지는 100자 이내로 작성해주세요.");
            return;
        }

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

    // 신고 전송
    const handleSubmitReport = async () => {
        if (isSubmitting || !reportTarget) return;

        setIsSubmitting(true);

        try {
            if (!reportCategory) {
                alert("카테고리를 선택해주세요.");
                return;
            }

            if (!reportContent.trim()) {
                alert("사유를 입력해주세요.");
                return;
            }

            if (!session?.user?.id) {
                alert("로그인이 필요합니다.");
                return;
            }

            if (reportContent.length > 100) {
                alert("내용을 100자 이내로 작성해주세요.");
                return;
            }

            if (addOpinion.length > 100) {
                alert("추가 의견을 100자 이내로 작성해주세요.");
                return;
            }

            const reportData: ReportPayload = {
                createdAt: Date.now(),
                reportedUserId: reportTarget.senderId,
                reportedUserName: reportTarget.sender,
                reporterUserId: session.user.id,
                reporterUserName: session.user.name ?? "",
                reportContent,
                reportChat: reportTarget.message,
                reportDate: new Date(reportTarget.createdAt).toISOString(),
                category: reportCategory,
                addOpinion: addOpinion || undefined,
            };

            await submitReport(reportData);

            setIsReportOpen(false);
            resetReportForm();
        } finally {
            setIsSubmitting(false);
        }
    };

    // 세션에서 내 ID 저장
    useEffect(() => {
        if (session?.user?.id) setMyUserId(session.user.id);
    }, [session]);

    // Drawer 열릴 때 소켓 연결
    useEffect(() => {
        if (!open || !myUserId) return;

        let cancelled = false; // 비동기 작업 취소 플래그 초기화
        paginatedLoadSucceededRef.current = false; // 초기 로드 성공 플래그 초기화

        if (!socket.connected) socket.connect(); // 소켓 연결이 없으면 연결

        // 서버에 방 입장을 요청
        const joinRoom = () => {
            socket.emit("join_room", name);
        };

        // 방이 꽉 찼을 때 알람
        type RoomFullPayload = {
            roomId: string;
            limit: number;
        };

        const handleRoomFull = (payload: RoomFullPayload) => {
            const { roomId, limit } = payload;
            alert(`'${roomId}' 방은 이미 ${limit}명으로 가득 찼습니다!`);
        };


        // 서버에서 받은 현재 참여자 수
        const handleRoomCount = ({ roomId, count }: { roomId: string; count: number }) => {
            if (roomId === name) setCount(count);
        };

        // room_history를 받았을 때 메시지와 전체 개수를 저장
        const handleRoomHistory = ({
            messages,
            totalMessageCount,
        }: {
            messages: ChatMessage[];
            totalMessageCount: number;
        }) => {
            if (cancelled || paginatedLoadSucceededRef.current) return;

            shouldScrollToBottomRef.current = true;
            scrollBehaviorRef.current = "auto";
            setMessages(messages);
            setTotal(totalMessageCount);
            lastSeenTotalRef.current = totalMessageCount;
            setUnreadCount(0);
            setNextCursor(null);
            setHasMore(false);
        };

        // 새 메시지를 받으면 메시지 배열 끝에 추가하고 전체 개수를 1증가
        const handleReceiveMessage = (data: ChatMessage) => {
            shouldScrollToBottomRef.current = true;
            scrollBehaviorRef.current = "smooth";
            setMessages((prev) => [...prev, data]);
            setTotal((prev) => {
                const nextTotal = prev + 1;
                lastSeenTotalRef.current = nextTotal;
                return nextTotal;
            });
        };

        // 초기 메시지 로드
        const loadInitialMessages = async () => {
            const data = await loadMessages(null); // 초기에 메시지 20개 로드
            if (cancelled || !data.ok) return;

            paginatedLoadSucceededRef.current = true;
            shouldScrollToBottomRef.current = true;
            scrollBehaviorRef.current = "auto";
            setMessages(data.messages);
            setNextCursor(data.nextCursor);
            setHasMore(data.hasMore);
            const totalMessages = data.totalRoomMessageCount ?? data.messages.length;
            setTotal(totalMessages); // 방 전체 메시지 개수
            lastSeenTotalRef.current = totalMessages;
            setUnreadCount(0);
        };

        if (socket.connected) joinRoom(); // 소켓 연결되어 있으면 방 입장

        // 소켓 리스너 등록
        socket.on("connect", joinRoom);
        socket.on("room_full", handleRoomFull);
        socket.on("room_count", handleRoomCount);
        socket.on("room_history", handleRoomHistory);
        socket.on("receive_message", handleReceiveMessage);

        loadInitialMessages(); // 첫 메시지 목록 조회

        return () => {
            // 이벤트 리스너 제거 및 소켓 연결 해제
            cancelled = true;
            socket.off("connect", joinRoom);
            socket.off("room_full", handleRoomFull);
            socket.off("room_count", handleRoomCount);
            socket.off("room_history", handleRoomHistory);
            socket.off("receive_message", handleReceiveMessage);
            socket.disconnect();
        };
    }, [loadMessages, myUserId, name, open, socket]);

    // 메시지 변경 후 스크롤
    useEffect(() => {
        if (!shouldScrollToBottomRef.current) return;

        shouldScrollToBottomRef.current = false;
        scrollToBottom(scrollBehaviorRef.current);
    }, [messages, scrollToBottom]);

    // Drawer가 닫혀 있을 때 전체 메시지 수를 확인해 새 메시지 배지 표시
    useEffect(() => {
        if (!isLoggedIn || open) return;

        let cancelled = false;

        const checkNewMessages = async () => {
            if (!socket.connected) socket.connect();

            const data = await loadMessages(null);
            if (cancelled || !data.ok || typeof data.totalRoomMessageCount !== "number") return;

            const latestTotal = data.totalRoomMessageCount;
            const lastSeenTotal = lastSeenTotalRef.current;

            setTotal(latestTotal);

            if (lastSeenTotal === 0) {
                lastSeenTotalRef.current = latestTotal;
                return;
            }

            if (latestTotal > lastSeenTotal) {
                setUnreadCount(latestTotal - lastSeenTotal);
            }
        };

        checkNewMessages();
        const intervalId = window.setInterval(checkNewMessages, 10000);

        return () => {
            cancelled = true;
            window.clearInterval(intervalId);
        };
    }, [isLoggedIn, loadMessages, open, socket]);

    // 메시지 렌더링 함수
    const renderMessage = (message: ChatMessage) => {
        const isMine = message.senderId === myUserId; // 내 메시지인지 확인

        return (
            <div
                key={`${message.senderId}-${message.createdAt}`}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
                <div className="flex max-w-[75%] flex-col gap-1">
                    {!isMine && (
                        <span className="text-xs text-gray-500">
                            {message.maskedSender ?? message.sender}
                        </span>
                    )}

                    <div
                        className={`
                            break-words rounded-[14px] px-3 py-2 text-sm leading-relaxed
                            ${isMine
                                ? "rounded-br-sm bg-[var(--primary)] text-white"
                                : "rounded-bl-sm bg-[#F1F1F1] text-[#04152F]"
                            }
                        `}
                    >
                        {message.message}
                    </div>

                    <div
                        className={`flex items-center gap-1 text-[10px] text-gray-400 ${
                            isMine ? "justify-end" : "justify-start"
                        }`}
                    >
                        <span className={isMine ? "text-right" : "text-left"}>
                            {new Date(message.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>

                        {!isMine && (
                            <button
                                type="button"
                                className="cursor-pointer"
                                onClick={() => openReportPopup(message)}
                            >
                                <Icon24 name="notify" viewBox="0 0 24 24" className="text-[#FF5F57]" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // 사용자 신고 팝업 BODY
    const reportPopupBody = (
        <div className="flex max-h-[60vh] w-full flex-col gap-5 overflow-y-auto px-1 pb-5 pe-3 pt-2">
            <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-[#04152F]">카테고리</p>
                <RadioComponent
                    options={REPORT_CATEGORIES}
                    className="flex flex-col gap-3"
                    itemGap="gap-2"
                    value={reportCategory}
                    onValueChange={setReportCategory}
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <p className="text-sm font-medium text-[#04152F]">신고 내용</p>
                <Textarea
                    rows={4}
                    value={reportContent}
                    placeholder="신고 사유를 입력해주세요"
                    className="h-[96px] resize-none"
                    onChange={(e) => setReportContent(e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <p className="text-sm font-medium text-[#04152F]">
                    추가 의견 <span className="text-xs text-muted-foreground">(선택)</span>
                </p>
                <Input
                    value={addOpinion}
                    placeholder="추가로 전달할 내용이 있다면 입력하세요"
                    onChange={(e) => setAddOpinion(e.target.value)}
                />
            </div>
        </div>
    );

    return (
        <>
            <button
                ref={buttonRef}
                disabled={!isLoggedIn}
                onClick={() => {
                    buttonRef.current?.blur();
                    setUnreadCount(0);
                    lastSeenTotalRef.current = total;
                    setOpen(true);
                }}
                className="
                    fixed bottom-20 right-6 z-999 flex h-14 w-14 cursor-pointer items-center
                    justify-center rounded-full bg-[var(--primary)] text-white shadow-lg
                    transition hover:opacity-90 lg:bottom-8 md:right-8
                "
            >
                <Icon24 name="talk" viewBox="0 0 36 34" className="bg-[#white]" />
                {unreadCount > 0 && !open && (
                    <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#FF5F57] px-1.5 text-[11px] font-semibold leading-none text-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            <Drawer open={open} onOpenChange={setOpen} direction="right">
                <DrawerContent className="right-0 left-auto z-[9999] flex h-full w-[90%] flex-col rounded-none sm:w-[420px]">
                    <DrawerHeader>
                        <div className="flex w-full items-center justify-between pb-[24px]">
                            <div className="flex flex-col">
                                <DrawerTitle className="text-lg font-semibold">
                                    {name}
                                </DrawerTitle>
                                <DrawerDescription className="sr-only">
                                    축제 실시간 채팅 Drawer
                                </DrawerDescription>
                                <span className="text-sm text-gray-500">
                                    <span className="sr-only">실시간 채팅 Drawer</span>
                                    실시간 채팅
                                </span>
                            </div>

                            <DrawerClose className="cursor-pointer">
                                <Icon24
                                    name="doubleclose"
                                    viewBox="0 0 36 34"
                                    className="text-[#04152F] transition hover:opacity-70"
                                />
                            </DrawerClose>
                        </div>
                    </DrawerHeader>

                    <div className="flex flex-1 flex-col gap-[15px] overflow-hidden px-4 pb-6">
                        <div className="flex flex-col items-center justify-center gap-1 rounded-[10px] bg-[#F5F5F5] px-[20px] py-3 text-sm text-[#767676]">
                            <p>{total}개의 톡</p>
                            <p>현재 {count}명 참여중</p>
                        </div>

                        <div
                            ref={scrollRef}
                            onScroll={(e) => {
                                if (e.currentTarget.scrollTop < 40) {
                                    loadOlderMessages();
                                }
                            }}
                            className="flex flex-1 flex-col gap-3 overflow-y-auto rounded-[4px] border px-[12px] py-[8px]"
                        >
                            {isLoadingMore && (
                                <p className="text-center text-xs text-gray-400">
                                    이전 메시지를 불러오는 중...
                                </p>
                            )}

                            {!hasMore && messages.length > 0 && (
                                <p className="text-center text-xs text-gray-400">
                                    가장 처음 메시지입니다.
                                </p>
                            )}

                            {messages.map(renderMessage)}
                            <div ref={bottomRef} />
                        </div>

                        <div className="flex items-center gap-[10px]">
                            <Input
                                value={input}
                                placeholder="메시지를 입력하세요"
                                className="h-[40px] flex-1"
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if ((e.nativeEvent as any).isComposing) return;

                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                            />

                            <button
                                onClick={handleSend}
                                className="
                                    flex h-[40px] w-[100px] cursor-pointer items-center justify-center
                                    rounded-[4px] bg-[var(--primary)] text-white transition hover:opacity-90
                                "
                            >
                                전송
                            </button>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>

            {reportTarget && (
                <TwoFunctionPopup
                    open={isReportOpen}
                    onOpenChange={(nextOpen) => {
                        if (!nextOpen) {
                            (document.activeElement as HTMLElement | null)?.blur();
                            setReportTarget(null);
                        }

                        setIsReportOpen(nextOpen);
                    }}
                    preventOutsideClose={true}
                    closeOnRight={false}
                    dialogTrigger={<button type="button" className="hidden" aria-hidden />}
                    title="사용자 신고 처리"
                    body={reportPopupBody}
                    leftTitle="초기화"
                    rightTitle="적용"
                    closeOnLeft={false}
                    leftCallback={resetReportForm}
                    rightCallback={handleSubmitReport}
                />
            )}
        </>
    );
}
