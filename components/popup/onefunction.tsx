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
import { cn } from '@/lib/utils';

/**
 * @typedef {object} OneFunctionPopupProps
 * @property {string} className - 팝업의 전체에 적용하고 싶은 style을 받는 변수
 * @property {ReactNode} dialogTrigger - 팝업창을 열기 위한 트리거 컴포넌트입니다. (예: <Button>보기</Button>)
 * @property {string} title - 팝업창의 제목입니다.
 * @property {ReactNode} body - 팝업창의 본문 내용입니다. ReactNode 타입으로 다양한 컴포넌트를 전달할 수 있습니다.
 * @property {string} buttonTitle - 팝업 하단에 위치한 버튼의 텍스트입니다. (예: '확인', '닫기')
 * @property {() => void} [callback] - 하단 버튼 클릭 시 실행될 콜백 함수입니다. (선택 사항)
 */

/**
 * 하나의 버튼으로 특정 동작을 수행하거나 정보 확인 후 팝업을 닫는 공용 팝업 컴포넌트입니다.
 * 주로 알림, 정보 제공, 단일 선택 등의 상황에 사용됩니다.
 * className으로 적용하고 싶은 sytle을 전체 팝업 박스에 지정하는 것이 가능합니다.
 * 이 경우 기본 Dialog에 적용된 max-w-[calc(100%-2rem)] sm:max-w-lg 값이 삭제되어 반응형 구현이 사라지게 됩니다.
 * className으로 팝업창의 전체 크기를 조절하시고 싶으시면 lg:max-w-xxx, sm:max-w-xxx와 같은 형태로 반응형 크기 지정을 하셔야합니다.
 *
 * @param {OneFunctionPopupProps} props - 팝업에 전달될 속성들.
 * @returns {React.ReactElement} OneFunction 팝업 컴포넌트.
 */
export const OneFunctionPopup = ({
   className,
   dialogTrigger,
   title,
   body,
   buttonTitle,
   callback = () => {},
   width = 'max-w-[800px]',
   open,
   onOpenChange,
}: {
   className?: string;
   dialogTrigger: ReactNode; //팝업창 오픈 버튼이자 팝업창 오픈 전의 화면에 보여질 컴포넌트
   title: string; //팝업창 제목 (좌상단 가장 큰 글자)
   body: ReactNode; //팝업창 바디에 들어갈 컴포넌트
   buttonTitle: string; //하단 버튼에 들어갈 문자열
   callback?: () => void; //버튼 클릭시 기능 동작 콜백 함수
   width?: string;
   open?: boolean;
   onOpenChange?: (open: boolean) => void;
}): React.ReactElement => {
   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
         <DialogContent
            className={cn(
               'flex flex-col bg-white max-w-none p-4 gap-4',
               className ? 'lg:max-w-none sm:max-w-none max-w-none ' + className : '',
               width,
            )}
         >
            <DialogHeader>
               <DialogTitle>
                  <div>
                     <h1 className="flex justify-start text-[20px] font-semibold">{title}</h1>
                  </div>
               </DialogTitle>
            </DialogHeader>
            {body}
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
