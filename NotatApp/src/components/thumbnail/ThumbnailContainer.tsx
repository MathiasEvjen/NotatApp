
import { useRef } from "react";
import type { Sheet } from "../../types/sheet";
import Thumbnail from "./Thumbnail";
import "./thumbnailContainer.css";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";

interface ThumbnailContainerProps {
    sheets: Sheet[];
}

const ThumbnailContainer: React.FC<ThumbnailContainerProps> = ({ sheets }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleScroll = (event: any) => {
        event.preventDefault();

        const container = containerRef.current;
        if (container) {
            container.scrollTo({
                left: container.scrollLeft + event.deltaY * 1
            })
        }
    };

    const handleScrollLeft = () => {
        const container = containerRef.current;
        if (container) {
            container.scrollTo({
                left: container.scrollLeft - 152,
                behavior: "smooth"
            })
        }
    };

    const handleScrollRight = () => {
        const container = containerRef.current;
        if (container) {
            container.scrollTo({
                left: container.scrollLeft + 152,
                behavior: "smooth"
            })
        }
    };

    return(
        <div className="thumbnail-container-wrapper">
            {/* <div className="thumbnail-container-left">
                <div className="thumbnail-container-arrow-left" onClick={handleScrollLeft}>
                    <IoMdArrowDropleft />
                </div>
            </div> */}
            <div ref={containerRef} className="thumbnail-container-content" onWheel={(e) => handleScroll(e)}>
                {sheets.map(sheet => (
                    <Thumbnail key={sheet.sheetId} title={sheet.title} date={sheet.createdAt} type={sheet.noteType} />
                ))}
            </div>
            {/* <div className="thumbnail-container-right">
                <div className="thumbnail-container-arrow-right" onClick={handleScrollRight}>
                    <IoMdArrowDropright />
                </div>
            </div> */}
        </div>
    )
}

export default ThumbnailContainer;