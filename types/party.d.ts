export type CreatePartyPayload = {
  partyName?: string;
  description?: string;
  max_members?: string | number;
  label1?: string;
  label2?: string;
  label3?: string;
  eventId?: number;
  date?: string;
  time?: string;
  location?: string;
  locationLatitude?: number;
  locationLongitude?: number;
};

export type UpdatePartyPayload = CreatePartyPayload & {
  id?: string | number;
};
