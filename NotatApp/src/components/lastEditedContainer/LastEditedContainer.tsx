import type { Sheet } from "../../types/sheet";
import ThumbnailContainer from "../thumbnail/ThumbnailContainer";
import "./lastEditedContainer.css";

interface LastEditedContainerProps {
    sheets: Sheet[];
}

const LastEditedContainer: React.FC<LastEditedContainerProps> = ({ sheets }) => {
    return (
        <div className="last-edited-container">
            <p>Nylig brukte</p>
            <ThumbnailContainer sheets={sheets} />
        </div>
    )
}

export default LastEditedContainer;