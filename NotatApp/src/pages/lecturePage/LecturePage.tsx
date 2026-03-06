import { useEffect, useRef, useState } from "react";
import TextEditor from "../../editor/TextEditor";
import type { Sheet } from "../../types/sheet";
import "./lecturePage.css";
import { useEditor, type Editor } from "@tiptap/react";
import { extensions } from "../../editor/Extensions";
import { MenuBar } from "./MenuBar";
import Sidebar from "./Sidebar";
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";


const LecturePage: React.FC = () => {

    const [sheet, setSheet] = useState<Sheet>({ title: '', content: '' });
    
    const timeoutRef = useRef<number | null>(null);

    const handleUpdateTitle = (newTitle: string) => {
        setSheet(prev => ({
            ...prev, title: newTitle
        }));
    };

    const handleUpdatecontent = (htmlText: string) => {
        setSheet(prev => ({
            ...prev, content: htmlText
        }));
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

    
    const [nodeCoords, setNodeCoords] = useState<{top: number, bottom: number}[]>([]);

    const findAndSetNodeCoords = () => {
        const nodeCoords: {top: number, bottom: number}[] = [];
        editor.state.doc.forEach((node, pos) => {
            const coords = editor.view.coordsAtPos(pos);

            nodeCoords.push({top: coords.top, bottom: coords.bottom})
        })

        setNodeCoords(nodeCoords);
    };

    const [nodePositions, setNodePositions] = useState<{pos: number, text: string, type: string}[]>([])

    const getRelativeCoords = () => {
        const { view } = editor;
        
        const editorElement = view.dom as HTMLElement;
        const editorRect = editorElement.getBoundingClientRect();
        
        const coords: {pos: number, text: string, type: string}[] = [];

        editor.state.doc.forEach((node, pos) => {
            try {
                const nodeCoords = view.coordsAtPos(pos);
    
                const relativeTop = nodeCoords.top - editorRect.top + editorElement.scrollTop;
    
                coords.push({
                    pos: relativeTop,
                    text: node.textContent,
                    type: node.type.name,
                });

                console.log("hola")
            } catch (e) {

            }
        });

        return coords;
    };

    const updatePositions = () => {
        if (!editor) return;
        setNodePositions(getRelativeCoords());
    };

    useEffect(() => {
        if (!editor) return;

        // Update on content changes
        editor.on('update', updatePositions);
        
        // Update on window resize (since editorRect might change)
        window.addEventListener('resize', updatePositions);

        // Initial calculation
        updatePositions();

        return () => {
        editor.off('update', updatePositions);
        window.removeEventListener('resize', updatePositions);
        };
    }, [editor]);


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
                    <div className="gutter">
                        {nodePositions.map((node) => (
                            (node.type === "paragraph" || node.type === "header") && node.text.startsWith("!") &&  (
                                <div 
                                    key={node.pos}
                                    className="gutter-item"
                                    style={{
                                        top: `${node.pos}px`,
                                    }} 
                                    onClick={() => console.log(node.text)}
                                >
                                    <IoMdArrowDropdown />
                                </div>
                            )
                        ))}
                    </div>
                    <div className="editor">
                        <TextEditor editor={editor} />
                    </div>
                </div>
            </div>

            <div className="sheet-sidebar">
                <Sidebar editor={editor} />
            </div>
        </div>
    )
}

export default LecturePage;