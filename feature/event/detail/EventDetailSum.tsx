"use client";

import { Icon36 } from '@/components/icons/icon36';

interface EventDetailSumProps {
    imageUrl: string;
    startDate: string;
    endDate: string;
    price: string;
    region: string;
    phone: string;
}

export function EventDetailSum({ imageUrl, startDate, endDate, price, region, phone }: EventDetailSumProps) {
    return (
        <div className="
            flex
            flex-col
            md:flex-row
            gap-6
            md:gap-8
            items-start
        ">
            <div
                className="
                    flex
                    justify-center
                    md:justify-start
                    w-full

                    h-[280px]
                    md:h-[428px]
                    overflow-hidden
                    rounded-xl
                    shrink
                "
                >
                <img
                    src={imageUrl}
                    alt="event image"
                    className="
                    block
                    w-full
                    h-full
                    object-cover
                    "
                />
            </div>

            <div className="
                bg-[#F5F5F5]
                rounded-[15px]
                p-4
                md:p-5
                lg:p-6
                flex
                flex-col
                gap-3
                w-full">
                <InfoRow icon="bigcalendar">
                    {startDate} ~ {endDate}
                </InfoRow>

                <InfoRow icon="price">
                    <span
                        dangerouslySetInnerHTML={{
                            __html: price.replace(/<br\s*\/?>/gi, "<br />"),
                        }}
                    />
                </InfoRow>

                <InfoRow icon="city">
                    {region}
                </InfoRow>

                <InfoRow icon="phone">
                    {phone}
                </InfoRow>
            </div>
        </div>
    )
}

function InfoRow({
    icon,
    children,
}: {
    icon: Parameters<typeof Icon36>[0]['name'];
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center gap-3 text-sm md:text-base">
            <Icon36 name={icon} />
            <span className="text-[#04152F]">{children}</span>
        </div>
    );
}