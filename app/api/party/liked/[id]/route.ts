import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const partyId = Number(params.id);
    if (!partyId || partyId <= 0) {
      return NextResponse.json(
        { message: "파티 정보를 찾을 수 없어요." },
        { status: 400 }
      );
    }

    const { data: existingLike, error: fetchError } = await supabase
      .from("liked_parties")
      .select("id")
      .eq("party_id", partyId)
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (fetchError) {
      console.error("Party like fetch error:", fetchError);
      return NextResponse.json(
        { message: "좋아요 처리에 실패했어요." },
        { status: 500 }
      );
    }

    if (existingLike) {
      const { error: deleteError } = await supabase
        .from("liked_parties")
        .delete()
        .eq("id", existingLike.id);

      if (deleteError) {
        console.error("Party like delete error:", deleteError);
        return NextResponse.json(
          { message: "좋아요 처리에 실패했어요." },
          { status: 500 }
        );
      }

      return NextResponse.json({ liked: false });
    }

    const { error: insertError } = await supabase.from("liked_parties").insert({
      party_id: partyId,
      user_id: session.user.id,
    });

    if (insertError) {
      console.error("Party like insert error:", insertError);
      return NextResponse.json(
        { message: "좋아요 처리에 실패했어요." },
        { status: 500 }
      );
    }

    return NextResponse.json({ liked: true });
  } catch (error) {
    console.error("Party like API error:", error);
    return NextResponse.json(
      { message: "좋아요 처리 중 오류가 발생했어요." },
      { status: 500 }
    );
  }
}
