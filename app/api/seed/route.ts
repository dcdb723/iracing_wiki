import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
    const dummyData = [
        {
            title: "Mercedes-AMG GT3 2020",
            slug: "mercedes-amg-gt3-2020",
            content: "The Mercedes-AMG GT3 2020 is a GT3 class racing car from Mercedes-AMG. It is an evolution of the previous model with improved aerodynamics and durability. A favorite in endurance races.",
            category: "Car",
            image_url: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1000&auto=format&fit=crop", // Placeholder
            metadata: { hp: "550", weight: "1285kg" }
        },
        {
            title: "Circuit de Spa-Francorchamps",
            slug: "spa-francorchamps",
            content: "Spa-Francorchamps is a legendary circuit in Stavelot, Belgium. Known for the Eau Rouge/Raidillon complex, it is one of the most challenging tracks in the world.",
            category: "Track",
            image_url: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1000&auto=format&fit=crop", // Placeholder
            metadata: { location: "Belgium", length: "7.004 km" }
        },
        {
            title: "Crew Chief",
            slug: "crew-chief",
            content: "Crew Chief is a third-party spotter and race engineer application for PC sim racing. It provides audible information about lap times, fuel, and opponents.",
            category: "Software",
            image_url: "",
            metadata: { type: "Voice Assistant", price: "Free" }
        },
        {
            title: "Formula Vee",
            slug: "formula-vee",
            content: "The Formula Vee is a popular open-wheel entry-level class based on pre-1963 Volkswagen Beetle components. It teaches momentum conservation and drafting.",
            category: "Car",
            image_url: "",
            metadata: { hp: "60", weight: "375kg" }
        }
    ];

    // Note: We are not generating embeddings here to keep it simple.
    // In production, you'd generate embeddings for these descriptions.

    const { data, error } = await supabase
        .from('wiki_entries')
        .upsert(dummyData, { onConflict: 'slug' })
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Seed successful", data });
}
