"use client";

import LocationPanel from "@/components/header/panels/locationpanel";
import { RouteSearchBody } from "@/feature/location/search/RouteSearchBody";
import { SearchState, useSearchStore } from "@/stores/map/seachstore";
import { Suspense } from "react";
import { useShallow } from "zustand/react/shallow";

export default function Location() {
  const { places } = useSearchStore(
    useShallow((state: SearchState) => ({
      places: state.places,
    }))
  );

  console.log(
    "[Location] - 현재 장소 개수 및 장소 데이터:",
    places.length,
    places
  );

  return (
    <LocationPanel>
      <Suspense fallback={null}>
        <RouteSearchBody />
      </Suspense>
    </LocationPanel>
  );
}
