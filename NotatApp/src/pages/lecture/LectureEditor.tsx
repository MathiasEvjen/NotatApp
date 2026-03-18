import "./lectureEditor.css";
import { useEffect, useRef, useState } from "react";
import TextEditor from "../../editor/TextEditor";
import type { Sheet } from "../../types/sheet";
import { useEditor, type Editor } from "@tiptap/react";
import { extensions } from "../../editor/Extensions";
import { getHierarchicalIndexes, TableOfContents, type TableOfContentData } from '@tiptap/extension-table-of-contents'
import { MenuBar } from "./MenuBar";
import Sidebar from "./Sidebar";
import React from "react";

interface LectureEditorProps {
    sheet?: Sheet;

    handleUpdateTitle: (newTitle: string) => void;
    handleUpdatecontent: (htmlText: string) => void;
}

const LectureEditor: React.FC<LectureEditorProps> = ({ sheet, handleUpdateTitle, handleUpdatecontent }) => {

    const MemorizedSidebar = React.memo(Sidebar)

    const [anchors, setAnchors] = useState<TableOfContentData>([]);
    
    const timeoutRef = useRef<number | null>(null);    


    const editor: Editor = useEditor({
        extensions: [ 
            ...extensions.map(ext => {
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
        TableOfContents.configure({
            anchorTypes: ["heading"],
            getIndex: getHierarchicalIndexes,
            scrollParent: () => document.querySelector('.sheet-text-editor') as HTMLElement,
            onUpdate(anchors) {
                setAnchors(anchors);
            },
        })
    ],
        content: `${sheet!.content}`,
        onUpdate({ editor }) {
            if (!editor) return;

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = window.setTimeout(() => {
                handleUpdatecontent(editor.getHTML());
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
                <div className="sheet-text-editor">
                    <div className="editor">
                        <TextEditor editor={editor} />
                    </div>
                </div>
            </div>

            <div className="sheet-sidebar">
                <MemorizedSidebar editor={editor} anchors={anchors} />
            </div>
        </div>
    )
}

export default LectureEditor;