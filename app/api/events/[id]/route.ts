import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }){

    try {
        /* ===========================
           Query Params
        =========================== */
        const { id } = await params;

        const eventId = Number(id);
        if (!eventId) return NextResponse.json({ message: "Invalid id" }, { status: 400 });
        

        /* ===========================
           Supabase Query
        =========================== */
        const { data, error } = await supabase
            .from("events")
            .select(`
                id,
                content_id,
                title,
                start_date,
                end_date,
                homepage,
                overview,
                address,
                address2,
                area_code,
                sigungu_code,
                latitude,
                longitude,
                phone,
                cat1,
                cat2,
                cat3,
                lcls1,
                lcls2,
                lcls3,
                api_modified_at,
                event_images (
                    image_url,
                    is_main
                ),
                price,
                insta_url
            `)
            .eq("id", eventId)
            .single();
        
        if (error || !data) return NextResponse.json({ message: "Event not found" }, { status: 404 });

        /* ===========================
           Main Image
        =========================== */
        const images = Array.isArray(data.event_images) ? data.event_images : [];
        const mainImage = images.find(img => img?.is_main)?.image_url ?? null;
        const result = { ...data, main_image: mainImage, event_images: images }

        return NextResponse.json({ success: true, data: result });
        
    }catch (e: any) { console.error("Festival API Error:", e); 
    return NextResponse.json({ message: e.message ?? "Server Error" }, { status: 500 }); }
}