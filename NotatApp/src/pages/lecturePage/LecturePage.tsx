import { useEffect, useRef, useState } from "react";
import TextEditor from "../../editor/TextEditor";
import type { Sheet } from "../../types/sheet";
import "./lecturePage.css";
import { useEditor, type Editor } from "@tiptap/react";
import { extensions } from "../../editor/Extensions";
import { MenuBar } from "./MenuBar";


const LecturePage: React.FC = () => {

    const [sheet, setSheet] = useState<Sheet>({ title: '', content: '' });

    const [text, setText] = useState<string>("");
    
    const timeoutRef = useRef<number | null>(null);

    const handleUpdateTitle = (newTitle: string) => {
        setSheet(prev => ({
            ...prev, title: newTitle
        }));
    };

    const handleUpdatecontent = (htmlText: string, plainText: string) => {
        setSheet(prev => ({
            ...prev, content: htmlText
        }));
        setText(plainText);
    };


    const editor: Editor = useEditor({
        extensions: extensions.map(ext => {
            if (ext.name === 'math') {
            return ext.configure({
                blockOptions: {
                    onClick: (node, pos) => {
                        const latex = prompt('Edit math:', node.attrs.latex)
                        if (latex) {
                            editor
                            .chain()
                            .setNodeSelection(pos)
                            .updateBlockMath({ latex })
                            .focus()
                            .run()
                        }
                    },
                },
                inlineOptions: {
                    onClick: (node) => {
                        const latex = prompt('Edit math:', node.attrs.latex)
                        if (latex) {
                        editor
                            .chain()
                            .updateInlineMath({ latex })
                            .focus()
                            .run()
                        }
                    },
                },
            })
        }
        return ext
    }),
        content: `${sheet.content}`,
        onUpdate({ editor }) {
            if (!editor) return;

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = window.setTimeout(() => {
                handleUpdatecontent(editor.getHTML(), editor.getText());
            }, 300);
        }
    });

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return(
        <div className="sheet-wrapper">
            <div className="sheet-content">
                <div className="sheet-header">
                    <input 
                        value={sheet?.title}
                        onChange={(e) => handleUpdateTitle(e.target.value)}
                        placeholder="Title..." />
                    <MenuBar editor={editor} />
                </div>

                <TextEditor editor={editor} />
            </div>

            <div className="sheet-sidebar">
            </div>
        </div>
    )
}

export default LecturePage;