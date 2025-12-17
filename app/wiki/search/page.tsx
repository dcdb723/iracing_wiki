'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Search, Loader2, ArrowRight, ExternalLink, Home, ArrowLeft, Globe, Paintbrush } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import WikiFooter from '@/components/WikiFooter';
import ContributeModal from '@/components/ContributeModal';

function SearchResults() {
    const searchParams = useSearchParams();
    const rawQuery = searchParams.get('q') || '';
    const query = decodeURIComponent(rawQuery);

    const { lang, setLang, t } = useLanguage();

    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isContributeOpen, setIsContributeOpen] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/search', {
                    method: 'POST',
                    body: JSON.stringify({ query }),
                });
                const data = await response.json();
                setResults(data.results || []);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };

        if (query) {
            fetchResults();
        } else {
            setIsLoading(false);
        }
    }, [query]);

    const externalSearchUrl = (engine: string) => {
        const q = `iracing ${query}`;
        if (engine === 'google') return `https://www.google.com/search?q=${encodeURIComponent(q)}`;
        if (engine === 'bing') return `https://www.bing.com/search?q=${encodeURIComponent(q)}`;
        if (engine === 'baidu') return `https://www.baidu.com/s?wd=${encodeURIComponent(q)}`;
        return '#';
    };

    return (
        <main className="min-h-screen flex flex-col bg-slate-950">
            <ContributeModal
                isOpen={isContributeOpen}
                onClose={() => setIsContributeOpen(false)}
            />
            {/* Simple Navbar - Just Identity & Language */}
            <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md p-4 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-brand-red skew-x-[-12deg] flex items-center justify-center font-bold italic text-white rounded-sm group-hover:bg-red-500 transition-colors">iR</div>
                        <span className="font-bold text-lg hidden sm:block">{t.appName}</span>
                    </Link>
                    <button
                        onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
                        className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors border border-transparent hover:border-slate-800 px-3 py-1.5 rounded-full"
                    >
                        <Globe className="w-4 h-4" />
                        <span>{lang === 'zh' ? 'English' : '中文'}</span>
                    </button>
                </div>
            </nav>

            <div className="flex-1 max-w-4xl mx-auto w-full p-6 space-y-8">
                {/* Header Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-full transition-colors group" title={t.home}>
                            <div className="flex items-center gap-1">
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                <Home className="w-5 h-5" />
                            </div>
                        </Link>
                        <h1 className="text-3xl font-bold">{t.searchResults}</h1>
                    </div>

                    {/* Search Input - Prominent */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-4 py-4 text-lg focus:border-brand-blue outline-none transition-colors shadow-lg"
                            placeholder={t.refineSearch}
                            defaultValue={query}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    window.location.href = `/wiki/search?q=${encodeURIComponent(e.currentTarget.value)}`;
                                }
                            }}
                        />
                    </div>

                    <p className="text-slate-400">{t.foundResultsFor} <span className="text-brand-blue">"{query}"</span></p>
                </div>

                {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-slate-500">
                        <Loader2 className="w-10 h-10 animate-spin mb-4 text-brand-blue" />
                        <p>{t.scanning}</p>
                    </div>
                ) : results.length > 0 ? (
                    <div className="space-y-12">
                        <div className="grid gap-4">
                            {results.map((item: any) => (
                                <Link
                                    key={item.id}
                                    href={`/wiki/${item.slug}`}
                                    className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl hover:border-brand-blue/50 hover:bg-slate-900 transition-all group"
                                >
                                    <div className="flex gap-4">
                                        {item.image_url && (
                                            <div className="w-24 h-24 shrink-0 bg-slate-950 rounded-lg overflow-hidden hidden sm:block">
                                                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                            </div>
                                        )}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs text-slate-400 border border-slate-700">{item.category}</span>
                                                <h2 className="text-xl font-bold text-white group-hover:text-brand-blue transition-colors">{item.title}</h2>
                                            </div>
                                            <p className="text-slate-400 text-sm line-clamp-2">{item.content}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Fallback Search Options - Always shown now */}
                        <div className="text-center space-y-4 pt-8 border-t border-slate-800/50">
                            <p className="text-slate-500 text-sm">{t.fallbackSearchPrompt}</p>
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <a
                                    href={externalSearchUrl('google')}
                                    target="_blank"
                                    className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-800 px-4 py-2 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors text-sm text-slate-400 hover:text-white"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    {t.searchGoogle}
                                </a>
                                <a
                                    href={externalSearchUrl('bing')}
                                    target="_blank"
                                    className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-800 px-4 py-2 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors text-sm text-slate-400 hover:text-white"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    {t.searchBing}
                                </a>
                                <a
                                    href={externalSearchUrl('baidu')}
                                    target="_blank"
                                    className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-800 px-4 py-2 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors text-sm text-slate-400 hover:text-white"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    {t.searchBaidu}
                                </a>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center space-y-4">
                            <Search className="w-12 h-12 text-slate-600 mx-auto" />
                            <h3 className="text-xl font-semibold">{t.noResultsTitle}</h3>
                            <p className="text-slate-400 max-w-md mx-auto">{t.noResultsDesc}</p>

                            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                                <a
                                    href={externalSearchUrl('google')}
                                    target="_blank"
                                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg border border-slate-700 transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    {t.searchGoogle}
                                </a>
                                <a
                                    href={externalSearchUrl('bing')}
                                    target="_blank"
                                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg border border-slate-700 transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    {t.searchBing}
                                </a>
                                <a
                                    href={externalSearchUrl('baidu')}
                                    target="_blank"
                                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg border border-slate-700 transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    {t.searchBaidu}
                                </a>
                            </div>

                            <div className="pt-8 border-t border-slate-800 w-full mt-8">
                                <p className="text-slate-400 mb-4 text-sm">{t.contributeDesc}</p>
                                <button
                                    onClick={() => setIsContributeOpen(true)}
                                    className="bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue border border-brand-blue/50 hover:border-brand-blue px-6 py-3 rounded-lg flex items-center justify-center gap-2 mx-auto transition-all"
                                >
                                    <Paintbrush className="w-5 h-5" />
                                    {t.contributeTitle}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
            <WikiFooter />
        </main>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>}>
            <SearchResults />
        </Suspense>
    );
}
