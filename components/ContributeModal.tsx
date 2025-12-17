'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { X, Send, Loader2, FileText } from 'lucide-react';
import Modal from './Modal';
import MarkdownToolbar from './MarkdownToolbar';

interface ContributeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ContributeModal({ isOpen, onClose }: ContributeModalProps) {
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        title: '',
        category: 'Car',
        image_url: '',
        content: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Rate Limit Check (Client Side)
        const lastTime = localStorage.getItem('last_contribution_time');
        if (lastTime && Date.now() - parseInt(lastTime) < 60000) {
            alert(t.formRateLimit); // Simple alert or improved UI
            return;
        }

        setIsLoading(true);
        setStatus('idle');

        try {
            const res = await fetch('/api/contribute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Failed to submit');

            // Set timestamp on success
            localStorage.setItem('last_contribution_time', Date.now().toString());

            setStatus('success');
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setFormData({ title: '', category: 'Car', image_url: '', content: '' });
            }, 2000);
        } catch (error) {
            setStatus('error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            const textarea = e.currentTarget;
            const start = textarea.selectionStart;
            const text = textarea.value;
            const linesBefore = text.substring(0, start).split('\n');
            const currentLine = linesBefore[linesBefore.length - 1];

            // Check for numbered list pattern (e.g. "1. ")
            const match = currentLine.match(/^(\d+)\.\s/);
            if (match) {
                e.preventDefault();
                const nextNum = parseInt(match[1]) + 1;
                const insertion = `\n${nextNum}. `;

                const newText = text.substring(0, start) + insertion + text.substring(textarea.selectionEnd);
                setFormData(prev => ({ ...prev, content: newText }));

                setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd = start + insertion.length;
                }, 0);
            }
            // Check for bullet list pattern (e.g. "- ")
            else if (currentLine.match(/^-\s/)) {
                e.preventDefault();
                const insertion = `\n- `;
                const newText = text.substring(0, start) + insertion + text.substring(textarea.selectionEnd);
                setFormData(prev => ({ ...prev, content: newText }));

                setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd = start + insertion.length;
                }, 0);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`}>
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 transform transition-all">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <FileText className="w-5 h-5 text-brand-blue" />
                            {t.contributeTitle}
                        </h3>
                        <p className="text-slate-400 text-sm mt-1">{t.contributeDesc}</p>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {status === 'success' ? (
                    <div className="py-8 text-center text-green-500 animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Send className="w-8 h-8" />
                        </div>
                        <p className="font-medium">{t.contributeSuccess}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">{t.formTitle}</label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:border-brand-blue outline-none text-white"
                                placeholder="e.g. Mercedes-AMG GT3"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">{t.formCategory}</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:border-brand-blue outline-none text-white"
                            >
                                <option>Car</option>
                                <option>Track</option>
                                <option>Series</option>
                                <option>Software</option>
                                <option>Resource</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">{t.formImage}</label>
                            <input
                                name="image_url"
                                value={formData.image_url}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:border-brand-blue outline-none text-white"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">{t.formContent}</label>
                            <div className="border border-slate-800 rounded-lg overflow-hidden focus-within:border-brand-blue transition-colors bg-slate-950">
                                <MarkdownToolbar
                                    textareaId="contribute-content"
                                    onInsert={(newVal) => setFormData(prev => ({ ...prev, content: newVal }))}
                                />
                                <textarea
                                    id="contribute-content"
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    required
                                    rows={8}
                                    className="w-full bg-slate-950 px-4 py-3 outline-none font-mono text-sm leading-relaxed text-slate-300 placeholder:text-slate-600 border-none resize-y"
                                    placeholder={t.phContentContribute}
                                />
                            </div>
                        </div>

                        {status === 'error' && (
                            <p className="text-red-500 text-sm">{t.contributeError}</p>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-brand-blue hover:bg-blue-600 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                                {t.formSubmit}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
