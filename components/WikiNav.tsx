'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';
import BackButton from './BackButton';

export default function WikiNav() {
    const { lang, setLang, t } = useLanguage();

    return (
        <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                <BackButton />
                <div className="flex items-center gap-4">
                    <Link href="/" className="font-bold italic text-white hidden sm:block">{t.appName}</Link>
                    <button
                        onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
                        className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors border border-slate-800 hover:border-slate-700 px-2 py-1 rounded-full"
                    >
                        <Globe className="w-3 h-3" />
                        <span>{lang === 'zh' ? 'EN' : '中'}</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
