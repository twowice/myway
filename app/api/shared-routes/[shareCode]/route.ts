import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const getOdsayPaths = (rawResponse: unknown) => {
  const paths = (rawResponse as any)?.result?.path;
  return Array.isArray(paths) ? paths : null;
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ shareCode: string }> }
) {
  try {
    const { shareCode } = await params;

    if (!shareCode) {
      return NextResponse.json(
        { message: "공유 코드가 필요합니다." },
        { status: 400 }
      );
    }

    const { data: shared, error: sharedError } = await supabase
      .from("shared_routes")
      .select("share_code, shared_path_index, search_history_id")
      .eq("share_code", shareCode)
      .maybeSingle();

    if (sharedError) {
      console.error("Shared route fetch error:", sharedError);
      return NextResponse.json(
        { message: "공유 경로 조회 실패" },
        { status: 500 }
      );
    }

    if (!shared) {
      return NextResponse.json(
        { message: "공유 경로를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const { data: history, error: historyError } = await supabase
      .from("route_search_histories")
      .select(
        `
        id,
        search_mode,
        created_at,
        departure_name,
        departure_latitude,
        departure_longitude,
        departure_address,
        departure_road_address,
        departure_category,
        departure_telephone,
        departure_link,
        destination_name,
        destination_latitude,
        destination_longitude,
        destination_address,
        destination_road_address,
        destination_category,
        destination_telephone,
        destination_link,
        total_time_seconds,
        total_fare,
        map_object_id,
        raw_response
      `
      )
      .eq("id", shared.search_history_id)
      .maybeSingle();

    if (historyError) {
      console.error("Route search history fetch error:", historyError);
      return NextResponse.json(
        { message: "검색 기록 조회 실패" },
        { status: 500 }
      );
    }

    if (!history) {
      return NextResponse.json(
        { message: "검색 기록을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const paths = getOdsayPaths(history.raw_response);
    const sharedPath =
      paths && shared.shared_path_index < paths.length
        ? paths[shared.shared_path_index]
        : null;

    if (!sharedPath) {
      return NextResponse.json(
        { message: "공유 경로 데이터가 유효하지 않습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      shareCode: shared.share_code,
      sharedPathIndex: shared.shared_path_index,
      searchMode: history.search_mode,
      createdAt: history.created_at,
      departure: {
        name: history.departure_name,
        latitude: history.departure_latitude,
        longitude: history.departure_longitude,
        address: history.departure_address,
        roadAddress: history.departure_road_address,
        category: history.departure_category,
        telephone: history.departure_telephone,
        link: history.departure_link,
      },
      destination: {
        name: history.destination_name,
        latitude: history.destination_latitude,
        longitude: history.destination_longitude,
        address: history.destination_address,
        roadAddress: history.destination_road_address,
        category: history.destination_category,
        telephone: history.destination_telephone,
        link: history.destination_link,
      },
      totalTimeSeconds: history.total_time_seconds,
      totalFare: history.total_fare,
      mapObjectId: history.map_object_id,
      rawResponse: history.raw_response,
      sharedPath,
    });
  } catch (error: any) {
    console.error("Shared route fetch API error:", error);
    return NextResponse.json(
      { message: "공유 경로 조회 중 오류 발생" },
      { status: 500 }
    );
  }
}
