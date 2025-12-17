'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function BackButton() {
    const router = useRouter();
    const { t } = useLanguage();

    return (
        <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{t.backToSearch}</span>
        </button>
    );
}
