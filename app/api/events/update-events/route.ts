import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* ===========================
   환경 변수 및 API 설정
=========================== */
const KTO_API_KEY = process.env.KTO_API_KEY;
const BASE_URL = "http://apis.data.go.kr/B551011/KorService2/searchFestival2";
const BASE_DETAIL_COMMON_URL = "http://apis.data.go.kr/B551011/KorService2/detailCommon2";
const BASE_DETAIL_INTRO_URL = "http://apis.data.go.kr/B551011/KorService2/detailIntro2";

const PAGE_SIZE = 100;
const REQUEST_DELAY_MS = 200;
const FESTIVAL_CONTENT_TYPE_ID = "15";

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type TourApiItem = {
    contentid: string | number; // 콘텐츠 ID
    title: string; // 제목
    eventstartdate: string; // 행사 시작일
    eventenddate: string; // 행사 종료일
    addr1?: string | null; // 주소
    addr2?: string | null; // 상세주소
    mapy?: string | number | null; // GPS Y좌표
    mapx?: string | number | null; // GPS X좌표
    tel?: string | null; // 전화번호
    lclsSystm1?: string | null; // 분류체계 대분류
    lclsSystm2?: string | null; // 분류체계 중분류
    lclsSystm3?: string | null; // 분류체계 소분류
    modifiedtime?: string; // 수정일
    firstimage?: string | null; // 대표이미지(원본)
};

type EventPayload = {
    content_id: number; // 콘텐츠 ID
    title: string; // 제목
    start_date: string; // 행사 시작일
    end_date: string; // 행사 종료일
    address?: string | null; // 주소
    address2?: string | null; // 상세주소
    latitude: number | null; // GPS Y좌표
    longitude: number | null; // GPS X좌표
    phone?: string | null; // 전화번호
    lcls1?: string | null; // 분류체계 대분류
    lcls2?: string | null; // 분류체계 중분류
    lcls3?: string | null; // 분류체계 소분류
    api_modified_at: Date | null; // 수정일
};

type EventRow = {
    id: number;
    content_id: number;
    homepage?: string | null;
    overview?: string | null;
    organizer?: string | null;
    playtime?: string | null;
    price?: string | number | null;
};

type ImagePayload = {
    event_id: number;
    image_url: string;
    is_main: boolean;
};

/* ===========================
   공통 유틸
=========================== */
function toYYYYMMDD(d: Date) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");

    return `${yyyy}${mm}${dd}`;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const stripHtml = (value?: string | null) =>
    value?.replace(/<[^>]*>/g, "")?.trim() || null;

const isEmpty = (value: unknown) =>
    value === null || value === undefined || value === "";

const toNumberOrNull = (value?: string | number | null) => {
    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue : null;
};

const normalizeItems = <T,>(rawItems: T | T[] | null | undefined): T[] => {
    if (Array.isArray(rawItems)) return rawItems;
    return rawItems ? [rawItems] : [];
};

const assertTourApiSuccess = (json: any, apiName: string) => {
    const resultCode = json?.response?.header?.resultCode;
    if (resultCode && resultCode !== "0000") {
        throw new Error(`${apiName} Error: ${json?.response?.header?.resultMsg ?? resultCode}`);
    }
};

const parseModifiedTime = (value?: string) => {
    if (!value) return null;

    return new Date(
        value.replace(
            /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
            "$1-$2-$3T$4:$5:$6"
        )
    );
};

/* ===========================
   TourAPI 목록 조회
=========================== */
async function fetchFestivalItems(eventStartDate: string) {
    let pageNo = 1;
    const allItems: TourApiItem[] = [];

    while (true) {
        const params = new URLSearchParams({
            numOfRows: PAGE_SIZE.toString(),
            pageNo: pageNo.toString(),
            MobileOS: "ETC",
            MobileApp: "Myway",
            _type: "json",
            arrange: "C",
            eventStartDate,
        });

        const res = await fetch(`${BASE_URL}?serviceKey=${KTO_API_KEY}&${params.toString()}`);
        if (!res.ok) throw new Error(`TourAPI searchFestival2 Error: ${await res.text()}`);

        const json = await res.json();
        assertTourApiSuccess(json, "TourAPI searchFestival2");

        const body = json?.response?.body;
        const items = normalizeItems<TourApiItem>(body?.items?.item);

        if (items.length === 0) break;

        allItems.push(...items);

        const totalCount = Number(body?.totalCount ?? 0);
        const totalPages = Math.ceil(totalCount / PAGE_SIZE);

        if (pageNo >= totalPages) break;
        pageNo++;
    }

    return allItems;
}

/* ===========================
   Events 저장 데이터 생성
=========================== */
function toEventPayload(item: TourApiItem): EventPayload {
    return {
        content_id: Number(item.contentid),
        title: item.title,
        start_date: item.eventstartdate,
        end_date: item.eventenddate,
        address: item.addr1,
        address2: item.addr2,
        latitude: toNumberOrNull(item.mapy),
        longitude: toNumberOrNull(item.mapx),
        phone: item.tel ?? null,
        lcls1: item.lclsSystm1,
        lcls2: item.lclsSystm2,
        lcls3: item.lclsSystm3,
        api_modified_at: parseModifiedTime(item.modifiedtime),
    };
}

function uniqueEventsByContentId(payload: EventPayload[]) {
    const eventMap = new Map<number, EventPayload>();

    for (const event of payload) {
        eventMap.set(event.content_id, event);
    }

    return Array.from(eventMap.values());
}

async function upsertEvents(payload: EventPayload[]) {
    if (payload.length === 0) return;

    const { error } = await supabase
        .from("events")
        .upsert(payload, { onConflict: "content_id" });

    if (error) throw error;
}

async function getSavedEventRows(contentIds: number[]) {
    if (contentIds.length === 0) return [];

    const { data, error } = await supabase
        .from("events")
        .select("id, content_id, homepage, overview, organizer, playtime, price")
        .in("content_id", contentIds);

    if (error) throw error;

    return (data ?? []) as EventRow[];
}

const needsCommonDetail = (event: EventRow) =>
    isEmpty(event.homepage) || isEmpty(event.overview);

const needsIntroDetail = (event: EventRow) =>
    isEmpty(event.organizer) || isEmpty(event.playtime) || isEmpty(event.price);

/* ===========================
   Event Images 저장
=========================== */
function buildImagePayload(items: TourApiItem[], eventIdMap: Map<number, number>) {
    const imageMap = new Map<string, ImagePayload>();

    for (const item of items) {
        const eventId = eventIdMap.get(Number(item.contentid));
        if (!eventId || !item.firstimage) continue;

        const image = {
            event_id: eventId,
            image_url: item.firstimage,
            is_main: true,
        };
        const key = `${image.event_id}_${image.image_url}`;

        imageMap.set(key, image);
    }

    return Array.from(imageMap.values());
}

async function upsertEventImages(payload: ImagePayload[]) {
    if (payload.length === 0) return;

    const { error } = await supabase
        .from("event_images")
        .upsert(payload, { onConflict: "event_id,image_url" });

    if (error) throw error;
}

/* ===========================
   상세 정보 업데이트
=========================== */
async function updateCommonDetails(events: EventRow[]) {
    let updatedCount = 0;

    for (const event of events) {
        const params = new URLSearchParams({
            contentId: event.content_id.toString(),
            MobileOS: "ETC",
            MobileApp: "Myway",
            _type: "json",
        });

        const res = await fetch(`${BASE_DETAIL_COMMON_URL}?serviceKey=${KTO_API_KEY}&${params.toString()}`);
        if (!res.ok) {
            console.error("TourAPI detailCommon2 Error:", await res.text());
            continue;
        }

        const json = await res.json();
        assertTourApiSuccess(json, "TourAPI detailCommon2");

        const detail = normalizeItems<any>(json?.response?.body?.items?.item)[0];
        if (!detail) continue;

        const homepage = stripHtml(detail.homepage);
        const overview = stripHtml(detail.overview);
        const updateData: Record<string, string> = {};

        if (homepage) updateData.homepage = homepage;
        if (overview) updateData.overview = overview;
        if (Object.keys(updateData).length === 0) continue;

        const { error } = await supabase
            .from("events")
            .update(updateData)
            .eq("id", event.id);

        if (error) throw error;

        updatedCount++;
        await sleep(REQUEST_DELAY_MS);
    }

    return updatedCount;
}

async function updateIntroDetails(events: EventRow[]) {
    let updatedCount = 0;

    for (const event of events) {
        const params = new URLSearchParams({
            contentId: event.content_id.toString(),
            contentTypeId: FESTIVAL_CONTENT_TYPE_ID,
            MobileOS: "ETC",
            MobileApp: "Myway",
            _type: "json",
        });

        const res = await fetch(`${BASE_DETAIL_INTRO_URL}?serviceKey=${KTO_API_KEY}&${params.toString()}`);
        if (!res.ok) {
            console.error("TourAPI detailIntro2 Error:", await res.text());
            continue;
        }

        const json = await res.json();
        assertTourApiSuccess(json, "TourAPI detailIntro2");

        const detail = normalizeItems<any>(json?.response?.body?.items?.item)[0];
        if (!detail) continue;

        const organizer = detail.sponsor1 || null;
        const playtime = detail.playtime || null;
        const price = detail.usetimefestival || null;
        const updateData: Record<string, string> = {};

        if (organizer) updateData.organizer = organizer;
        if (playtime) updateData.playtime = playtime;
        if (price) updateData.price = price;
        if (Object.keys(updateData).length === 0) continue;

        const { error } = await supabase
            .from("events")
            .update(updateData)
            .eq("id", event.id);

        if (error) throw error;

        updatedCount++;
        await sleep(REQUEST_DELAY_MS);
    }

    return updatedCount;
}

/* ===========================
   GET: 축제 데이터 동기화
=========================== */
export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get("authorization");

        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        if (!KTO_API_KEY) throw new Error("KTO_API_KEY is missing");

        // TourAPI는 시작일 기준으로 조회하므로 넓게 가져온 뒤, 종료일 기준으로 다시 필터링합니다.
        const today = new Date();
        const start = new Date(today);
        start.setMonth(start.getMonth() - 6);

        const eventStartDate = toYYYYMMDD(start);
        const todayString = toYYYYMMDD(today);

        const allItems = await fetchFestivalItems(eventStartDate);
        const activeItems = allItems.filter(item => item.eventenddate >= todayString);

        const eventsPayload = uniqueEventsByContentId(activeItems.map(toEventPayload));
        await upsertEvents(eventsPayload);

        const contentIds = eventsPayload.map(event => event.content_id);
        const savedEvents = await getSavedEventRows(contentIds);
        const eventIdMap = new Map(savedEvents.map(event => [event.content_id, event.id]));

        const imagePayload = buildImagePayload(activeItems, eventIdMap);
        await upsertEventImages(imagePayload);

        const commonDetailTargets = savedEvents.filter(needsCommonDetail);
        const introDetailTargets = savedEvents.filter(needsIntroDetail);

        const commonDetailCount = await updateCommonDetails(commonDetailTargets);
        const introDetailCount = await updateIntroDetails(introDetailTargets);

        return NextResponse.json({
            success: true,
            fetchedCount: allItems.length,
            activeCount: activeItems.length,
            count: eventsPayload.length,
            imageCount: imagePayload.length,
            commonDetailTargetCount: commonDetailTargets.length,
            introDetailTargetCount: introDetailTargets.length,
            commonDetailCount,
            introDetailCount,
        });
    } catch (e: any) {
        console.error("Festival API Error:", e);

        return NextResponse.json(
            { message: e.message ?? "Festival API Error" },
            { status: 500 }
        );
    }
}
