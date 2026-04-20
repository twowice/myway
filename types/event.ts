export type EventItem = {
  id: number;
  region: string;
  title: string;
  startDate: string;
  endDate: string;
  overview: string;
  imageUrl: string;
  event_images: string;
};

export type EventApiItem = {
  id: number;
  address?: string | null;
  title: string;
  start_date: string;
  end_date: string;
  overview?: string | null;
  main_image?: string | null;
  event_images: string;
};

export type EventPagination = {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  nextOffset: number | null;
};

export type EventApiResponse = {
  success: boolean;
  data: EventApiItem[];
  pagination: EventPagination;
};

export type FetchEventsParams = {
  limit: number;
  offset: number;
  category: string;
  region: string;
  month: string;
  keyword: string;
};

export type FetchEventsResult = {
  mapped: EventItem[];
  pagination: EventPagination;
};

export type EventLikeResponse = {
  liked: boolean;
  message?: string;
};

export type EventImage = {
  image_url: string;
  is_main: boolean;
};

export type EventDetail = {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  address: string;
  address2: string;
  latitude: number;
  longitude: number;
  phone: string;
  main_image: string;
  homepage?: string;
  overview?: string;
  event_images?: EventImage[];
  price?: string | null;
  insta_url?: string | null;
};

export type EventDetailApiResponse = {
  success: boolean;
  data: EventDetail;
};

export type EventPartyListItem = {
  id: string;
  partyName: string;
  current_members: number;
  max_members: number;
  description?: string;
  location?: string;
  date?: string;
  time?: string;
  hostId?: string;
  eventName?: string;
  eventId?: number;
  locationLatitude?: number;
  locationLongitude?: number;
  label1?: string;
  label2?: string;
  label3?: string;
};

export type EventPartyApiItem = {
  id?: number;
  name?: string;
  current_members?: number;
  max_members?: number;
  description?: string;
  location_name?: string;
  location_latitude?: number;
  location_longitude?: number;
  gathering_date?: string;
  owner_id?: string;
  tags?: string[];
  event_id?: number;
  events?: { title?: string };
};
