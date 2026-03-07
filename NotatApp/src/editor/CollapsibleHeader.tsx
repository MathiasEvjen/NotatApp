import { NodeViewContent, NodeViewWrapper, type NodeViewProps } from "@tiptap/react"
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";

const CollapsibleHeader: React.FC<NodeViewProps> = ({ node, editor, getPos }) => {
    const isCollapsed = node.attrs.collapsed === "true";

    const level = node.attrs.level || 1;
    const Tag = `h${level}` as any

    const toggle = () => {
        const { state, view } = editor;
        const pos = getPos();
        if (typeof pos !== "number") return;

        let tr = state.tr;

        const nextValue = isCollapsed ? "false" : "true";

        // 1. Oppdater selve overskriften (pilen)
        tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            collapsed: nextValue,
        });

        // 2. Finn ut hvilken index denne noden har i dokumentet
        let currentIndex = -1;
        state.doc.forEach((n, p, i) => {
            if (p === pos) currentIndex = i;
        });

        // 3. Loop gjennom alle noder etter denne for å skjule dem
        let stopCollapsing = false;
        state.doc.forEach((childNode, childPos, childIndex) => {
        if (childIndex > currentIndex) {
            // Hvis vi treffer en ny overskrift med "!", stopper vi
            if (childNode.type.name === "heading") {
                stopCollapsing = true;
            }

            if (!stopCollapsing) {
            tr.setNodeMarkup(childPos, undefined, {
                ...childNode.attrs,
                visible: nextValue === "true" ? "false" : "true",
            });
            }
        }
        });

        // 4. Utfør endringene
        view.dispatch(tr);

        // 5. Bonus: Hvis vi lukker, flytt markøren ut av den skjulte sonen
        if (nextValue === "true") {
            editor.commands.setTextSelection(pos + node.nodeSize);
        }
    };

    return(
        <NodeViewWrapper className={`collapsible-node ${isCollapsed ? "is-collapsed" : ""}`}>
            <div 
                contentEditable={false} 
                onClick={toggle}
                className="gutter-button"
            >
                {isCollapsed ? <IoMdArrowDropright /> : <IoMdArrowDropdown />}
            </div>
            {/* NodeViewContent er der selve teksten bor */}
            <NodeViewContent as={Tag} className="content" />
        </NodeViewWrapper>
    )
}

export default CollapsibleHeader;