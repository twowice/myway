import { PhotoEditable, PhotoInputContainer } from "@/components/photo/photo";

export const MyProfileBody = () => {
  const uploadImage = (file: File) => {
    return 202;
  };

  return (
    <div className="flex flex-col gap-3 text-[16px]">
      <p className="text-[20px]">내 프로필</p>
      <div>
        <p>프로필 사진</p>
        <PhotoEditable />
      </div>
    </div>
  );
};
