import { Editor } from "@tiptap/core";
import Paragraph from "@tiptap/extension-paragraph";
import { Node } from "@tiptap/pm/model";
import { TableMap } from "@tiptap/pm/tables";
import { TextSelection, Transaction } from "@tiptap/pm/state";

export const CustomKeybinds = Paragraph.extend({
    priority: 1000,
    

    addKeyboardShortcuts() {
        return {
            "Tab": () => {
                const { state, view, commands } = this.editor;
                const { from, to } = state.selection;
                const { $from } = state.selection;

                let isTableCell: boolean = false;

                if ($from.depth > 1) {
                    
                    isTableCell = $from.node($from.depth - 3).type.name === "table" && $from.depth === 4;
                }
                
                const isCodeblock: boolean = $from.parent.type.name === "codeBlock" && $from.depth === 1;
                const isListItem: boolean = $from.node($from.depth - 1).type.name === "listItem" && $from.depth > 1;
                const isTopLevelParagraph: boolean = $from.parent.type.name === "paragraph" && $from.depth === 1;

                if (isTableCell) {
                    
                    const tableNode: Node = $from.node($from.depth - 3);
                    
                    const map = TableMap.get(tableNode);

                    const cellPos: number = $from.before($from.depth) - $from.start($from.depth - 3);
                    const cellIndex: number = map.map.indexOf(cellPos-1);

                    const row: number = Math.floor(cellIndex / map.width);
                    const col: number = cellIndex % map.width;

                    const isLastRow: boolean = row === map.height - 1;
                    const isLastCol: boolean = col === map.width - 1;

                    const isLastCell: boolean = isLastRow && isLastCol;

                    if (isLastCell) {
                        this.editor.chain().focus().addRowAfter().run();
                    }

                    this.editor.chain().focus().goToNextCell().run();
                }

                if (isListItem) {
                    this.editor.chain().sinkListItem("listItem").run();
                }

                if (isTopLevelParagraph) {
                    const tr: Transaction = state.tr;
                    const positions: number[] = [];
                    state.doc.nodesBetween(from, to, (node, pos) => {
                        const nodeType: string = node.type.name;
                        if (nodeType === "paragraph" || nodeType === "codeBlock") {
                            positions.push(pos + 1);
                        }
                    });
    
                    if (positions.length === 1) {
                        const node: Node = $from.parent;
                        const text: string = node.textContent;
    
                        const tabCount: number = getTabCount(text);
    
                        const startOfLine: number = positions[0];
    
                        if (tabCount > 0 && from <= startOfLine + tabCount) {
                            tr.insertText("\t", startOfLine);
                        } else {
                            commands.insertContent("\t");
                        }
    
                    } else {
                        for (let i = positions.length - 1; i >= 0; i--) {
                            tr.insertText("\t", positions[i]);
                        }
                    }
                    
                    if (tr.docChanged) view.dispatch(tr);
                }

                if (isCodeblock) {
                    const node: Node = $from.parent;
                    const text: string = node.textContent;
                    const lines: string[] = text.split("\n");

                    const tr: Transaction = state.tr;

                    if (from === to) {
                        commands.insertContentAt(from, "\t");
                    } else {
                        const toNoLnBreak: number = to - lines.length;
                        
                        let fromLine: number = 0;
                        let toLine: number = 0;
                        let tempText: string = "";
                        let prevTemptText: string = "";
                        let fromAtLineStart: boolean = false;

                        
                        for (let i = 0; i < lines.length; i++) {
                            tempText += lines[i];
                            if (from-i <= tempText.length && from-i >= prevTemptText.length) {
                                fromLine = i;

                                let tabCount: number = getTabCount(lines[i]);
                                if (from-i-1-tabCount === prevTemptText.length) fromAtLineStart = true;
                            }
                            if (toNoLnBreak > prevTemptText.length && toNoLnBreak <= tempText.length) {
                                toLine = i;
                                break;
                            }
                            
                            prevTemptText = tempText;
                        }
                        
                        if (fromLine === toLine && !fromAtLineStart) {
                            commands.insertContent("\t");
                        } else {
                            tr.delete(1, $from.after());
                            
                            let newText: string = "";
                            for (let i = 0; i < lines.length; i++) {
                                if (i === toLine && i === lines.length - 1) {
                                    newText += "\t" + lines[i];
                                } else if (i >= fromLine && i <= toLine) {
                                    newText += "\t" + lines[i] + "\n";
                                } else if (i === lines.length - 1) {
                                    newText += lines[i];
                                } else {
                                    newText += lines[i] + "\n"
                                }
                            }
                            
                            tr.insertText(newText, 1);

                        }
                        tr.setSelection(
                            TextSelection.create(
                                tr.doc,
                                from + 1,
                                to + 1
                            )
                        );
                    }

                    if (tr.docChanged) view.dispatch(tr);
                }

                return true;
            },
            "Shift-Tab": () => {
                const { state, view } = this.editor;
                const { $from } = state.selection;
                const { from, to } = state.selection;
                
                let isTableCell: boolean = false;
                if ($from.depth > 1) {
                    
                    isTableCell = $from.node($from.depth - 3).type.name === "table" && $from.depth === 4;
                }

                const isCodeblock: boolean = $from.parent.type.name === "codeBlock" && $from.depth === 1;
                const isListItem: boolean = $from.node($from.depth - 1).type.name === "listItem" && $from.depth > 1;
                const isTopLevelParagraph: boolean = $from.parent.type.name === "paragraph" && $from.depth === 1;


                if (isTableCell) {
                    this.editor.chain().focus().goToPreviousCell().run();
                }

                if (isListItem) {
                    this.editor.chain().liftListItem("listItem").run();
                }

                if (isTopLevelParagraph) {

                    console.log("Ikke her ")
                    const tr: Transaction = state.tr;
                    const positions: number[] = [];
                    state.doc.nodesBetween(from, to, (node, pos) => {
                        const nodeType: string = node.type.name;
                        if (nodeType === "paragraph") {
                            const text: string = node.textContent;
    
                            if (text.startsWith("\t")) {
                                positions.push(pos + 1);
                            }
                        }
                    });
    
                    for (let i = positions.length - 1; i >= 0; i--) {
                        const start: number = positions[i];
                        tr.deleteRange(start, start + 1);
                    }
    
                    if (tr.docChanged) {
                        view.dispatch(tr);
                    }
                }

                if (isCodeblock) {
                    const node: Node = $from.parent;
                    const text: string = node.textContent;
                    const lines: string[] = text.split(/(?<=\n)/);

                    const tr: Transaction = state.tr;

                    let fromLine: number = 0;
                    let toLine: number = 0;
                    let tempText: string = "";
                    let prevTemptText: string = "";

                    for (let i = 0; i < lines.length; i++) {
                        tempText += lines[i];

                        if (from - 1 >= prevTemptText.length && from - 1 <= tempText.length) {
                            fromLine = i;
                        }
                        if (to - 1 >= prevTemptText.length && to <= tempText.length) {
                            toLine = i;
                            break;
                        }

                        prevTemptText = tempText;
                    }

                    tr.delete(1, $from.after());

                    let newText: string = "";
                    let tabsDeleted: number = 0;
                    for (let i = 0; i < lines.length; i++) {
                        if (i >= fromLine && i <= toLine && lines[i][0] === "\t") {
                            newText += lines[i].slice(1);
                            tabsDeleted++;
                        } else {
                            newText += lines[i];
                        }
                    }

                    tr.insertText(newText, 1);

                    fromLine === toLine ?
                        tr.setSelection(
                            TextSelection.create(
                                tr.doc,
                                from - 1,
                                to - 1
                            )
                        ) :
                        tr.setSelection(
                            TextSelection.create(
                                tr.doc,
                                from - 1,
                                to - tabsDeleted
                            )
                        )
                            

                    if (tr.docChanged) view.dispatch(tr);
            }

                return true
            },
            "Enter": () => {
                const { state, commands } = this.editor;
                const { $from } = state.selection;

                const isCodeblock: boolean = $from.parent.type.name === "codeBlock" && $from.depth === 1;
                if (isCodeblock) return false;

                const node: Node = $from.parent;
                const text: string = node.textContent;

                const tabCount: number = getTabCount(text);

                if (tabCount === 0) return false;

                const insertText = createInsertTextWithTabs(tabCount);
    
                commands.insertContentAt($from.after(), insertText);

                return true;
            },
            "Mod-Enter": () => {

                const { state, commands, view } = this.editor
                const { from, to } = state.selection;
                const { $from } = state.selection;

                let isTableCell: boolean = false;
                if ($from.depth > 1)
                    isTableCell = $from.node($from.depth - 3).type.name === "table" && $from.depth === 4;

                const isCodeblock: boolean = $from.parent.type.name === "codeBlock" && $from.depth === 1;
                const isListItem: boolean = $from.node($from.depth - 1).type.name === "listItem" && $from.depth > 1;
                const isTopLevelParagraph: boolean = $from.parent.type.name === "paragraph" && $from.depth === 1;
                
                
                let insertPos: number = 0
                if (isListItem ) $from.after($from.depth - 2);
                else if (isTopLevelParagraph) $from.after();


                if (isListItem) {
                    commands.insertContentAt(insertPos, {
                        type: "listItem",
                        content: [{
                            type: "paragraph",
                            content: []
                        }]
                    })
                }

                if (isTopLevelParagraph) {
                    const text: string = $from.parent.textContent;
                    
                    const tabCount: number = getTabCount(text);
                    const insertText: string = createInsertTextWithTabs(tabCount);
                    

                    commands.insertContentAt(insertPos, {
                        type: 'paragraph',
                        content: 
                        tabCount !== 0 ?
                        [{
                            type: "text",
                            text: insertText
                        }]
                        : []
                    })
                }

                if (isCodeblock) {
                    const node: Node = $from.parent;
                    const text: string = node.textContent;
                    const lines: string[] = text.split(/(?<=\n)/);
                    
                    const tr: Transaction = state.tr;

                    let toLine: number = 0;
                    let tempText: string = "";
                    let prevTemptText: string = "";

                    for (let i = 0; i < lines.length; i++) {
                        tempText += lines[i];

                        if (to - 1 >= prevTemptText.length && to <= tempText.length) {
                            toLine = i;
                            break;
                        }

                        prevTemptText = tempText;
                    }

                    console.log(toLine);

                    tr.delete(1, $from.after());

                    let newText: string = "";
                    let newCursorPos: number = 0;
                    for (let i = 0; i < lines.length; i++) {
                        if (i === toLine) {
                            newText += lines[i] + "\n";
                            newCursorPos = newText.slice(newText.length-2) === "\n\n" ? newText.length : newText.length + 1;
                        } else {
                            newText += lines[i]
                        }
                    }

                    tr.insertText(newText, 1);

                    tr.setSelection(
                        TextSelection.create(
                            tr.doc,
                            newCursorPos,
                            newCursorPos
                        )
                    )
                    
                    if (tr.docChanged) view.dispatch(tr);
                }
                
                return true;
            },
            "Mod-Shift-Enter": () => {
                const { state, commands } = this.editor
                const { from, to } = state.selection;
                const { $from } = state.selection;

                const isTableCell: boolean = $from.node($from.depth - 3).type.name === "table" && $from.depth === 4;
                
                if (isTableCell) {
                    let tableIndex: number = 0;
                    state.doc.nodesBetween(0, to, (node, pos) => {
                        if (node.type.name === "table") {
                            tableIndex = pos;
                        }
                    });

                    console.log(state.doc.resolve(tableIndex + 1).after());
                    const insertPos: number = state.doc.resolve(tableIndex + 1).after();

                    commands.insertContentAt(insertPos, {
                        type: "paragraph",
                        content: []
                    });
                }

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
            "Backspace": () => {
                const { state } = this.editor;
                const { $from } = state.selection;

                if ($from.depth < 3) return false;
                
                const isTableCell: boolean = $from.node($from.depth - 3).type.name === "table" && $from.depth === 4;

                if (isTableCell) {

                    const tableNode: Node = $from.node($from.depth - 3);
                    
                    const map: TableMap = TableMap.get(tableNode);

                    const cellPos: number = $from.before($from.depth) - $from.start($from.depth - 3);
                    const cellIndex: number = map.map.indexOf(cellPos-1);

                    const row: number = Math.floor(cellIndex / map.width);
                    const col: number = cellIndex % map.width;

                    const isFirstRow: boolean = row === 0;
                    const isFirstCol: boolean = col === 0;

                    const isFirstCell: boolean = isFirstRow && isFirstCol;
                    const isFirstCellEmpty: boolean = tableNode.firstChild?.firstChild?.firstChild?.textContent === "";

                    if (isFirstCell && isFirstCellEmpty) 
                            this.editor.chain().focus().deleteTable().run();
                }
                
                return false;
            },
            "Alt-ArrowRight": () => {
                const { state } = this.editor;
                const { $from } = state.selection;

                console.log($from.depth)
                console.log($from.node($from.depth))
                console.log($from.node($from.depth).type.name)
                console.log($from.node($from.depth).textContent[0] === "\t")

                console.log()
                return false;
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

const getTabCount = (text: string) => {
    let tabCount: number = 0;
    for (let i = 0; i < text.length; i++) {
        if (text[i] !== "\t") break;
        tabCount++;
    }

    return tabCount;
};

const createInsertTextWithTabs = (tabCount: number) => {
    let insertText: string = "";
    for (let i = 0; i < tabCount; i++) {
        insertText += "\t";
    }
    return insertText;
}