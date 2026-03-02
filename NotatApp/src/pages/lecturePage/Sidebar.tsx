import { useEffect, useState } from "react";
import "./sidebar.css";
import type { Editor } from "@tiptap/react";
import type { Node } from "@tiptap/pm/model";

type PointOfInterest = {
    text: string;
    pos: number;
}

interface SidebarProps {
    editor: Editor;
}

const Sidebar: React.FC<SidebarProps> = ({ editor }) => {

    const [pointsOfInterest, setPointsOfInterest] = useState<PointOfInterest[]>([]);

    const handlePointOfInterestClick = (pos: number) => {
        editor.commands.focus(pos);
    };

    useEffect(() => {
        // handlePointsOfInterest();

        const pointsOfInteresHandler = () => {
            const newPointsOfInterest: PointOfInterest[] = [];
    
            const doc: Node = editor.state.doc;
    
            doc.forEach((node, offset, index) => {
                const text: string = node.textContent;
                if (text[0] === "!" && text.length > 1) {
                    newPointsOfInterest.push({text: text.slice(1), pos: offset + text.length + 1});
                }
            })

            setPointsOfInterest(newPointsOfInterest);
        }

        editor.on('update', pointsOfInteresHandler)

    }, [editor]);

    return(
        <div className="sidebar-container">
            {pointsOfInterest.map(poi => (
                <div 
                    key={poi.pos}
                    className="point-of-interest"
                    onClick={() => handlePointOfInterestClick(poi.pos)}
                    >{poi.text}</div>
            ))}
        </div>
    )
}
export default Sidebar;