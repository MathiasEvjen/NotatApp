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

                const state = this.editor.state;

                const cursorPos = state.selection.from;
                console.log("CursorPos: ", cursorPos);
                const resolvedPos = state.doc.resolve(cursorPos);

                if (resolvedPos.parent.type.name === "paragraph") {
                    const paragraphStart = resolvedPos.start()
                    console.log("ParagraphStart:", paragraphStart);

                    const paragraphEnd = resolvedPos.end()
                    console.log("ParagraphEnd", paragraphEnd);

                    const paragraphText = state.doc.textBetween(paragraphStart, paragraphEnd)
                    const asciiText: number[] = paragraphText.split('').map(c => c.charCodeAt(0));
                    console.log("ASCII", asciiText);

                    console.log("Text", paragraphText);

                    const cursorOffsetInParagraph = cursorPos - paragraphStart;
                    console.log("CursorOffsetInParagraph:", cursorOffsetInParagraph);

                    const newLines: number[] = [];
                    for (let i = cursorOffsetInParagraph; i < asciiText.length; i++) {
                        if (asciiText[i] === 10) newLines.push(i);
                    }

                    let nearest = null;
                    let minDistance = Infinity;
                    for (const pos of newLines) {
                        const distance = Math.abs(pos - cursorOffsetInParagraph);
                        if (distance < minDistance) {
                            minDistance = distance;
                            nearest = pos;
                        }
                    }

                    console.log("Nearest", nearest);

                    if (nearest !== null) {
                        const insertPos = paragraphStart + nearest;
                        console.log("InsertPos:", insertPos);
                        this.editor.commands.insertContentAt(insertPos, "\n");
                    } else {
                        console.log("ParagraphEnd:", paragraphEnd);
                        this.editor.commands.insertContentAt(paragraphEnd, "\n");
                    }
                }


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