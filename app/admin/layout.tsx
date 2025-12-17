'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { LayoutDashboard, FileText, LogOut } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
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
                <div className="mb-8">
                    <div className="w-8 h-8 bg-brand-red skew-x-[-12deg] flex items-center justify-center font-bold italic text-white rounded-sm mb-2">iR</div>
                    <h1 className="text-xl font-bold">Admin Panel</h1>
                </div>

                <nav className="space-y-2 flex-1">
                    <Link href="/admin" className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${pathname === '/admin' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link href="/admin/editor" className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${pathname.includes('/admin/editor') ? 'bg-brand-blue text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <FileText className="w-5 h-5" />
                        New Entry
                    </Link>
                </nav>

                <button
                    onClick={() => supabase.auth.signOut()}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors mt-auto"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
