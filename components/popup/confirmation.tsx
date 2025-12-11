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
import { Button } from "../ui/button";

/**
 * @typedef {object} ConfirmationPopupProps
 * @property {ReactNode} dialogTrigger - 팝업창을 열기 위한 트리거 컴포넌트입니다. (예: <Button>확인</Button>)
 * @property {string} title - 팝업창의 제목입니다.
 * @property {ReactNode} body - 팝업창의 본문 내용입니다. ReactNode 타입으로 다양한 컴포넌트를 전달할 수 있습니다.
 * @property {string} [cancelTitle='아니오'] - 취소 버튼의 텍스트입니다. (선택 사항, 기본값: '아니오')
 * @property {string} [confirmTitle='네'] - 확인 버튼의 텍스트입니다. (선택 사항, 기본값: '네')
 * @property {() => void} [cancelCallback] - 취소 버튼 클릭 시 실행될 콜백 함수입니다.
 * @property {() => void} [confirmCallback] - 확인 버튼 클릭 시 실행될 콜백 함수입니다.
 */

/**
 * 사용자에게 어떤 행동에 대한 확인을 받거나 취소를 결정하게 하는 공용 팝업 컴포넌트입니다.
 * 이 팝업은 DialogTrigger로 팝업을 열고, DialogFooter에 확인/취소 버튼을 포함합니다.
 *
 * @param {ConfirmationPopupProps} props - 팝업에 전달될 속성들.
 * @returns {React.ReactElement} Confirmation 팝업 컴포넌트.
 */

export const ConfirmationPopup = ({
  dialogTrigger,
  title,
  body,
  cancelTitle = "아니오",
  confirmTitle = "네",
  cancelCallback = () => {},
  confirmCallback = () => {},
}: {
  dialogTrigger: ReactNode; //팝업창 오픈 버튼이자 팝업창 오픈 전의 화면에 보여질 컴포넌트
  title: string; //팝업창 제목 (좌상단 가장 큰 글자)
  body: ReactNode; //팝업창 바디에 들어갈 컴포넌트
  cancelTitle?: string; //취소 버튼 이름
  confirmTitle?: string; //수락 버튼 이름
  cancelCallback?: () => void; //취소 동작 콜백 함수
  confirmCallback?: () => void; //수락 동작 콜백 함수
}): React.ReactElement => {
  return (
    <Dialog>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
      <DialogContent className="flex flex-col bg-white w-min-8xl p-[16px] gap-[16px]">
        <DialogHeader>
          <DialogTitle>
            <div>
              <h1 className="flex justify-start text-[20px] font-semibold">
                {title}
              </h1>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-center sm:justify-center">{body}</div>

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
