'use client';

import { Search, Camera, Mic, Paintbrush, Activity, Loader2, Globe } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { lang, setLang, t } = useLanguage();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/wiki/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSearching(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];

        // We call the API just to get the inferred query from the image
        // In a real app we might pass the image to the next page to show it
        // but here we want to convert "Image" -> "Text Query" -> "Results"
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64String })
        });
        const data = await response.json();

        if (data.inferredQuery) {
          router.push(`/wiki/search?q=${encodeURIComponent(data.inferredQuery)}`);
        } else {
          alert('Could not analyze image. Please try again.');
          setIsSearching(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Image upload failed", error);
      setIsSearching(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-brand-darker/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-red skew-x-[-12deg] flex items-center justify-center font-bold italic text-white rounded-sm">iR</div>
          <span className="text-xl font-bold tracking-tight italic">iRacing<span className="text-slate-400 font-normal ml-1">Wiki</span></span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
            className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700 hover:border-slate-500"
          >
            <Globe className="w-4 h-4" />
            <span>{lang === 'zh' ? 'English' : '中文'}</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center space-y-8 relative overflow-hidden">

        {/* Decorative Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-brand-red/5 rounded-full blur-3xl pointer-events-none" />

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight relative z-10">
          {lang === 'en' ? (
            <>
              {t.heroTitlePrefix} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-brand-blue italic pr-2">iRacing</span>
              {t.heroTitleSuffix}
            </>
          ) : (
            <>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-brand-blue italic pr-2">iRacing</span>
              {t.heroTitleSuffix}
            </>
          )}
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl relative z-10">
          {t.heroSubtitle}
        </p>

        {/* Search Component */}
        <div className="w-full max-w-2xl relative group z-10">
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-red to-brand-blue rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <form onSubmit={handleSearch} className="relative flex items-center bg-slate-900 border border-slate-800 rounded-xl p-2 shadow-2xl">
            <Search className="w-6 h-6 text-slate-500 ml-3 mr-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder:text-slate-600 h-10"
            />
            {/* Image Search Hidden by User Request
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSearching}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-lg border border-slate-800 transition-all disabled:opacity-50"
              >
                {isSearching ? <Loader2 className="w-5 h-5 animate-spin text-brand-blue" /> : <Camera className="w-5 h-5 text-brand-blue" />}
                <span className="hidden sm:inline text-sm font-medium">
                  {isSearching ? 'Analyzing...' : 'Image Search'}
                </span>
              </button>
            </div>
            */}
          </form>
        </div>

      </section>

      {/* Featured Resources Section */}
      <section id="resources" className="py-20 bg-slate-950/50 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">{t.featuredTitle}</h2>
            <p className="text-slate-400">{t.featuredSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Card 1 */}
            <Link href="/resources/qingmeng-voice-pack" className="block group relative bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-brand-blue/50 transition-all hover:shadow-lg hover:shadow-brand-blue/10 cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-slate-950 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <Mic className="w-6 h-6 text-brand-blue" />
                </div>
                <h3 className="text-xl font-bold group-hover:text-brand-blue transition-colors leading-tight">{t.card1Title}</h3>
              </div>
              <p className="text-slate-400 text-sm">{t.card1Desc}</p>
            </Link>

            {/* Card 2 */}
            <Link href="/resources/trading-paints" className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-brand-red/50 transition-all hover:shadow-lg hover:shadow-brand-red/10 cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-slate-950 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <Paintbrush className="w-6 h-6 text-brand-red" />
                </div>
                <h3 className="text-xl font-bold group-hover:text-brand-red transition-colors leading-tight">{t.card2Title}</h3>
              </div>
              <p className="text-slate-400 text-sm">{t.card2Desc}</p>
            </Link>

            {/* Card 3 */}
            <div className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-slate-950 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <Activity className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold group-hover:text-purple-500 transition-colors leading-tight">{t.card3Title}</h3>
              </div>
              <p className="text-slate-400 text-sm">{t.card3Desc}</p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-600 text-sm border-t border-slate-900 bg-brand-darker">
        <p>{t.footer}</p>
      </footer>
    </main>
  );
}
