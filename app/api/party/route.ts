import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";

type CreatePartyPayload = {
  partyName?: string;
  description?: string;
  max_members?: string | number;
  label1?: string;
  label2?: string;
  label3?: string;
  eventId?: number;
  date?: string;
  time?: string;
  location?: string;
  locationLatitude?: number;
  locationLongitude?: number;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") ?? 12);
    const offset = Number(searchParams.get("offset") ?? 0);
    const eventId = Number(searchParams.get("eventId"));

    let query = supabase.from("parties").select("*", { count: "exact" });

    if (!Number.isNaN(eventId) && eventId > 0) {
      query = query.eq("event_id", eventId);
    }

    if (Number.isInteger(limit) && limit > 0) {
      const safeOffset = Number.isInteger(offset) && offset >= 0 ? offset : 0;
      query = query.range(safeOffset, safeOffset + limit - 1);
    }

    const { data, error, count } = await query;
    if (error) {
      console.error("Party fetch error:", error);
      return NextResponse.json(
        { message: "파티 조회에 실패했어요." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      count: data.length,
      data,
      pagination: {
        limit,
        offset,
        total: count ?? 0,
        hasMore: offset + limit < (count ?? 0),
      },
    });
  } catch (error) {
    console.error("Party fetch API error:", error);
    return NextResponse.json(
      { message: "파티 조회 중 오류가 발생했어요." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const body = (await request.json().catch(() => ({}))) as CreatePartyPayload;

    const partyName = body.partyName?.trim();
    const description = body.description?.trim();
    const eventId = body.eventId;
    const maxMembers =
      typeof body.max_members === "string"
        ? parseInt(body.max_members)
        : body.max_members;
    const date = body.date;
    const time = body.time;
    const locationName = body.location?.trim();

    if (!partyName) {
      return NextResponse.json(
        { message: "파티명을 입력해주세요." },
        { status: 400 }
      );
    }
    if (!eventId || eventId <= 0) {
      return NextResponse.json(
        { message: "이벤트명을 입력해주세요." },
        { status: 400 }
      );
    }
    if (!maxMembers || maxMembers < 1) {
      return NextResponse.json(
        { message: "최대 인원을 입력해주세요." },
        { status: 400 }
      );
    }
    if (!description) {
      return NextResponse.json(
        { message: "파티 소개를 입력해주세요." },
        { status: 400 }
      );
    }
    if (!locationName) {
      return NextResponse.json(
        { message: "장소를 입력해주세요." },
        { status: 400 }
      );
    }
    if (!date || !time) {
      return NextResponse.json(
        { message: "날짜와 시간을 입력해주세요." },
        { status: 400 }
      );
    }

    const tags = [body.label1, body.label2, body.label3].filter(
      (tag): tag is string => Boolean(tag?.trim())
    );
    const gatheringDate = `${date}T${time}:00`;

    const { data, error } = await supabase
      .from("parties")
      .insert({
        event_id: eventId,
        owner_id: session.user.id,
        name: partyName,
        description,
        max_members: maxMembers,
        current_members: 1,
        tags,
        status: "open",
        gathering_date: gatheringDate,
        location_name: locationName,
        location_latitude:
          typeof body.locationLatitude === "number"
            ? body.locationLatitude
            : null,
        location_longitude:
          typeof body.locationLongitude === "number"
            ? body.locationLongitude
            : null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Party create error:", error);
      return NextResponse.json(
        { message: "파티 생성에 실패했어요." },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: data.id });
  } catch (error) {
    console.error("Party create API error:", error);
    return NextResponse.json(
      { message: "파티 생성 중 오류가 발생했어요." },
      { status: 500 }
    );
  }
}
