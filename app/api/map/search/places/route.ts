import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
   try {
      const { query } = await request.json();

      if (!query) {
         return NextResponse.json({ error: '검색어를 입력해주세요.' }, { status: 400 });
      }

      const clientId = process.env.NAVER_CLIENT_SEARCH_ID;
      const clientSecret = process.env.NAVER_CLIENT_SEARCH_SECRET;

      if (!clientId || !clientSecret) {
         return NextResponse.json({ error: 'API 키가 설정되지 않았습니다.' }, { status: 500 });
      }

      const itemsPerPage = 5;
      const numPages = 4; // 고정: 무조건 4페이지 호출


      const allItems: any[] = [];

      // ⭐ 무조건 4페이지 호출 (break/continue 없음)
      for (let page = 0; page < numPages; page++) {
         const start = page * itemsPerPage + 1;
         const searchUrl = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query)}&display=${itemsPerPage}&start=${start}`;


         try {
            const response = await fetch(searchUrl, {
               method: 'GET',
               headers: {
                  'X-Naver-Client-Id': clientId,
                  'X-Naver-Client-Secret': clientSecret,
               },
            });

            if (!response.ok) {
               const errorText = await response.text();
               console.error(`❌ [페이지 ${page + 1}] HTTP 에러:`, response.status, errorText);
               // 에러 있어도 다음 페이지 계속
               continue;
            }

            const data = await response.json();


            if (data.items && data.items.length > 0) {
               allItems.push(...data.items);
            } else {
            }
         } catch (fetchError) {
            console.error(`💥 [페이지 ${page + 1}] fetch 예외:`, fetchError);
            // 예외 있어도 다음 페이지 계속
            continue;
         }
      }


      // 결과 변환
      const places = allItems.map((item: any, index: number) => {
         const place = {
            name: item.title?.replace(/<[^>]*>/g, '') || '',
            road_address: item.roadAddress || '',
            address: item.address || '',
            x: item.mapx ? String(Number(item.mapx) / 10000000) : '',
            y: item.mapy ? String(Number(item.mapy) / 10000000) : '',
            category: item.category || '',
         };

         if (index < 3) {
         }

         return place;
      });


      // JSON 크기 확인
      const jsonString = JSON.stringify({ places });

      return NextResponse.json({ places });
   } catch (error) {
      console.error('💥 [주소검색] 최상위 예외:', error);
      return NextResponse.json(
         { error: '오류 발생', details: error instanceof Error ? error.message : '알 수 없는 오류' },
         { status: 500 },
      );
   }
}
