'use client';

import { cn } from '@/lib/utils';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

/**
 * @component
 * @description
 * 사용자가 이미지 파일을 선택하고 볼 수 있게 하며, 선택된 이미지를 외부 서비스로 업로드하는 기능을 제공하는 올인원 컨테이너 컴포넌트입니다.
 * 내부적으로 이미지 파일 선택 및 업로드 버튼을 담당하는 `PhotoInput` 컴포넌트와,
 * 업로드된 이미지들을 표시하는 `Photo` 컴포넌트 목록을 포함합니다.
 * 이미지 목록은 가로 스크롤 가능한 형태로 표시되며, 각 `Photo` 및 `PhotoInput` 컴포넌트는 고정된 크기를 가집니다.
 *
 * @param {object} props - PhotoInputContainer 컴포넌트의 속성입니다.
 * @param {string[] | null} props.initImages - 해당 컴포넌트에 초기화할 이미지 url 목록입니다
 * @param {function(File): number} props.uploadImage -
 *   선택된 이미지 파일을 인수로 받아 업로드 처리를 수행하는 콜백 함수입니다.
 *   업로드 결과에 따라 HTTP 상태 코드를 반환해 handleUploadError에서 HTTP 상태 코드에 대응하는 에러 대처를 커스텀 가능합니다.
 *   (예: 200 - 성공, 400 - 실패 등).
 * @returns {React.ReactElement} `PhotoInput` 컴포넌트와 업로드된 이미지들의 미리 보기를 렌더링하는 React 요소입니다.
 */

export const PhotoInputContainer = ({
   initImages = null,
   uploadImage,
   autoScroll = false,
}: {
   initImages?: string[] | null;
   uploadImage: (file: File) => number;
   autoScroll?: boolean;
}): React.ReactElement => {
   const [images, setImages] = useState<string[] | null>(initImages);

   const PhotoInput = () => {
      const fileInputRef = useRef<HTMLInputElement>(null);
      const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
         const file = event.target.files?.[0];
         if (file) {
            if (file.size > 5 * 1024 * 1024) {
               alert('파일 크기가 너무 큽니다 (최대 5MB).');
               return;
            }
            if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
               alert('JPEG, PNG, GIF 이미지 파일만 업로드할 수 있습니다.');
               return;
            }

            //화면에 이미지를 보이기 위해서 작동
            setImages(prev => [URL.createObjectURL(file), ...(prev ?? [])]);

            //이미지 업로드를 위한 통신 부분으로 추후 통신 status 코드에 따른 구분이 가능하도록 number을 리턴 받습니다.
            //해당 부분은 추후 커스텀이 가능합니다.
            try {
               const responseStatus = await uploadImage(file);
               handleUploadError(responseStatus);
            } catch (error) {
               console.log('[PhotoInput] 에러가 발생했습니다:', error);
            }
         } else {
            alert('오류로 인해 이미지 파일 추가에 실패했습니다.');
            console.error('[PhotoInput Error] image file is not exist : ', file);
         }
      };

      const handleButtonClick = () => {
         fileInputRef.current?.click();
      };

      /**
       *
       * @param {number} code uploadeImage 함수에서 받은 HTTP통신 상태 코드
       * @returns {boolean} 정상 통신일 경우 true를 반환하도록 기본 설계가 되어 있습니다 -> 추후 커스텀 가능
       */
      const handleUploadError = (code: number) => {
         switch (code) {
            case 200:
               return true;
            case 400:
               throw Error('Bad Request');
            default:
               throw Error('Unknown');
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
               className={'w-full h-full rounded-1 bg-primary-foreground text-4'}
               onClick={handleButtonClick}
               variant={'ghost'}
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
               'w-[178.67px] h-full',
               'object-contain',
               'rounded-1',
               'bg-primary-foreground',
               'aspect-[178.67/112]',
            )}
            src={image}
         />
      );
   };

   return (
      <div
         className={cn(
            'flex flex-row',
            'w-min-100',
            autoScroll ? 'overflow-x-auto' : 'overflow-x-scroll',
            'h-28',
            'gap-2',
            'justify-start',
         )}
      >
         <PhotoInput />
         {images !== null && images?.map((image, idx) => <Photo key={idx} image={image}></Photo>)}
      </div>
   );
};

/**
 * @component
 * @description
 * 기본 이미지를 보여주고, 클릭 시 새 이미지를 선택/업로드할 수 있는 단일 이미지 편집 컴포넌트입니다.
 * 내부에서 미리보기 상태를 관리하며, 업로드는 외부 콜백으로 위임합니다.
 *
 * @param {object} props - PhotoEditable 컴포넌트의 속성입니다.
 * @param {string} [props.imageUrl] - 초기 표시할 이미지 URL입니다.
 * @param {(file: File) => number | Promise<number>} [props.uploadImage] -
 *   선택된 이미지 파일을 업로드하는 콜백 함수입니다.
 *   반환값(HTTP 상태 코드)을 기반으로 내부 에러 처리를 수행합니다.
 * @param {(file: File, previewUrl: string) => void} [props.onChange] -
 *   파일 선택 직후 호출되는 콜백입니다. 미리보기 URL을 함께 제공합니다.
 * @param {string} [props.className] - 최상위 컨테이너에 적용할 클래스명입니다.
 * @returns {React.ReactElement} 클릭 가능한 이미지 편집 UI를 렌더링합니다.
 */
export const PhotoEditable = ({
   imageUrl = '',
   uploadImage,
   onChange,
   className,
}: {
   imageUrl?: string;
   uploadImage?: (file: File) => number | Promise<number>;
   onChange?: (file: File, previewUrl: string) => void;
   className?: string;
}): React.ReactElement => {
   const [previewUrl, setPreviewUrl] = useState(imageUrl);
   const fileInputRef = useRef<HTMLInputElement>(null);

   useEffect(() => {
      setPreviewUrl(imageUrl);
   }, [imageUrl]);

   const handleUploadError = (code: number) => {
      switch (code) {
         case 200:
            return true;
         case 400:
            throw Error('Bad Request');
         default:
            throw Error('Unknown');
      }
   };

   const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
         return;
      }

      if (file.size > 5 * 1024 * 1024) {
         alert('파일 크기가 너무 큽니다 (최대 5MB).');
         return;
      }
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
         alert('JPEG, PNG, GIF 이미지 파일만 업로드할 수 있습니다.');
         return;
      }

      const nextPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(nextPreviewUrl);
      onChange?.(file, nextPreviewUrl);

      if (!uploadImage) return;

      try {
         const responseStatus = await uploadImage(file);
         handleUploadError(responseStatus);
      } catch (error) {
         console.log('[PhotoEditable] 에러가 발생했습니다:', error);
      }
   };

   const handleClick = () => {
      fileInputRef.current?.click();
   };

   return (
      <div className={cn('w-[178.67px] h-[112px]', className)}>
         <Input
            id="photo-editable-input"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/jpeg, image/png, image/gif"
         />
         <button
            type="button"
            onClick={handleClick}
            className="group relative w-full h-full rounded-1 overflow-hidden"
         >
            {previewUrl ? (
               <>
                  <img
                     className={cn('w-full h-full', 'object-contain', 'bg-primary-foreground')}
                     src={previewUrl}
                     alt="selected"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100">
                     이미지 변경
                  </div>
               </>
            ) : (
               <div className="w-full h-full rounded-1 bg-primary-foreground flex items-center justify-center text-sm text-foreground/60">
                  이미지 선택
               </div>
            )}
         </button>
      </div>
   );
};
