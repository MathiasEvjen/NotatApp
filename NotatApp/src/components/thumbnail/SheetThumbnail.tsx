import "./thumbnail.css";
import { format } from "date-fns";
import type { Sheet } from "../../types/sheet";
import Document from "../../assets/document.svg";
import Log from "../../assets/log.svg";
import Checklist from "../../assets/checklist.svg";
import { useEffect, useRef, useState } from "react";
import { SlOptionsVertical } from "react-icons/sl";
import { FaRegEdit } from "react-icons/fa";
import { LuTrash2 } from "react-icons/lu";

interface ThumbnailProps {
    sheet: Sheet;
    saveSheet: (sheet: Sheet, newTitle: string) => void;
    cancelEditMode: (sheet: Sheet) => void;
    handleOpenSheet: (sheet: Sheet) => void;
    removeSheet: (sheet: Sheet) => void;
}

const SheetThumbnail: React.FC<ThumbnailProps> = ({ 
    sheet,
    saveSheet,
    cancelEditMode,
    handleOpenSheet,
    removeSheet
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);    

    const formattedDate: string = format(sheet.createdAt, "E. do MMM y")

    const [newTitle, setNewTitle] = useState<string>("");

    const [showOptions, setShowOptions] = useState<boolean>(false);

    const handleShowOptions = () => {
        setShowOptions(!showOptions);
    };

    const handleEditTitle = () => {
        setShowOptions(false);
        setNewTitle(sheet.title);   // For å fylle ut textarea når man skal redigere navnet
        sheet.editMode = true;
    };

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
        <div className="thumbnail-wrapper" onClick={() => sheet.editMode ? "" : handleOpenSheet(sheet)}>
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
            <div className="thumbnail-options-button">
                            <button onClick={
                                (e) => {
                                    e.stopPropagation();
                                    handleShowOptions()
                                }}
                            >
                                <SlOptionsVertical />
                            </button>
                        </div>

            {showOptions && (
                <div className="thumbnail-options">
                    <div 
                        className="thumbnail-options-entry" 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEditTitle();
                        }}
                    >
                        <FaRegEdit />
                        <p>Edit</p>
                    </div>
                    <div 
                        className="thumbnail-options-entry delete"
                        onClick={(e) => {
                            e.stopPropagation();
                            removeSheet(sheet);
                            handleShowOptions();
                        }}
                    >
                        <LuTrash2 />
                        <p>Delete</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SheetThumbnail;