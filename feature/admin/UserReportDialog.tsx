import { RadioComponent } from '@/components/basic/radio';
import { TwoFunctionPopup } from '@/components/popup/twofunction';
import { Button } from '@/components/ui/button/button';
import { PartyReportData, UserReportData } from '@/types/userReport';
import { useState } from 'react';

interface UserReportDialogProps {
   reportData: UserReportData | PartyReportData;
   onUpdate?: (updateData: UserReportData | PartyReportData) => void;
   type: 'user-report' | 'party-report';
   showChat?: boolean;
   title?: string;
}

export function UserReportDialog({ reportData, onUpdate, type }: UserReportDialogProps) {
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
   const [additionalComment, setAdditionalComment] = useState('');
   const title = type === 'user-report' ? '사용자 신고 처리' : '파티 신고 처리';
   const showChat = type === 'user-report';

   const handleModify = () => {
      setSanctionType(reportData.sanction_type === '미정' ? 'account_suspended_7days' : reportData.sanction_type);
      setAdditionalComment('');
      console.log('수정');
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

      const getSanctionTypeName = (type: string) => {
         switch (type) {
            case 'account_suspended_7days':
               return '7일 계정정지';
            case 'account_suspended_14days':
               return '14일 계정정지';
            case 'account_suspended_30days':
               return '30일 계정정지';
            case 'account_suspended_permanent':
               return '영구 계정정지';
            default:
               return '미정';
         }
      };

      let updatedData: UserReportData | PartyReportData;

      if (type === 'user-report') {
         updatedData = {
            ...(reportData as UserReportData),
            sanction_type: getSanctionTypeName(sanctionType),
            sanction_period: getSanctionPeriod(sanctionType),
            is_processed: true,
         };
      } else {
         updatedData = {
            ...(reportData as PartyReportData),
            sanction_type: getSanctionTypeName(sanctionType),
            is_processed: true,
         };
      }
      console.log('적용:', {});
      updatedData;
      // API
      // try {
      //    const reponse = await fetch(`/api/user-report/${reportData.user_name}`, {
      //       method: 'PUT',
      //       headers: { 'Content-Type': 'application/json' },
      //       body: JSON.stringify({
      //          ...updatedData,
      //       }),
      //    });
      //    if (reponse.ok) {
      //       alert('신고 처리가 완료되었습니다.');
      //       if (onUpdate) {
      //          onUpdate(updatedData);
      //       }
      //    } else {
      //       throw new Error('처리 실패');
      //    }
      // } catch (error) {
      //    console.error('신고 처리 실패:', error);
      //    alert('신고 처리에 실패했습니다.');
      // }
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
                     value={reportData.reporter_name}
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
                  <label className="text-sm font-semibold">이벤트 명</label>
                  <input
                     type="text"
                     disabled
                     className="flex-1 text-base px-2 py-2 bg-secondary rounded-md"
                     value={reportData.event_name}
                  />
               </div>
               <div className="flex flex-col gap-2 w-full">
                  <label className="text-sm font-semibold">신고 내용</label>
                  <textarea
                     disabled
                     className="flex-1 text-base px-2 py-2 bg-secondary rounded-md"
                     value={reportData.sanction_content}
                  />
               </div>
               {showChat && (
                  <div className="flex flex-col gap-2 w-full">
                     <label className="text-sm font-semibold">채팅 내역</label>
                     <textarea
                        disabled
                        className="flex-1 text-base px-2 py-2 bg-secondary rounded-md"
                        value={(reportData as UserReportData).sanction_chat}
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
