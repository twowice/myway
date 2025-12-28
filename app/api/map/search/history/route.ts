import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "❌ Session error" }, { status: 401 });
    }

    const body = await request.json();
    const {
      departure_name,
      departure_latitude,
      departure_longitude,
      destination_name,
      destination_latitude,
      destination_longitude,
      total_time_seconds,
      total_fare,
      map_object_id,
      raw_response,
    } = body ?? {};

    if (
      !departure_name ||
      departure_latitude == null ||
      departure_longitude == null ||
      !destination_name ||
      destination_latitude == null ||
      destination_longitude == null ||
      !raw_response
    ) {
      return NextResponse.json(
        { message: "필수 값이 누락되었습니다." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("route_search_histories")
      .insert({
        user_id: session.user.id,
        search_mode: "public_transport",
        departure_name,
        departure_latitude,
        departure_longitude,
        destination_name,
        destination_latitude,
        destination_longitude,
        total_time_seconds,
        total_fare,
        map_object_id,
        raw_response,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Route search history insert error:", error);
      return NextResponse.json(
        { message: "검색 기록 저장 실패" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error: any) {
    console.error("Route search history API error:", error);
    return NextResponse.json(
      { message: "검색 기록 저장 중 오류 발생" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "❌ Session error" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") ?? 5);
    const offset = Number(searchParams.get("offset") ?? 0);

    const { data, error } = await supabase
      .from("route_search_histories")
      .select(
        `
        id,
        created_at,
        departure_name,
        departure_latitude,
        departure_longitude,
        destination_name,
        destination_latitude,
        destination_longitude,
        total_time_seconds,
        total_fare,
        map_object_id,
        raw_response
      `
      )
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Route search history fetch error:", error);
      return NextResponse.json(
        { message: "검색 기록 조회 실패" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: data ?? [] });
  } catch (error: any) {
    console.error("Route search history API error:", error);
    return NextResponse.json(
      { message: "검색 기록 조회 중 오류 발생" },
      { status: 500 }
    );
  }
}
