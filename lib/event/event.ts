import type {
  EventApiResponse,
  EventDetail,
  EventDetailApiResponse,
  EventItem,
  EventLikeResponse,
  EventPartyApiItem,
  EventPartyListItem,
  FetchEventsParams,
  FetchEventsResult,
} from '@/types/event';

function mapEventItem(item: EventApiResponse['data'][number]): EventItem {
  const addressRegion = item.address?.split(' ') ?? [];

  return {
    id: item.id,
    title: item.title,
    startDate: item.start_date,
    endDate: item.end_date,
    region: addressRegion.length >= 2 ? `${addressRegion[0]} ${addressRegion[1]}` : addressRegion[0] ?? '',
    imageUrl: item.main_image ?? '/error/no-image.svg',
    event_images: item.event_images,
    overview: item.overview ?? '',
  };
}

export async function fetchEventsPage({
  limit,
  offset,
  category,
  region,
  month,
  keyword,
}: FetchEventsParams): Promise<FetchEventsResult> {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
    category,
    region,
    month,
    keyword,
  });

  const response = await fetch(`/api/events?${params.toString()}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Event API Request Fail');
  }

  const json: EventApiResponse = await response.json();

  return {
    mapped: (json.data ?? []).map(mapEventItem),
    pagination: json.pagination,
  };
}

export async function fetchEventDetail(eventId: number | string): Promise<EventDetail> {
  const response = await fetch(`/api/events/${eventId}`);

  if (!response.ok) {
    throw new Error('Event Detail Request Fail');
  }

  const json: EventDetailApiResponse = await response.json();
  return json.data;
}

export function mapEventPartyItem(party: unknown, eventTitle?: string): EventPartyListItem {
  const data = party as EventPartyApiItem;
  const gatheringDate = data.gathering_date;
  let date: string | undefined;
  let time: string | undefined;

  if (typeof gatheringDate === 'string' && gatheringDate.includes('T')) {
    const [datePart, timePart] = gatheringDate.split('T');
    date = datePart;
    time = timePart
      .replace('Z', '')
      .split('.')[0]
      .split('+')[0]
      .slice(0, 5);
  }

  const tags = Array.isArray(data.tags) ? data.tags : [];

  return {
    id: String(data.id ?? ''),
    partyName: data.name ?? '',
    current_members: data.current_members ?? 0,
    max_members: data.max_members ?? 0,
    description: data.description ?? '',
    location: data.location_name ?? '',
    date,
    time,
    hostId: data.owner_id ? String(data.owner_id) : undefined,
    eventName: data.events?.title ?? eventTitle,
    eventId: typeof data.event_id === 'number' ? data.event_id : undefined,
    locationLatitude: typeof data.location_latitude === 'number' ? data.location_latitude : undefined,
    locationLongitude: typeof data.location_longitude === 'number' ? data.location_longitude : undefined,
    label1: tags[0],
    label2: tags[1],
    label3: tags[2],
  };
}

export async function fetchEventLikeStatus(eventId: number | string): Promise<EventLikeResponse> {
  const response = await fetch(`/api/events/${eventId}/like`);

  if (!response.ok) {
    throw new Error('Event Like Status Request Fail');
  }

  return response.json();
}

export async function toggleEventLike(eventId: number | string): Promise<EventLikeResponse> {
  const response = await fetch(`/api/events/${eventId}/like`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Event Like Request Fail');
  }

  return response.json();
}
