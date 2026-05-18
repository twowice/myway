//////////////////////////////////////
//                                  //
//          TOAST 공통 모듈          //
//                                  //
//////////////////////////////////////
/*  
    *** 예시 사용법 ***
    <Toast message="새 경로가 등록되었습니다." />
*/
interface ToastProps {
    message: string; // 토스트 메시지
    className?: string;
}

export default function Toast({ message, className = "" }: ToastProps) {
    return (
        <div
            className={[
                "flex min-h-12 w-[calc(100vw-32px)] max-w-[420px] items-center justify-center",
                "rounded-[12px] border border-[#DCE3EB] bg-white px-4 py-3",
                "text-center text-[15px] font-medium leading-relaxed text-[#04152F]",
                "shadow-[0_8px_24px_rgba(4,21,47,0.14)]",
                "break-keep",
                className
            ].join(" ")}
        >
            {message}
        </div>
    );
}
