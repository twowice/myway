import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest, context: any) {
    try {
        
    }catch(e) { console.error(e); return NextResponse.json( { message: "Report API Error" }, { status: 500 } )}
}