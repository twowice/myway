"use client";
import { useParams } from 'next/navigation';
import { EventDetailTitle } from '@/feature/event/detail/EventDetailTitle';
import { EventDetailSum } from '@/feature/event/detail/EventDetailSum';
import { PartyDrawer } from '@/feature/event/detail/PartyDrawer';
import { ImageCarousel } from '@/feature/event/detail/ImageCarousel';
import { PartyRow } from '@/components/partyrow/PartyRow'


export default function Page() {
  const { id } = useParams<{ id: string }>();
  const region = "부산 중구";
  const title = "광복로 겨울빛 트리 축제";
  const startDate = "2025.12.05";
  const endDate = "2026.02.22";
  const imageUrl = "/1.png";
  const images = ["/1.png", "/1.png", "/1.png", "/1.png"];
  const description = "부산의 겨울을 밝히는 대표 트리축제가 K-문화를 담은 찬란한 겨울빛으로 찾아온다. 2025년 12월 5일 올해 단 한번의 하이라이트, 카운트다운과 함께 광복로가 빛으로 깨어나는 점등식을 시작으로 26년 2월 22일까지 '2025 광복로 겨울빛 트리축제'를 만나볼 수 있다. 축제 기간 동안 부산 지역 뮤지션들의 버스킹 공연, 시민이 직접 트리 불빛을 켜볼 수 있는 참여형 점등식 등 다채로운 거리 이벤트가 준비되어 있다. 12월 20일~21일 주말에는 크리스마스 쿠킹클래스, 미니 트리만들기 등 다양한 체험프로그램도 펼쳐지니 빠짐없이 즐겨볼 수 있다."
  const price = 20000;
  const phone = "02-123-4567";
  const insta_url = "https://www.instagram.com/busan_fireworks/";
  const naver_map_embed_url = "https://map.naver.com/p/embed?lng=129.0364&lat=35.1017&zoom=15";
  const homepage = "https://www.naver.com/";
  const partyList = [
    {
      id: 1,
      partyName: "부산 불꽃축제 같이 가요",
      current_members: 2,
      max_members: 4,
    },
    {
      id: 2,
      partyName: "재즈 페스티벌 혼행 탈출",
      current_members: 3,
      max_members: 5,
    },
    {
      id: 3,
      partyName: "푸드트럭 투어 파티",
      current_members: 1,
      max_members: 3,
    },
  ];

  return (
    <div className="
      flex flex-col space-y-4 md:space-y-6 lg:space-y-[22px]
      pb-[80px]
      pt-[70px] 
      px-[16px]
      sm:px-[32px]
      lg:px-[80px]
      xl:px-[100px]
    ">
      {/* 타이틀 */}
      <EventDetailTitle
        region={region}
        title={title}
        startDate={startDate}
        endDate={endDate}
        imageUrl={imageUrl}
      />

      {/* 커슽첨 이미지 케러쉘 */}
      <ImageCarousel images={images ?? []} />

      {/* 설명 */}
      <p className="text-sm md:text-base text-gray-700 leading-relaxed pb-[80px]">
        {description}
      </p>

      <span className='text-xl md:text-2xl lg:text-[36px] font-semibold'>
        {title}는 이렇게 구성되어 있어요
      </span>

      {/* 디테일 */}
      <EventDetailSum
        imageUrl={imageUrl}
        startDate={startDate}
        endDate={endDate}
        price={price}
        region={region}
        phone={phone}
        insta_url={insta_url}
      />

      {/* 지도 */}
      <div className="flex items-center gap-3">
        <div className="w-full h-[260px] md:h-[320px] lg:h-[353px] rounded-xl overflow-hidden border">
          <iframe
            src={naver_map_embed_url}
            width="100%"
            height="100%"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      {/* 홈페이지 버튼 */}
      <div className="w-full h-[45px] bg-[var(--primary)] text-[#F1F5FA] rounded-[4px] flex items-center justify-center gap-4 cursor-pointer hover:opacity-80">
        <a
          href={homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="
            w-full h-[45px]
            bg-[var(--primary)]
            text-[#F1F5FA]
            rounded-[4px]
            flex items-center justify-center
            cursor-pointer
            hover:opacity-80
            transition
          "
        >
          홈페이지 바로가기
        </a>
      </div>

      {/* 파티 리스트 */}
      <span className='mt-[80px] text-[20px] font-semibold text-[#04152F] '>
        파티 모집 현황
      </span>

      <div className="flex flex-col gap-3">
        {partyList.map((party, index) => (
          <PartyRow
            key={party.id}
            index={index}
            partyName={party.partyName}
            current_members={party.current_members}
            max_members={party.max_members}
          />
        ))}
      </div>

      {/* 우측 하단 플로팅 버튼 */}
      <PartyDrawer eventId={id} name={title} />
    </div>

  );
}
