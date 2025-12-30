import type { RouteSearchHistoryPayload } from "@/lib/map/history";
import type { SelectedPlace } from "@/types/map/place";

type RouteSummary = {
  totalTimeSeconds?: number | null;
  totalFare?: number | null;
  mapObjectId?: string | null;
};

export const placesToHistoryPayload = ({
  startPlace,
  endPlace,
  rawResponse,
  summary,
}: {
  startPlace: SelectedPlace;
  endPlace: SelectedPlace;
  rawResponse: unknown;
  summary?: RouteSummary;
}): RouteSearchHistoryPayload => {
  return {
    departure_name: startPlace.name,
    departure_latitude: startPlace.lat,
    departure_longitude: startPlace.lng,
    departure_address: startPlace.address,
    departure_road_address: startPlace.roadAddress,
    departure_category: startPlace.category,
    departure_telephone: startPlace.telephone ?? null,
    departure_link: startPlace.link ?? null,
    destination_name: endPlace.name,
    destination_latitude: endPlace.lat,
    destination_longitude: endPlace.lng,
    destination_address: endPlace.address,
    destination_road_address: endPlace.roadAddress,
    destination_category: endPlace.category,
    destination_telephone: endPlace.telephone ?? null,
    destination_link: endPlace.link ?? null,
    total_time_seconds: summary?.totalTimeSeconds ?? null,
    total_fare: summary?.totalFare ?? null,
    map_object_id: summary?.mapObjectId ?? null,
    raw_response: rawResponse,
  };
};
