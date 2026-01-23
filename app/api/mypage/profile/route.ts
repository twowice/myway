import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId || userId !== session.user.id) {
      return NextResponse.json(
        { message: "접근 권한이 없습니다." },
        { status: 403 }
      );
    }

    const { data, error } = await supabase
      .from("users")
      .select("gender, image_url")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Profile fetch error:", error);
      return NextResponse.json(
        { message: "프로필 조회에 실패했어요." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      gender: data?.gender ?? "",
      imageUrl: data?.image_url ?? "",
    });
  } catch (error) {
    console.error("Profile fetch API error:", error);
    return NextResponse.json(
      { message: "프로필 조회 중 오류가 발생했어요." },
      { status: 500 }
    );
  }
}
