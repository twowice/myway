import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* ===========================
   ENV
=========================== */
const KTO_API_KEY = process.env.KTO_API_KEY;
const BASE_DETAIL_URL = "http://apis.data.go.kr/B551011/KorService2/detailIntro2";
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

/* ===========================
   utils
=========================== */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/* ===========================
   GET (Batch Job)
=========================== */
export async function GET() {
    try {
        /* ===========================
           Batch Auth
        =========================== */
        if (!KTO_API_KEY) throw new Error("KTO_API_KEY is missing");

        /* ===========================
            events 테이블 조회
        =========================== */
        const { data: events, error } = await supabase
            .from("events")
            .select("id, content_id, price, organizer, playtime")
            .or("price.is.null,organizer.is.null,playtime.is.null")
        if (error) throw error;
        if (!events || events.length === 0) return NextResponse.json({ success: true, message: "No events to update" });


        /* ===========================
           DETAIL API
        =========================== */
        for (const event of events) {

            if (!event.content_id) continue; // contentId 가 없으면 skip
            if (event.price && event.organizer && event.playtime) continue;

            const params = new URLSearchParams({
                contentId: event.content_id.toString(),
                contentTypeId: "15",
                MobileOS: "ETC",
                MobileApp: "Myway",
                _type: "json"
            });

            const res = await fetch(`${BASE_DETAIL_URL}?serviceKey=${KTO_API_KEY}&${params.toString()}`);
            if (!res.ok) {
                console.error("TourAPI Error:", await res.text());
                continue;
            }

            const json = await res.json();
            const detail = Array.isArray(json?.response?.body?.items?.item) ? json.response.body.items.item[0] : json?.response?.body?.items?.item;
            if (!detail) continue;

            const organizer = detail.sponsor1
            const playtime = detail.playtime
            const price = detail.usetimefestival

            if (!organizer && !playtime && !price) continue;

            // Supabase 업데이트
            const { error: updateError } = await supabase
                .from("events")
                .update({ organizer, playtime, price })
                .eq("id", event.id)

            if (updateError) throw updateError;

            await sleep(500); // api rate limit 보호
        }

        /* ===========================
           DONE
        =========================== */
        return NextResponse.json({ success: true });

    } catch (e: any) { console.error("Festival API Error:", e); return NextResponse.json({ message: e.message ?? "Festival API Error" }, { status: 500 }); }
}