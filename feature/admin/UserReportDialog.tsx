import { RadioComponent } from '@/components/basic/radio';
import { TwoFunctionPopup } from '@/components/popup/twofunction';
import { Button } from '@/components/ui/button/button';
import { PartyReportData, UserReportData } from '@/types/userReport';
import { useState } from 'react';

interface UserReportDialogProps {
   reportData: UserReportData | PartyReportData;
   onUpdate?: (reportId: number, updateData: Partial<UserReportData | PartyReportData>) => Promise<void>;
   type: 'user-report' | 'party-report';
   showChat?: boolean;
   title?: string;
}

export function UserReportDialog({ reportData, onUpdate, type = 'user-report' }: UserReportDialogProps) {
   const reportCategoryLabels: Record<string, string> = {
      cult_activity: '사이비 포교 활동',
      unauthorized_commercial: '미허가 영리활동',
      inappropriate_language: '부적절한 언어',
      impersonation: '사칭 목적 파티',
      illegal_activity: '불법 행위',
      advertisementetc: '광고',
      etc: '기타',
   };

   const getReportCategoryLabel = (value?: string) => {
      if (!value) return '-';
      return reportCategoryLabels[value] ?? value;
   };
   const userSanctionOptions = [
      { value: 'account_suspended_7days', label: '7일 계정정지' },
      { value: 'account_suspended_14days', label: '14일 계정정지' },
      { value: 'account_suspended_30days', label: '30일 계정정지' },
      { value: 'account_suspended_permanent', label: '영구 계정정지' },
   ];

   const partySanctionOptions = [
      { value: 'party_dissolution', label: '파티 해산' },
      { value: 'party_restore', label: '파티 복구' },
   ];
   const sanctionOptions = type === 'user-report' ? userSanctionOptions : partySanctionOptions;

   const normalizePartyDissolutionDate = (date: string | undefined) => {
      if (!date) return '';
      const parsed = new Date(date);
      if (Number.isNaN(parsed.getTime())) return '';
      return parsed.toISOString();
   };

   const formatPartyDissolutionDate = (date: string | undefined) => {
      if (!date) return '-';
      const parsed = new Date(date);
      if (Number.isNaN(parsed.getTime())) return '-';
      return parsed.toLocaleString('ko-KR', {
         year: 'numeric',
         month: '2-digit',
         day: '2-digit',
         hour: '2-digit',
         minute: '2-digit',
         hour12: false,
      });
   };

   const [sanctionType, setSanctionType] = useState(reportData.sanction_type || sanctionOptions[0].value);
   const [additionalComment, setAdditionalComment] = useState(reportData.add_opinion || '');
   const [sanctionPeriod, setSanctionPeriod] = useState(reportData.sanction_period || '');
   const [partyDissolutionDate, setPartyDissolutionDate] = useState(
      normalizePartyDissolutionDate((reportData as PartyReportData).party_dissolution_date),
   );

   const [isEditing, setIsEditing] = useState(!reportData.is_processed);

   const resetStates = () => {
      setSanctionType(reportData.sanction_type || sanctionOptions[0].value);
      setAdditionalComment(reportData.add_opinion || '');
      setSanctionPeriod(reportData.sanction_period || '');
      setPartyDissolutionDate(normalizePartyDissolutionDate((reportData as PartyReportData).party_dissolution_date));
   };

   const title = type === 'user-report' ? '사용자 신고 처리' : '파티 신고 처리';
   const showChat = type === 'user-report';

   // 제재 유형 변경 핸들러
   const handleSanctionTypeChange = (newType: string) => {
      setSanctionType(newType);

      if (!isEditing) return;

      if (type === 'user-report') {
         if (newType === 'account_suspended_permanent') {
            setSanctionPeriod('영구');
         } else {
            const today = new Date();
            let days = 0;
            switch (newType) {
               case 'account_suspended_7days':
                  days = 7;
                  break;
               case 'account_suspended_14days':
                  days = 14;
                  break;
               case 'account_suspended_30days':
                  days = 30;
                  break;
               default:
                  return;
            }
            const endDate = new Date(today);
            endDate.setDate(today.getDate() + days);
            setSanctionPeriod(`${today.toISOString().split('T')[0]} ~ ${endDate.toISOString().split('T')[0]}`);
         }
      } else if (type === 'party-report' && newType === 'party_dissolution') {
         setPartyDissolutionDate(new Date().toISOString());
      } else if (type === 'party-report' && newType === 'party_restore') {
         setPartyDissolutionDate('');
      }
   };

   const handleCancel = () => {
      console.log('수정 취소: 초기 상태로 되돌림');
      resetStates();
   };

   const handleApply = async () => {
      if (!sanctionType) {
         alert('제재 유형을 선택해주세요.');
         return;
      }

      const updateData: Partial<UserReportData | PartyReportData> = {
         sanction_type: sanctionType,
         is_processed: true,
         add_opinion: additionalComment,
      };

      if (type === 'user-report') {
         (updateData as Partial<UserReportData>).sanction_period = sanctionPeriod;
      } else if (type === 'party-report') {
         (updateData as Partial<PartyReportData>).party_dissolution_date =
            sanctionType === 'party_dissolution' ? partyDissolutionDate || new Date().toISOString() : null;
      }

      console.log('=== 적용 디버깅 ===');
      console.log('type:', type);
      console.log('sanctionType:', sanctionType);
      console.log('partyDissolutionDate:', partyDissolutionDate);
      console.log('updateData:', updateData);
      console.log('reportData.id:', reportData.id);

      if (onUpdate && reportData.id) {
         try {
            await onUpdate(reportData.id, updateData);
            setIsEditing(false);
            console.log('업데이트 성공');
         } catch (error) {
            console.error('업데이트 실패:', error);
         }
      }
   };

   return (
      <TwoFunctionPopup
         dialogTrigger={
            <Button variant={reportData.is_processed ? 'secondary' : 'default'} size="sm" className="h-8 px-3 text-xs">
               {reportData.is_processed ? '제재 완료' : '신고 처리'}
            </Button>
         }
         title={title}
         body={
            <div className="flex flex-col gap-5 w-full ">
               <div className="flex flex-col gap-2 w-full">
                  <label className="text-sm font-semibold">신고자</label>
                  <input
                     type="text"
                     disabled
                     className="flex-1 text-base px-2 py-2 bg-secondary rounded-md"
                     value={reportData.reporter_name || '-'}
                  />
               </div>
               <div className="flex flex-col gap-2 w-full">
                  <label className="text-sm font-semibold">
                     {type === 'user-report' ? '신고 대상 사용자' : '파티명'}
                  </label>
                  <input
                     type="text"
                     disabled
                     className="flex-1 text-base px-2 py-2 bg-secondary rounded-md"
                     value={
                        type === 'user-report'
                           ? (reportData as UserReportData).reported_user_name || '-'
                           : (reportData as PartyReportData).party_name || '-'
                     }
                  />
               </div>
               <div className="flex flex-col gap-2 w-full">
                  <label className="text-sm font-semibold">카테고리</label>
                  <input
                     type="text"
                     disabled
                     className="flex-1 text-base px-2 py-2 bg-secondary rounded-md"
                     value={getReportCategoryLabel(reportData.report_category)}
                  />
               </div>

               <div className="flex flex-col gap-2 w-full">
                  <label className="text-sm font-semibold">신고 내용</label>
                  <textarea
                     disabled
                     className="flex-1 text-base px-2 py-2 bg-secondary rounded-md"
                     value={reportData.report_content}
                  />
               </div>
               {showChat && (
                  <div className="flex flex-col gap-2 w-full">
                     <label className="text-sm font-semibold">채팅 내역</label>
                     <textarea
                        disabled
                        className="flex-1 text-base px-2 py-2 bg-secondary rounded-md"
                        value={(reportData as UserReportData).report_chat}
                     />
                  </div>
               )}
               {type === 'user-report' && (
                  <div className="flex flex-col gap-2 w-full">
                     <label className="text-sm font-semibold">제재 기간</label>
                     <input
                        type="text"
                        className="flex-1 text-base px-2 py-2 border rounded-md"
                        value={sanctionPeriod}
                        onChange={e => setSanctionPeriod(e.target.value)}
                        placeholder="예: 2026-01-05 ~ 2026-01-12"
                     />
                  </div>
               )}
               {type === 'party-report' && (
                  <div className="flex flex-col gap-2 w-full">
                     <label className="text-sm font-semibold">파티 해산 날짜</label>
                     <input
                        type="text"
                        className="flex-1 text-base px-2 py-2 border rounded-md"
                        value={formatPartyDissolutionDate(partyDissolutionDate)}
                        onChange={e => setPartyDissolutionDate(e.target.value)}
                        placeholder="예: 2026-01-05"
                     />
                  </div>
               )}
               <div className="flex flex-col gap-2 w-full">
                  <label className="text-sm font-semibold">제재 유형</label>
                  <div>
                     <RadioComponent
                        options={sanctionOptions}
                        value={sanctionType}
                        onValueChange={handleSanctionTypeChange}
                     />
                  </div>
               </div>
               <div className="flex flex-col gap-2 w-full">
                  <label className="text-sm font-semibold">발생 일시</label>
                  <input
                     type="text"
                     disabled
                     className="flex-1 text-base px-2 py-2 bg-secondary rounded-md"
                     value={
                        reportData.report_date
                           ? new Date(reportData.report_date).toLocaleString('ko-KR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                             })
                           : '-'
                     }
                  />
               </div>
               <div className="flex flex-col gap-2 w-full">
                  <label className="text-sm font-semibold">추가의견(선택)</label>
                  <textarea
                     disabled
                     readOnly
                     className="flex-1 text-base px-2 py-2 bg-secondary rounded-md whitespace-pre-wrap"
                     value={additionalComment || '-'}
                  />
               </div>
            </div>
         }
         leftTitle="취소"
         rightTitle="적용"
         leftCallback={handleCancel}
         rightCallback={handleApply}
      />
   );
}
