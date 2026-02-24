import { useEffect, useRef } from "react";

import "./sheetTest.css";


interface SheetContentProps {
    content: string;
    onChange: (content: string) => void;
}

const SheetContent: React.FC<SheetContentProps> = ({ content, onChange }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const cursorPosRef = useRef<number | null>(null);

    const handleIndent = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const ta = textareaRef.current;
        if (!ta) return;

        const start = ta.selectionStart;
        const end = ta.selectionEnd;

        if (e.key === "Tab") {
            e.preventDefault(); // Prevent losing focus

            const isTextSelected = end > start;

            if (isTextSelected) {
                const lineStart = content.lastIndexOf("\n", start - 1) + 1;

                // Insert a tab at the beginning of the line
                const newContent = 
                    content.substring(0,lineStart) + "\t" + content.substring(lineStart, end + 1);
                onChange(newContent);
            }
            
            else {
                // Insert a tab character at the cursor
                const newContent =
                    content.substring(0, start) + "\t" + content.substring(end);
                onChange(newContent);
            }

            // Move cursor after the inserted tab
            setTimeout(() => {
                cursorPosRef.current = ta.selectionEnd = start + 1;
            }, 0);
        }

        if (e.shiftKey && e.key === "Tab") {
            e.preventDefault();

            const newContent = 
                content.replace("\t", "");
            onChange(newContent);
        }

        if (e.key === "Enter") {
            e.preventDefault();

            // Find the start of the current line
            const lineStart = content.lastIndexOf("\n", start - 1) + 1;
            const lineText = content.substring(lineStart, start);

            // Match leading spaces or tabs
            const leadingWhitespaceMatch = lineText.match(/^\s*/);
            const leadingWhitespace = leadingWhitespaceMatch ? leadingWhitespaceMatch[0] : "";

            // Insert newline + leading whitespace
            const newContent =
                content.substring(0, start) + "\n" + leadingWhitespace + content.substring(end);
            onChange(newContent);

            setTimeout(() => {
                ta.selectionStart = ta.selectionEnd = start + 1 + leadingWhitespace.length;
            }, 0);
        }
    };

    useEffect(() => {
        const ta = textareaRef.current;
        if (ta) {
            ta.style.height = "auto";              // reset height
            ta.style.height = ta.scrollHeight + "px"; // expand to fit content
        }
    }, [content]);

    return (
        <textarea
            className="content-textarea"
            ref={textareaRef}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleIndent}
        />
    );
}

export default SheetContent;