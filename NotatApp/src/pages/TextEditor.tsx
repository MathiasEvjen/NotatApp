import Editor from "react-simple-code-editor";
import "./textEditor.css";
import { useEffect, useRef, useState } from "react";

interface TextEditorProps {
    content: string;
    handleUpdatecontent: (newContent: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ content, handleUpdatecontent }) => {
    const editorRef = useRef<any>(null);
    const [height, setHeight] = useState<number>(0);


    const handleKeyInput = (e: React.KeyboardEvent) => {
        if (!editorRef.current) return;

        const input = editorRef.current;
        if (!input) return;

        const cursorPosition = input.selectionStart;
        const selectionEnd = input.selectionEnd;

        if (e.ctrlKey && e.key === "Enter") {
            e.preventDefault();

            const value = content;

            const lineStartIdx = value.lastIndexOf("\n", cursorPosition - 1) + 1; // +1 because lastIndexOf returns index of \n
            // Find the end of current line
            const lineEndIdx = value.indexOf("\n", cursorPosition);
            const insertPos = lineEndIdx === -1 ? value.length : lineEndIdx;

            // Insert newline at end of current line
            const newContent = value.slice(0, insertPos) + "\n" + value.slice(insertPos);
            handleUpdatecontent(newContent);

            // Move cursor just after the inserted newline
            requestAnimationFrame(() => {
                if (editorRef.current) {
                    editorRef.current.selectionStart = editorRef.current.selectionEnd = insertPos + 1;
                    editorRef.current.focus();
                }
            });
        }
    };

    useEffect(() => {
        if (editorRef.current) {
            setHeight(editorRef.current.scrollHeight);
        }
    }, [content]);

    return (
        <Editor
            ref={editorRef}
            value={content}
            onValueChange={handleUpdatecontent}
            onKeyDown={(e) => handleKeyInput(e)}
            highlight={(code) => code}
            className="text-editor"
            style={{
                fontFamily: "Poppins, sans-serif",
                height, // <-- apply measured height here
            }}
            tabSize={6}
            padding={5}
        />
    )
}

export default TextEditor;