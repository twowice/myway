"use client";

import { Icon36 } from '@/components/icons/icon36';

interface EventDetailSumProps {
    imageUrl: string;
    startDate: string;
    endDate: string;
    price: number;
    region: string;
    phone: string;
    insta_url: string;
}

export function EventDetailSum({ imageUrl, startDate, endDate, price, region, phone, insta_url }: EventDetailSumProps) {
    return (
        <div className="
            flex
            flex-col
            md:flex-row
            gap-6
            md:gap-8
            items-start
        ">
            <div className='flex justify-center md:justify-start w-full md:w-auto'>
                <img src={imageUrl} alt="event image" width={302} height={428} className="
                object-cover
                rounded-xl
                w-[300px]
                h-[280px]
                md:w-[402px]
                md:h-[428px]
                lg:w-[502px]
                lg:h-[428px]"/>
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
                    {price.toLocaleString()}원
                </InfoRow>

                <InfoRow icon="city">
                    {region}
                </InfoRow>

                <InfoRow icon="phone">
                    {phone}
                </InfoRow>

                <InfoRow icon="sns">
                    <a
                        href={insta_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:opacity-80 break-all"
                    >
                        인스타 바로가기
                    </a>
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