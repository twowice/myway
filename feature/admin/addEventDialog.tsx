import { CheckboxComponent } from '@/components/basic/checkbox';
import { RadioComponent } from '@/components/basic/radio';
import { Icon24 } from '@/components/icons/icon24';
import { OneFunctionPopup } from '@/components/popup/onefunction';
import { Button } from '@/components/ui/button/button';

export function AddEvent() {
   const handleAdd = () => {
      console.log('새로운 이벤트 등록');
   };
   return (
      <OneFunctionPopup
         dialogTrigger={
            <Button variant={'add'} size={'lg'}>
               <Icon24 name="plus" className="text-primary-foreground" />
               신규 등록
            </Button>
         }
         title="신규 등록"
         body={
            <div className="flex flex-col gap-5 w-full ">
               <div className="flex flex-col gap-2 w-full">
                  <label className="text-sm font-semibold">이벤트 명</label>
                  <input
                     type="text"
                     className="flex-1 text-sm px-4 py-2 border rounded-md"
                     placeholder="이벤트 명을 입력해주세요."
                  />
               </div>
               <div className="flex flex-col gap-2 w-full">
                  <label className="text-sm font-semibold">이벤트 이미지</label>
                  {/* 포토 로직 */}
               </div>
               <div className="flex flex-col gap-2 w-full">
                  <label className="text-sm font-semibold">이벤트 소개</label>
                  <input
                     type="text"
                     className="flex-1 text-sm px-4 py-2 border rounded-md"
                     placeholder="이벤트 소개를 입력해주세요."
                  />
               </div>
               <div className="flex flex-col gap-2 w-full">
                  <label className="text-sm font-semibold">이벤트 홈페이지</label>
                  <input
                     type="text"
                     className="flex-1 text-sm px-4 py-2 border rounded-md"
                     placeholder="이벤트 홈페이지를 입력해주세요."
                  />
               </div>
               <div className="flex flex-col gap-2 w-full">
                  <label className="text-sm font-semibold">이벤트 주최</label>
                  <input
                     type="text"
                     className="flex-1 text-sm px-4 py-2 border rounded-md"
                     placeholder="이벤트 주최사를 입력해주세요."
                  />
               </div>
               <div className="flex flex-col gap-2 w-full">
                  <label className="text-sm font-semibold">이벤트 기간</label>
                  <div className="flex gap-2 items-center">
                     <input
                        type="text"
                        className="flex-1 text-sm px-4 py-2 border rounded-md"
                        placeholder="연도. 월. 일"
                     />
                     ~
                     <input
                        type="text"
                        className="flex-1 text-sm px-4 py-2 border rounded-md"
                        placeholder="연도. 월. 일"
                     />
                  </div>
               </div>
               <div className="flex flex-col gap-2 w-full">
                  <label className="text-sm font-semibold">예약 접수</label>
                  <div className="flex gap-2 items-center">
                     <input
                        type="text"
                        className="flex-1 text-sm px-4 py-2 border rounded-md"
                        placeholder="연도. 월. 일"
                     />
                     ~
                     <input
                        type="text"
                        className="flex-1 text-sm px-4 py-2 border rounded-md"
                        placeholder="연도. 월. 일"
                     />
                  </div>
                  <CheckboxComponent options={[{ value: 'reservation', label: '예약접수 여부' }]} />
               </div>
               <div className="flex flex-col gap-2 w-full">
                  <label className="text-sm font-semibold">가격</label>
                  <div className="flex gap-3">
                     <div className="flex flex-col text-sm gap-2 w-full">
                        어른
                        <input
                           type="text"
                           className="flex-1 text-sm px-4 py-2 border rounded-md"
                           placeholder="예: 15000"
                        />
                     </div>
                     <div className="flex flex-col text-sm gap-2 w-full">
                        청소년
                        <input
                           type="text"
                           className="flex-1 text-sm px-4 py-2 border rounded-md"
                           placeholder="예: 15000"
                        />
                     </div>
                  </div>
                  <div className="flex flex-col text-sm gap-2 w-full">
                     초등학생
                     <input
                        type="text"
                        className="flex-1 text-sm px-4 py-2 border rounded-md"
                        placeholder="0으로 입력 시 무료로 설정됩니다."
                     />
                  </div>
                  <CheckboxComponent options={[{ value: 'for_free', label: '모두 무료로 설정' }]} />
               </div>
               <div className="flex flex-col gap-2 w-full">
                  <label className="text-sm font-semibold">이벤트 장소명</label>
                  <div className="flex flex-col text-sm gap-2 w-full">
                     도로명 주소
                     <div className="flex gap-2">
                        <input
                           type="text"
                           className="flex-1 text-sm px-4 py-2 border rounded-md"
                           placeholder="오른쪽 버튼을 통해 주소를 검색해 입력해주세요."
                        />
                        <Button variant={'default'} size={'lg'}>
                           주소 검색
                        </Button>
                     </div>
                  </div>
                  <div className="flex flex-col text-sm gap-2 w-full">
                     상세 주소
                     <input
                        type="text"
                        className="flex-1 text-sm px-4 py-2 border rounded-md"
                        placeholder="예 : 00빌딩 3층"
                     />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                     <label className="text-sm font-semibold">이벤트 상태</label>
                     <RadioComponent
                        options={[
                           { value: 'non_progress', label: '미진행' },
                           { value: 'progress', label: '진행중' },
                        ]}
                     />
                  </div>
               </div>
            </div>
         }
         buttonTitle="등록하기"
         callback={handleAdd}
      />
   );
}
