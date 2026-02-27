import { Editor, Extension, NodePos, type NodeType } from "@tiptap/core";
import Paragraph from "@tiptap/extension-paragraph";
import { Slice, Node, type ResolvedPos } from "@tiptap/pm/model";
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
                const cursorPos = state.selection.from

                let nodeIndex: number = 0;
                let nodeStartPos: number = 0;
                let prevNodeStartPos: number = 0;
                let currentIndex: number = 0;

                state.doc.forEach((node, pos) => {
                    if (node.type.name === 'paragraph') {
                        const nodeEnd = pos + node.nodeSize

                        if (cursorPos >= pos && cursorPos <= nodeEnd) {
                            nodeIndex = currentIndex;
                            nodeStartPos = pos;
                        }
                        nodeStartPos === 0 ? prevNodeStartPos = pos : prevNodeStartPos;
                        currentIndex++;
                    }
                })
                
                if (nodeIndex === 0) return true;

                console.log("Her");

                // TODO: Tillate tomme linjer å flyttes, stoppe den fra å legge til en ekstra linje under flyttet node (tror det er den samme node som den flyttede, bare tom)
                
                const $pos: ResolvedPos = state.doc.resolve(cursorPos);  
                const nodeSel: NodeSelection = NodeSelection.create(state.doc, $pos.start());
                const node: Node = $pos.node();
                const offsetInNode: number = cursorPos - nodeStartPos;

                console.log("Prev:", prevNodeStartPos, "Curr:", nodeStartPos);

                const tr: Transaction = state.tr;

                tr.setSelection(nodeSel);
                
                tr.deleteSelection();

                tr.insert(prevNodeStartPos, node);

                tr.setSelection(TextSelection.create(tr.doc, prevNodeStartPos + offsetInNode));

                view.dispatch(tr);
                
                return true;
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