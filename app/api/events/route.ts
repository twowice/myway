import { supabase } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    try {
        const { data, error } = await supabase
        .from("events")
        .select(`
            id,
            category,
            title,
            description,
            start_date,
            end_date,
            region,
            address,
            latitude,
            longitude,
            homepage_url,
            phone,
            price,
            insta_url,
            created_at,
            updated_at,
            event_images (image_url)
        `)
        .order("created_at", { ascending: false });

        if (error) { return NextResponse.json({ message: error.message }, { status: 500 }); }

        const events = data.map((event) => {
            const images = event.event_images?.map((img) => {
                const { data } = supabase.storage
                .from("event-images")
                .getPublicUrl(img.image_url);

                return data.publicUrl;
            }) ?? [];

            return {
                ...event,
                images,
                event_images: undefined,
            };
        });

        return NextResponse.json(events, { status: 200 });
    }catch (e) { return NextResponse.json({ message: "Internal Server Error" }, { status: 500 }); }
}