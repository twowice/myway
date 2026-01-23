export function markerDepartureDrawer(
    map: naver.maps.Map,
    latitude: number,
    longitude: number
) {
    const position = new naver.maps.LatLng(latitude, longitude)

    const markerOptions = {
        position: position,
        map: map,
        icon: '/marker/departure.svg'
    }

    const marker = new naver.maps.Marker(markerOptions)
    return marker
}

export function markerDestinationDrawer(
    map: naver.maps.Map,
    latitude: number,
    longitude: number
) {
    const position = new naver.maps.LatLng(latitude, longitude)

    const markerOptions = {
        position: position,
        map: map,
        icon: '/marker/destination.svg'
    }

    const marker = new naver.maps.Marker(markerOptions)
    return marker
}
