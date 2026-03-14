import { useEffect, useRef } from "react";
import type { Sheet } from "../../types/sheet";
import Thumbnail from "./Thumbnail";
import "./thumbnailContainer.css";

interface ThumbnailContainerProps {
    sheets: Sheet[];
}

const ThumbnailContainer: React.FC<ThumbnailContainerProps> = ({ sheets }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // const handleWheel = (event: WheelEvent) => {
        //     if (container.contains(event.target as Node)) {
        //         event.preventDefault();

        //         container.scrollLeft += event.deltaY;
        //     }
        // };

        // container.addEventListener("wheel", handleWheel, { passive: false });

        // return () => {
        //     container.removeEventListener("wheel", handleWheel);
        // };
    }, []);

    return(
        <div className="thumbnail-container-wrapper">
            <div ref={containerRef} className="thumbnail-container-content">
                {sheets.map(sheet => (
                    <Thumbnail key={sheet.sheetId} title={sheet.title} date={sheet.createdAt} type={sheet.noteType} />
                ))}
            </div>
        </div>
    )
}

export default ThumbnailContainer;