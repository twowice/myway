import { NextRequest, NextResponse } from "next/server";
import { MYWAY_PROXY_API_KEY, ODSAY_BASE_URL } from "../config";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const sx = searchParams.get('sx')
    const sy = searchParams.get('sy')
    const ex = searchParams.get('ex')
    const ey = searchParams.get('ey')

    if (sx === null || sy === null || ex === null || ey === null) {
        return NextResponse.json({ error: 'sx, sy, ex, ey는 필수 쿼리입니다.' }, { status: 400 })
    }
    const TRANSPATH_API_URL = `${ODSAY_BASE_URL}transpath?sx=${sx}&sy=${sy}&ex=${ex}&ey=${ey}`

    console.log(`[Next.js API Route]\nurl: ${TRANSPATH_API_URL}\nkey: ${MYWAY_PROXY_API_KEY}`)

    try {
        const response = await fetch(TRANSPATH_API_URL, {
            method: 'GET',
            headers: {
                'x-api-key': MYWAY_PROXY_API_KEY ? MYWAY_PROXY_API_KEY : ""
            }
        })

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[Next.js API Route] Odsay API 프록시 서버 API 에러 응답: ${response.status}`);
            console.error(`[Next.js API Route] Odsay API 프록시 서버 API 에러 전문: ${errorText}`);

            let errorMessage = '알 수 없는 오류';
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.errorMessage || errorJson.message || errorJson.errorCode || errorMessage;
            } catch (parseError) {
            }
            return NextResponse.json(
                { error: `Odsay API 프록시 서버 API 오류: ${errorMessage}` },
                { status: response.status }
            );
        }

        const data = await response.json()

        return NextResponse.json(data, { status: 200 })

    } catch (error) {
        console.error('[Next.js API Route] api/map/odsay/transpath에서 통신 오류가 발생했습니다\n', error)
        return NextResponse.json({ error: '통신 오류가 발생했습니다.' }, { status: 400 })
    }
}