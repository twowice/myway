import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest, context: any) {
    try {
        /* ===========================
            Login Check
        =========================== */
        const session = await auth()
        if (!session) return NextResponse.json({ message: "❌ Session error" }, { status: 401 });
        
        /* ===========================
            Body
        =========================== */
        const body = await req.json();
        const {
            createdAt,
            reportedUserId,
            reportedUserName,
            reporterUserId,
            reporterUserName,
            reportContent,
            reportChat,
            reportDate,
            category,
            addOpinion,
        } = body;

        /* ===========================
            Exception Check
        =========================== */
        if (
            !createdAt ||
            !reportedUserId ||
            !reportedUserName ||
            !reporterUserId ||
            !reporterUserName ||
            !reportContent ||
            !reportChat ||
            !reportDate ||
            !category
        ) { return NextResponse.json({ message: "필수 값이 누락되었습니다." },{ status: 400 }); }

        /* ===========================
            DB INSERT
        =========================== */
        const { error } = await supabase
            .from("user_reports")
            .insert({
                reported_user_id: reportedUserId,
                reported_user_name: reportedUserName,
                reporter_user_id: reporterUserId,
                reporter_user_name: reporterUserName,
                report_content: reportContent,
                report_chat: reportChat,
                report_date: new Date(reportDate),
                category,
                add_opinion: addOpinion ?? null,
                sanction_type: "none",
                is_processed: false,
            });
        
        if (error) console.error("Insert Error:", error);

        /* ===========================
            Response
        =========================== */
        return NextResponse.json({ success: true }, { status: 200 });
    }catch(e) { console.error(e); return NextResponse.json( { message: "Report API Error" }, { status: 500 } )}
}