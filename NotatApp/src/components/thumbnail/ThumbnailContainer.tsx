import { useEffect, useRef } from "react";
import type { Sheet } from "../../types/sheet";
import SheetThumbnail from "./SheetThumbnail";
import "./thumbnailContainer.css";

interface ThumbnailContainerProps {
    sheets: Sheet[];
}

const ThumbnailContainer: React.FC<ThumbnailContainerProps> = ({ sheets }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
    }, []);

    return(
        <div className="thumbnail-container-wrapper">
            <div ref={containerRef} className="thumbnail-container-content">
                {sheets.map(sheet => (
                    <SheetThumbnail key={sheet.sheetId} sheet={sheet} />
                ))}
            </div>
        </div>
    )
}

export default ThumbnailContainer;