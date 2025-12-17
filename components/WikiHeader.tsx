'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface WikiHeaderProps {
    title: string;
    category: string;
    updatedAt: string;
    imageUrl: string | null;
}

export default function WikiHeader({ title, category, updatedAt, imageUrl }: WikiHeaderProps) {
    const { t } = useLanguage();

    return (
        <div className="relative">
            {imageUrl && (
                <div className="w-full h-[40vh] md:h-[50vh] relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950 z-10" />
                    <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                </div>
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
