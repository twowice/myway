import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";

type PartyReportPayload = {
  partyId?: string | number;
  reportCategory?: string;
  reportContent?: string;
  reportDate?: string;
  addOpinion?: string;
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

    const body = (await request.json().catch(() => ({}))) as PartyReportPayload;
    const partyId =
      typeof body.partyId === "string" ? parseInt(body.partyId) : body.partyId;
    const reportCategory = body.reportCategory?.trim();
    const reportContent = body.reportContent?.trim();
    const reportDate = body.reportDate;
    const addOpinion = body.addOpinion?.trim();

    if (!partyId || partyId <= 0) {
      return NextResponse.json(
        { message: "파티 정보를 찾을 수 없어요." },
        { status: 400 }
      );
    }
    if (!reportCategory) {
      return NextResponse.json(
        { message: "카테고리를 선택해주세요." },
        { status: 400 }
      );
    }
    if (!reportContent) {
      return NextResponse.json(
        { message: "신고 내용을 입력해주세요." },
        { status: 400 }
      );
    }
    if (!reportDate) {
      return NextResponse.json(
        { message: "발생 일시를 입력해주세요." },
        { status: 400 }
      );
    }

    const { data: party, error: partyError } = await supabase
      .from("parties")
      .select("id, name, owner_id, status")
      .eq("id", partyId)
      .single();

    if (partyError || !party || !party.owner_id) {
      return NextResponse.json(
        { message: "파티 정보를 찾을 수 없어요." },
        { status: 404 }
      );
    }

    if (party.status === "deleted" || party.status === "disbanded") {
      return NextResponse.json(
        { message: "신고할 수 없는 파티입니다." },
        { status: 400 }
      );
    }

    const { data: ownerData } = await supabase
      .from("users")
      .select("name")
      .eq("id", party.owner_id)
      .maybeSingle();

    const { data: reporterData } = await supabase
      .from("users")
      .select("name")
      .eq("id", session.user.id)
      .maybeSingle();

    const partyChairmanName = ownerData?.name?.trim() || "알 수 없음";
    const reporterName =
      (session.user.name?.trim() || reporterData?.name?.trim()) ?? "알 수 없음";

    const { error: insertError } = await supabase
      .from("party_reports")
      .insert({
        party_id: partyId,
        party_name: party.name ?? "",
        party_chairman_id: party.owner_id,
        party_chairman_name: partyChairmanName,
        reporter_id: session.user.id,
        reporter_name: reporterName,
        report_category: reportCategory,
        report_content: reportContent,
        report_date: new Date(reportDate),
        add_opinion: addOpinion ?? null,
      });

    if (insertError) {
      console.error("Party report insert error:", insertError);
      return NextResponse.json(
        { message: "파티 신고에 실패했어요." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Party report API error:", error);
    return NextResponse.json(
      { message: "파티 신고 중 오류가 발생했어요." },
      { status: 500 }
    );
  }
}
