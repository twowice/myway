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
                "flex flex-col items-center justify-center gap-4",
                "px-4 py-6 rounded-[16px]",
                "bg-[#F1F5FA]",
                "text-[24px] font-regular text-center",
                "w-[600px] h-[65px]"
            ].join(" ")}
        >
            {message}
        </div>
    );
}
