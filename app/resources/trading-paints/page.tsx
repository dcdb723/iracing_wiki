'use client';

import React from 'react';
import { Paintbrush, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import WikiNav from '@/components/WikiNav';
import { useLanguage } from '@/context/LanguageContext';

export default function TradingPaintsPage() {
    const { t, lang } = useLanguage();

    const content = {
        zh: `
### 也就是我们常说的 TP

**Trading Paints** 是 iRacing 必不可少的第三方涂装工具。它允许你在比赛中展示自定义的赛车涂装，也能让你看到其他车手的个性化涂装。如果不安装这个软件，你就只能看到 iRacing 默认的白色赛车。

### 主要功能

*   **自定义涂装**：上传你自己的设计，或者使用社区创建的成千上万个免费涂装。
*   **无缝同步**：软件会在后台运行，自动下载当前会话中其他车手的涂装。
*   **Showroom**：浏览和收藏来自全球创作者的精彩设计。

👇 **【官方网站】** 👇

[**https://www.tradingpaints.com/**](https://www.tradingpaints.com/)

*(点击链接前往官网下载安装包)*
`,
        en: `
### The Essential Livery Tool

**Trading Paints** is the custom livery system for iRacing. It allows you to race with your own custom car designs and see the custom paint schemes of other drivers. Without it, you'll likely just see default white cars on track.

### Key Features

*   **Custom Liveries**: Upload your own designs or choose from thousands of community-created paints in the Showroom.
*   **Seamless Sync**: The desktop app runs in the background, automatically downloading paints for drivers in your session.
*   **Showroom**: Browse, race, and favorite designs from creators around the world.

👇 **【Official Website】** 👇

[**https://www.tradingpaints.com/**](https://www.tradingpaints.com/)

*(Click the link to visit the site and download)*
`
    };

    return (
        <main className="min-h-screen bg-slate-950">
            {/* Navigation */}
            <WikiNav />

            {/* Hero / Header */}
            <div className="relative">
                {/* Header Image */}
                <div className="w-full h-[40vh] md:h-[50vh] relative bg-slate-900 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950 z-10" />
                    {/* Placeholder Pattern */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-red via-slate-900 to-slate-950"></div>
                    <div className="absolute inset-0 flex items-center justify-center p-12">
                        <img
                            src="https://assets.tradingpaints.gg/illustrations/mypaints.svg"
                            alt="Trading Paints Illustration"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-20">
                    <div className="inline-flex items-center gap-2 bg-brand-red/20 border border-brand-red/30 text-brand-red px-3 py-1 rounded-full text-sm font-medium mb-4 backdrop-blur-md">
                        {t.tradingPaintsTag}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-xl">{t.tradingPaintsTitle}</h1>
                    <div className="flex items-center gap-4 text-slate-400 text-sm">
                        <span className="flex items-center gap-1">
                            {t.updated} 2024-01-01
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <article className="max-w-4xl mx-auto px-6 py-12">
                <div className="prose prose-invert prose-lg max-w-none">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkBreaks]}
                        components={{
                            h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-white mt-8 mb-4" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-white mt-8 mb-4 border-b border-slate-800 pb-2" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-white mt-6 mb-3" {...props} />,
                            p: ({ node, ...props }) => <p className="mb-4 text-slate-300 leading-relaxed" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 text-slate-300 space-y-2" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 text-slate-300 space-y-2" {...props} />,
                            li: ({ node, ...props }) => <li className="ml-4" {...props} />,
                            strong: ({ node, ...props }) => <strong className="text-brand-red font-bold" {...props} />,
                            a: ({ node, ...props }) => <a className="text-brand-red hover:underline break-all flex inline-flex items-center gap-1" target="_blank" rel="noopener noreferrer" {...props}><ExternalLink className="w-4 h-4" />{props.children}</a>,
                            blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-slate-700 pl-4 italic text-slate-400 my-4" {...props} />,
                        }}
                    >
                        {content[lang]}
                    </ReactMarkdown>
                </div>
            </article>
        </main>
    );
}
