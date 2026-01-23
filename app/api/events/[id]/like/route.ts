/* ===========================
    Event Like
=========================== */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest, context: any) {
    try {
        const params = await context.params;
        const eventId = Number(params.id);

        if(!eventId) return NextResponse.json({ message: "Invalid event id" }, { status: 400 });

        /* ===========================
            Login Check
        =========================== */
        const session = await auth()
        if (!session) return NextResponse.json({ message: "❌ Session error" }, { status: 401 });
        
        const userId = session?.user.id;
        console.log("userId: ", userId);

        /* ===========================
            Like SELECT
        =========================== */
        const { data: liked, error } = await supabase
            .from("liked_events")
            .select("id")
            .eq("event_id", eventId)
            .eq("user_id", userId)
            .single();

        if (error && error.code !== "PGRST116") {
            console.error("Like Check Error:", error);
            return NextResponse.json({ message: "Like check error" }, { status: 500 });
        }

        return NextResponse.json({ liked: !!liked }); // row가 있으면 true 없으면 false


    }catch(e) { console.error(e); return NextResponse.json( { message: "Like API Error" }, { status: 500 } )}
}

export async function POST(req: NextRequest, context: any) {
    try {
        const params = await context.params;
        const eventId = Number(params.id);

        if(!eventId) return NextResponse.json({ message: "Invalid event id" }, { status: 400 });

        /* ===========================
            Login Check
        =========================== */
        const session = await auth()
         if (!session) {
            return NextResponse.json({ message: "❌ Session error" }, { status: 401 });
        }
        const userId = session?.user.id;

        
        /* ===========================
            Like Check
        =========================== */
        const { data: liked } = await supabase
            .from("liked_events")
            .select("id")
            .eq("event_id", eventId)
            .eq("user_id", userId)
            .single();
        
        /* ===========================
            Like Cancle
        =========================== */
        if(liked) {
            await supabase
                .from("liked_events")
                .delete()
                .eq("event_id", eventId)
                .eq("user_id", userId)
            
            await supabase.rpc("decrease_event_like", { event_id: eventId })
            
            return NextResponse.json({ liked: false, message: "Like removed" }) 
        }

        /* ===========================
            Like Add
        =========================== */
        const { data, error } = await supabase.from("liked_events").insert({
            event_id: eventId,
            user_id: userId,
        });
        if (error) console.error("Insert Error:", error);

        await supabase.rpc("increase_event_like", { event_id: eventId })

        return NextResponse.json({ liked: true, message: "Liked" })
    }catch(e) { console.error(e); return NextResponse.json( { message: "Like API Error" }, { status: 500 } )}
}