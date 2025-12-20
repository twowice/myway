export interface OdsayTranspath {
    result: Result;
}

export interface Result {
    searchType: number;
    outTrafficCheck: number;
    busCount: number;
    subwayCount: number;
    subwayBusCount: number;
    pointDistance: number;
    startRadius: number;
    endRadius: number;
    path: Path[];
}

export interface Path {
    pathType: number;
    info: Info;
    subPath: SubPath[];
}

export interface Info {
    trafficDistance: number;
    totalWalk: number;
    totalTime: number;
    payment: number;
    busTransitCount: number;
    subwayTransitCount: number;
    mapObj: string;
    firstStartStation: string;
    lastEndStation: string;
    totalStationCount: number;
    busStationCount: number;
    subwayStationCount: number;
    totalDistance: number;
    totalWalkTime: number;
    checkIntervalTime: number;
    checkIntervalTimeOverYn: CheckIntervalTimeOverYn;
    totalIntervalTime: number;
}