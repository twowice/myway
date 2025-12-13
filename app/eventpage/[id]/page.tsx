"use client";
import { useParams } from 'next/navigation';
import { EventDetailTitle } from '@/feature/event/detail/EventDetailTitle';

export default function Page() {
  const { id } = useParams<{ id: string }>();

  

  return (
    <div>
      <EventDetailTitle 
        region={"부산 중구"}
        title={"광복로 겨울빛 트리 축제"}
        startDate={"2025.12.05"}
        endDate={"2026.02.22"}
        imageUrl={"/1.png"}  
      />
    </div>
  );
}
