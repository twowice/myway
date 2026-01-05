"use client";

import { ReactNode } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button/button";
import { cn } from "@/lib/utils";

/**
 * @typedef {object} ConfirmationPopupProps
 * @property {string} className - 팝업의 전체에 적용하고 싶은 style을 받는 변수
 * @property {ReactNode} dialogTrigger - 팝업창을 열기 위한 트리거 컴포넌트입니다. (예: <Button>확인</Button>)
 * @property {string} title - 팝업창의 제목입니다.
 * @property {ReactNode} body - 팝업창의 본문 내용입니다. ReactNode 타입으로 다양한 컴포넌트를 전달할 수 있습니다.
 * @property {string} [cancelTitle='아니오'] - 취소 버튼의 텍스트입니다. (선택 사항, 기본값: '아니오')
 * @property {string} [confirmTitle='네'] - 확인 버튼의 텍스트입니다. (선택 사항, 기본값: '네')
 * @property {() => void} [cancelCallback] - 취소 버튼 클릭 시 실행될 콜백 함수입니다.
 * @property {() => void} [confirmCallback] - 확인 버튼 클릭 시 실행될 콜백 함수입니다.
 * @property {boolean} [preventOutsideClose] - 바깥 클릭 시 닫힘 방지 여부
 * @property {boolean} [open] - 팝업 열림 상태 제어
 * @property {(open: boolean) => void} [onOpenChange] - 열림 상태 변경 콜백
 */

/**
 * 사용자에게 어떤 행동에 대한 확인을 받거나 취소를 결정하게 하는 공용 팝업 컴포넌트입니다.
 * 이 팝업은 DialogTrigger로 팝업을 열고, DialogFooter에 확인/취소 버튼을 포함합니다.
 * className으로 적용하고 싶은 sytle을 전체 팝업 박스에 지정하는 것이 가능합니다.
 * 이 경우 기본 Dialog에 적용된 max-w-[calc(100%-2rem)] sm:max-w-lg 값이 삭제되어 반응형 구현이 사라지게 됩니다.
 * className으로 팝업창의 전체 크기를 조절하시고 싶으시면 lg:max-w-xxx, sm:max-w-xxx와 같은 형태로 반응형 크기 지정을 하셔야합니다.
 *
 * @param {ConfirmationPopupProps} props - 팝업에 전달될 속성들.
 * @returns {React.ReactElement} Confirmation 팝업 컴포넌트.
 */

export const ConfirmationPopup = ({
  className,
  dialogTrigger,
  title,
  body,
  cancelTitle = "아니오",
  confirmTitle = "네",
  cancelCallback = () => {},
  confirmCallback = () => {},
  preventOutsideClose = false,
  open,
  onOpenChange,
}: {
  className?: string;
  dialogTrigger: ReactNode; //팝업창 오픈 버튼이자 팝업창 오픈 전의 화면에 보여질 컴포넌트
  title: string; //팝업창 제목 (좌상단 가장 큰 글자)
  body: ReactNode; //팝업창 바디에 들어갈 컴포넌트
  cancelTitle?: string; //취소 버튼 이름
  confirmTitle?: string; //수락 버튼 이름
  cancelCallback?: () => void; //취소 동작 콜백 함수
  confirmCallback?: () => void; //수락 동작 콜백 함수
  preventOutsideClose?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}): React.ReactElement => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
      <DialogContent
        className={cn(
          "flex flex-col bg-white max-w-none p-4 gap-4",
          className ? "lg:max-w-none sm:max-w-none max-w-none " + className : ""
        )}
        onInteractOutside={
          preventOutsideClose ? (event) => event.preventDefault() : undefined
        }
        onPointerDownOutside={
          preventOutsideClose ? (event) => event.preventDefault() : undefined
        }
      >
        <DialogHeader>
          <DialogTitle>
            <div>
              <h1 className="flex justify-start text-[20px] font-semibold">
                {title}
              </h1>
            </div>
          </DialogTitle>
        </DialogHeader>
        {body}
        <DialogFooter className="flex flex-row gap-x-10px ">
          <DialogClose asChild>
            <Button
              className="flex-1 sm:flex-1"
              variant={"secondary"}
              type="button"
              onClick={cancelCallback}
            >
              {cancelTitle}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className="flex-1 sm:flex-1"
              type="button"
              onClick={confirmCallback}
            >
              {confirmTitle}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
