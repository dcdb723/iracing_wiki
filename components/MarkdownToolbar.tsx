'use client';

import {
    Bold, Italic, Underline, Quote,
    List, ListOrdered, Minus, Link as LinkIcon, Image as ImageIcon,
    ChevronDown, X, Check
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface MarkdownToolbarProps {
    textareaId: string;
    onInsert: (value: string) => void;
}

export default function MarkdownToolbar({ textareaId, onInsert }: MarkdownToolbarProps) {
    const { t } = useLanguage();
    const [activePopup, setActivePopup] = useState<'link' | 'image' | null>(null);
    const [headerLevel, setHeaderLevel] = useState('Paragraph');

    // Popup State
    const [popupUrl, setPopupUrl] = useState('');
    const [popupText, setPopupText] = useState('');

    const toolbarRef = useRef<HTMLDivElement>(null);

    // Close popups when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
                setActivePopup(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const insertText = (before: string, after = '') => {
        const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selection = text.substring(start, end);

        const newText = text.substring(0, start) + before + selection + after + text.substring(end);

        onInsert(newText);

        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + before.length + selection.length + after.length;
            if (selection.length === 0 && after.length > 0) {
                textarea.setSelectionRange(start + before.length, start + before.length);
            } else {
                textarea.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 0);
    };

    // Advanced Logic for Ordered List
    const handleOrderedList = () => {
        const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
        if (!textarea) return insertText('1. ');

        const start = textarea.selectionStart;
        const text = textarea.value;
        const linesBefore = text.substring(0, start).split('\n');
        const currentLine = linesBefore[linesBefore.length - 1]; // Line we are on (partial)

        // Check previous line for a number
        let nextNum = 1;
        if (linesBefore.length > 1) {
            const prevLine = linesBefore[linesBefore.length - 2];
            const match = prevLine.match(/^(\d+)\.\s/);
            if (match) {
                nextNum = parseInt(match[1]) + 1;
            }
        }

        // If we are essentially at start of line, just insert.
        // If not, maybe new line? Let's just keep it simple: insert number at cursor.
        // User usually clicks this on a new line.
        insertText(`${nextNum}. `);
    };

    const handleSelectHeader = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const level = e.target.value;
        setHeaderLevel(level);
        if (level === 'p') return;

        const hashes = '#'.repeat(parseInt(level)) + ' ';
        insertText(hashes);

        // Reset to paragraph for display purpose after insert? OR keep it?
        // Let's reset
        setTimeout(() => setHeaderLevel('Paragraph'), 500);
    };

    const confirmPopup = () => {
        if (activePopup === 'link') {
            insertText(`[${popupUrl}]`, `(${popupText || popupUrl})`); // Correct MD: [text](url) -> Wait, logic was insertText(before, after)
            // My generic insertText wraps selection. 
            // For link: [Selection](URL)
            // So before="[", after="](URL)"

            // Wait, UI has "Text" and "URL" inputs.
            // If user selected text, that should be pre-filled?
            // Let's robustify.
            const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
            const start = textarea?.selectionStart;
            const end = textarea?.selectionEnd;
            const selection = textarea?.value.substring(start, end);

            // Logic: 
            // If selection exists, use it as text, wrap in [] and append (url).
            // If no selection, use popupText as text.

            if (selection) {
                // We utilize the wrapper function
                insertText('[', `](${popupUrl})`);
            } else {
                // No selection, insert full string
                insertText(`[${popupText || t.tbLink}](${popupUrl})`);
            }
        } else if (activePopup === 'image') {
            insertText(`![${popupText || t.tbImage}](${popupUrl})`);
        }
        setActivePopup(null);
        setPopupUrl('');
        setPopupText('');
    };

    const openPopup = (type: 'link' | 'image') => {
        const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
        const selection = textarea?.value.substring(textarea.selectionStart, textarea.selectionEnd);
        if (selection) setPopupText(selection);

        setActivePopup(type);
        setPopupUrl(''); // Reset URL
    };

    return (
        <div ref={toolbarRef} className="relative flex items-center gap-1 p-2 bg-slate-900 border-b border-slate-800 rounded-t-lg select-none">

            {/* Header Select */}
            <div className="relative group mr-2">
                <select
                    value={headerLevel}
                    onChange={handleSelectHeader}
                    className="appearance-none bg-slate-800 text-slate-300 text-xs font-medium px-3 py-1.5 pr-8 rounded-md outline-none border border-slate-700 hover:border-slate-600 cursor-pointer"
                >
                    <option value="p">{t.tbParagraph}</option>
                    <option value="1">{t.tbHeading} 1</option>
                    <option value="2">{t.tbHeading} 2</option>
                    <option value="3">{t.tbHeading} 3</option>
                    <option value="4">{t.tbHeading} 4</option>
                    <option value="5">{t.tbHeading} 5</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
            </div>

            <div className="h-4 w-[1px] bg-slate-800 mx-1" />

            {/* Basic Tools */}
            <ToolBtn icon={Bold} label={t.tbBold} onClick={() => insertText('**', '**')} />
            <ToolBtn icon={Italic} label={t.tbItalic} onClick={() => insertText('*', '*')} />
            <ToolBtn icon={Underline} label={t.tbUnderline} onClick={() => insertText('<u>', '</u>')} />
            <ToolBtn icon={Quote} label={t.tbQuote} onClick={() => insertText('> ')} />

            <div className="h-4 w-[1px] bg-slate-800 mx-1" />

            <ToolBtn icon={ListOrdered} label={t.tbListOrdered} onClick={handleOrderedList} />
            <ToolBtn icon={List} label={t.tbListBullet} onClick={() => insertText('- ')} />
            <ToolBtn icon={Minus} label={t.tbDivider} onClick={() => insertText('\n---\n')} />

            <div className="h-4 w-[1px] bg-slate-800 mx-1" />

            <ToolBtn icon={LinkIcon} label={t.tbLink} active={activePopup === 'link'} onClick={() => openPopup('link')} />
            <ToolBtn icon={ImageIcon} label={t.tbImage} active={activePopup === 'image'} onClick={() => openPopup('image')} />

            {/* Popover */}
            {activePopup && (
                <div className="absolute top-full left-0 mt-2 z-50 w-72 bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-3 animate-in fade-in zoom-in-95 duration-200">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                {activePopup === 'link' ? t.tbInsertLink : t.tbInsertImage}
                            </span>
                            <button onClick={() => setActivePopup(null)} className="text-slate-500 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 font-medium">URL</label>
                            <input
                                autoFocus
                                value={popupUrl}
                                onChange={e => setPopupUrl(e.target.value)}
                                placeholder={t.tbUrlPlaceholder}
                                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-sm text-white focus:border-brand-blue outline-none"
                                onKeyDown={e => e.key === 'Enter' && confirmPopup()}
                            />
                        </div>

                        {!document.getElementById(textareaId)?.getAttribute('selectionEnd') // Show text input only if simpler? Actually let's just always show for flexibility
                            && (
                                <div className="space-y-1">
                                    <label className="text-[10px] text-slate-500 font-medium">{activePopup === 'link' ? t.tbTextPlaceholder : t.tbAltPlaceholder}</label>
                                    <input
                                        value={popupText}
                                        onChange={e => setPopupText(e.target.value)}
                                        placeholder={activePopup === 'link' ? t.tbTextPlaceholder : t.tbAltPlaceholder}
                                        className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-sm text-white focus:border-brand-blue outline-none"
                                        onKeyDown={e => e.key === 'Enter' && confirmPopup()}
                                    />
                                </div>
                            )}

                        <button
                            onClick={confirmPopup}
                            className="w-full bg-brand-blue hover:bg-blue-600 text-white py-1.5 rounded text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                        >
                            <Check className="w-3 h-3" />
                            {t.tbConfirm}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function ToolBtn({ icon: Icon, label, onClick, active }: { icon: any, label: string, onClick: () => void, active?: boolean }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`p-1.5 rounded-md transition-colors ${active ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            title={label}
        >
            <Icon className="w-4 h-4" />
        </button>
    );
}
