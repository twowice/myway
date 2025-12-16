export interface UserReportData {
   user_name: string;
   phone_number: string;
   event_name: string;
   sanction_content: string;
   sanction_chat: string;
   reporter_name: string;
   report_date: string;
   report_category: string;
   sanction_type: string;
   sanction_period: string;
   add_opinion: string;
   is_processed: boolean; // 신고 처리 여부
}

export interface PartyReportData {
   user_name: string;
   party_name: string;
   party_chairman_name: string;
   report_date: string;
   party_dissolution_date: string;
   sanction_content: string;
   sanction_type: string;
   reporter_name: string;
   report_category: string;
   add_opinion: string;
   event_name: string;
   is_processed: boolean;
}
