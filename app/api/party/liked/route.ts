import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("liked_parties")
      .select("party_id")
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Liked parties fetch error:", error);
      return NextResponse.json(
        { message: "좋아요 목록 조회에 실패했어요." },
        { status: 500 }
      );
    }

    const partyIds = (data ?? [])
      .map((item) => item.party_id)
      .filter((id): id is number => typeof id === "number");

    return NextResponse.json({ partyIds });
  } catch (error) {
    console.error("Liked parties API error:", error);
    return NextResponse.json(
      { message: "좋아요 목록 조회 중 오류가 발생했어요." },
      { status: 500 }
    );
  }
}
