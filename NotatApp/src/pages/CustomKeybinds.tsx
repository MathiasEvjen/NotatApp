import { Editor } from "@tiptap/core";
import Paragraph from "@tiptap/extension-paragraph";
import { Node, ResolvedPos } from "@tiptap/pm/model";
import { NodeSelection, TextSelection, Transaction } from "@tiptap/pm/state";

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
            "Alt-ArrowUp": () => {
                const { state, view } = this.editor
                const { $from } = state.selection

                if ($from.parent.type.name !== "paragraph") return true

                const currPos: number = $from.before()
                const parent: Node = $from.node($from.depth - 1)
                const index: number = $from.index($from.depth - 1)

                if (index === 0) return true; // already at top

                const prevNode: Node = parent.child(index - 1)
                const prevPos: number = currPos - prevNode.nodeSize

                const currNode: Node = $from.parent
                const offset: number = $from.parentOffset

                const tr: Transaction = state.tr

                // delete the whole paragraph node
                tr.delete(currPos, currPos + currNode.nodeSize)

                // insert it above previous paragraph
                tr.insert(prevPos, currNode.copy(currNode.content))

                // restore cursor
                tr.setSelection(
                    TextSelection.create(
                        tr.doc,
                        prevPos + offset + 1
                    )
                );

                view.dispatch(tr);
                
                return true;
            },
            "Alt-ArrowDown": () => {
                const { state, view } = this.editor
                const { $from } = state.selection

                if ($from.parent.type.name !== "paragraph") return true

                const totalNodes: number = linesInDock(this.editor);

                const currPosBefore: number = $from.before();
                const currPosAfter: number = $from.after();
                const parent: Node = $from.node($from.depth - 1);
                const index: number = $from.index($from.depth - 1);

                if (index + 1 === totalNodes) return true; // already at bottom

                const nextNode: Node = parent.child(index + 1);
                const nextPos: number = currPosBefore + nextNode.nodeSize;

                const currNode: Node = $from.parent;
                const offset: number = $from.parentOffset;

                const tr: Transaction = state.tr;

                tr.insert(currPosAfter + nextNode.nodeSize, currNode.copy(currNode.content));
                
                tr.delete(currPosBefore, currPosBefore + currNode.nodeSize)

                tr.setSelection(
                    TextSelection.create(
                        tr.doc,
                        nextPos + offset + 1
                    )
                );

                view.dispatch(tr);
                
                return true;
            },
            "Shift-Tab": () => {
                const { state, view } = this.editor
                const { from, to } = state.selection

                const tr = state.tr
                const positions: number[] = []
                state.doc.nodesBetween(from, to, (node, pos) => {
                    if (node.type.name === "paragraph") {
                    const text = node.textContent
                    if (text.startsWith("\t")) {
                        positions.push(pos + 1) 
                    }
                    }
                })

                for (let i = positions.length - 1; i >= 0; i--) {
                    const start = positions[i]
                    tr.deleteRange(start, start + 1)
                }

                if (tr.docChanged) {
                    view.dispatch(tr)
                }

                return true
            },
            "Mod-Shift-Enter": () => {
                
                const tr = this.editor.state.tr;

                const cursorPos: number = this.editor.state.selection.from;
                const $pos = this.editor.state.doc.resolve(cursorPos);
                
                const nodeSel = NodeSelection.create(this.editor.state.doc, $pos.start());
                const node = nodeSel.node;
                const text = nodeSel.node.textContent;
                
                console.log(text);


                tr.setSelection(nodeSel);
                tr.deleteSelection();

                tr.insert(0, node);



                this.editor.view.dispatch(tr);

                return true;
            }
        }
    }
})

const linesInDock = (editor: Editor) => {
  let lines = 0;

  editor.state.doc.descendants((node) => {
    if (node.type.name === "paragraph") {

      lines++;
    }
  })
  return lines
}