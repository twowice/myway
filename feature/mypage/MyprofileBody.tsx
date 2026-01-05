import { RadioComponent } from "@/components/basic/radio";
import { PhotoEditable } from "@/components/photo/photo";
import { supabase } from "@/lib/clientSupabase";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const MyProfileBody = () => {
  const { data: session } = useSession();
  const [gender, setGender] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string>("");

  const uploadImage = (file: File) => {
    return 202;
  };

  useEffect(() => {
    if (!session?.user?.id) return;

    let isMounted = true;
    const loadProfile = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("gender, image_url")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error) {
        console.error("마이페이지 프로필 조회 실패:", error);
        return;
      }

      if (!isMounted) return;
      setGender(data?.gender ?? "");
      setProfileImage(data?.image_url ?? session.user.image ?? "");
    };

    void loadProfile();
    return () => {
      isMounted = false;
    };
  }, [session?.user?.id, session?.user?.image]);

  const handleImageChange = (_file: File, previewUrl: string) => {
    setProfileImage(previewUrl);
  };

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
