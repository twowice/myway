/* ===========================
    Event Title
=========================== */
interface EventTitleProps {
    count: number;
    isPanel: boolean;
    onToggle: () => void;
}

export function EventTitle({ count, isPanel, onToggle }: EventTitleProps) {
    return (
        <div
            className="
                flex flex-col gap-1
                md:flex-row md:items-end md:gap-2
            "
        >
            {/* 제목 */}
            <p
                className={`
                    font-normal text-[#04152F]
                    text-[20px]
                    md:text-[32px]
                `}
            >
                전국 이벤트 콘텐츠
            </p>

            {/* 카운트 */}
            <span
                className="
                    font-normal text-[var(--primary)]
                    text-[20px]
                    md:text-[32px]
                "
            >
                {count}
            </span>

            {/* + / - 버튼 */}
            <button
                onClick={onToggle}
                aria-label={isPanel ? '페이지로 확장' : '패널로 축소'}
                className="
                    mt-1 md:mt-0
                    md:ml-2

                    flex items-center justify-center
                    w-[28px] h-[28px]
                    md:w-[36px] md:h-[36px]

                    rounded-full
                    border border-[#E5E7EB]
                    text-[16px] md:text-[20px]
                    font-bold

                    hover:bg-[#F4F6FA]
                    transition
                "
            >
                {isPanel ? '+' : '−'}
            </button>
        </div>
    );
}
