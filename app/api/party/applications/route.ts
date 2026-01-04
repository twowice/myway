import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const body = (await request.json().catch(() => ({}))) as {
      partyId?: string | number;
    };
    const partyId =
      typeof body.partyId === "string" ? parseInt(body.partyId) : body.partyId;

    if (!partyId || partyId <= 0) {
      return NextResponse.json(
        { message: "파티 정보를 찾을 수 없어요." },
        { status: 400 }
      );
    }

    const { data: party, error: partyError } = await supabase
      .from("parties")
      .select("id, owner_id, status, current_members, max_members")
      .eq("id", partyId)
      .single();

    if (partyError || !party) {
      return NextResponse.json(
        { message: "파티 정보를 찾을 수 없어요." },
        { status: 404 }
      );
    }

    if (party.owner_id === session.user.id) {
      return NextResponse.json(
        { message: "파티 생성자는 신청할 수 없어요." },
        { status: 403 }
      );
    }

    if (party.status !== "open") {
      return NextResponse.json(
        { message: "모집중인 파티만 신청할 수 있어요." },
        { status: 400 }
      );
    }

    const currentMembers = party.current_members ?? 0;
    if (currentMembers >= party.max_members) {
      return NextResponse.json(
        { message: "이미 마감된 파티에요." },
        { status: 400 }
      );
    }

    const { data: existingApplication } = await supabase
      .from("party_applications")
      .select("id")
      .eq("party_id", partyId)
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (existingApplication) {
      return NextResponse.json(
        { message: "이미 신청한 파티에요." },
        { status: 409 }
      );
    }

    const { error: insertError } = await supabase
      .from("party_applications")
      .insert({
        party_id: partyId,
        user_id: session.user.id,
        status: "pending",
      });

    if (insertError) {
      console.error("Party apply error:", insertError);
      return NextResponse.json(
        { message: "파티 신청에 실패했어요." },
        { status: 500 }
      );
    }

    const { error: updateError } = await supabase
      .from("parties")
      .update({ current_members: currentMembers + 1 })
      .eq("id", partyId);

    if (updateError) {
      console.error("Party member update error:", updateError);
      return NextResponse.json(
        { message: "파티 신청에 실패했어요." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Party apply API error:", error);
    return NextResponse.json(
      { message: "파티 신청 중 오류가 발생했어요." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const partyId = Number(searchParams.get("partyId"));

    if (!partyId || partyId <= 0) {
      return NextResponse.json(
        { message: "파티 정보를 찾을 수 없어요." },
        { status: 400 }
      );
    }

    const { data: party, error: partyError } = await supabase
      .from("parties")
      .select("id, current_members")
      .eq("id", partyId)
      .single();

    if (partyError || !party) {
      return NextResponse.json(
        { message: "파티 정보를 찾을 수 없어요." },
        { status: 404 }
      );
    }

    const { data: existingApplication, error: applicationError } =
      await supabase
        .from("party_applications")
        .select("id")
        .eq("party_id", partyId)
        .eq("user_id", session.user.id)
        .maybeSingle();

    if (applicationError) {
      console.error("Party apply fetch error:", applicationError);
      return NextResponse.json(
        { message: "파티 철회에 실패했어요." },
        { status: 500 }
      );
    }

    if (!existingApplication) {
      return NextResponse.json(
        { message: "신청 내역이 없어요." },
        { status: 404 }
      );
    }

    const { error: deleteError } = await supabase
      .from("party_applications")
      .delete()
      .eq("id", existingApplication.id);

    if (deleteError) {
      console.error("Party withdraw error:", deleteError);
      return NextResponse.json(
        { message: "파티 철회에 실패했어요." },
        { status: 500 }
      );
    }

    const nextMembers = Math.max((party.current_members ?? 1) - 1, 0);
    const { error: updateError } = await supabase
      .from("parties")
      .update({ current_members: nextMembers })
      .eq("id", partyId);

    if (updateError) {
      console.error("Party member update error:", updateError);
      return NextResponse.json(
        { message: "파티 철회에 실패했어요." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Party withdraw API error:", error);
    return NextResponse.json(
      { message: "파티 철회 중 오류가 발생했어요." },
      { status: 500 }
    );
  }
}

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
    const partyId = Number(searchParams.get("partyId"));

    if (!partyId || partyId <= 0) {
      return NextResponse.json(
        { message: "파티 정보를 찾을 수 없어요." },
        { status: 400 }
      );
    }

    const { data: existingApplication, error } = await supabase
      .from("party_applications")
      .select("id")
      .eq("party_id", partyId)
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (error) {
      console.error("Party application check error:", error);
      return NextResponse.json(
        { message: "신청 상태 조회에 실패했어요." },
        { status: 500 }
      );
    }

    return NextResponse.json({ applied: Boolean(existingApplication) });
  } catch (error) {
    console.error("Party application check API error:", error);
    return NextResponse.json(
      { message: "신청 상태 조회 중 오류가 발생했어요." },
      { status: 500 }
    );
  }
}
