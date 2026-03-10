import "./sidebar.css";
import type { Editor } from "@tiptap/react";
import type { TableOfContentData, TableOfContentDataItem } from "@tiptap/extension-table-of-contents";
import { TextSelection } from "@tiptap/pm/state";
import { useEffect } from "react";

interface ToCItemProps {
    item: TableOfContentDataItem
    onItemClick: (e: any, id: string) => void;
}

export const ToCItem: React.FC<ToCItemProps> = ({ item, onItemClick }) => {
    return (
        <div
            className={
                item.isActive
                    ? "is-active"
                    : item.isScrolledOver
                    ? "is-scrolled-over"
                    : ""
                
            }
            style={{
                '--level': item.level,
            } as React.CSSProperties}
            onClick={e => onItemClick(e, item.id)}
        >
            <a href={`#${item.id}`} >
                {item.textContent}
            </a>
        </div>
    )
}

interface SidebarProps {
    editor: Editor;
    anchors: TableOfContentData;
}

const Sidebar: React.FC<SidebarProps> = ({ editor, anchors }) => {

    const onItemClick = (e: any, id: string) => {
        e.preventDefault();

        const element = editor.view.dom.querySelector(`[data-toc-id="${id}"]`) as HTMLElement;
        if (!element) return;

        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Move cursor
        const pos = editor.view.posAtDOM(element, 0);
        const tr = editor.view.state.tr.setSelection(TextSelection.create(editor.view.state.doc, pos));
        editor.view.dispatch(tr);
        editor.view.focus();

        // Update URL
        history.replaceState(null, "", `#${id}`);
    };

    useEffect(() => {
        const active = document.querySelector(".table-of-contents .is-active");
        active?.scrollIntoView({ block: "nearest" });
    }, [anchors]);

    return(
        <div className="sidebar">
            <div className="sidebar-options">
                <div className="table-of-contents">
                    {anchors.map((anchor) => (
                        <ToCItem onItemClick={onItemClick} key={anchor.id} item={anchor} />
                    ))}
                </div>
            </div>
        </div>
    )
}
export default Sidebar;