import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

type GenderPayload = {
  gender?: string;
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

    const body = (await request.json().catch(() => ({}))) as GenderPayload;
    const gender = body.gender?.trim();

    if (!gender || !["male", "female"].includes(gender)) {
      return NextResponse.json(
        { message: "성별 정보를 확인해주세요." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("users")
      .update({ gender })
      .eq("id", session.user.id);

    if (error) {
      console.error("Gender update error:", error);
      return NextResponse.json(
        { message: "성별 저장에 실패했어요." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gender update API error:", error);
    return NextResponse.json(
      { message: "성별 저장 중 오류가 발생했어요." },
      { status: 500 }
    );
  }
}
