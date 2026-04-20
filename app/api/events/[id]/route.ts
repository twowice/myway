import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const eventId = Number(id);

        if (!Number.isInteger(eventId) || eventId <= 0) {
            return NextResponse.json({ message: "Invalid id" }, { status: 400 });
        }

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
                latitude,
                longitude,
                phone,
                lcls1,
                lcls2,
                lcls3,
                api_modified_at,
                price,
                organizer,
                playtime,
                event_images (
                    image_url,
                    is_main
                )
            `)
            .eq("id", eventId)
            .maybeSingle();

        if (error) {
            console.error("Event detail query error:", error);
            return NextResponse.json(
                { message: error.message ?? "Event detail query failed" },
                { status: 500 }
            );
        }

        if (!data) {
            return NextResponse.json({ message: "Event not found" }, { status: 404 });
        }

        const images = Array.isArray(data.event_images) ? data.event_images : [];
        const mainImage = images.find(img => img?.is_main)?.image_url ?? null;
        const result = { ...data, main_image: mainImage, event_images: images };

        return NextResponse.json({ success: true, data: result });
    } catch (e: any) {
        console.error("Festival API Error:", e);

        return NextResponse.json(
            { message: e.message ?? "Server Error" },
            { status: 500 }
        );
    }
}
