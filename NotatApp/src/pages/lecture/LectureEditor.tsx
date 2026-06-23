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
import { format } from "date-fns";

interface LectureEditorProps {
    sheet?: Sheet;

    handleUpdateTitle: (newTitle: string) => void;
    handleUpdateContent: (htmlText: string) => void;
}

const LectureEditor: React.FC<LectureEditorProps> = ({ sheet, handleUpdateTitle, handleUpdateContent }) => {

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
            } else if (ext.name === "customKeybinds") {
                return ext.configure({
                    onSave: () => {
                        const html = editor?.getHTML();
                        if (html) {
                            handleUpdateContent(html);
                        }
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
                handleUpdateContent(editor.getHTML());
            }, 5000);
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
        <>
        {sheet && 
            <div className="sheet-wrapper">
                <div className="sheet-content">
                    <div className="sheet-header">
                        <div className="sheet-title">
                            <input 
                                value={sheet?.title}
                                onChange={(e) => handleUpdateTitle(e.target.value)}
                                placeholder="Title..." />
                            <div className="sheet-dates">
                                <p>Created: {format(sheet?.createdAt, "E. do MMM y HH:mm")}</p>
                                <p>Edited: {format(sheet?.editedAt, "E. do MMM y HH:mm")}</p>
                            </div>
                        </div>
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
        }
        </>
    );
};

export default LectureEditor;