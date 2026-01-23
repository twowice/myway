export const WALK_COLOR = "#D9D9D9";
export const WALK_POLYLINE_COLOR = "#4B5563";
export const DEFAULT_COLOR = "#6B7280";

const SUBWAY_LINE_COLOR: Record<number, string> = {
    1: "#0032A0",
    2: "#00B140",
    3: "#FC4C02",
    4: "#00A9E0",
    5: "#A05EB5",
    6: "#A9431E",
    7: "#67823A",
    8: "#E31C79",
    9: "#8C8279",
    21: "#3B82F6", // 인천 1호선
    22: "#60A5FA", // 인천 2호선
    31: "#1D4ED8", // 대전 1호선
    41: "#EF4444", // 대구 1호선
    42: "#10B981", // 대구 2호선
    43: "#F59E0B", // 대구 3호선
    48: "#8B5CF6", // 대경선
    51: "#D946EF", // 광주 1호선
    71: "#F97316", // 부산 1호선
    72: "#22C55E", // 부산 2호선
    73: "#A855F7", // 부산 3호선
    74: "#3B82F6", // 부산 4호선
    78: "#0EA5E9", // 동해선
    79: "#14B8A6", // 부산-김해경전철 
    91: "#7C3AED",  // GTX-A 
    101: "#2563EB", // 공항철도 
    102: "#06B6D4", // 자기부상철도
    104: "#F59E0B", // 경의중앙선
    107: "#22C55E", // 에버라인
    108: "#0C8E72", // 경춘선
    109: "#D20F46", // 신분당선
    110: "#EF4444", // 의정부경전철
    112: "#14B8A6", // 경강선
    113: "#64748B", // 우이신설선
    114: "#DC2626", // 서해선 
    115: "#A3A3A3", // 김포골드라인
    116: "#F5A200", // 수인분당선
    117: "#0EA5E9", // 신림선 

};

const BUS_TYPE_COLOR: Record<number, string> = {
    1: "#52AA48",  // 일반
    2: "#0067B9",  // 좌석
    3: "#00A55D",  // 마을버스
    4: "#60287C",  // 직행좌석
    5: "#00A8CB",  // 공항버스
    6: "#0A3F7F",  // 간선급행

    10: "#94A3B8", // 외곽
    11: "#0050A4", // 간선
    12: "#52AA48", // 지선
    13: "#FFD400", // 순환
    14: "#D60C1F", // 광역
    15: "#F7941C", // 급행
    16: "#EC4899", // 관광버스

    20: "#9DCB3C", // 농어촌버스
    22: "#00A3DA", // 경기도 시외형버스
    26: "#008299", // 급행간선
    30: "#00BCD4", // 한강버스
};

export const TRAIN_TYPE_COLOR: Record<number, string> = {
    1: "#1D4ED8",
    2: "#2563EB", // 새마을
    3: "#64748B", // 무궁화
    4: "#F59E0B", // 누리로
    5: "#475569", // 통근
    6: "#0EA5E9", // ITX
    7: "#22C55E", // ITX-청춘
    8: "#0B3D91", // SRT
};

export const EXPRESS_INTERCITY_BUS_TYPE_COLOR: Record<number, string> = {
    1: "#334155", // 일반
    2: "#0F172A", // 우등 
    3: "#7C3AED", // 프리미엄
    4: "#64748B", // 심야 일반
    5: "#1F2937", // 심야 우등
    6: "#6D28D9", // 심야 프리미엄
    7: "#A855F7", // 주말 프리미엄
    8: "#9333EA", // 주말심야 프리미엄
};


export function getSubwayColor(sub: any): string {
    const subwayCode = sub?.lane?.[0]?.subwayCode;
    return SUBWAY_LINE_COLOR[subwayCode] ?? DEFAULT_COLOR;
}

export function getBusColor(sub: any): string {
    const type = sub?.lane?.[0]?.type;
    return BUS_TYPE_COLOR[type] ?? DEFAULT_COLOR;
}

export function getTrainColor(sub: any): string {
    const type = sub?.trainType;
    return TRAIN_TYPE_COLOR[type] ?? DEFAULT_COLOR;
}

/**
 * 고속/시외버스(도시간) 타입 색상.
 * API 응답마다 타입 키명이 다를 수 있어 “후보 필드”들을 같이 체크.
 */
export function getExpressIntercityBusColor(sub: any): string {
    const lane0 = sub?.lane?.[0];

    const type =
        sub?.busType ??                // 후보 1
        sub?.busClass ??               // 후보 2
        sub?.expressBusType ??         // 후보 3
        sub?.intercityBusType ??       // 후보 4
        lane0?.busType ??              // 후보 5 (lane)
        lane0?.busClass ??             // 후보 6 (lane)
        lane0?.type ??
        sub                  // 후보 7 (lane - ODsay에서 class/type로 쓰는 경우)

    return EXPRESS_INTERCITY_BUS_TYPE_COLOR[type] ?? DEFAULT_COLOR;
}

export function getSegmentColor(sub: any): string {
    // 도보
    if (sub?.trafficType === 3) return WALK_COLOR;

    // 지하철
    if (sub?.trafficType === 1) return getSubwayColor(sub);

    // 버스(시내/광역/마을 등)
    if (sub?.trafficType === 2) return getBusColor(sub);

    // 열차(도시간/철도)
    if (sub?.trafficType === 4 && sub?.trainType != null) return getTrainColor(sub);

    // 고속/시외버스(도시간) - trafficType이 6으로 오는 케이스(터미널 버스)
    if (sub?.trafficType === 6) return getExpressIntercityBusColor(sub);

    // 고속/시외버스(도시간) - trafficType이 4로 오거나 별도 필드로 오는 케이스 대비
    if (
        sub?.trafficType === 4 &&
        (sub?.busType != null ||
            sub?.busClass != null ||
            sub?.expressBusType != null ||
            sub?.intercityBusType != null ||
            sub?.lane?.[0]?.busType != null ||
            sub?.lane?.[0]?.busClass != null ||
            sub?.lane?.[0]?.type != null)
    ) {
        return getExpressIntercityBusColor(sub);
    }

    return DEFAULT_COLOR;
}

export function getPolylineSegmentColor(sub: any): string {
    if (sub?.trafficType === 3) return WALK_POLYLINE_COLOR;
    return getSegmentColor(sub);
}

export function getLaneTypeColor(lane: { class: number; type: number }): string {
    if (lane.class === 2) {
        return SUBWAY_LINE_COLOR[lane.type] ?? DEFAULT_COLOR;
    }

    if (lane.class === 1) {
        return BUS_TYPE_COLOR[lane.type] ?? DEFAULT_COLOR;
    }

    return DEFAULT_COLOR;
}
