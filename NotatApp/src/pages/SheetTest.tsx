import { useRef, useState } from "react";
import "./sheetTest.css";
import SheetContent from "./Sheetcontent";

const SheetTest: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");

    const handleTextAreaScroll = (cursorY: number) => {
        const container = containerRef.current;
        if (!container) return;

        const containerTop = container.scrollTop;
        const containerHeight = container.clientHeight;

        // Keep cursor visible with padding
        const padding = 100;
        if (cursorY < containerTop + padding) {
            container.scrollTop = cursorY - padding;
        } else if (cursorY > containerTop + containerHeight - padding) {
            container.scrollTop = cursorY - containerHeight + padding;
        }
    }

    return(
        <div className="sheet-wrapper">
            <div ref={containerRef} className="sheet-content">
                <input 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title..." />

                <SheetContent content={content} onChange={setContent} handleTextAreaScroll={handleTextAreaScroll} />
            </div>

            <div className="sheet-sidebar">

            </div>
        </div>
    )
}

export default SheetTest;