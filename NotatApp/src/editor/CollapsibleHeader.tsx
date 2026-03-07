import { NodeViewContent, NodeViewWrapper, type NodeViewProps } from "@tiptap/react"
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";

const CollapsibleHeader: React.FC<NodeViewProps> = ({ node, editor, getPos }) => {
    const level = node.attrs.level || 1;
    const Tag = `h${level}` as any

    const toggle = () => {
        const { state, view } = editor;
        const pos = getPos();
        if (typeof pos !== "number") return;

        const headerId = node.attrs.id || crypto.randomUUID();
        const isCollapsed = node.attrs.isCollapsed === "true";
        const nextCollapsedValue = isCollapsed ? "false" : "true";
        

        let tr = state.tr;



        // 1. Oppdater selve overskriften (pilen)
        tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            id: headerId,
            isCollapsed: nextCollapsedValue,
        });

        // 2. Finn ut hvilken index denne noden har i dokumentet
        let currentIndex = -1;
        state.doc.forEach((n, p, i) => {
            if (p === pos) currentIndex = i;
        });

        // 3. Loop gjennom alle noder etter denne for å skjule dem
        let stopCollapsing = false;
        state.doc.forEach((childNode, childPos) => {
            // Vi ser bare på noder som kommer ETTER denne headeren
            if (childPos <= pos) return;

            if (!stopCollapsing) {
                // Sjekk om vi skal stoppe (ny heading på samme eller høyere nivå)
                if (childNode.type.name === "heading") {
                    const childLevel = childNode.attrs.level || 1;
                    if (childLevel <= level) {
                        stopCollapsing = true;
                        return;
                    }
                }

                // 3. Oppdater barna
                if (nextCollapsedValue === "true") {
                    // VI LUKKER: Merk noden som skjult av DENNE headeren
                    tr.setNodeMarkup(childPos, undefined, {
                        ...childNode.attrs,
                        visible: "false",
                        hiddenBy: headerId,
                    });
                } else {
                    // VI ÅPNER: Bare vis noden hvis den var skjult av akkurat DENNE headeren
                    // (Dette hindrer at vi åpner ting som er manuelt skjult av andre overskrifter)
                    if (childNode.attrs.hiddenBy === headerId) {
                        tr.setNodeMarkup(childPos, undefined, {
                            ...childNode.attrs,
                            visible: "true",
                            hiddenBy: null,
                        });
                    }
                }
            }
        });

        // 4. Utfør endringene
        view.dispatch(tr);

        // 5. Bonus: Hvis vi lukker, flytt markøren ut av den skjulte sonen
        if (nextCollapsedValue === "true") {
            editor.commands.setTextSelection(pos + node.nodeSize);
        }
    };

    return(
        <NodeViewWrapper className={`collapsible-node ${node.attrs.isCollapsed === "true" ? "is-collapsed" : ""}`}>
            <div 
                contentEditable={false} 
                onClick={toggle}
                className="gutter-button"
            >
                {node.attrs.isCollapsed === "true" ? <IoMdArrowDropright /> : <IoMdArrowDropdown />}
            </div>
            {/* NodeViewContent er der selve teksten bor */}
            <NodeViewContent as={Tag} className="content" />
        </NodeViewWrapper>
    )
}

export default CollapsibleHeader;