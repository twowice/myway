import { NextRequest, NextResponse } from "next/server";
import { MYWAY_PROXY_API_KEY, ODSAY_BASE_URL } from "../config";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    try {

    } catch (error) {
        console.error('[Next.js API Route] api/map/odsay/loadlane에서 통신 오류가 발생했습니다\n', error)
        return NextResponse.json({ error: '통신 오류가 발생했습니다.' }, { status: 400 })
    }
}