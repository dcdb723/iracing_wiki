'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { LayoutDashboard, FileText, LogOut, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { lang, setLang, t } = useLanguage();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            // If no session and not on login page, redirect to login
            if (!session && pathname !== '/admin/login') {
                router.push('/admin/login');
            }
            // If session exists and on login page, redirect to dashboard
            else if (session && pathname === '/admin/login') {
                router.push('/admin');
            }

            setIsLoading(false);
        };

        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session && pathname !== '/admin/login') {
                router.push('/admin/login');
            }
        });

        return () => subscription.unsubscribe();
    }, [pathname, router]);

    if (isLoading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading Admin...</div>;

    // Don't show sidebar on login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen flex bg-slate-950 text-slate-100">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-800 bg-slate-900 p-6 flex flex-col">
                <div className="mb-8 flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-red skew-x-[-12deg] flex items-center justify-center font-bold italic text-white rounded-sm shrink-0">iR</div>
                    <h1 className="text-xl font-bold">{t.adminPanel}</h1>
                </div>

                <nav className="space-y-2 flex-1">
                    <Link href="/admin" className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${pathname === '/admin' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <LayoutDashboard className="w-5 h-5" />
                        {t.adminDashboard}
                    </Link>
                    <Link href="/admin/editor" className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${pathname.includes('/admin/editor') ? 'bg-brand-blue text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <FileText className="w-5 h-5" />
                        {t.adminNewEntry}
                    </Link>
                </nav>

                <button
                    onClick={() => supabase.auth.signOut()}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors mt-auto"
                >
                    <LogOut className="w-5 h-5" />
                    {t.adminSignOut}
                </button>

                <div className="mt-4 pt-4 border-t border-slate-800">
                    <button
                        onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors w-full text-left"
                    >
                        <Globe className="w-5 h-5" />
                        <span>{lang === 'zh' ? 'English' : '中文'}</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
