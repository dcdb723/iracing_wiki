import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import BackButton from '@/components/BackButton';
import WikiNav from '@/components/WikiNav';
import WikiHeader from '@/components/WikiHeader';
import WikiFooter from '@/components/WikiFooter';
import WikiContent from '@/components/WikiContent';

// Generate Metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const { data: entry } = await supabase.from('wiki_entries').select('title, content').eq('slug', slug).single();

    if (!entry) return { title: 'Not Found' };

    return {
        title: `${entry.title} - iRacing Wiki`,
        description: entry.content?.substring(0, 160) || 'Wiki Entry',
    };
}

// Server Component (Async)
export default async function WikiEntryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { data: entry } = await supabase
        .from('wiki_entries')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!entry) {
        notFound();
    }

    // Safety fix: normalize newlines. Sometimes SQL inputs store literal "\n" string instead of newline char.
    const normalizedContent = entry.content ? entry.content.replace(/\\n/g, '\n') : '';

    // Extract first image from markdown content as fallback if no image_url
    let displayImageUrl = entry.image_url;
    if (!displayImageUrl && normalizedContent) {
        const imgMatch = normalizedContent.match(/!\[.*?\]\((.*?)\)/);
        if (imgMatch && imgMatch[1]) {
            displayImageUrl = imgMatch[1];
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 flex flex-col">
            {/* Navigation - Client Component for Language state */}
            <WikiNav />

            {/* Hero / Header - Client Component for localized labels */}
            <WikiHeader
                title={entry.title}
                category={entry.category}
                updatedAt={entry.updated_at}
                imageUrl={displayImageUrl}
            />

            {/* Content */}
            <article className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full">
                <WikiContent content={normalizedContent} />
            </article>
            <WikiFooter />
        </main>
    );
}
