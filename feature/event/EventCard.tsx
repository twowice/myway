//////////////////////////
//                      //
//   EVENTCARD 모듈     //
//                      //
//////////////////////////

"use client";
import { Icon24 } from '@/components/icons/icon24';

interface FilterCardProps {
    title: string;
    startDate: string;
    endDate: string;
    region: string;
    imageUrl: string;
}

export function EventCard({ title, startDate, endDate, region, imageUrl }: FilterCardProps) {
    return (
        <div className="w-full h-auto overflow-hidden ">
            <div className='relative w-full h-[300px]'>
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover rounded-[8px]"
                />
                <button className='absolute top-2 right-2 w-[36px] h-[36px] bg-white/70 rounded-full shadow-sm cursor-pointer flex items-center justify-center'>
                    <Icon24 name="likedef" />
                </button>
            </div>

            <div className='flex flex-col gap-[7px] mt-[12px]'>
                <span className="text-[24px] font-bold text-[#04152F]">{title}</span>
                <span className="text-[14px] font-regular text-[#616161]">{startDate} ~ {endDate}</span>
                <span className="text-[14px] font-regular text-[#848484]">{region}</span>
            </div>
        </div>
    );
}
