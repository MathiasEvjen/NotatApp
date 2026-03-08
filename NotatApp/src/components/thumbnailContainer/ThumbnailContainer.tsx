
import type { Sheet } from "../../types/sheet";
import Thumbnail from "../thumbnail/Thumbnail";
import "./thumbnailContainer.css";

interface ThumbnailContainerProps {
    sheets: Sheet[];
}

const ThumbnailContainer: React.FC<ThumbnailContainerProps> = ({ sheets }) => {
    return(
        <div className="thumbnail-container-wrapper">
            {sheets.map(sheet => (
                <Thumbnail key={sheet.sheetId} title={sheet.title} date={sheet.createdAt} type={sheet.noteType} />
            ))}
        </div>
    )
}

export default ThumbnailContainer;