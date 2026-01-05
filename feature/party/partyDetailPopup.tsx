'use client';

import { Icon24 } from '@/components/icons/icon24';
import { TwoFunctionPopup } from '@/components/popup/twofunction';
import Tag from '@/components/tag/tag';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/contexts/ToastContext';
import {
   applyParty,
   deleteParty,
   fetchPartyApplicationStatus,
   updateParty,
   withdrawParty,
} from '@/lib/party/party';
import { useEffect, useState } from 'react';
import { EventSearchBar } from '../event/EventSearchBar';
import { PlaceSearchBar } from '../location/search/PlaceSearchBar';

type PartyDetailPopupProps = {
   party: {
      id: string;
      partyName: string;
      current_members: number;
      max_members: number | string;
      description?: string;
      location?: string;
      date?: string;
      time?: string;
      host?: string;
      hostId?: string;
      eventName?: string;
      label1?: string;
      label2?: string;
      label3?: string;
      eventId?: number;
      locationLatitude?: number;
      locationLongitude?: number;
   };
   trigger: React.ReactNode;
   currentUserId?: string;
   onEdit?: (updatedParty: any) => void;
   onDelete?: (partyId: string) => void;
   onApply?: (updatedParty: any) => void;
   onWithdraw?: (updatedParty: any) => void;
   onClose?: () => void;
   liked?: boolean;
   onToggleLike?: (partyId: string) => void;
};

export const PartyDetailPopup = ({
   party,
   trigger,
   onEdit,
   onApply,
   onWithdraw,
   onClose,
   onDelete,
   currentUserId,
   liked = false,
   onToggleLike,
}: PartyDetailPopupProps) => {
   const { showToast } = useToast();
   const [isEditMode, setIsEditMode] = useState(false);
   const [currentParty, setCurrentParty] = useState(party);
   const [editedParty, setEditedParty] = useState(party);
   const [tagInput, setTagInput] = useState('');
   const [isApplied, setIsApplied] = useState(false);

   useEffect(() => {
      setCurrentParty(party);
      setEditedParty(party);
      setIsApplied(false);
   }, [party]);

   const isFull = currentParty.current_members === currentParty.max_members;
   const isHost = currentParty.hostId === currentUserId;

   useEffect(() => {
      if (!currentUserId || !currentParty?.id || isHost) {
         setIsApplied(false);
         return;
      }

      const loadApplicationStatus = async () => {
         try {
            const result = await fetchPartyApplicationStatus(currentParty.id);
            setIsApplied(result.applied);
         } catch (error) {
            console.error('파티 신청 상태 조회 실패:', error);
         }
      };

      void loadApplicationStatus();
   }, [currentParty.id, currentUserId, isHost]);

   const handleApply = async () => {
      if (isHost) {
         showToast('파티 생성자는 신청할 수 없어요.');
         return;
      }
      if (isFull || isApplied) return;
      try {
         await applyParty(currentParty.id);
      } catch (error) {
         console.error('파티 신청 실패:', error);
         showToast(
            error instanceof Error ? error.message : '파티 신청에 실패했어요. 잠시 후 다시 시도해주세요.',
         );
         return;
      }

      const updatedParty = {
         ...currentParty,
         current_members: currentParty.current_members + 1,
      };
      setCurrentParty(updatedParty);
      setIsApplied(true);
      onApply?.(updatedParty);
      showToast('파티 신청이 완료되었습니다.');
      onClose?.();
   };
   const handleWithdraw = async () => {
      if (!isApplied) return;
      try {
         await withdrawParty(currentParty.id);
      } catch (error) {
         console.error('파티 철회 실패:', error);
         showToast(
            error instanceof Error ? error.message : '파티 철회에 실패했어요. 잠시 후 다시 시도해주세요.',
         );
         return;
      }

      const updatedParty = {
         ...currentParty,
         current_members: currentParty.current_members - 1,
      };
      setCurrentParty(updatedParty);
      setIsApplied(false);
      onWithdraw?.(updatedParty);
      showToast('파티 철회가 완료되었습니다.');
      onClose?.();
   };

   const handleEdit = () => {
      setIsEditMode(true);
      setEditedParty(currentParty);
   };

   const handleSaveEdit = async () => {
      const partyName = editedParty.partyName?.trim();
      const description = editedParty.description?.trim();
      const maxMembers = Number(editedParty.max_members);
      const eventId = editedParty.eventId;
      const locationName = editedParty.location?.trim();
      const date = editedParty.date;
      const time = editedParty.time;

      if (!partyName) {
         showToast('파티명을 입력해주세요.');
         return;
      }
      if (!eventId || eventId <= 0) {
         showToast('이벤트명을 입력해주세요.');
         return;
      }
      if (!Number.isFinite(maxMembers) || maxMembers < 1) {
         showToast('최대 인원을 입력해주세요.');
         return;
      }
      if (!locationName) {
         showToast('장소를 입력해주세요.');
         return;
      }
      if (!date || !time) {
         showToast('날짜와 시간을 입력해주세요.');
         return;
      }
      if (!description) {
         showToast('파티 소개를 입력해주세요.');
         return;
      }

      try {
         await updateParty({
            id: editedParty.id,
            partyName,
            description,
            max_members: maxMembers,
            label1: editedParty.label1,
            label2: editedParty.label2,
            label3: editedParty.label3,
            eventId,
            date,
            time,
            location: locationName,
            locationLatitude: editedParty.locationLatitude,
            locationLongitude: editedParty.locationLongitude,
         });
      } catch (error) {
         console.error('파티 수정 실패:', error);
         showToast(
            error instanceof Error ? error.message : '파티 수정에 실패했어요. 잠시 후 다시 시도해주세요.',
         );
         return;
      }

      setCurrentParty(editedParty);
      onEdit?.(editedParty);
      setIsEditMode(false);
      showToast('파티 정보가 수정되었습니다.');
   };

   const handleDeleteEdit = async () => {
      const confirmed = window.confirm('정말 이 파티를 삭제하시겠어요?');
      if (!confirmed) return;

      try {
         await deleteParty(currentParty.id);
      } catch (error) {
         console.error('파티 삭제 실패:', error);
         showToast(
            error instanceof Error ? error.message : '파티 삭제에 실패했어요. 잠시 후 다시 시도해주세요.',
         );
         return;
      }

      onDelete?.(currentParty.id);
      showToast('파티가 삭제되었습니다.');
   };

   const handleCancel = () => {
      onClose?.();
   };

   const handleRemoveTag = (tagNumber: 1 | 2 | 3) => {
      setEditedParty({
         ...editedParty,
         [`label${tagNumber}`]: undefined,
      });
   };

   const handleAddTag = () => {
      const value = tagInput.trim();
      if (!value) return;
      if (!editedParty.label1) {
         setEditedParty({ ...editedParty, label1: value });
      } else if (!editedParty.label2) {
         setEditedParty({ ...editedParty, label2: value });
      } else if (!editedParty.label3) {
         setEditedParty({ ...editedParty, label3: value });
      }
      setTagInput('');
   };

   const PopupBody = (
      <div className="flex flex-col gap-4 flex-1 overflow-y-auto">
         {/* {isHost && ( */}
         {!isEditMode && isHost && (
            <div className="flex w-full justify-end">
               <Button className="w-20" onClick={handleEdit}>
                  편집
               </Button>
            </div>
         )}
         {/* )} */}
         {/* 파티명 */}
         <div className="flex flex-col gap-2">
            {isEditMode ? (
               <>
                  <label className="text-sm font-medium text-gray-700">
                     파티명
                     <span className="text-red-500">*</span>
                  </label>
                  <Input
                     type="text"
                     value={editedParty.partyName}
                     onChange={e => setEditedParty({ ...editedParty, partyName: e.target.value })}
                     placeholder={currentParty.partyName}
                  />
               </>
            ) : (
               <>
                  <label className="text-sm font-medium text-gray-700">파티명</label>
                  <p className="bg-secondary disabled h-10 px-4 py-2 rounded-md">{currentParty.partyName}</p>
               </>
            )}
         </div>
         {/* 일정 */}
         <div className="flex flex-col gap-2">
            {isEditMode ? (
               <>
                  <label className="text-sm font-medium text-gray-700">
                     일정
                     <span className="text-red-500">*</span>
                  </label>
                  <Input
                     type="datetime-local"
                     value={`${editedParty.date}T${editedParty.time}`}
                     onChange={e => {
                        const datetime = e.target.value.split('T');
                        setEditedParty({ ...editedParty, date: datetime[0], time: datetime[1] });
                     }}
                     placeholder={currentParty.date}
                  />
               </>
            ) : (
               <>
                  <label className="text-sm font-medium text-gray-700">일정</label>
                  <p className="bg-secondary disabled h-10 px-4 py-2 rounded-md">
                     {currentParty.date} {currentParty.time}
                  </p>
               </>
            )}
         </div>

         {/* 이벤트명 */}
         <div className="flex flex-col gap-2">
            {isEditMode ? (
               <EventSearchBar
                  create={editedParty}
                  setCreate={setEditedParty}
               />
            ) : (
               <>
                  <label className="text-sm font-medium text-gray-700">이벤트명</label>
                  <p className="bg-secondary disabled h-10 px-4 py-2 rounded-md">{currentParty.eventName || '-'}</p>
               </>
            )}
         </div>

         {/* 최대 인원 */}
         <div className="flex flex-col gap-2">
            {isEditMode ? (
               <>
                  <label className="text-sm font-medium text-gray-700">
                     최대 인원
                     <span className="text-red-500">*</span>
                  </label>
                  <Input
                     type="number"
                     value={editedParty.max_members ?? ''}
                     onChange={e => {
                        const value = e.target.value;
                        setEditedParty({
                           ...editedParty,
                           max_members: value === '' ? '' : Number(value),
                        });
                     }}
                     min={currentParty.current_members}
                  />
               </>
            ) : (
               <>
                  <label className="text-sm font-medium text-gray-700">최대 인원</label>
                  <p className="bg-secondary disabled h-10 px-4 py-2 rounded-md">
                     {currentParty.current_members} / {currentParty.max_members} 명
                  </p>
               </>
            )}
         </div>

         {/* 위치 */}
         <div className="flex flex-col gap-2">
            {isEditMode ? (
               <PlaceSearchBar
                  create={editedParty}
                  setCreate={setEditedParty}
               />
            ) : (
               <>
                  <label className="text-sm font-medium text-gray-700">위치</label>
                  <p className="bg-secondary disabled h-10 px-4 py-2 rounded-md">{currentParty.location || '-'}</p>
               </>
            )}
         </div>

         {/* 파티 소개 */}
         <div className="flex flex-col gap-2 flex-1">
            {isEditMode ? (
               <>
                  <label className="text-sm font-medium text-gray-700">
                     파티 소개
                     <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                     value={editedParty.description || ''}
                     onChange={e => setEditedParty({ ...editedParty, description: e.target.value })}
                     placeholder={currentParty.description}
                     className="flex-1 resize-none min-h-[100px]"
                  />
               </>
            ) : (
               <>
                  <label className="text-sm font-medium text-gray-700">파티 소개</label>
                  <p className="bg-secondary flex-1 min-h-[100px] px-4 py-2 rounded-md whitespace-pre-wrap">
                     {currentParty.description || '-'}
                  </p>
               </>
            )}
         </div>

         {/* 태그 */}
         {(currentParty.label1 || currentParty.label2 || currentParty.label3 || isEditMode) && (
            <div className="flex flex-col gap-2">
               {/* 편집모드 태그 */}
               {isEditMode ? (
                  <>
                     <label className="text-sm font-medium text-gray-700">
                        해시태그
                        <span className="text-red-500">*</span>
                     </label>
                     <Input
                        placeholder="태그 입력 후 Enter (최대 3개)"
                        value={tagInput}
                        disabled={!!editedParty.label3}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={e => {
                           if (e.key === 'Enter') {
                              handleAddTag();
                           }
                        }}
                     />
                  </>
               ) : (
                  <>
                     <label className="text-sm font-medium text-gray-700">해시태그</label>
                  </>
               )}

               {/* 태그 목록 */}
               <div className="flex gap-2 flex-wrap">
                  {editedParty.label1 && (
                     <Tag
                        label={`# ${editedParty.label1}`}
                        removable={isEditMode}
                        onRemove={() => handleRemoveTag(1)}
                     />
                  )}
                  {editedParty.label2 && (
                     <Tag
                        label={`# ${editedParty.label2}`}
                        removable={isEditMode}
                        onRemove={() => handleRemoveTag(2)}
                     />
                  )}
                  {editedParty.label3 && (
                     <Tag
                        label={`# ${editedParty.label3}`}
                        removable={isEditMode}
                        onRemove={() => handleRemoveTag(3)}
                     />
                  )}
               </div>
            </div>
         )}
      </div>
   );
   return (
      <TwoFunctionPopup
         dialogTrigger={trigger}
         title={currentParty.partyName}
         titleButton={
            !isEditMode && (
               <div className="flex gap-2">
                  <button
                     className="cursor-pointer"
                     onClick={e => {
                        e.stopPropagation();
                        if (!onToggleLike) return;
                        onToggleLike(currentParty.id);
                     }}
                  >
                     <Icon24 name={liked ? 'likefill' : 'likedef'} />
                  </button>
                  <div className="flex items-center gap-2">
                     <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${isFull ? 'bg-gray-200 text-gray-600' : 'bg-primary/10 text-primary'}`}
                     >
                        {isFull ? '마감' : '모집중'}
                     </span>
                  </div>
               </div>
            )
         }
         body={PopupBody}
         leftTitle={isEditMode ? '삭제' : isApplied ? '파티 철회' : '취소'}
         rightTitle={isEditMode ? '저장' : isApplied || isFull ? '확인' : '파티 신청'}
         leftCallback={isEditMode ? handleDeleteEdit : isApplied ? handleWithdraw : handleCancel}
         rightCallback={isEditMode ? handleSaveEdit : isApplied || isFull ? handleCancel : handleApply}
         className="w-150 h-[calc(100vh-40px)]"
         hideOverlay={true}
         position="top-left"
         closeOnLeft={!isEditMode}
         closeOnRight={!isEditMode}
         onOpenChange={open => {
            if (!open) {
               setIsEditMode(false);
               onClose?.();
            }
         }}
      />
   );
};
