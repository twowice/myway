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
  const isMapScriptLoaded = useMapStore((state) => state.isMapScriptLoaded);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);
  const markerRef = useRef<naver.maps.Marker | null>(null);
  const html = renderToString(<Icon36 name="basicmarker" />);
  useEffect(() => {
    if (!mapRef.current) return;
    if (!isMapScriptLoaded || !window.naver || !window.naver.maps) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new naver.maps.Map(mapRef.current, {
        center: new naver.maps.LatLng(lat, lng),
        zoom: 15,
        scaleControl: false,
        logoControl: false,
      });
    } else {
      mapInstanceRef.current.setCenter(new naver.maps.LatLng(lat, lng));
    }

    const position = new naver.maps.LatLng(lat, lng);
    if (!markerRef.current) {
      markerRef.current = new naver.maps.Marker({
        position,
        map: mapInstanceRef.current,
        icon: {
          content: html,
          size: new naver.maps.Size(27, 36),
          anchor: new naver.maps.Point(13.5, 36),
        },
      });
    } else {
      markerRef.current.setPosition(position);
    }
  }, [html, isMapScriptLoaded, lat, lng]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy?.();
        mapInstanceRef.current = null;
      }
      markerRef.current = null;
    };
  }, []);

  return (
    <div
      ref={mapRef}
      className="w-full h-[260px] md:h-[320px] lg:h-[353px] rounded-xl overflow-hidden border"
    />
  );
};

export default NaverMapContainer;
