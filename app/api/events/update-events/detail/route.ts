import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* ===========================
   ENV
=========================== */
const KTO_API_KEY = process.env.KTO_API_KEY;
const BASE_DETAIL_URL = "http://apis.data.go.kr/B551011/KorService2/detailCommon2";
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
            (homepage OR overview 가 비어있는 데이터만)
        =========================== */
        const { data: events, error } = await supabase
            .from("events")
            .select("id, content_id, homepage, overview")
            .or("homepage.is.null,overview.is.null")
        if(error) throw error;
        if(!events || events.length === 0) return NextResponse.json({ success: true, message: "No events to update" }); 
        

        /* ===========================
           DETAIL API (homepage / overview)
        =========================== */
        for(const event of events) {

            if(!event.content_id) continue; // contentId 가 없으면 skip
            if (event.homepage && event.overview) continue; // homepage, overview가 이미 값 있으면 skip

            const params = new URLSearchParams({
                contentId: event.content_id.toString(),
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
            if(!detail) continue;

            const homepage = detail.homepage 
                ?.replace(/<[^>]*>/g, "")
                ?.trim() ?? null;
            
            const overview = detail.overview
                ?.replace(/<[^>]*>/g, "")
                ?.trim() ?? null;

            if(!homepage && !overview) continue;

            // Supabase 업데이트
            const { error: updateError } = await supabase
                .from("events")
                .update({ homepage, overview })
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