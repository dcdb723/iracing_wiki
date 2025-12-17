'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Pinyin from 'tiny-pinyin';
import { useLanguage } from '@/context/LanguageContext';
import Modal from '@/components/Modal';

export default function EditorPage({ params }: { params: { id?: string[] } }) {
    const router = useRouter();
    const { t } = useLanguage();
    const [entryId, setEntryId] = useState<string | null>(null);
    const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });

    useEffect(() => {
        // Robust client-side ID extraction
        const pathParts = window.location.pathname.split('/');
        const possibleId = pathParts[pathParts.length - 1];
        if (possibleId && possibleId.length > 20 && possibleId !== 'editor') {
            setEntryId(possibleId);
        }
    }, []);

    const [formData, setFormData] = useState({
        id: '',
        title: '',
        slug: '',
        category: 'Car',
        content: '',
        image_url: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (entryId) {
            setIsLoading(true);
            supabase
                .from('wiki_entries')
                .select('*')
                .eq('id', entryId)
                .single()
                .then(({ data, error }) => {
                    if (data) {
                        setFormData({
                            id: data.id,
                            title: data.title,
                            slug: data.slug,
                            category: data.category || 'Car',
                            content: data.content || '',
                            image_url: data.image_url || ''
                        });
                    }
                    setIsLoading(false);
                });
        }
    }, [entryId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            // Auto-generate slug from title
            if (name === 'title') {
                // If slug is empty OR matches the old title's simple slugified version, update it
                // We basically want to auto-fill slug if it looks like the user hasn't manually customized it yet.
                // Or if it is a new entry.
                const shouldAutoUpdate = !prev.slug || !prev.id;

                if (shouldAutoUpdate) {
                    // 1. Check for Chinese characters
                    let slugBase = value;
                    if (/[\u4e00-\u9fa5]/.test(value)) {
                        slugBase = Pinyin.convertToPinyin(value, '-', true);
                    }

                    const slug = slugBase
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)+/g, '');

                    newData.slug = slug;
                }
            }
            return newData;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            // 0. Ensure Slug Uniqueness
            let uniqueSlug = formData.slug;
            let counter = 1;

            while (true) {
                // Check if this slug exists (and isn't the current entry)
                const query = supabase
                    .from('wiki_entries')
                    .select('id')
                    .eq('slug', uniqueSlug);

                // If we have data, it means we might conflict.
                // Note: single() throws if multiple, maybeSingle() is safer if using unique constraint but let's just use select().
                const { data: existingEntries, error: checkError } = await query;

                if (checkError) throw checkError;

                const conflictWithOther = existingEntries && existingEntries.length > 0 && existingEntries[0].id !== formData.id;

                if (!conflictWithOther) {
                    // Unique! (or it's just us)
                    break;
                }

                // Conflict found, try next suffix
                uniqueSlug = `${formData.slug}-${counter}`;
                counter++;

                if (counter > 100) throw new Error("Too many duplicate slugs. Please choose a different title.");
            }

            // 1. Get Embedding from our new API route (keeps API key secure on server)
            const textToEmbed = `${formData.title} (${formData.category}): ${formData.content}`;
            const embeddingRes = await fetch('/api/generate-embedding', {
                method: 'POST',
                body: JSON.stringify({ text: textToEmbed })
            });
            const embeddingData = await embeddingRes.json();

            if (embeddingData.error) throw new Error(embeddingData.error);

            // 2. Prepare Data
            const entryData = {
                title: formData.title,
                slug: uniqueSlug, // Use the unique one
                category: formData.category,
                content: formData.content,
                image_url: formData.image_url,
                embedding: embeddingData.embedding,
                updated_at: new Date().toISOString()
            };

            // 3. Upsert using Client SDK (Authenticates as Logged-in Admin User)
            let error;
            if (formData.id) {
                // Update
                const { error: updateError } = await supabase
                    .from('wiki_entries')
                    .update(entryData)
                    .eq('id', formData.id);
                error = updateError;
            } else {
                // Insert
                const { error: insertError } = await supabase
                    .from('wiki_entries')
                    .insert([entryData]);
                error = insertError;
            }

            if (error) throw error;

            router.push('/admin');

        } catch (err: any) {
            setErrorModal({ isOpen: true, message: t.adminError + err.message });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-8">{t.adminLoading}</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Modal
                isOpen={errorModal.isOpen}
                onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
                title="Error"
                message={errorModal.message}
                type="alert"
                isDestructive={true}
                confirmText={t.confirm}
            />

            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin" className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold">{entryId ? t.adminEditEntry : t.adminNewEntry}</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/50 border border-slate-800 p-8 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">{t.adminTitle}</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:border-brand-blue outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">{t.adminSlug}</label>
                        <input
                            name="slug"
                            value={formData.slug}
                            readOnly
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-slate-500 cursor-not-allowed font-mono text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">{t.adminCategory}</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:border-brand-blue outline-none"
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
                        <label className="text-sm font-medium text-slate-400">{t.adminImage}</label>
                        <input
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:border-brand-blue outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">{t.adminContent}</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                        rows={15}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:border-brand-blue outline-none font-mono text-sm leading-relaxed"
                        placeholder="# Heading&#10;Write your article here..."
                    />
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-800">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-brand-blue hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {isSaving ? t.adminSaving : t.adminSave}
                    </button>
                </div>
            </form>
        </div>
    );
}
