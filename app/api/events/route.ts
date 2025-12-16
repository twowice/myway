import { supabase } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const uid = request.headers.get('X-User-ID');

    if(uid === null || uid === ""){
        return NextResponse.json({ error: "Unauthorized: No user info" }, { status: 401 })
    }
}