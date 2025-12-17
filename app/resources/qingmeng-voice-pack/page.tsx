'use client';

import React from 'react';
import { Mic } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import WikiNav from '@/components/WikiNav';
import WikiFooter from '@/components/WikiFooter';
import { useLanguage } from '@/context/LanguageContext';
import qingmengBg from './qingmeng.jpg';

export default function QingmengVoicePage() {
    const { t } = useLanguage();

    // User requested single-language content for the body text
    const content = `
### 联盟资源库 (Resources)

**【必装】MeiMei领航员语音包最新版本v1.1**

联盟荣誉出品，可能是你最需要的中文语音包。

👇 **【下载传送门 - DOWNLOAD】** 👇
（推荐使用PC端下载，解压后按教程安装）

*   **Github (推荐！全球同步更新):** [https://github.com/Qingmeng-iRacing/Qingmeng-MeiMei-voice-pack](https://github.com/Qingmeng-iRacing/Qingmeng-MeiMei-voice-pack)
*   **百度网盘① (提取码: 2025):** [https://pan.baidu.com/s/1uEoSx_-xpnSSg5rko_a0vQ](https://pan.baidu.com/s/1uEoSx_-xpnSSg5rko_a0vQ)
*   **百度网盘② (提取码: 1984):** [https://pan.baidu.com/s/1JqasT7-oRcFrOYy7ENBBug?pwd=1984](https://pan.baidu.com/s/1JqasT7-oRcFrOYy7ENBBug?pwd=1984)
*   **夸克网盘 (提取码: Yaew):** [https://pan.quark.cn/s/11d4b65092ac](https://pan.quark.cn/s/11d4b65092ac)
*   **城通网盘 (访问密码: 8680):** [https://url36.ctfile.com/f/65468336-8529784957-77f321?p=8680](https://url36.ctfile.com/f/65468336-8529784957-77f321?p=8680)
*   **腾讯微云:** [https://share.weiyun.com/EwUpb49P](https://share.weiyun.com/EwUpb49P)
`;

    return (
        <main className="min-h-screen bg-slate-950">
            {/* Navigation */}
            <WikiNav />

            {/* Hero / Header */}
            <div className="relative">
                {/* Header Image */}
                <div className="w-full h-[30vh] md:h-[40vh] relative bg-slate-950 overflow-hidden">
                    {/* Blurred Background Layer */}
                    <div
                        className="absolute inset-0 bg-cover bg-center blur-3xl scale-110 opacity-50"
                        style={{ backgroundImage: `url(${qingmengBg.src})` }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950 z-20" />

                    {/* Main Image */}
                    <img
                        src={qingmengBg.src}
                        alt="Qingmeng Voice Pack"
                        className="relative z-10 w-full h-full object-contain shadow-2xl drop-shadow-2xl"
                    />
                </div>

                <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-20">
                    <div className="inline-flex items-center gap-2 bg-brand-blue/20 border border-brand-blue/30 text-brand-blue px-3 py-1 rounded-full text-sm font-medium mb-4 backdrop-blur-md">
                        {t.voicePackTag}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-xl">{t.voicePackTitle}</h1>
                    <div className="flex items-center gap-4 text-slate-400 text-sm">
                        <span className="flex items-center gap-1">
                            {t.updated} 2024-03-20
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
                            strong: ({ node, ...props }) => <strong className="text-brand-blue font-bold" {...props} />,
                            a: ({ node, ...props }) => <a className="text-brand-blue hover:underline break-all" target="_blank" rel="noopener noreferrer" {...props} />,
                            blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-slate-700 pl-4 italic text-slate-400 my-4" {...props} />,
                            code: ({ node, ...props }) => <code className="bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono text-pink-400" {...props} />,
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            </article>
            <WikiFooter />
        </main>
    );
}
