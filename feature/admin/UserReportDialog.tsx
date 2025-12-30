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
   const [sanctionType, setSanctionType] = useState(sanctionOptions[0].value);
   const [additionalComment, setAdditionalComment] = useState(reportData.add_opinion || '');
   const title = type === 'user-report' ? '사용자 신고 처리' : '파티 신고 처리';
   const showChat = type === 'user-report';

   const handleModify = () => {
      setSanctionType(reportData.sanction_type || 'account_suspended_7days');
      setAdditionalComment(reportData.add_opinion || '');
      console.log('수정 모드  ');
   };
   const handleApply = async () => {
      if (!sanctionType) {
         alert('제재 유형을 선택해주세요.');
         return;
      }
      const getSanctionPeriod = (type: string) => {
         const today = new Date();
         let days = 0;
         switch (type) {
            case 'account_suspended_7days':
               days = 7;
               break;
            case 'account_suspended_14days':
               days = 14;
               break;
            case 'account_suspended_30days':
               days = 30;
               break;
            case 'account_suspended_permanent':
               return '영구';
            default:
               return '-';
         }
         const endDate = new Date(today);
         endDate.setDate(today.getDate() + days);
         return `${today.toISOString().split('T')[0]} ~ ${endDate.toISOString().split('T')[0]}`;
      };

      const updateData: Partial<UserReportData | PartyReportData> = {
         sanction_type: sanctionType,
         is_processed: true,
         add_opinion: additionalComment || reportData.add_opinion,
      };

      if (type === 'user-report') {
         (updateData as Partial<UserReportData>).sanction_period = getSanctionPeriod(sanctionType);
      } else if (type === 'party-report' && sanctionType === 'party_dissolution') {
         (updateData as Partial<PartyReportData>).party_dissolution_date = new Date().toISOString().split('T')[0];
      }

      console.log('적용:', updateData);

      if (onUpdate && reportData.id) {
         try {
            await onUpdate(reportData.id, updateData);
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
                     value={reportData.report_category}
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
               <div className="flex flex-col gap-2 w-full">
                  <label className="text-sm font-semibold">제재 유형</label>
                  {showChat ? (
                     <RadioComponent
                        options={userSanctionOptions}
                        value={sanctionType}
                        onValueChange={setSanctionType}
                     />
                  ) : (
                     <RadioComponent
                        options={partySanctionOptions}
                        value={sanctionType}
                        onValueChange={setSanctionType}
                     />
                  )}
               </div>
               <div className="flex flex-col gap-2 w-full">
                  <label className="text-sm font-semibold">발생 일시</label>
                  <input
                     type="text"
                     disabled
                     className="flex-1 text-base px-2 py-2 bg-secondary rounded-md"
                     value={reportData.report_date}
                  />
               </div>
               <div className="flex flex-col gap-2 w-full">
                  <label className="text-sm font-semibold">추가의견(선택)</label>
                  <textarea
                     disabled
                     className="flex-1 text-base px-2 py-2 bg-secondary rounded-md"
                     value={reportData.add_opinion || '-'}
                  />
               </div>
            </div>
         }
         leftTitle="수정"
         rightTitle="적용"
         leftCallback={handleModify}
         rightCallback={handleApply}
      />
   );
}
