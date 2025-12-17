import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { model, generateEmbedding } from '@/lib/gemini';

export async function POST(req: Request) {
    try {
        const { query, image } = await req.json();
        let searchHash = query;
        let isImageSearch = false;

        // 1. If Image is provided, analyze it first
        if (image) {
            isImageSearch = true;
            // Image is expected to be a base64 string or a part object that Gemini accepts
            // For simplicity, assuming the client sends the base64 string part without prefix if possible,
            // or we handle the inline data construction here.

            // Construct the parts
            const prompt = "Analyze this image efficiently. Identify the specific car model, the race track (if visible), and the context (e.g., specific racing series). Return a clear, concise search query string that would find relevant wiki articles. Example: 'Mercedes AMG GT3 Spa Francorchamps'. Do not add filler text.";

            const result = await model.generateContent([
                prompt,
                { inlineData: { data: image, mimeType: "image/jpeg" } }
            ]);
            const response = await result.response;
            searchHash = response.text().trim();
            console.log("Image Analysis Result:", searchHash);
        }

        if (!searchHash) {
            return NextResponse.json({ error: "No query provided" }, { status: 400 });
        }

        // 2. Search Logic (Hybrid)
        let semanticResults: any[] = [];
        let keywordResults: any[] = [];

        // A. Vector Search (Semantic)
        // We always generate an embedding for the "intent"
        try {
            const embedding = await generateEmbedding(searchHash);
            const { data: semData } = await supabase.rpc('match_wiki_entries', {
                query_embedding: embedding,
                match_threshold: 0.5,
                match_count: 5 // Get top 5 semantic matches
            });
            if (semData) semanticResults = semData;
        } catch (e) {
            console.error("Vector search failed", e);
        }

        // B. Keyword Search (Literal) - Only if it's a text query (not purely image-based inference, though we could)
        // If it's an image search, 'searchHash' is the AI description, which might be too long for an ilike query.
        // So we only do keyword search if the user typed something or the query is short.
        if (!image && query.length > 2) {
            const { data: keyData } = await supabase
                .from('wiki_entries')
                .select('*')
                .or(`title.ilike.%${query}%,category.ilike.%${query}%`)
                .limit(5);
            if (keyData) keywordResults = keyData;
        }

        // 3. Combine & Deduplicate
        // We prioritize Semantic results, then append Keyword results that aren't already there.
        const combinedMap = new Map();

        // Add Semantic matches first
        semanticResults.forEach((item: any) => combinedMap.set(item.id, item));

        // Add Keyword matches
        keywordResults.forEach((item: any) => {
            if (!combinedMap.has(item.id)) {
                combinedMap.set(item.id, item);
            }
        });

        const finalResults = Array.from(combinedMap.values());

        return NextResponse.json({
            results: finalResults,
            inferredQuery: isImageSearch ? searchHash : query
        });

    } catch (error: any) {
        console.error("Search API Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
