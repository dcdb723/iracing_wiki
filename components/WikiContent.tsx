'use client';

import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';

interface WikiContentProps {
    content: string;
}

export default function WikiContent({ content }: WikiContentProps) {
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    return (
        <>
            <div className="prose prose-lg max-w-none bg-white/95 backdrop-blur-sm p-8 rounded-2xl border border-slate-200/20 shadow-2xl">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                        h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3" {...props} />,
                        p: ({ node, ...props }) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 text-gray-700 space-y-2" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 text-gray-700 space-y-2" {...props} />,
                        li: ({ node, ...props }) => <li className="ml-4" {...props} />,
                        strong: ({ node, ...props }) => <strong className="text-gray-900 font-bold" {...props} />,
                        a: ({ node, ...props }) => <a className="text-brand-blue hover:underline" {...props} />,
                        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4" {...props} />,
                        code: ({ node, ...props }) => <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-pink-600" {...props} />,
                        img: ({ node, ...props }) => (
                            <span className="relative group cursor-zoom-in my-6 inline-block w-full" onClick={() => setLightboxImage((props.src as string) || '')}>
                                <img
                                    {...props}
                                    className="rounded-lg shadow-lg w-full hover:shadow-xl transition-shadow"
                                />
                                <span className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <span className="bg-black/50 backdrop-blur-sm p-2 rounded-full text-white">
                                        <ZoomIn className="w-5 h-5" />
                                    </span>
                                </span>
                            </span>
                        ),
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>

            {/* Image Lightbox */}
            {lightboxImage && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setLightboxImage(null)}
                >
                    <button
                        onClick={() => setLightboxImage(null)}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <X className="w-8 h-8" />
                    </button>
                    <img
                        src={lightboxImage}
                        alt="Enlarged view"
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    );
}
