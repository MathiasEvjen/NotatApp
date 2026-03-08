import type { Sheet } from "../../types/sheet";
import ThumbnailContainer from "../thumbnailContainer/ThumbnailContainer";
import "./lastEditedContainer.css";

interface LastEditedContainerProps {
    heading: string;
    sheets: Sheet[];
}

const LastEditedContainer: React.FC<LastEditedContainerProps> = ({ heading, sheets }) => {
    return (
        <div className="last-edited-container">
            {heading}
            <ThumbnailContainer sheets={sheets} />
        </div>
    )
}

export default LastEditedContainer;