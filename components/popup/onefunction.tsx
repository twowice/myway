'use client';

import { ReactNode } from 'react';
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button/button';

/**
 * @typedef {object} OneFunctionPopupProps
 * @property {ReactNode} dialogTrigger - 팝업창을 열기 위한 트리거 컴포넌트입니다. (예: <Button>보기</Button>)
 * @property {string} title - 팝업창의 제목입니다.
 * @property {ReactNode} body - 팝업창의 본문 내용입니다. ReactNode 타입으로 다양한 컴포넌트를 전달할 수 있습니다.
 * @property {string} buttonTitle - 팝업 하단에 위치한 버튼의 텍스트입니다. (예: '확인', '닫기')
 * @property {() => void} [callback] - 하단 버튼 클릭 시 실행될 콜백 함수입니다. (선택 사항)
 */

/**
 * 하나의 버튼으로 특정 동작을 수행하거나 정보 확인 후 팝업을 닫는 공용 팝업 컴포넌트입니다.
 * 주로 알림, 정보 제공, 단일 선택 등의 상황에 사용됩니다.
 *
 * @param {OneFunctionPopupProps} props - 팝업에 전달될 속성들.
 * @returns {JSX.Element} OneFunction 팝업 컴포넌트.
 */
export const OneFunctionPopup = ({
   dialogTrigger,
   title,
   body,
   buttonTitle,
   callback = () => {},
}: {
   dialogTrigger: ReactNode; //팝업창 오픈 버튼이자 팝업창 오픈 전의 화면에 보여질 컴포넌트
   title: string; //팝업창 제목 (좌상단 가장 큰 글자)
   body: ReactNode; //팝업창 바디에 들어갈 컴포넌트
   buttonTitle: string; //하단 버튼에 들어갈 문자열
   callback?: () => void; //버튼 클릭시 기능 동작 콜백 함수
}) => {
   return (
      <Dialog>
         <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
         <DialogContent className="flex flex-col bg-white w-min-8xl p-[16px] gap-[16px]">
            <DialogHeader>
               <DialogTitle>
                  <div>
                     <h1 className="flex justify-start text-[20px] font-semibold">{title}</h1>
                  </div>
               </DialogTitle>
            </DialogHeader>
            <div className="flex justify-center sm:justify-center">{body}</div>

            <DialogFooter className="flex flex-row gap-x-10px ">
               <DialogClose asChild>
                  <Button className="flex-1 sm:flex-1 bg" type="button" onClick={callback}>
                     {buttonTitle}
                  </Button>
               </DialogClose>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};
