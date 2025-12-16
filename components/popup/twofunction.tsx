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
 * @property {string} [leftTitle='아니오'] - 왼쪽 버튼의 텍스트입니다. (선택 사항, 기본값: '아니오')
 * @property {string} [rightTitle='네'] - 오른쪽 버튼의 텍스트입니다. (선택 사항, 기본값: '네')
 * @property {() => void} [leftCallback] - 왼쪽 버튼 클릭 시 실행될 콜백 함수입니다.
 * @property {() => void} [rightCallback] - 오른쪽 버튼 클릭 시 실행될 콜백 함수입니다.
 */

/**
 * 사용자에게 어떤 행동에 대해서 두 가지 기능 중 하나를 결정하게 하는 공용 팝업 컴포넌트입니다.
 * 이 팝업은 DialogTrigger로 팝업을 열고, DialogFooter에 두가지의 버튼을 포함하지만, 두 버튼의 색상이 동일합니다.
 * 기본 동작은 ConfirmationPopup과 동일합니다. 다른 점은 DialogFooter의 색상 뿐입니다.
 * className으로 적용하고 싶은 sytle을 전체 팝업 박스에 지정하는 것이 가능합니다.
 * 이 경우 기본 Dialog에 적용된 max-w-[calc(100%-2rem)] sm:max-w-lg 값이 삭제되어 반응형 구현이 사라지게 됩니다.
 * className으로 팝업창의 전체 크기를 조절하시고 싶으시면 lg:max-w-xxx, sm:max-w-xxx와 같은 형태로 반응형 크기 지정을 하셔야합니다.
 * @param {ConfirmationPopupProps} props - 팝업에 전달될 속성들.
 * @returns {React.ReactElement} Confirmation 팝업 컴포넌트.
 */

export const TwoFunctionPopup = ({
  className,
  dialogTrigger,
  title,
  body,
  leftTitle = "아니오",
  rightTitle = "네",
  leftCallback = () => {},
  rightCallback = () => {},
}: {
  className?: string;
  dialogTrigger: ReactNode; //팝업창 오픈 버튼이자 팝업창 오픈 전의 화면에 보여질 컴포넌트
  title: string; //팝업창 제목 (좌상단 가장 큰 글자)
  body: ReactNode; //팝업창 바디에 들어갈 컴포넌트
  leftTitle?: string; //기능1 버튼 이름
  rightTitle?: string; //기능2 버튼 이름
  leftCallback?: () => void; //기능1 동작 콜백 함수
  rightCallback?: () => void; //기능2 동작 콜백 함수
}): React.ReactElement => {
  return (
    <Dialog>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
      <DialogContent
        className={cn(
          "flex flex-col bg-white max-w-none p-4 gap-4",
          className ? "lg:max-w-none sm:max-w-none max-w-none " + className : ""
        )}
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
              className="flex-1 sm:flex-1 bg"
              type="button"
              onClick={leftCallback}
            >
              {leftTitle}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className="flex-1 sm:flex-1"
              type="button"
              onClick={rightCallback}
            >
              {rightTitle}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
