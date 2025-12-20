import { NextResponse } from 'next/server';

interface PlaceResult {
    name: string;
    address: string;
    roadAddress: string;
    lat: number;
    lng: number;
    category: string;
    telephone?: string;
    link?: string;
}

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_SEARCH_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SEARCH_SECRET;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
        return NextResponse.json({ error: '검색 쿼리가 필요합니다.' }, { status: 400 });
    }

    if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
        console.error("네이버 API 키(NAVER_CLIENT_ID, NAVER_CLIENT_SECRET)가 설정되지 않았습니다.");
        return NextResponse.json({ error: '서버 설정 오류: API 키 없음' }, { status: 500 });
    }

    try {
        const naverApiUrl = new URL('https://openapi.naver.com/v1/search/local.json');
        naverApiUrl.searchParams.append('query', query);
        naverApiUrl.searchParams.append('display', '5');

        console.log(`[Next.js API Route] 네이버 Search API 호출 대상 URL: ${naverApiUrl.toString()}`);

        const naverApiResponse = await fetch(naverApiUrl.toString(), {
            method: 'GET',
            headers: {
                'X-Naver-Client-Id': NAVER_CLIENT_ID,
                'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
            },
        });

        if (!naverApiResponse.ok) {
            const errorText = await naverApiResponse.text();
            console.error(`[Next.js API Route] 네이버 Search API 에러 응답: ${naverApiResponse.status}`);
            console.error(`[Next.js API Route] 네이버 Search API 에러 전문: ${errorText}`);

            let errorMessage = '알 수 없는 오류';
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.errorMessage || errorJson.message || errorJson.errorCode || errorMessage;
            } catch (parseError) {
            }
            return NextResponse.json(
                { error: `네이버 Search API 오류: ${errorMessage}` },
                { status: naverApiResponse.status }
            );
        }

        const naverApiData = await naverApiResponse.json();

        const filteredPlaces: PlaceResult[] = naverApiData.items.map((item: any) => {
            const cleanedTitle = item.title.replace(/<[^>]*>?/g, '');
            const cleanedCategory = item.category.replace(/<[^>]*>?/g, '').replace(/>/g, ' > ');

            const lat = Number(item.mapy) / 1e7;
            const lng = Number(item.mapx) / 1e7;

            return {
                name: cleanedTitle,
                address: item.address,
                roadAddress: item.roadAddress,
                lat: !isNaN(lat) ? lat : 0,
                lng: !isNaN(lng) ? lng : 0,
                category: cleanedCategory,
                telephone: item.telephone,
                link: item.link,
            };
        });

        return NextResponse.json({ addresses: filteredPlaces });

    } catch (error: any) {
        console.error('[Next.js API Route] 장소 검색 처리 중 내부 오류:', error.message);
        return NextResponse.json({ error: '장소 검색 중 서버 내부 오류가 발생했습니다.' }, { status: 500 });
    }
}