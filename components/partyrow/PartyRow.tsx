'use client';

import { Icon24 } from '@/components/icons/icon24';
import { TwoFunctionPopup } from '@/components/popup/twofunction';
import { RadioComponent } from '@/components/basic/radio';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface PartyRowProps {
   index: number;
   partyName: string;
   current_members: number;
   max_members: number;
   isSelected?: boolean; //선택 상태
   partyId?: string;
   liked?: boolean;
   onToggleLike?: (partyId: string) => void;
}

export function PartyRow({
   index,
   partyId,
   partyName,
   current_members,
   max_members,
   isSelected = false, //선택 상태
   liked = false,
   onToggleLike,
}: PartyRowProps) {
   return (
      <div
         className={`flex items-center justify-between w-full px-4 py-3 border-2 bg-[#007DE4]/10 rounded-[4px] ${isSelected ? 'border-primary' : 'border-transparent'}`}
      >
         <div className="flex items-center gap-4">
            <span className="text-foreground font-semibold text-[16px]">{String(index + 1).padStart(2, '0')}</span>

            <span className="text-[16px] font-medium text-[var(--foreground)]">{partyName}</span>
         </div>

         <div className="flex items-center gap-4">
            <span className="text-[14px] text-[var(--foreground)]">
               {current_members}/{max_members}
            </span>

            <button
               className="cursor-pointer"
               onClick={e => {
                  e.stopPropagation();
                  if (!partyId || !onToggleLike) return;
                  onToggleLike(partyId);
               }}
            >
               <Icon24 name={liked ? 'likefill' : 'likedef'} />
            </button>
            <div onClick={e => e.stopPropagation()}>
               <TwoFunctionPopup
                  dialogTrigger={
                     <button className="cursor-pointer">
                        <Icon24 name="notify" />
                     </button>
                  }
                  title="파티 신고 처리"
                  body={
                     <div className="flex flex-col gap-5 w-full pb-5 pt-2 max-h-[60vh] overflow-y-auto px-1 pe-3">
                        {/* 카테고리 */}
                        <div className="flex flex-col gap-2">
                           <p className="text-sm font-medium text-[#04152F]">카테고리</p>
                           <RadioComponent
                              options={[
                                 { value: '사이비 표교 활동', label: '사이비 표교 활동' },
                                 { value: '미허가 영리활동', label: '미허가 영리활동' },
                                 { value: '부적절한 언어', label: '부적절한 언어' },
                                 { value: '사칭 목적 파티', label: '사칭 목적 파티' },
                                 { value: '불법 행위', label: '불법 행위' },
                                 { value: '광고', label: '광고' },
                                 { value: '기타', label: '기타' },
                              ]}
                              className="flex flex-col gap-3"
                              itemGap="gap-2"
                           />
                        </div>

                        {/* 이벤트명 */}
                        <div className="flex flex-col gap-1.5">
                           <p className="text-sm font-medium text-[#04152F]">이벤트명</p>
                           <Input placeholder="이벤트 명을 입력해주세요" />
                        </div>

                        {/* 신고 내용 */}
                        <div className="flex flex-col gap-1.5">
                           <p className="text-sm font-medium text-[#04152F]">신고 내용</p>
                           <Textarea placeholder="신고 사유를 입력해주세요" rows={4} className="resize-none h-[96px]" />
                        </div>

                        {/* 발생 일시 */}
                        <div className="flex flex-col gap-1.5">
                           <p className="text-sm font-medium text-[#04152F]">발생 일시</p>
                           <Input type="datetime-local" />
                        </div>

                        {/* 추가 의견 */}
                        <div className="flex flex-col gap-1.5">
                           <p className="text-sm font-medium text-[#04152F]">
                              추가 의견 <span className="text-xs text-muted-foreground">(선택)</span>
                           </p>
                           <Input placeholder="추가로 전달할 내용이 있다면 입력하세요" />
                        </div>
                     </div>
                  }
                  leftTitle="수정"
                  rightTitle="적용"
                  leftCallback={() => console.log('수정')}
                  rightCallback={() => console.log('적용')}
               />
            </div>
         </div>
      </div>
   );
}
