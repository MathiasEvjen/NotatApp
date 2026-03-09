import { Editor, Extension } from "@tiptap/core";
import { Node } from "@tiptap/pm/model";
import { TableMap } from "@tiptap/pm/tables";
import { TextSelection, Transaction } from "@tiptap/pm/state";

export const CustomKeybinds = Extension.create({
    name: 'customKeybinds',
    priority: 1000,
    
    addStorage() {
        return {
            isInsideTab: false,
        }
    },

    addKeyboardShortcuts() {
        const tabSize: number = 4;
        let tab: string = "";
        for (let i = 0; i < tabSize; i++) {
            tab += " ";
        }

        const getContext = () => {
            const { state, view, commands } = this.editor;
            const { selection } = state;
            const { from, to } = state.selection;
            const { $from } = state.selection;
            const node: Node = $from.parent;
            const text: string = node.textContent;
            const lines: string[] = text.split(/(?<=\n)/);
            const fromInCode: number = from - $from.before() - 1;
            const toInCode: number = to - $from.before() - 1;

            return {
                isCodeblock: this.editor.isActive('codeBlock'),
                isListItem: this.editor.isActive('listItem'),
                isTopLevelParagraph: $from.parent.type.name === "paragraph" && $from.depth === 1,
                isTableCell: $from.depth > 1 && $from.node($from.depth - 3).type.name === "table" && $from.depth === 4,
                isCollapsedHeader: $from.parent.type.name === "heading" && $from.parent.attrs.isCollapsed === "true",
                selection,
                $from,
                node,
                state,
                view,
                commands,
                from,
                to,
                text,
                lines,
                fromInCode,
                toInCode
            };
        };

        return {
            "Tab": () => {
                const { 
                    isCodeblock, isListItem, isTopLevelParagraph, node,
                    isTableCell, $from, state, view, commands, from, to,
                    lines, fromInCode, toInCode
                } = getContext();


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

                    const tr: Transaction = state.tr;

                    
                    

                    if (from === to) {
                        commands.insertContentAt(from, tab);
                    } else {
                        let fromLine: number = 0;
                        let toLine: number = 0;
                        let tempText: string = "";
                        let prevTemptText: string = "";
                        let fromAtLineStart: boolean = false;

                        for (let i = 0; i < lines.length; i++) {
                            tempText += lines[i];
                            if (fromInCode >= prevTemptText.length && fromInCode <= tempText.length) {
                                fromLine = i;

                                let tabCount: number = getTabCountCode(lines[i], tabSize);
                                if (fromInCode-1-(tabCount * tabSize)  === prevTemptText.length) fromAtLineStart = true;
                            }
                            if (toInCode >= prevTemptText.length && toInCode <= tempText.length) {
                                toLine = i;
                                break;
                            }
                            
                            prevTemptText = tempText;
                        }
                        
                        if (fromLine === toLine && !fromAtLineStart) {
                            commands.insertContent(tab);
                        } else {
                            tr.deleteRange($from.before(), $from.after());
                            
                            let newText: string = "";
                            for (let i = 0; i < lines.length; i++) {
                                if (i >= fromLine && i <= toLine) {
                                    newText += tab + lines[i];
                                } else {
                                    newText += lines[i];
                                }
                            }
                            
                            tr.insert(
                                $from.before(), 
                                state.schema.nodes.codeBlock.create(
                                    null,
                                    state.schema.text(newText)
                                )
                            );

                            const fromCorrected: number = $from.before() + fromInCode;
                            const toCorrected: number = $from.before() + toInCode;
    
                            tr.setSelection(
                                TextSelection.create(
                                    tr.doc,
                                    fromCorrected + tabSize,
                                    fromLine === toLine ?  toCorrected + tabSize :toCorrected + (tabSize * 2)
                                )
                            );
                        }

                    }

                    if (tr.docChanged) view.dispatch(tr);
                }

                return true;
            },
            "Shift-Tab": () => {
                const { 
                    isCodeblock, isListItem, isTopLevelParagraph, 
                    isTableCell, $from, state, view, from, to,
                    lines, fromInCode, toInCode
                } = getContext();


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

                    const tr: Transaction = state.tr;

                    let fromLine: number = 0;
                    let toLine: number = 0;
                    let tempText: string = "";
                    let prevTemptText: string = "";

                    for (let i = 0; i < lines.length; i++) {
                        tempText += lines[i];

                        if (fromInCode >= prevTemptText.length && fromInCode <= tempText.length) {
                            fromLine = i;
                        }
                        if (toInCode >= prevTemptText.length && toInCode <= tempText.length) {
                            toLine = i;
                            break;
                        }

                        prevTemptText = tempText;
                    }

                    tr.deleteRange($from.before(), $from.after());

                    let newText: string = "";
                    let tabsDeleted: number = 0;
                    let atLineStart: boolean = false;
                    for (let i = 0; i < lines.length; i++) {
                        if (i >= fromLine && i <= toLine && lines[i].slice(0, tabSize)) {
                            if (to-1 === newText.length) atLineStart = true;
                            newText += lines[i].slice(tabSize);
                            tabsDeleted++;

                        } else {
                            if (to-1 === newText.length) atLineStart = true;
                            newText += lines[i];
                        }
                    }

                    tr.insert(
                        $from.before(), 
                        state.schema.nodes.codeBlock.create(
                            null,
                            state.schema.text(newText)
                        )
                    );

                    const fromCorrected: number = $from.before() + fromInCode;
                    const toCorrected: number = $from.before() + toInCode;
                    
                    atLineStart ?
                        tr.setSelection(
                            TextSelection.create(
                                tr.doc,
                                fromCorrected,
                                toCorrected
                            )
                        ) : fromLine === toLine ?
                        tr.setSelection(
                            TextSelection.create(
                                tr.doc,
                                atLineStart ? fromCorrected - tabSize : fromCorrected,
                                toCorrected - tabSize
                            )
                        ) :
                        tr.setSelection(
                            TextSelection.create(
                                tr.doc,
                                fromCorrected - tabSize,
                                toCorrected - (tabsDeleted * tabSize)
                            )
                        )
                            

                    if (tr.docChanged) view.dispatch(tr);
            }

                return true
            },
            "Enter": () => {
                const { 
                    isCodeblock, isCollapsedHeader, $from, commands, from, to, node, state
                } = getContext();

                if (isCodeblock) {
                    const node: Node = $from.parent;
                    const text: string = node.textContent;
                    const lines: string[] = text.split(/(?<=\n)/);
                    const toInCode: number = to - $from.before() - 1;

                    let toLine: number = 0;
                    let tempText: string = "";
                    let prevTemptText: string = "";

                    for (let i = 0; i < lines.length; i++) {
                        tempText += lines[i];

                        if (toInCode >= prevTemptText.length && toInCode <= tempText.length) {
                            toLine = i;
                            break;
                        }

                        prevTemptText = tempText;
                    }
                    
                    const tabCount: number = getTabCountCode(lines[toLine], tabSize);
                    console.log('Tabs:', tabCount);
                    let insertTabs: string = "";
                    for (let i = 0; i < tabCount; i++) {
                        console.log("meow")
                        insertTabs += tab;
                    }
                    
                    console.log(text[toInCode-1])
                    if (cursorInBrackets(text, toInCode)) {
                        return this.editor
                            .chain()
                            .insertContent(`\n${insertTabs}${tab}\n${insertTabs}`)
                            .setTextSelection(from + tabCount * tabSize + tabSize + 1)
                            .run();
                    }

                    if (text[toInCode-1] === "{") {
                        return this.editor
                            .chain()
                            .insertContent(`\n${insertTabs}${tab}\n${insertTabs}}`)
                            .setTextSelection(from + tabCount * tabSize + tabSize + 1)
                            .run();
                    }

                    commands.insertContent(`\n${insertTabs}`)
                    return true;
                }

                if (isCollapsedHeader) {
                    const pos = $from.after();
                    let endPos = pos;

                    // Finn slutten på den kollapsede seksjonen
                    state.doc.nodesBetween(pos, state.doc.content.size, (child, childPos) => {
                        if (child.attrs.hiddenBy === node.attrs.id) {
                            endPos = childPos + child.nodeSize;
                            return true;
                        }
                        return false;
                    });

                    // Hopp over alle skjulte noder og sett inn en ny paragraf der
                    this.editor.chain()
                    .insertContentAt(endPos, { type: 'paragraph' })
                    .focus(endPos + 1)
                    .run();

                    return true; // Stopper standard Enter-oppførsel
                }

                const text: string = node.textContent;

                const tabCount: number = getTabCount(text);

                if (tabCount === 0) return false;

                const insertText = createInsertTextWithTabs(tabCount);
    
                commands.insertContentAt($from.after(), insertText);

                return true;
            },

            // TODO: Holde på indent
            "Mod-Enter": () => {
                const { 
                    isCodeblock, isListItem, isTopLevelParagraph, 
                    $from, state, view, commands, to 
                } = getContext();
                
                let insertPos: number = 0
                if (isListItem ) insertPos = $from.after($from.depth - 2);
                else if (isTopLevelParagraph) insertPos = $from.after();


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
                    const toInCode: number = to - $from.before();
                    
                    const tr: Transaction = state.tr;

                    let toLine: number = 0;
                    let tempText: string = "";
                    let prevTemptText: string = "";

                    for (let i = 0; i < lines.length; i++) {
                        tempText += lines[i];

                        if (toInCode - 1 >= prevTemptText.length && toInCode <= tempText.length) {
                            toLine = i;
                            break;
                        }

                        prevTemptText = tempText;
                    }

                    console.log(toLine);

                    tr.deleteRange($from.before(), $from.after());

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


                    tr.insert(
                        $from.before(), 
                        state.schema.nodes.codeBlock.create(
                            null,
                            state.schema.text(newText)
                        )
                    );

                    tr.setSelection(
                        TextSelection.create(
                            tr.doc,
                            $from.before() + newCursorPos,
                            $from.before() + newCursorPos
                        )
                    )
                    
                    if (tr.docChanged) view.dispatch(tr);
                }
                
                return true;
            },
            "Mod-Shift-Enter": () => {
                const { 
                    isCodeblock, isTableCell, state, commands, to 
                } = getContext();

                let nodeIndex: number = 0;
                state.doc.nodesBetween(0, to, (node, pos) => {
                    if (isTableCell && node.type.name === "table") {
                        nodeIndex = pos;
                    } else if (isCodeblock && node.type.name === "codeBlock") {
                        nodeIndex = pos;
                    }
                })

                const insertPos: number = state.doc.resolve(nodeIndex + 1).after();

                    commands.insertContentAt(insertPos, {
                        type: "paragraph",
                        content: []
                    });

                return true;
            },
            "Alt-ArrowUp": () => {
                const { 
                    isCodeblock, isTopLevelParagraph, 
                    $from, state, view, lines,
                    fromInCode, toInCode,
                } = getContext();

                if (isTopLevelParagraph) {
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
                }

                if (isCodeblock) {
                    let fromLine: number = 0;
                    let toLine: number = 0;
                    let tempText: string = "";
                    let prevTemptText: string = "";
                    let fromAtLineStart: boolean = false;

                    for (let i = 0; i < lines.length; i++) {
                        tempText += lines[i];
                        if (fromInCode >= prevTemptText.length && fromInCode <= tempText.length) {
                            fromLine = i;

                            let tabCount: number = getTabCountCode(lines[i], tabSize);
                            if (fromInCode-1-(tabCount * tabSize)  === prevTemptText.length) fromAtLineStart = true;
                        }
                        if (toInCode >= prevTemptText.length && toInCode <= tempText.length) {
                            toLine = i;
                            break;
                        }
                        
                        prevTemptText = tempText;
                    }

                    if (fromLine === 0) return true;

                    const tr: Transaction = state.tr;

                    tr.deleteRange($from.before(), $from.after());

                    
                    let newText: string = "";
                    let lineAbove: string = "";
                    for (let i = 0; i < lines.length; i++) {
                        if (i === fromLine - 1) {
                            lineAbove = lines[i];
                        } else if (i >= fromLine && i < toLine) {
                            newText += lines[i]
                        } else if (i === toLine) {
                            if (i === lines.length-1) {
                                newText += lines[i] + "\n";
                                newText += lineAbove.replace("\n", "");
                            } else {
                                newText += lines[i];
                                newText += lineAbove;
                            }
                        } else {
                            newText += lines[i];
                        }
                    }

                    tr.insert(
                        $from.before(),
                        state.schema.nodes.codeBlock.create(
                            null,
                            state.schema.text(newText)
                        )
                    )

                    tr.setSelection(
                        TextSelection.create(
                            tr.doc,
                            $from.before() + fromInCode - lineAbove.length + 1,
                            $from.before() + toInCode - lineAbove.length + 1
                        )
                    )

                    view.dispatch(tr);
                }

                
                return true;
            },
            "Alt-ArrowDown": () => {
                const { 
                    isTopLevelParagraph, isCodeblock, $from, 
                    state, view, lines, fromInCode, toInCode
                } = getContext();

                if (isTopLevelParagraph)  {
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
                }

                if (isCodeblock) {
                    let fromLine: number = 0;
                    let toLine: number = 0;
                    let tempText: string = "";
                    let prevTemptText: string = "";
                    let fromAtLineStart: boolean = false;

                    for (let i = 0; i < lines.length; i++) {
                        tempText += lines[i];
                        if (fromInCode >= prevTemptText.length && fromInCode <= tempText.length) {
                            fromLine = i;

                            let tabCount: number = getTabCountCode(lines[i], tabSize);
                            if (fromInCode-1-(tabCount * tabSize)  === prevTemptText.length) fromAtLineStart = true;
                        }
                        if (toInCode >= prevTemptText.length && toInCode <= tempText.length) {
                            toLine = i;
                            break;
                        }
                        
                        prevTemptText = tempText;
                    }

                    if (toLine === lines.length-1) return true;

                    const tr: Transaction = state.tr;

                    tr.deleteRange($from.before(), $from.after());

                    let newText: string = "";
                    let lineUnder: string = lines[toLine + 1];
                    for (let i = 0; i < lines.length; i++) {
                        if (i === toLine + 1) {
                            continue;
                        } else if (i === toLine && fromLine === toLine && toLine + 1 === lines.length - 1) {
                            newText += lineUnder + "\n";
                            newText += lines[i].replace("\n", "")
                        } else if (i === fromLine) {
                            if (toLine + 1 === lines.length - 1) {
                                newText += lineUnder + "\n";
                                newText += lines[i];
                            } else {
                                newText += lineUnder;
                                newText += lines[i];
                            }
                        } else if (i === toLine && toLine + 1 === lines.length - 1) {
                            newText += lines[i].replace("\n", "")
                            console.log("plong")
                        } else {
                            newText += lines[i];
                        }
                    }

                    tr.insert(
                        $from.before(),
                        state.schema.nodes.codeBlock.create(
                            null,
                            state.schema.text(newText)
                        )
                    )

                    const newFromInCode: number = toLine + 1 === lines.length-1 ? fromInCode + lines[toLine + 1].length + 2 : fromInCode + lines[toLine + 1].length + 1;
                    const newToInCode: number = toLine + 1 === lines.length-1 ? toInCode + lines[toLine + 1].length + 2 : toInCode + lines[toLine + 1].length + 1;

                    tr.setSelection(
                        TextSelection.create(
                            tr.doc,
                            $from.before() + newFromInCode,
                            $from.before() + newToInCode
                        )
                    )

                    view.dispatch(tr);

                    return true;
                }
                
                return false;
            },
            "Backspace": () => {
                const { 
                    isCodeblock, isTableCell, $from, text, fromInCode, commands, from
                } = getContext();

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

                if (
                    isCodeblock && this.storage.isInsideTab && 
                    (text[fromInCode - 1] == "{" || text[fromInCode - 1] == "(" || text[fromInCode - 1] == "[")) {
                        this.storage.isInsideTab = false;
                        return commands.deleteRange({ from: from - 1, to: from + 1 });
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
            },
            "{": () => {
                const { 
                    isCodeblock, from, to
                } = getContext();

                this.storage.isInsideTab = true;

                if (isCodeblock) {
                   if (from === to) {
                        return this.editor.chain().insertContent("{}").setTextSelection(from + 1).run();
                    } else {
                        return this.editor.chain().insertContentAt(from, "{").insertContentAt(to+1, "}").setTextSelection({ from: from+1, to: to+1 }).run();
                    }
                }
                return false;
            },
            "}": () => {
                const { 
                    isCodeblock, commands, from, text, fromInCode
                } = getContext();


                if (isCodeblock && this.storage.isInsideTab && text[fromInCode] === "}") {
                    this.storage.isInsideTab = false;
                    return commands.setTextSelection(from + 1);

                }
                return false;
            },
            "(": () => {
               const { 
                    isCodeblock, from, to
                } = getContext();

                this.storage.isInsideTab = true;

                if (isCodeblock) {

                    if (from === to) {
                        return this.editor.chain().insertContent("()").setTextSelection(from + 1).run();
                    } else {
                        return this.editor.chain().insertContentAt(from, "(").insertContentAt(to+1, ")").setTextSelection({ from: from+1, to: to+1 }).run();
                    }
                }
                return false;
            },
            ")": () => {
                const { 
                    isCodeblock, commands, from, text, fromInCode
                } = getContext();


                if (isCodeblock && this.storage.isInsideTab && text[fromInCode] === ")") {
                    this.storage.isInsideTab = false;
                    return commands.setTextSelection(from + 1);

                }
                return false;
            },
            "[": () => {
                const { 
                    isCodeblock, from, to
                } = getContext();

                this.storage.isInsideTab = true;

                if (isCodeblock) {
                    if (from === to) {
                        return this.editor.chain().insertContent("[]").setTextSelection(from + 1).run();
                    } else {
                        return this.editor.chain().insertContentAt(from, "[").insertContentAt(to+1, "]").setTextSelection({ from: from+1, to: to+1 }).run();
                    }
                }
                return false;
            },
            "]": () => {
                const { 
                    isCodeblock, $from, from, commands
                } = getContext();

                const node: Node = $from.parent;
                const text: string = node.textContent;
                const fromInCode: number = from - $from.before() - 1;


                if (isCodeblock && this.storage.isInsideTab && text[fromInCode] === "]") {
                    this.storage.isInsideTab = false;
                    return commands.setTextSelection(from + 1);

                }
                return false;
            },
            "ArrowUp": () => {
                const { 
                    isCodeblock
                } = getContext();
                
                if (isCodeblock && this.storage.isInsideTab) {
                    this.storage.isInsideTab = false;
                }

                return false;
            },
            "ArrowDown": () => {
                const { 
                    isCodeblock
                } = getContext();
                
                if (isCodeblock && this.storage.isInsideTab) {
                    this.storage.isInsideTab = false;
                }

                return false;
            },
            "ArrowLeft": () => {
                const { 
                    isCodeblock
                } = getContext();
                
                if (isCodeblock && this.storage.isInsideTab) {
                    this.storage.isInsideTab = false;
                }

                return false;
            },
            "ArrowRight": () => {
                const { 
                    isCodeblock
                } = getContext();
                
                if (isCodeblock && this.storage.isInsideTab) {
                    this.storage.isInsideTab = false;
                }

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

const getTabCountCode = (line: string, tabSize: number) => {
    let tabCount: number = 0;
    let spaceCount: number = 0;
    for (let i = 0; i < line.length; i++) {
        if (spaceCount === tabSize) {
            tabCount++;
            spaceCount = 0;
        }
        if (line[i] !== " ") break;
        spaceCount++;
    }
    return tabCount;
};

const getTabCount = (line: string) => {
    let tabCount: number = 0;
    for (let i = 0; i < line.length; i++) {
        if (line[i] !== "\t") break;
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
};

const cursorInBrackets = (text: string, cursorPos: number): boolean => {
    if (
        (text[cursorPos - 1] === "{" && text[cursorPos] === "}") ||
        (text[cursorPos - 1] === "[" && text[cursorPos] === "]") ||
        (text[cursorPos - 1] === "(" && text[cursorPos] === ")")
    )  return true;
    return false;
};