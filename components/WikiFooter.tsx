'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function WikiFooter() {
    const { t } = useLanguage();

    return (
        <footer className="py-12 text-center text-slate-600 text-sm border-t border-slate-900/50 mt-12 bg-slate-950">
            <p>{t.footer}</p>
        </footer>
    );
}
