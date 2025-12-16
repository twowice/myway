'use client';

import { ComboboxComponent } from '@/components/basic/combo';
import { Button } from '@/components/ui/button/button';
import { SearchBar } from '@/components/ui/searchBar';
import { useMemo, useState } from 'react';
import { TableComponent } from './table';
import { EllipsisPagination } from '@/components/pagination/pagination';
import { UserReportDialog } from './UserReportDialog';
import { UserReportData } from '@/types/userReport';

const allUserReports: UserReportData[] = [
   {
      user_name: '김철수',
      phone_number: '010-1234-5678',
      reporter_name: '이영희',
      event_name: '봄맞이 꽃 축제',
      report_date: '2025-01-15',
      report_category: '부정적인 언어',
      sanction_content: '다른 참가자에게 욕설 및 비방 발언을 하였습니다.',
      sanction_type: '7일 계정정지',
      sanction_period: '2025-01-15 ~ 2025-01-22',
      sanction_chat: '김철수: 너 정말 최악이야\n김철수: 이런 이벤트에 왜 왔어?',
      add_opinion: '이 사용자는 이전에도 여러 번 비슷한 행동을 반복했습니다. 엄중한 조치 부탁드립니다.',
      is_processed: true,
   },
   {
      user_name: '박민수',
      phone_number: '010-2345-6789',
      reporter_name: '최지현',
      event_name: '여름 음악 페스티벌',
      report_date: '2025-01-14',
      report_category: '도배',
      sanction_content: '채팅창에 동일한 메시지를 30회 이상 반복 전송했습니다.',
      sanction_type: '7일 계정정지',
      sanction_period: '2025-01-14 ~ 2025-01-21',
      sanction_chat: '박민수: 할인 쿠폰 받으세요\n박민수: 할인 쿠폰 받으세요\n박민수: 할인 쿠폰 받으세요\n(30회 반복)',
      add_opinion: '채팅이 너무 많아서 정상적인 대화가 불가능했습니다.',
      is_processed: true,
   },
   {
      user_name: '정수진',
      phone_number: '010-3456-7890',
      reporter_name: '강민호',
      event_name: '가을 푸드 트럭 축제',
      report_date: '2025-01-13',
      report_category: '광고',
      sanction_content: '상업적 광고 링크를 지속적으로 게시했습니다.',
      sanction_type: '미정',
      sanction_period: '-',
      sanction_chat: '정수진: 여기서 제품 구매하세요 www.example.com\n정수진: 50% 할인 중입니다',
      add_opinion: '경고를 했지만 계속 광고를 올려서 신고합니다.',
      is_processed: false,
   },
   {
      user_name: '홍길동',
      phone_number: '010-4567-8901',
      reporter_name: '윤서연',
      event_name: '겨울 빛 축제',
      report_date: '2025-01-12',
      report_category: '사기',
      sanction_content: '가짜 경품 이벤트로 개인정보를 수집하려 했습니다.',
      sanction_type: '7일 계정정지',
      sanction_period: '2025-01-12 ~ 2025-01-19',
      sanction_chat: '홍길동: 경품 당첨됐어요! 개인정보 알려주세요\n홍길동: 계좌번호와 주민번호 보내주세요',
      add_opinion: '명백한 사기 행위입니다. 다른 피해자도 있을 것 같습니다.',
      is_processed: true,
   },
   {
      user_name: '이동욱',
      phone_number: '010-5678-9012',
      reporter_name: '김나연',
      event_name: '크리스마스 마켓',
      report_date: '2025-01-11',
      report_category: '기타',
      sanction_content: '이벤트와 무관한 정치적 발언을 지속했습니다.',
      sanction_type: '미정',
      sanction_period: '-',
      sanction_chat: '이동욱: 정치 이야기 좀 합시다\n이동욱: 여러분은 어느 정당 지지하세요?',
      add_opinion: '이벤트 분위기를 해쳤습니다.',
      is_processed: false,
   },
   {
      user_name: '최준호',
      phone_number: '010-6789-0123',
      reporter_name: '박서준',
      event_name: '한강 불꽃축제',
      report_date: '2025-01-10',
      report_category: '부정적인 언어',
      sanction_content: '특정 지역 사람들을 비하하는 발언을 했습니다.',
      sanction_type: '7일 계정정지',
      sanction_period: '2025-01-10 ~ 2025-01-17',
      sanction_chat: '최준호: 그 지역 사람들은 다 그래\n최준호: 민도가 낮아서 그런 거야',
      add_opinion: '지역 차별 발언으로 매우 불쾌했습니다.',
      is_processed: true,
   },
   {
      user_name: '강다은',
      phone_number: '010-7890-1234',
      reporter_name: '정하늘',
      event_name: '서울 재즈 페스티벌',
      report_date: '2025-01-09',
      report_category: '도배',
      sanction_content: '이모티콘을 50회 이상 연속으로 전송했습니다.',
      sanction_type: '미정',
      sanction_period: '-',
      sanction_chat: '강다은: 😀😀😀😀😀\n강다은: 😀😀😀😀😀\n(50회 반복)',
      add_opinion: '',
      is_processed: false,
   },
   {
      user_name: '신예은',
      phone_number: '010-8901-2345',
      reporter_name: '조민수',
      event_name: '서울 국제 영화제',
      report_date: '2025-01-08',
      report_category: '광고',
      sanction_content: '타 플랫폼 홍보 메시지를 반복적으로 게시했습니다.',
      sanction_type: '7일 계정정지',
      sanction_period: '2025-01-08 ~ 2025-01-15',
      sanction_chat: '신예은: 제 유튜브 채널 구독하세요\n신예은: 인스타그램 팔로우 해주세요',
      add_opinion: '경고했는데도 계속 홍보 메시지를 올렸습니다.',
      is_processed: true,
   },
   {
      user_name: '한지우',
      phone_number: '010-9012-3456',
      reporter_name: '송유진',
      event_name: '강남 페스티벌',
      report_date: '2025-01-07',
      report_category: '사기',
      sanction_content: '중고거래 사칭으로 금전 요구를 했습니다.',
      sanction_type: '미정',
      sanction_period: '-',
      sanction_chat: '한지우: 티켓 팔아요 50% 할인\n한지우: 계좌로 먼저 입금하시면 보내드릴게요',
      add_opinion: '이미 피해를 입은 사람이 있다고 들었습니다.',
      is_processed: false,
   },
   {
      user_name: '오세훈',
      phone_number: '010-0123-4567',
      reporter_name: '임채원',
      event_name: '한강 마라톤 대회',
      report_date: '2025-01-06',
      report_category: '부정적인 언어',
      sanction_content: '성희롱성 발언으로 다른 참가자를 불쾌하게 했습니다.',
      sanction_type: '7일 계정정지',
      sanction_period: '2025-01-06 ~ 2025-01-13',
      sanction_chat: '오세훈: 너 진짜 예쁘다 연락처 줄래?\n오세훈: 나이가 어떻게 되세요?',
      add_opinion: '계속 귀찮게 해서 이벤트를 즐길 수 없었습니다.',
      is_processed: true,
   },
   {
      user_name: '서민아',
      phone_number: '010-1111-2222',
      reporter_name: '노승우',
      event_name: '서울 빛초롱 축제',
      report_date: '2025-01-05',
      report_category: '기타',
      sanction_content: '타인의 개인정보를 무단으로 공개했습니다.',
      sanction_type: '미정',
      sanction_period: '-',
      sanction_chat: '서민아: 이 사람 전화번호는 010-xxxx-xxxx예요\n서민아: 주소는 서울시 xx구입니다',
      add_opinion: '개인정보가 공개되어 매우 당황스러웠습니다.',
      is_processed: false,
   },
   {
      user_name: '백현우',
      phone_number: '010-3333-4444',
      reporter_name: '하은비',
      event_name: '전통주 페스티벌',
      report_date: '2025-01-04',
      report_category: '도배',
      sanction_content: '특수문자를 이용한 도배 행위를 했습니다.',
      sanction_type: '7일 계정정지',
      sanction_period: '2025-01-04 ~ 2025-01-11',
      sanction_chat: '백현우: ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ\n백현우: !!!!!!!!!!!!!!!!!!!!',
      add_opinion: '채팅창이 도배로 가득 차서 불편했습니다.',
      is_processed: true,
   },
];

export default function UserReport() {
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 12;

   const totalPages = useMemo(() => {
      return Math.ceil(allUserReports.length / itemsPerPage);
   }, [itemsPerPage]);

   const currentData = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return allUserReports.slice(startIndex, endIndex);
   }, [currentPage, itemsPerPage]);

   const handlePageChange = (page: number) => {
      setCurrentPage(page);
   };

   return (
      <div className="flex w-full h-full flex-col gap-6">
         <div>사용자 신고 관리</div>

         <div className="flex flex-col gap-6 h-full">
            <div className="flex flex-col w-full gap-5">
               <div className="flex flex-col p-4 gap-4 border rounded-md">
                  <div className="flex gap-4 text-base font-normal items-center">
                     <div className="w-16">카테고리</div>
                     <div className="w-50">
                        <ComboboxComponent
                           options={[
                              { value: 'all', label: '전체' },
                              { value: 'negative', label: '부정적인 언어' },
                              { value: 'spamming', label: '도배' },
                              { value: 'advertisement', label: '광고' },
                              { value: 'fraud', label: '사기' },
                              { value: 'etc', label: '기타' },
                           ]}
                           className="w-full"
                        />
                     </div>
                     <div className="w-16">제재 유형</div>
                     <div className="w-50">
                        <ComboboxComponent
                           options={[
                              { value: 'all', label: '전체' },
                              { value: 'account_suspended_7days', label: '7일 계정정지' },
                              { value: 'account_suspended_14days', label: '14일 계정정지' },
                              { value: 'account_suspended_30days', label: '30일 계정정지' },
                              { value: 'account_suspended_permanent', label: '영구 계정정지' },
                              { value: 'undetermined', label: '미정' },
                           ]}
                           className="w-full"
                        />
                     </div>
                     <div className="w-16">신고 기간</div>
                     <div className="flex-1 h-full border"></div>
                  </div>

                  <div className="flex gap-4 text-base font-normal items-center">
                     <div className="w-16">분류</div>
                     <div className="w-50">
                        <ComboboxComponent
                           options={[
                              { value: 'user_name', label: '사용자 명' },
                              { value: 'phone_number', label: '전화번호' },
                              { value: 'reporter_name', label: '신고자 명' },
                           ]}
                           className="w-full"
                        />
                     </div>
                     <div className="w-16">검색</div>
                     <div className="flex-1">
                        <SearchBar />
                     </div>
                  </div>

                  <div className="flex justify-end gap-4">
                     <Button variant={'secondary'} size={'lg'}>
                        초기화
                     </Button>
                     <Button variant={'default'} size={'lg'}>
                        검색
                     </Button>
                  </div>
               </div>
            </div>

            <div className="flex-1 min-h-0">
               <TableComponent<UserReportData>
                  columns={[
                     { key: 'user_name', label: '사용자 명', width: 'w-[100px]' },
                     { key: 'phone_number', label: '전화번호', width: 'w-[130px]' },
                     { key: 'report_date', label: '신고 접수날짜', width: 'w-[120px]' },
                     { key: 'sanction_period', label: '제재 기간', width: 'w-[170px]' },
                     {
                        key: 'sanction_type',
                        label: '제재 유형',
                        width: 'w-[120px]',
                        render: value => (
                           <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                 value === '7일 계정정지' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                              }`}
                           >
                              {value}
                           </span>
                        ),
                     },
                     { key: 'reporter_name', label: '신고자 명', width: 'w-[100px]' },
                     {
                        key: 'report_category',
                        label: '카테고리',
                        width: 'w-[120px]',
                        render: value => (
                           <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                 value === '부정적인 언어'
                                    ? 'bg-red-100 text-red-800'
                                    : value === '도배'
                                      ? 'bg-orange-100 text-orange-800'
                                      : value === '광고'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : value === '사기'
                                          ? 'bg-purple-100 text-purple-800'
                                          : 'bg-gray-100 text-gray-800'
                              }`}
                           >
                              {value}
                           </span>
                        ),
                     },
                     {
                        key: 'is_processed',
                        label: '제재관리',
                        width: 'w-[110px]',
                        render: (value, row) => <UserReportDialog reportData={row} type="user-report" />,
                     },
                  ]}
                  data={currentData}
                  itemsPerPage={12}
               />
            </div>
         </div>

         <div className="flex justify-center">
            <EllipsisPagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
         </div>
      </div>
   );
}
