import "./thumbnail.css";
import { format } from "date-fns";
import type { Sheet } from "../../types/sheet";
import Document from "../../assets/document.svg";
import Log from "../../assets/log.svg";
import Checklist from "../../assets/checklist.svg";
import { useEffect, useRef, useState } from "react";

interface ThumbnailProps {
    sheet: Sheet;
    saveSheet: (sheet: Sheet, newTitle: string) => void;
    cancelEditMode: (sheet: Sheet) => void;
}

const SheetThumbnail: React.FC<ThumbnailProps> = ({ 
    sheet,
    saveSheet,
    cancelEditMode
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);    

    const formattedDate: string = format(sheet.createdAt, "E. do MMM y")

    const [newTitle, setNewTitle] = useState<string>("");

    const handleKeyDown = (event: any) => {
        if (event.key === "Enter") {
            saveSheet(sheet, newTitle);
        }
        if (event.key === "Escape") {
            cancelEditMode(sheet);
        }
    };

    useEffect(() => {
        if (sheet.editMode) {
            textareaRef.current?.focus();
        }
    }, [sheet.editMode]);
    
    return(
        <div className="thumbnail-wrapper">
            <div className="thumbnail-type-icon">
                {sheet.noteType === "Lecture" ? (
                    <img src={Document} />
                ) : sheet.noteType === "List" ? (
                    <img src={Checklist} />
                ) : sheet.noteType === "Log" ? (
                    <img src={Log} />
                ) : ""}
            </div>
            <div className="thumbnail-info">
                {sheet.editMode ? (
                    <div className="thumbnail-title-edit">
                        <textarea 
                        ref={textareaRef}
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e)} />
                    </div>
                ) : (
                    <div className="thumbnail-title">
                        {sheet.title}
                    </div>
                )}
                <div className="thumbnail-date">
                    {formattedDate}
                </div>
            </div>
        </div>
    )
}

export default SheetThumbnail;