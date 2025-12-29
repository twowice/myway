// app/api/odsay/loadlane/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MYWAY_PROXY_API_KEY, ODSAY_BASE_URL } from '../config';

export async function GET(request: NextRequest) {

    const { searchParams } = new URL(request.url);
    const mapObject = searchParams.get('mapObject');
    console.log("[Sever] mapObject:", mapObject)

    if (!mapObject) {
        return NextResponse.json({ error: 'Missing mapObject parameter.' }, { status: 400 });
    }
    const LOADLANE_API_URL = `${ODSAY_BASE_URL}loadlane?mapObject=${mapObject}`

    try {
        const odsayResponse = await fetch(LOADLANE_API_URL, {
            method: 'GET',
            headers: {
                'x-api-key': MYWAY_PROXY_API_KEY ? MYWAY_PROXY_API_KEY : ""
            }
        }
        );
        if (!odsayResponse.ok) {
            const errorText = await odsayResponse.text();
            console.error('ODsay loadLane API Error:', odsayResponse.status, errorText);
            return NextResponse.json({ error: `ODsay loadLane API 오류: ${odsayResponse.status} - ${errorText}` }, { status: odsayResponse.status });
        }
        const data = await odsayResponse.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('API Route Fetching Error for ODsay loadLane:', error);
        return NextResponse.json({ error: `ODsay loadLane 요청 처리 중 오류 발생: ${error.message}` }, { status: 500 });
    }
}