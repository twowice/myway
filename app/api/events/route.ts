import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const limit = Number(searchParams.get("limit") ?? 12);
    const offset = Number(searchParams.get("offset") ?? 0);

    const category = searchParams.get("category"); // cat1
    const region = searchParams.get("region");     // address prefix
    const month = searchParams.get("month");       // start_date range
    const keyword = searchParams.get("keyword");   // title ilike
    const todayYMD = new Date().toISOString().slice(0, 10); // 서버에서 종료일 필터 처리 (yyyy-mm-dd)

    let query = supabase
      .from("events")
      .select(
        `
          id,
          content_id,
          title,
          start_date,
          end_date,
          address,
          address2,
          area_code,
          sigungu_code,
          latitude,
          longitude,
          phone,
          cat1,
          cat2,
          cat3,
          lcls1,
          lcls2,
          lcls3,
          api_modified_at,
          event_images (
            image_url,
            is_main
          )
        `,
        { count: "exact" }
      )
      .or(`end_date.is.null,end_date.gte.${todayYMD}`)
      .order("start_date", { ascending: false })
      .range(offset, offset + limit - 1);

    // 카테고리 필터
    if (category && category !== "all") {
      query = query.eq("cat1", category);
    }

    // 지역 필터
    if (region && region !== "all") {
      query = query.ilike("address", `${region}%`);
    }

    // 월 필터
    if (month && month !== "all") {
      const monthNumber = parseInt(month.replace("월", ""), 10);
      const y = new Date().getFullYear();
      const m = monthNumber.toString().padStart(2, "0");
      const start = `${y}-${m}-01`;
      const endMonth = monthNumber === 12 ? 1 : monthNumber + 1;
      const endYear = monthNumber === 12 ? y + 1 : y;
      const end = `${endYear}-${endMonth.toString().padStart(2, "0")}-01`;
      query = query.gte("start_date", start).lt("start_date", end);
    }

    // 키워드 필터 (2글자 이상)
    if (keyword && keyword.trim().length >= 2) {
      const safeKeyword = keyword.replace(/[%_\\]/g, "\\$&");
      query = query.ilike("title", `%${safeKeyword}%`);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    // main_image 가공
    const events = (data ?? []).map((event: any) => {
      const images = Array.isArray(event.event_images) ? event.event_images : [];
      const mainImage = images.find((img: any) => img?.is_main)?.image_url ?? null;

      return {
        ...event,
        main_image: mainImage,
        event_images: images,
      };
    });

    const total = count ?? 0;
    const hasMore = offset + limit < total;
    const nextOffset = hasMore ? offset + limit : null;

    return NextResponse.json({
      success: true,
      data: JSON.parse(JSON.stringify(events)),
      pagination: {
        limit,
        offset,
        total,
        hasMore,
        nextOffset,
      },
    });
  } catch (e: any) {
    console.error("Festival API Error:", e);
    const message = e?.message ?? JSON.stringify(e) ?? "Festival API Error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
