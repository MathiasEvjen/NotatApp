import { useEffect, useRef } from "react";
import type { Sheet } from "../../types/sheet";
import SheetThumbnail from "./SheetThumbnail";
import "./thumbnailContainer.css";
import { useNavigate } from "react-router-dom";

interface ThumbnailContainerProps {
    sheets: Sheet[];
    smallMenu: boolean;
    handleSetSmallMenu: () => void;
}

const ThumbnailContainer: React.FC<ThumbnailContainerProps> = ({ sheets, smallMenu, handleSetSmallMenu }) => {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
    }, []);

    const saveSheet = () => {}

    const cancelEditMode = () => {}

    const handleOpenSheet = (sheet: Sheet) => {
        if (!smallMenu) handleSetSmallMenu();
        navigate(`/lecture/document?course=${sheet.lectureCourseId}&sheet=${sheet.sheetId}`);
    };

    const removeSheet = () => {}

    return(
        <div className="thumbnail-container-wrapper">
            <div ref={containerRef} className="thumbnail-container-content">
                {sheets.map(sheet => (
                    <SheetThumbnail 
                        key={sheet.sheetId} 
                        sheet={sheet} 
                        saveSheet={saveSheet} 
                        cancelEditMode={cancelEditMode}
                        handleOpenSheet={handleOpenSheet}
                        removeSheet={removeSheet} />
                ))}
            </div>
        </div>
    )
}

export default ThumbnailContainer;