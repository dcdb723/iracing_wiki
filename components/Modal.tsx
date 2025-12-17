'use client';

import { X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useEffect, useState } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message?: string;
    children?: React.ReactNode;
    type?: 'alert' | 'confirm';
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

export default function Modal({
    isOpen,
    onClose,
    title,
    message,
    children,
    type = 'alert',
    onConfirm,
    confirmText,
    cancelText,
    isDestructive = false
}: ModalProps) {
    const { t } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Content */}
            <div className={`relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {message && (
                    <p className="text-slate-400 mb-6 leading-relaxed">
                        {message}
                    </p>
                )}

                {children}

                <div className="flex items-center justify-end gap-3 mt-6">
                    {type === 'confirm' && (
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                            {cancelText || t.cancel}
                        </button>
                    )}
                    <button
                        onClick={() => {
                            if (onConfirm) onConfirm();
                            if (type === 'alert') onClose();
                        }}
                        className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${isDestructive
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-brand-blue hover:bg-blue-600'
                            }`}
                    >
                        {confirmText || t.confirm}
                    </button>
                </div>
            </div>
        </div>
    );
}
