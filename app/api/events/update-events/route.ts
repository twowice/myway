import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* ===========================
   ENV
=========================== */
const KTO_API_KEY = process.env.KTO_API_KEY;
const BASE_URL = "http://apis.data.go.kr/B551011/KorService2/searchFestival2";
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

/* ===========================
   GET (Batch Job)
=========================== */
export async function GET() {
    try {
        if (!KTO_API_KEY) throw new Error("KTO_API_KEY is missing");

        const numOfRows = 100;
        let pageNo = 1;
        let allItems: any[] = [];

        /* ===========================
           TourAPI Fetch
        =========================== */
        while (true) {
            const params = new URLSearchParams({
                numOfRows: numOfRows.toString(),
                pageNo: pageNo.toString(),
                MobileOS: "ETC",
                MobileApp: "Myway",
                _type: "json",
                arrange: "C",
                eventStartDate: "20250101",
            });

            const res = await fetch(`${BASE_URL}?serviceKey=${KTO_API_KEY}&${params.toString()}`);
            const json = await res.json();
            const body = json?.response?.body;

            const rawItems = body?.items?.item;
            const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : []; // items 정규화

            if (!items.length) break;

            allItems.push(...items); // 전체 데이터 누적

            const totalCount = Number(body?.totalCount ?? 0);
            const totalPages = Math.ceil(totalCount / numOfRows);

            if (pageNo >= totalPages) break; // 종료 조건
            pageNo++;
        }

        const eventsPayload = allItems.map((item: any) => ({
            content_id: Number(item.contentid), // 콘텐츠 ID
            title: item.title, // 제목
            start_date: item.eventstartdate, // 행사 시작일
            end_date: item.eventenddate, // 행사 종료일
            address: item.addr1, // 주소
            address2: item.addr2, // 상세 주소
            area_code: item.areacode, // 지역 코드
            sigungu_code: item.sigungucode, // 시군구 코드
            latitude: Number(item.mapy), // 지도 y좌표
            longitude: Number(item.mapx), // 지도 x좌표
            phone: item.tel ?? null, // 전화 번호
            cat1: item.cat1, // 대분류
            cat2: item.cat2, // 중분류
            cat3: item.cat3, // 소분류
            lcls1: item.lclsSystm1,
            lcls2: item.lclsSystm2,
            lcls3: item.lclsSystm3,
            api_modified_at: new Date( // api 갱신 일자
                item.modifiedtime.replace(
                    /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
                    "$1-$2-$3T$4:$5:$6"
                )
            ),
        }));

        /* ===========================
           Events UPSERT
        =========================== */
        const uniqueEventsMap = new Map<number, any>();
        for (const e of eventsPayload) {
            uniqueEventsMap.set(e.content_id, e);
        }

        const uniqueEventsPayload = Array.from(uniqueEventsMap.values());
        const { error: eventError } = await supabase
            .from("events")
            .upsert(uniqueEventsPayload, {
                onConflict: "content_id",
            });
        if (eventError) throw eventError;

        /* ===========================
            Event ID Map
        =========================== */
        const { data: events, error: eventsError } = await supabase
            .from("events")
            .select("id, content_id");

        if (eventsError) throw eventsError;

        const eventIdMap = new Map<number, number>();
        for (const event of events) {
            eventIdMap.set(event.content_id, event.id);
        }

        /* ===========================
           Image Payload
        =========================== */
        const imagePayload: {
            event_id: number;
            image_url: string;
            is_main: boolean;
        }[] = [];

        for (const item of allItems) {
            const eventId = eventIdMap.get(Number(item.contentid));
            if (!eventId) continue;

            if (item.firstimage) {
                imagePayload.push({
                    event_id: eventId,
                    image_url: item.firstimage,
                    is_main: true,
                });
            }

            // if (item.firstimage2) {
            //     imagePayload.push({
            //         event_id: eventId,
            //         image_url: item.firstimage2,
            //         is_main: false,
            //     });
            // }
        }

        /* ===========================
           Image UPSERT
        =========================== */
        const imageKeySet = new Set<string>();
        const uniqueImagePayload = [];

        for (const img of imagePayload) {
            const key = `${img.event_id}_${img.image_url}`;
            if (imageKeySet.has(key)) continue;
            imageKeySet.add(key);
            uniqueImagePayload.push(img);
        }

        if (uniqueImagePayload.length > 0) {
            const { error: imageError } = await supabase
                .from("event_images")
                .upsert(uniqueImagePayload, {
                    onConflict: "event_id,image_url",
                });

            if (imageError) throw imageError;
        }

        /* ===========================
           DONE
        =========================== */
        return NextResponse.json({ success: true, count: uniqueEventsPayload.length, imageCount: uniqueImagePayload.length, });

    } catch (e: any) { console.error("Festival API Error:", e); return NextResponse.json({ message: e.message ?? "Festival API Error" }, { status: 500 }); }
}