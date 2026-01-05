import type { RouteSearchHistory } from "@/lib/map/history";
import type { SelectedPlace } from "@/types/map/place";
import { SharedRouteResponse } from "@/types/map/sharedRoute";

export type RoutePlaces = {
  startPlace: SelectedPlace;
  endPlace: SelectedPlace;
};

export const historyToPlaces = (history: RouteSearchHistory): RoutePlaces => {
  const startPlace: SelectedPlace = {
    order: 1,
    name: history.departure_name,
    address: history.departure_address ?? "",
    roadAddress: history.departure_road_address ?? "",
    category: history.departure_category ?? "",
    telephone: history.departure_telephone ?? undefined,
    link: history.departure_link ?? undefined,
    lat: history.departure_latitude,
    lng: history.departure_longitude,
  };
  const endPlace: SelectedPlace = {
    order: 2,
    name: history.destination_name,
    address: history.destination_address ?? "",
    roadAddress: history.destination_road_address ?? "",
    category: history.destination_category ?? "",
    telephone: history.destination_telephone ?? undefined,
    link: history.destination_link ?? undefined,
    lat: history.destination_latitude,
    lng: history.destination_longitude,
  };

  return { startPlace, endPlace };
};

export const sharedRouteToPlaces = (
  shared: SharedRouteResponse
): RoutePlaces => {
  const startPlace: SelectedPlace = {
    order: 1,
    name: shared.departure.name,
    address: shared.departure.address ?? "",
    roadAddress: shared.departure.roadAddress ?? "",
    category: shared.departure.category ?? "",
    telephone: shared.departure.telephone ?? undefined,
    link: shared.departure.link ?? undefined,
    lat: shared.departure.latitude,
    lng: shared.departure.longitude,
  };
  const endPlace: SelectedPlace = {
    order: 2,
    name: shared.destination.name,
    address: shared.destination.address ?? "",
    roadAddress: shared.destination.roadAddress ?? "",
    category: shared.destination.category ?? "",
    telephone: shared.destination.telephone ?? undefined,
    link: shared.destination.link ?? undefined,
    lat: shared.destination.latitude,
    lng: shared.destination.longitude,
  };

  return { startPlace, endPlace };
};
