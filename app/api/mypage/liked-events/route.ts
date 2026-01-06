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

    const { data: likedEvents, error: likedError } = await supabase
      .from("liked_events")
      .select("event_id")
      .eq("user_id", session.user.id);

    if (likedError) {
      console.error("Liked events fetch error:", likedError);
      return NextResponse.json(
        { message: "좋아요 목록 조회에 실패했어요." },
        { status: 500 }
      );
    }

    const eventIds = (likedEvents ?? [])
      .map((item) => item.event_id)
      .filter((id): id is number => typeof id === "number");

    if (eventIds.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const { data, error } = await supabase
      .from("events")
      .select(
        `
        id,
        title,
        start_date,
        end_date,
        address,
        cat1,
        event_images (
          image_url,
          is_main
        )
      `
      )
      .in("id", eventIds)
      .order("start_date", { ascending: false });

    if (error) {
      console.error("Liked events list error:", error);
      return NextResponse.json(
        { message: "이벤트 목록 조회에 실패했어요." },
        { status: 500 }
      );
    }

    const events = (data ?? []).map((event) => {
      const images = Array.isArray(event.event_images)
        ? event.event_images
        : [];
      const mainImage =
        images.find((img: any) => img?.is_main)?.image_url ?? null;
      return { ...event, main_image: mainImage, event_images: undefined };
    });

    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    console.error("Liked events API error:", error);
    return NextResponse.json(
      { message: "좋아요 목록 조회 중 오류가 발생했어요." },
      { status: 500 }
    );
  }
}
