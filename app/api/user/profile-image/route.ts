import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";

const MAX_IMAGE_SIZE_BYTES = 1024 * 1024;
const BUCKET_NAME = "profile-images";

const getPathFromPublicUrl = (url: string) => {
  const marker = `/storage/v1/object/public/${BUCKET_NAME}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return url.slice(index + marker.length);
};

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { message: "이미지를 선택해주세요." },
        { status: 400 }
      );
    }

    if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      return NextResponse.json(
        { message: "JPEG, PNG, GIF 이미지 파일만 업로드할 수 있습니다." },
        { status: 400 }
      );
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        { message: "이미지 용량이 너무 큽니다. (최대 1MB)" },
        { status: 413 }
      );
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("image_url")
      .eq("id", session.user.id)
      .maybeSingle();

    if (userError) {
      console.error("Profile image fetch error:", userError);
      return NextResponse.json(
        { message: "프로필 정보를 불러오지 못했어요." },
        { status: 500 }
      );
    }

    const extension =
      file.type === "image/png"
        ? "png"
        : file.type === "image/gif"
        ? "gif"
        : "jpg";

    const filePath = `${session.user.id}/${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Profile image upload error:", uploadError);
      return NextResponse.json(
        { message: "프로필 이미지 업로드에 실패했어요." },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    const imageUrl = publicUrlData?.publicUrl;
    if (!imageUrl) {
      return NextResponse.json(
        { message: "프로필 이미지 URL 생성에 실패했어요." },
        { status: 500 }
      );
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({ image_url: imageUrl })
      .eq("id", session.user.id);

    if (updateError) {
      console.error("Profile image update error:", updateError);
      return NextResponse.json(
        { message: "프로필 이미지 저장에 실패했어요." },
        { status: 500 }
      );
    }

    const oldPath = userData?.image_url
      ? getPathFromPublicUrl(userData.image_url)
      : null;

    if (oldPath) {
      const { error: removeError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([oldPath]);
      if (removeError) {
        console.error("Profile image remove error:", removeError);
      }
    }

    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error("Profile image API error:", error);
    return NextResponse.json(
      { message: "프로필 이미지 처리 중 오류가 발생했어요." },
      { status: 500 }
    );
  }
}
