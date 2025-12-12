export function EventTitle({ count }: { count: number }) {
    return (
        <div className="flex items-end gap-2">
            <p className="text-[32px] front-normal text-[#04152F]">
                전국 이벤트 콘텐츠
            </p>

            <span className="text-[32px] front-normal text-[var(--primary)]">
                {count}
            </span>
        </div>
    )
}