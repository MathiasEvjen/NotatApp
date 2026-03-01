
import "./textEditor.css";
import { Editor, EditorContent } from "@tiptap/react";
import DragHandle from "@tiptap/extension-drag-handle-react";


interface TextEditorProps {
    editor: Editor;
}

const TextEditor: React.FC<TextEditorProps> = ({ editor }) => {
    

    return (
        <>
            <DragHandle editor={editor} >
                <div className="custom-drag-handle" />
            </DragHandle>
            <EditorContent editor={editor} className="text-editor" onClick={() => editor?.commands.focus()} />
        </>
    )
}

export default TextEditor;