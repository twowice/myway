export interface UserReportData {
   id?: number;
   reported_user_id: number;
   reported_user_name: string;
   reporter_id: number;
   reporter_name: string;
   report_category: string;
   report_content: string;
   report_chat: string;
   report_date: string;
   sanction_type: string;
   sanction_period?: string;
   is_processed: boolean;
   add_opinion?: string;
   created_at?: string;
   insta_url: string;
   organizer: string;
}

export interface PartyReportData {
   id?: number;
   party_id: number;
   party_name: string;
   party_chairman_id: number;
   party_chairman_name: string;
   reporter_id: number;
   reporter_name: string;
   report_category: string;
   report_content: string;
   report_date: string;
   sanction_type: string;
   sanction_period?: string;
   party_dissolution_date?: string;
   is_processed: boolean;
   add_opinion?: string;
   created_at?: string;
   updated_at?: string;
}

export interface EventImage {
   id?: number;
   event_id: number;
   image_url: string;
   is_main?: boolean;
   created_at?: string;
}

export interface EventData {
   id?: number;
   content_id?: number;
   title: string;
   start_date: string;
   end_date: string;
   playtime?: string;
   address?: string;
   address2?: string;
   area_code?: string;
   sigungu_code?: string;
   latitude?: number;
   longitude?: number;
   phone?: string;
   cat1?: string;
   cat2?: string;
   cat3?: string;
   lcls1?: string;
   lcls2?: string;
   lcls3?: string;
   homepage?: string;
   overview?: string;
   price?: number;
   insta_url?: string;
   api_modified_at?: string;
   created_at?: string;
   updated_at?: string;
   event_images?: EventImage[];
   organizer?: string;
   status?: string;
}

export interface EventDisplayData {
   id: number;
   name: string;
   host: string;
   period: string;
   operating_hours: string;
   price: string;
   location: string;
   state: string;
   phone: string;
   insta_url: string;
}
export interface NoticeData {
   id?: number;
   title: string;
   content: string;
   created_at: string;
   updated_at: string;
   is_top_fixed: boolean;
   category: string;
}

export interface NoticeDisplayData {
   id: number;
   category: string;
   title: string;
   created_at: string;
   is_top_fixed: boolean;
}
