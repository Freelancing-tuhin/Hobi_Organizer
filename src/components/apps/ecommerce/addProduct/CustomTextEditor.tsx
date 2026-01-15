import React, { useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface CustomTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
    maxLength?: number;
}

const CustomTextEditor: React.FC<CustomTextEditorProps> = ({
    value,
    onChange,
    placeholder = 'Tell people what your event is about...',
    maxLength = 500,
}) => {
    const editorRef = useRef<HTMLDivElement>(null);

    const isInternalUpdate = useRef(false);

    // Sync value prop with editor content only if it originated from outside
    useEffect(() => {
        if (!isInternalUpdate.current && editorRef.current) {
            if (editorRef.current.innerHTML !== value) {
                editorRef.current.innerHTML = value || '';
            }
        }
        isInternalUpdate.current = false;
    }, [value]);

    const normalizeContent = (html: string) => {
        const trimmed = html.trim();
        // Check for common empty tag patterns across different browsers
        const emptyPatterns = [
            '<br>', '<br/>', '<br />',
            '<div><br></div>', '<div><br/></div>', '<div><br /></div>',
            '<p><br></p>', '<p><br/></p>', '<p><br /></p>',
            '<div></div>', '<p></p>'
        ];

        if (!trimmed || emptyPatterns.includes(trimmed.toLowerCase())) {
            return '';
        }
        return html;
    };

    const triggerChange = () => {
        if (editorRef.current) {
            const content = editorRef.current.innerHTML;
            const normalized = normalizeContent(content);
            isInternalUpdate.current = true;
            onChange(normalized);
        }
    };

    const handleCommand = (command: string, value?: string) => {
        editorRef.current?.focus();
        document.execCommand(command, false, value);
        triggerChange();
    };

    const handleInput = () => {
        if (editorRef.current) {
            const textContent = editorRef.current.innerText || '';
            if (maxLength && textContent.length > maxLength) {
                // Prevent further input if past limit (simplified for this custom editor)
                // In a production app, you might want to slice the content or handle this better
            }
            triggerChange();
        }
    };

    const handleBlur = () => {
        triggerChange();
    };

    return (
        <div className="w-full border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-dark-muted shadow-sm group focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-300">
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 bg-gray-50/50 dark:bg-dark-muted border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-1 px-1 border-r border-gray-200 dark:border-gray-700 last:border-0 mr-2">
                    <ToolbarButton icon="tabler:bold" onClick={() => handleCommand('bold')} tooltip="Bold" />
                    <ToolbarButton icon="tabler:italic" onClick={() => handleCommand('italic')} tooltip="Italic" />
                    <ToolbarButton icon="tabler:underline" onClick={() => handleCommand('underline')} tooltip="Underline" />
                </div>

                <div className="flex items-center gap-1 px-1 border-r border-gray-200 dark:border-gray-700 last:border-0 mr-2">
                    <ToolbarButton label="H1" onClick={() => handleCommand('formatBlock', 'H1')} tooltip="Heading 1" />
                    <ToolbarButton label="H2" onClick={() => handleCommand('formatBlock', 'H2')} tooltip="Heading 2" />
                </div>

                <div className="flex items-center gap-1 px-1 border-r border-gray-200 dark:border-gray-700 last:border-0 mr-2">
                    <ToolbarButton icon="tabler:list" onClick={() => handleCommand('insertUnorderedList')} tooltip="Bullet List" />
                    <ToolbarButton icon="tabler:list-numbers" onClick={() => handleCommand('insertOrderedList')} tooltip="Numbered List" />
                </div>

                <div className="flex items-center gap-1 px-1">
                    <ToolbarButton icon="tabler:link" onClick={() => {
                        const url = prompt('Enter the link URL:');
                        if (url) handleCommand('createLink', url);
                    }} tooltip="Link" />
                    <ToolbarButton icon="tabler:eraser" onClick={() => handleCommand('removeFormat')} tooltip="Clear Formatting" />
                </div>
            </div>

            {/* Editor Content */}
            <div className="relative">
                {!value && (
                    <div className="absolute top-4 left-4 text-gray-400 pointer-events-none text-sm italic">
                        {placeholder}
                    </div>
                )}
                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleInput}
                    onBlur={handleBlur}
                    className="min-h-[200px] p-4 text-sm text-gray-700 dark:text-gray-300 focus:outline-none leading-relaxed [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-2 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-2 [&>p]:mb-2"
                    style={{ whiteSpace: 'pre-wrap' }}
                />
            </div>
        </div>
    );
};

interface ToolbarButtonProps {
    icon?: string;
    label?: string;
    onClick: () => void;
    tooltip: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ icon, label, onClick, tooltip }) => (
    <button
        type="button"
        onClick={(e) => {
            e.preventDefault();
            onClick();
        }}
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-dark-muted hover:shadow-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-all duration-200"
        title={tooltip}
    >
        {icon ? <Icon icon={icon} className="w-5 h-5" /> : <span className="text-sm font-bold">{label}</span>}
    </button>
);

export default CustomTextEditor;
