'use client';

import { Clock, X, ZoomIn } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useState } from 'react';

interface WikiHeaderProps {
    title: string;
    category: string;
    updatedAt: string;
    imageUrl: string | null;
}

export default function WikiHeader({ title, category, updatedAt, imageUrl }: WikiHeaderProps) {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            {imageUrl && (
                <>
                    <div
                        className="w-full h-[30vh] md:h-[40vh] relative group cursor-zoom-in"
                        onClick={() => setIsOpen(true)}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950 z-10" />

                        {/* Hover Overlay hint */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
                            <div className="bg-black/50 backdrop-blur-sm p-3 rounded-full text-white">
                                <ZoomIn className="w-6 h-6" />
                            </div>
                        </div>

                        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                    </div>

                    {/* Lightbox / Modal */}
                    {isOpen && (
                        <div
                            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
                            onClick={() => setIsOpen(false)}
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X className="w-8 h-8" />
                            </button>
                            <img
                                src={imageUrl}
                                alt={title}
                                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
                            />
                        </div>
                    )}
                </>
            )}

            <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-20">
                <div className="inline-flex items-center gap-2 bg-brand-blue/20 border border-brand-blue/30 text-brand-blue px-3 py-1 rounded-full text-sm font-medium mb-4 backdrop-blur-md">
                    {category}
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-xl">{title}</h1>
                <div className="flex items-center gap-4 text-slate-400 text-sm">
                    <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {t.updated} {new Date(updatedAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>
    );
}
