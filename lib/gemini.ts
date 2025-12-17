import { GoogleGenerativeAI } from '@google/generative-ai'

// Note: In a real production app, you might want to proxy this through your backend
// to keep the key secret, or use a restricted key if client-side.
// Since we are using the Free Tier for this personal project, we'll keep it simple for now.
// Ideally, this should still be called from a Server Action or API Route.

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

export const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
export const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' })

export async function generateEmbedding(text: string) {
    const result = await embeddingModel.embedContent(text)
    return result.embedding.values
}
