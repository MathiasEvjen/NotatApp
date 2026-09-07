import type { Sheet } from "../../types/sheet";
import ThumbnailContainer from "../thumbnail/ThumbnailContainer";
import "./lastEditedContainer.css";

interface LastEditedContainerProps {
    sheets: Sheet[];
    smallMenu: boolean;
    handleSetSmallMenu: () => void; 
}

const LastEditedContainer: React.FC<LastEditedContainerProps> = ({ sheets, smallMenu, handleSetSmallMenu }) => {
    return (
        <div className="last-edited-container">
            <p>Nylig brukte</p>
            <ThumbnailContainer sheets={sheets} smallMenu={smallMenu} handleSetSmallMenu={handleSetSmallMenu} />
        </div>
    )
}

export default LastEditedContainer;