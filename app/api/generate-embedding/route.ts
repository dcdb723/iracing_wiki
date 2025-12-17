import { NextResponse } from 'next/server';
import { generateEmbedding } from '@/lib/gemini';

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        const embedding = await generateEmbedding(text);
        return NextResponse.json({ embedding });

    } catch (error: any) {
        console.error("Embedding API Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
