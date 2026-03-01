import type { Editor } from '@tiptap/core'
import { useEditorState } from '@tiptap/react'
import { HiMiniListBullet } from "react-icons/hi2";
import { GoListOrdered } from "react-icons/go";
import { FaCode } from "react-icons/fa6";
import { MdBlock } from "react-icons/md";
import { LuMessageSquareQuote } from "react-icons/lu";
import { MdChecklist } from "react-icons/md";
import { LuSigma } from "react-icons/lu";

import { menuBarStateSelector } from '../../editor/menuBarState.ts'
import "../../styles/menuBar.css";

export const MenuBar = ({ editor }: { editor: Editor | null}) => {
  const editorState = editor
  ? useEditorState({
      editor,
      selector: menuBarStateSelector,
    })
  : null

  if (!editor) {
    return null
  }

  return (
    <div className="menu-wrapper">
        <button
            onClick={() => {editor.chain().focus().toggleBold().run()}}
            disabled={!editorState?.canBold}
            className={editorState?.isBold ? "active" : ""}
        >
            <strong>B</strong>
        </button>
        <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editorState?.canItalic}
            className={editorState?.isItalic ? 'active' : ''}
        >
            <em>I</em>
        </button>
        <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editorState?.canUnderline}
            className={editorState?.isUnderline ? "active" : ""}
        >
            <u>U</u>
        </button>
        <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editorState?.canStrike}
            className={editorState?.isStrike ? 'active' : ''}
        >
            <del>Strike</del>
        </button>
        <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            disabled={!editorState?.canCode}
            className={editorState?.isCode ? 'is-active' : ''}
        >
            <FaCode />
        </button>
        <button onClick={() => editor.chain().focus().unsetAllMarks().run()}><MdBlock /> Marks</button>
        <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editorState?.isHeading1 ? 'active' : ''}
        >
            H1
        </button>
        <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editorState?.isHeading2 ? 'active' : ''}
        >
            H2
        </button>
        <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editorState?.isHeading3 ? 'active' : ''}
        >
            H3
        </button>
        <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editorState?.isBulletList ? 'active' : ''}
        >
            <HiMiniListBullet />
        </button>
        <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editorState?.isOrderedList ? 'active' : ''}
        >
            <GoListOrdered />
        </button>
        <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editorState?.isBlockquote ? 'active' : ''}
        >
            <LuMessageSquareQuote />
        </button>
        <button
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={editor.isActive('taskList') ? 'active' : ''}
        >
            <MdChecklist />
        </button>
        <button
            onClick={() => {
                const latex: string = prompt('Enter equation:', '') ?? ''
                if (!latex) return
                editor.chain().insertBlockMath({ latex }).focus().run()
            }}
        >
            <LuSigma />
        </button>
    </div>
  )
}