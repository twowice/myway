import { NextResponse } from 'next/server';
import type { PlaceResult } from '@/types/map/place';

const NAVER_SEARCH_ID = process.env.NAVER_CLIENT_SEARCH_ID;
const NAVER_SEARCH_SECRET = process.env.NAVER_CLIENT_SEARCH_SECRET;
const NAVER_MAP_API_KEY_ID = process.env.NEXT_PUBLIC_NCP_CLIENT_ID;
const NAVER_MAP_API_KEY = process.env.NEXT_PUBLIC_NCP_CLIENT_SECRET;

const fetchGeocoding = async (query: string) => {
    if (!NAVER_MAP_API_KEY_ID || !NAVER_MAP_API_KEY) {
        return null;
    }

    const geocodeUrl = new URL('https://maps.apigw.ntruss.com/map-geocode/v2/geocode');
    geocodeUrl.searchParams.append('query', query);

    const geocodeResponse = await fetch(geocodeUrl.toString(), {
        method: 'GET',
        headers: {
            'x-ncp-apigw-api-key-id': NAVER_MAP_API_KEY_ID,
            'x-ncp-apigw-api-key': NAVER_MAP_API_KEY,
            Accept: 'application/json',
        },
    });

    if (!geocodeResponse.ok) {
        const errorText = await geocodeResponse.text().catch(() => '');
        console.warn(`[Next.js API Route] Geocoding API 에러 응답: ${geocodeResponse.status}`);
        console.warn(`[Next.js API Route] Geocoding API 에러 전문: ${errorText}`);
        return null;
    }

    const geocodeData = await geocodeResponse.json();
    const address = geocodeData?.addresses?.[0];
    if (!address) return null;

    const lat = Number(address.y);
    const lng = Number(address.x);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

    const roadAddress = address.roadAddress ?? '';
    const jibunAddress = address.jibunAddress ?? '';
    const name = roadAddress || jibunAddress;

    const place: PlaceResult = {
        name,
        address: jibunAddress || roadAddress,
        roadAddress,
        lat,
        lng,
        category: '주소',
        telephone: undefined,
        link: undefined,
    };

    return { place, lat, lng };
};

const fetchLocalSearch = async (query: string, coords?: { lat: number; lng: number }) => {
    const naverApiUrl = new URL('https://openapi.naver.com/v1/search/local.json');
    naverApiUrl.searchParams.append('query', query);
    naverApiUrl.searchParams.append('display', '5');
    if (coords) {
        naverApiUrl.searchParams.append('coordinate', `${coords.lng},${coords.lat}`);
    }

    const naverApiResponse = await fetch(naverApiUrl.toString(), {
        method: 'GET',
        headers: {
            'X-Naver-Client-Id': NAVER_SEARCH_ID ?? '',
            'X-Naver-Client-Secret': NAVER_SEARCH_SECRET ?? '',
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

        throw new Error(`네이버 Search API 오류: ${errorMessage}`);
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

    return filteredPlaces;
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
        return NextResponse.json({ error: '검색 쿼리가 필요합니다.' }, { status: 400 });
    }

    try {
        if (!NAVER_SEARCH_ID || !NAVER_SEARCH_SECRET) {
            console.error("네이버 Search API 키(NAVER_CLIENT_SEARCH_ID, NAVER_CLIENT_SEARCH_SECRET)가 설정되지 않았습니다.");
            return NextResponse.json({ error: '서버 설정 오류: API 키 없음' }, { status: 500 });
        }

        const geoResult = await fetchGeocoding(query);
        const localResults = await fetchLocalSearch(
            query,
            geoResult ? { lat: geoResult.lat, lng: geoResult.lng } : undefined
        );

        if (geoResult) {
            return NextResponse.json({ addresses: [geoResult.place, ...localResults] });
        }

        return NextResponse.json({ addresses: localResults });

    } catch (error: any) {
        console.error('[Next.js API Route] 장소 검색 처리 중 내부 오류:', error.message);
        return NextResponse.json({ error: '장소 검색 중 서버 내부 오류가 발생했습니다.' }, { status: 500 });
    }
}
