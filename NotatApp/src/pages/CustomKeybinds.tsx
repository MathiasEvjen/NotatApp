import { Editor, Extension, NodePos } from "@tiptap/core";
import Paragraph from "@tiptap/extension-paragraph";
import type { Slice } from "@tiptap/pm/model";

export const CustomParagraphKeybinds = Paragraph.extend({
    priority: 1000,
    

    addKeyboardShortcuts() {
        return {
            "Tab": () => {
                this.editor.commands.insertContent("\t");
                return true;
            },
            "Mod-Enter": () => {

                const { state, commands } = this.editor
                const cursorPos = state.selection.from

                let nodeIndex = 0
                let nodeStartPos = 0
                let currentIndex = 0

                state.doc.forEach((node, pos) => {
                    if (node.type.name === 'paragraph') {
                        const nodeEnd = pos + node.nodeSize

                        if (cursorPos >= pos && cursorPos <= nodeEnd) {
                            nodeIndex = currentIndex
                            nodeStartPos = pos
                        }
                        currentIndex += 1
                    }
                })

                console.log('Cursor is in paragraph node index:', nodeIndex)
                console.log('Node start position in document:', nodeStartPos)

                const insertPos = nodeStartPos + state.doc.child(nodeIndex).nodeSize

                commands.insertContentAt(insertPos, {
                    type: 'paragraph',
                    content: []
                })


                return true;
            },
            "Mod-Shift-Enter": () => {
                console.log(linesInDock(this.editor));


                return true;
            }
        }
    }
})

const linesInDock = (editor: Editor) => {
  let lines = 0;

  editor.state.doc.descendants((node) => {
    if (node.type.name === "paragraph") {
      let linesInNode = 1;

      node.descendants((child) => {
        if (child.type.name === 'hardBreak') {
          linesInNode += 1
        }
      })

      lines += linesInNode
    }
  })

  console.log("Lines:", lines)
  return lines
}