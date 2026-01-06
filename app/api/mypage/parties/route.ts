import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const [
      { data: ownedParties, error: ownedError },
      { data: appliedParties, error: appliedError },
    ] = await Promise.all([
      supabase.from("parties").select("id").eq("owner_id", session.user.id),
      supabase
        .from("party_applications")
        .select("party_id")
        .eq("user_id", session.user.id),
    ]);

    if (ownedError) {
      console.error("My parties fetch error:", ownedError);
    }
    if (appliedError) {
      console.error("My applied parties fetch error:", appliedError);
    }

    const partyIds = new Set<number>();
    (ownedParties ?? []).forEach((item) => {
      if (typeof item.id === "number") partyIds.add(item.id);
    });
    (appliedParties ?? []).forEach((item) => {
      if (typeof item.party_id === "number") partyIds.add(item.party_id);
    });

    if (partyIds.size === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const { data, error } = await supabase
      .from("parties")
      .select("*, events ( title, cat1 )")
      .in("id", Array.from(partyIds))
      .not("status", "in", "(disbanded,deleted)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("My parties list error:", error);
      return NextResponse.json(
        { message: "파티 목록 조회에 실패했어요." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: data ?? [] });
  } catch (error) {
    console.error("My parties API error:", error);
    return NextResponse.json(
      { message: "파티 목록 조회 중 오류가 발생했어요." },
      { status: 500 }
    );
  }
}
