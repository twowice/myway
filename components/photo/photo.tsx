"use client";

import { cn } from "@/lib/utils";
import { ChangeEvent, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

/**
 * @component
 * @description
 * 사용자가 이미지 파일을 선택하고 미리 볼 수 있게 하며, 선택된 이미지를 외부 서비스로 업로드하는 기능을 제공하는 컨테이너 컴포넌트입니다.
 * 내부적으로 이미지 파일 선택 및 업로드 버튼을 담당하는 `PhotoInput` 컴포넌트와,
 * 업로드된 이미지들의 미리 보기를 표시하는 `Photo` 컴포넌트 목록을 포함합니다.
 * 이미지 목록은 가로 스크롤 가능한 형태로 표시되며, 각 `Photo` 및 `PhotoInput` 컴포넌트는 고정된 크기를 가집니다.
 *
 * @param {object} props - PhotoInputContainer 컴포넌트의 속성입니다.
 * @param {function(File): number} props.uploadImage -
 *   선택된 이미지 파일을 인수로 받아 업로드 처리를 수행하는 콜백 함수입니다.
 *   업로드 결과에 따라 HTTP 상태 코드를 반환해 handleUploadError에서 HTTP 상태 코드에 대응하는 에러 대처를 커스텀 가능합니다.
 *   (예: 200 - 성공, 400 - 실패 등).
 * @returns {React.ReactElement} `PhotoInput` 컴포넌트와 업로드된 이미지들의 미리 보기를 렌더링하는 React 요소입니다.
 */

export const PhotoInputContainer = ({
  uploadImage,
}: {
  uploadImage: (file: File) => number;
}): React.ReactElement => {
  const [images, setImages] = useState<string[] | null>(null);

  const PhotoInput = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert("파일 크기가 너무 큽니다 (최대 5MB).");
          return;
        }
        if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
          alert("JPEG, PNG, GIF 이미지 파일만 업로드할 수 있습니다.");
          return;
        }

        setImages((prev) => [URL.createObjectURL(file), ...(prev ?? [])]);

        //이미지 업로드를 위한 통신 부분으로 추후 통신 status 코드에 따른 구분이 가능하도록 number을 리턴 받습니다.
        //해당 부분은 추후 커스텀이 가능합니다.
        try {
          const responseStatus = await uploadImage(file);
          handleUploadError(responseStatus);
        } catch (error) {
          console.log("[PhotoInput] 에러가 발생했습니다:", error);
        }
      } else {
        alert("오류로 인해 이미지 파일 추가에 실패했습니다.");
        console.log("[PhotoInput Error] image file is not exist : ", file);
      }
    };

    const handleButtonClick = () => {
      fileInputRef.current?.click();
    };

    const handleUploadError = (code: number) => {
      switch (code) {
        case 200:
          return true;
        case 400:
          return Error("Bad Request");
        default:
          return Error("Unknown");
      }
    };

    return (
      <div className="flex flex-col w-[178.67px] h-full shrink-0">
        <Input
          id="picture"
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/jpeg, image/png, image/gif"
        />
        <Button
          className={"w-full h-full rounded-1 bg-primary-foreground text-4"}
          onClick={handleButtonClick}
          variant={"ghost"}
        >
          +
        </Button>
      </div>
    );
  };

  const Photo = ({ image }: { image: string }) => {
    return (
      <img
        className={cn(
          "w-[178.67px] h-full",
          "object-contain",
          "rounded-1",
          "bg-primary-foreground",
          "aspect-[178.67/112]"
        )}
        src={image}
      />
    );
  };

  return (
    <div className={cn("flex flex-row", "overflow-x-scroll", "h-28", "gap-2")}>
      <PhotoInput />
      {images !== null &&
        images?.map((image, idx) => <Photo key={idx} image={image}></Photo>)}
    </div>
  );
};
