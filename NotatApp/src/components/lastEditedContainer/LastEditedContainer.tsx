import type { Sheet } from "../../types/sheet";
import Thumbnail from "../thumbnail/Thumbnail";
import ThumbnailContainer from "../thumbnail/ThumbnailContainer";
import "./lastEditedContainer.css";

interface LastEditedContainerProps {
    heading: string;
    sheets: Sheet[];
}

const LastEditedContainer: React.FC<LastEditedContainerProps> = ({ heading, sheets }) => {
    return (
        <div className="last-edited-container">
            <p>Nylig brukte</p>
            <ThumbnailContainer sheets={sheets} />
            {/* <Thumbnail title="Dette er en forelesning" date={new Date()} type="Lecture"/> */}
            {/* <div className="last-edited-content">
                {sheets.map(sheet => (
                    <Thumbnail title={sheet.title} date={sheet.createdAt} type={sheet.noteType} />
                ))}
            </div> */}
        </div>
    )
}

export default LastEditedContainer;