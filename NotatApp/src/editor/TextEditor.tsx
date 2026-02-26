
import "./textEditor.css";
import { EditorContent, useEditor } from "@tiptap/react";
import DragHandle from "@tiptap/extension-drag-handle-react";
import { MenuBar } from "../pages/MenuBar";
import { useEffect, useRef, useState } from "react";
import { extensions } from "./Extensions";


interface TextEditorProps {
    content: string;
    handleUpdatecontent: (htmlText: string, plainText: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ content, handleUpdatecontent }) => {
    const [nested, setNested] = useState<boolean>(true)
    const NESTED_CONFIG = { edgeDetection: { threshold: -16 } }

    const timeoutRef = useRef<number | null>(null);

    const editor = useEditor({
        extensions,
        content: `${content}`,
        onUpdate({ editor }) {
            if (!editor) return;

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = window.setTimeout(() => {
                handleUpdatecontent(editor.getHTML(), editor.getText());
            }, 300);
        }
    })

    const toggleEditable = () => {
        editor.setEditable(!editor.isEditable)
        editor.view.dispatch(editor.view.state.tr)
    }

    const toggleNested = () => {
        setNested(!nested)
    }

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <>
            <MenuBar editor={editor} />
            <div>
                <button onClick={toggleEditable}>Toggle editable</button>
                <button onClick={toggleNested}>Toggle nested</button>
            </div>
            <DragHandle editor={editor} nested={nested ? NESTED_CONFIG : false}>
                <div className="custom-drag-handle" />
            </DragHandle>
            <EditorContent editor={editor} className="text-editor" />
        </>
    )
}

export default TextEditor;