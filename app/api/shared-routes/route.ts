import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";

const SHARE_CODE_LENGTH = 12;
const MAX_SHARE_CODE_ATTEMPTS = 3;

const createShareCode = () =>
  randomBytes(9).toString("base64url").slice(0, SHARE_CODE_LENGTH);

const getOdsayPaths = (rawResponse: unknown) => {
  const paths = (rawResponse as any)?.result?.path;
  return Array.isArray(paths) ? paths : null;
};

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "❌ Session error" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { searchHistoryId, sharedPathIndex } = body ?? {};
    const parsedHistoryId =
      typeof searchHistoryId === "string"
        ? Number(searchHistoryId)
        : searchHistoryId;
    const parsedPathIndex =
      typeof sharedPathIndex === "string"
        ? Number(sharedPathIndex)
        : sharedPathIndex;

    if (
      !Number.isInteger(parsedHistoryId) ||
      !Number.isInteger(parsedPathIndex) ||
      parsedPathIndex < 0
    ) {
      return NextResponse.json(
        { message: "유효한 검색 기록 ID와 경로 인덱스가 필요합니다." },
        { status: 400 }
      );
    }

    const { data: history, error: historyError } = await supabase
      .from("route_search_histories")
      .select("id, user_id, status, raw_response")
      .eq("id", parsedHistoryId)
      .maybeSingle();

    if (historyError) {
      console.error("Route search history fetch error:", historyError);
      return NextResponse.json(
        { message: "검색 기록 확인 실패" },
        { status: 500 }
      );
    }

    if (!history || history.user_id !== session.user.id) {
      return NextResponse.json(
        { message: "검색 기록을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    if (history.status === "deleted") {
      return NextResponse.json(
        { message: "삭제된 검색 기록입니다." },
        { status: 410 }
      );
    }

    const paths = getOdsayPaths(history.raw_response);
    if (!paths || parsedPathIndex >= paths.length) {
      return NextResponse.json(
        { message: "유효하지 않은 경로 인덱스입니다." },
        { status: 400 }
      );
    }

    const { data: existingShare, error: existingError } = await supabase
      .from("shared_routes")
      .select("share_code")
      .eq("search_history_id", parsedHistoryId)
      .eq("shared_path_index", parsedPathIndex)
      .eq("owner_id", session.user.id)
      .maybeSingle();

    if (existingError) {
      console.error("Shared route fetch error:", existingError);
      return NextResponse.json(
        { message: "공유 경로 확인 실패" },
        { status: 500 }
      );
    }

    if (existingShare?.share_code) {
      const origin = new URL(request.url).origin;
      return NextResponse.json({
        shareCode: existingShare.share_code,
        shareUrl: `${origin}/locationpage?shared=${existingShare.share_code}`,
      });
    }

    for (let attempt = 0; attempt < MAX_SHARE_CODE_ATTEMPTS; attempt += 1) {
      const shareCode = createShareCode();
      const { data, error } = await supabase
        .from("shared_routes")
        .insert({
          search_history_id: parsedHistoryId,
          shared_path_index: parsedPathIndex,
          owner_id: session.user.id,
          share_code: shareCode,
        })
        .select("share_code")
        .single();

      if (!error && data?.share_code) {
        const origin = new URL(request.url).origin;
        return NextResponse.json({
          shareCode: data.share_code,
          shareUrl: `${origin}/locationpage?shared=${data.share_code}`,
        });
      }

      if (error?.code !== "23505") {
        console.error("Shared route insert error:", error);
        return NextResponse.json(
          { message: "공유 경로 생성 실패" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { message: "공유 코드 생성에 실패했습니다." },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("Shared route create API error:", error);
    return NextResponse.json(
      { message: "공유 경로 생성 중 오류 발생" },
      { status: 500 }
    );
  }
}
