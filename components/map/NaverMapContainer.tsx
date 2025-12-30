"use client";

import { useEffect, useRef } from "react";
import { useMapStore } from "@/stores/map/store";
import { Icon36 } from '@/components/icons/icon36';
import { renderToString } from "react-dom/server";

interface Props {
  lat: number; // 위도
  lng: number; // 경도
}

const NaverMapContainer = ({ lat, lng }: Props) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const setMap = useMapStore((state) => state.setMap);
  const setIsMapScriptLoaded = useMapStore((state) => state.setIsMapScriptLoaded );
  const html = renderToString(<Icon36 name="basicmarker" />);
  useEffect(() => {
    if (!mapRef.current) return;
    if (!window.naver || !window.naver.maps) return;

    const map = new naver.maps.Map(mapRef.current, {
      center: new naver.maps.LatLng(lat, lng),
      zoom: 15,
    });

    const position = new naver.maps.LatLng(lat, lng);
    new naver.maps.Marker({
        position,
        map,
        icon: {
            content: html,
            size: new naver.maps.Size(27, 36),
            anchor: new naver.maps.Point(13.5, 36),
        }
    });

    setMap(map);
    setIsMapScriptLoaded(true);
  }, [lat, lng, setMap, setIsMapScriptLoaded]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[260px] md:h-[320px] lg:h-[353px] rounded-xl overflow-hidden border"
    />
  );
};

export default NaverMapContainer;
