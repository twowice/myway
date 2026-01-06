import { RadioComponent } from "@/components/basic/radio";
import { PhotoEditable } from "@/components/photo/photo";
import {
  fetchMyProfile,
  updateMyGender,
  uploadMyProfileImage,
} from "@/lib/mypage/profile";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { panelstore } from "@/stores/panelstore";

export const MyProfileBody = () => {
  const { data: session, update } = useSession();
  const { openpanel } = panelstore();
  const [gender, setGender] = useState<string>("");
  const [initialGender, setInitialGender] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string>("");
  const [isSavingGender, setIsSavingGender] = useState(false);

  const uploadImage = async (file: File) => {
    try {
      const result = await uploadMyProfileImage(file, async (imageUrl) => {
        setProfileImage(imageUrl);
        await update({ user: { image: imageUrl } });
      });
      return result.status;
    } catch (error) {
      console.error("프로필 이미지 업로드 실패:", error);
      return 500;
    }
  };

  useEffect(() => {
    if (!session?.user?.id) return;

    let isMounted = true;
    const loadProfile = async () => {
      try {
        const data = await fetchMyProfile(
          session.user.id,
          session.user.image
        );
        if (!isMounted) return;
        setGender(data.gender);
        setInitialGender(data.gender);
        setProfileImage(data.imageUrl);
      } catch (error) {
        console.error("마이페이지 프로필 조회 실패:", error);
      }
    };

    void loadProfile();
    return () => {
      isMounted = false;
    };
  }, [session?.user?.id, session?.user?.image]);

  const handleImageChange = (_file: File, previewUrl: string) => {
    setProfileImage(previewUrl);
  };

  useEffect(() => {
    if (!session?.user?.id) return;
    if (openpanel === "mypage") return;
    if (!initialGender || gender === initialGender) return;
    if (isSavingGender) return;

    const saveGender = async () => {
      try {
        setIsSavingGender(true);
        await updateMyGender(gender);
        setInitialGender(gender);
      } catch (error) {
        console.error("성별 저장 실패:", error);
      } finally {
        setIsSavingGender(false);
      }
    };

    void saveGender();
  }, [gender, initialGender, isSavingGender, openpanel, session?.user?.id]);

  if (!session?.user?.id) {
    return (
      <div className="flex flex-col gap-3 text-[16px]">
        <p className="text-[20px]">내 프로필</p>
        <div className="rounded-md bg-primary-foreground p-4 text-sm text-foreground/70">
          좌측 하단에 위치한 로그인 완료하신 후에 이용하실 수 있습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 text-[16px]">
      <p className="text-[20px]">내 프로필</p>
      <div className="flex gap-2 flex-col">
        <p>프로필 사진</p>
        <PhotoEditable
          imageUrl={profileImage}
          uploadImage={uploadImage}
          onChange={handleImageChange}
        />
      </div>
      <div className="flex gap-2 flex-col">
        <p>성별</p>
        <RadioComponent
          name="gender"
          options={[
            { value: "male", label: "남" },
            { value: "female", label: "여" },
          ]}
          value={gender}
          onValueChange={setGender}
        />
      </div>
    </div>
  );
};
