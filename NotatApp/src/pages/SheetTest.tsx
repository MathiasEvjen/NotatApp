import { useRef, useState } from "react";
import "./sheetTest.css";
import SheetContent from "./Sheetcontent";

const SheetTest: React.FC = () => {
    
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");


    return(
        <div className="sheet-wrapper">
            <div className="sheet-content">
                <input />

                <SheetContent content={content} onChange={setContent} />
            </div>

            <div className="sheet-sidebar">

            </div>
        </div>
    )
}

export default SheetTest;