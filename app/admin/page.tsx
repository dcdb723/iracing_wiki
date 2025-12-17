'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Modal from '@/components/Modal';

export default function AdminDashboard() {
    const { t } = useLanguage();
    const [entries, setEntries] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const fetchEntries = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('wiki_entries')
            .select('*')
            .order('updated_at', { ascending: false });

        if (data) setEntries(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        const { error } = await supabase.from('wiki_entries').delete().eq('id', deleteId);

        if (!error) {
            fetchEntries();
        } else {
            alert('Error deleting entry: ' + error.message);
        }
        setDeleteId(null);
    };

    return (
        <div className="space-y-6">
            <Modal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                title={t.adminDeleteTitle}
                message={t.adminDeleteConfirm}
                type="confirm"
                onConfirm={confirmDelete}
                isDestructive={true}
                confirmText={t.confirm}
                cancelText={t.cancel}
            />

            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">{t.adminDashboard}</h1>
                <Link
                    href="/admin/editor"
                    className="bg-brand-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    {t.adminCreateNew}
                </Link>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-950 text-slate-400 font-medium border-b border-slate-800">
                        <tr>
                            <th className="p-4">{t.adminTableTitle}</th>
                            <th className="p-4">{t.adminTableCategory}</th>
                            <th className="p-4">{t.adminTableLastUpdated}</th>
                            <th className="p-4 text-right">{t.adminTableActions}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {isLoading ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-500">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                    {t.loading}
                                </td>
                            </tr>
                        ) : entries.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-500">{t.adminNoEntries}</td>
                            </tr>
                        ) : (
                            entries.map((entry) => (
                                <tr key={entry.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4 font-medium">{entry.title}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300">{entry.category}</span>
                                    </td>
                                    <td className="p-4 text-slate-400 text-sm">
                                        {new Date(entry.updated_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <Link
                                            href={`/admin/editor/${entry.id}`}
                                            className="inline-flex p-2 text-slate-400 hover:text-brand-blue transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteClick(entry.id)}
                                            className="inline-flex p-2 text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
