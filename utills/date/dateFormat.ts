export function formatKoreanTime(d: Date) {
    return d.toLocaleTimeString("ko-KR", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}