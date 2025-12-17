'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language } from '@/lib/translations';

interface LanguageContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    t: typeof translations.zh;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Language>('zh');

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('iracing-wiki-lang') as Language;
        if (saved && (saved === 'zh' || saved === 'en')) {
            setLang(saved);
        }
    }, []);

    const switchLang = (newLang: Language) => {
        setLang(newLang);
        localStorage.setItem('iracing-wiki-lang', newLang);
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang: switchLang, t: translations[lang] }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
