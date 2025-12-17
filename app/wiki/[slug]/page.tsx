import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import BackButton from '@/components/BackButton';
import WikiNav from '@/components/WikiNav';
import WikiHeader from '@/components/WikiHeader';
import WikiFooter from '@/components/WikiFooter';

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
                <div className="prose prose-invert prose-lg max-w-none">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkBreaks]}
                        components={{
                            h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-white mt-8 mb-4" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-white mt-8 mb-4 border-b border-slate-800 pb-2" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-white mt-6 mb-3" {...props} />,
                            p: ({ node, ...props }) => <p className="mb-4 text-slate-300 leading-relaxed" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 text-slate-300 space-y-2" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 text-slate-300 space-y-2" {...props} />,
                            li: ({ node, ...props }) => <li className="ml-4" {...props} />,
                            strong: ({ node, ...props }) => <strong className="text-white font-bold" {...props} />,
                            a: ({ node, ...props }) => <a className="text-brand-blue hover:underline" {...props} />,
                            blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-slate-700 pl-4 italic text-slate-400 my-4" {...props} />,
                            code: ({ node, ...props }) => <code className="bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono text-pink-400" {...props} />,
                        }}
                    >
                        {normalizedContent}
                    </ReactMarkdown>
                </div>
            </article>
            <WikiFooter />
        </main>
    );
}
