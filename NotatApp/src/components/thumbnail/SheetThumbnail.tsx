import "./thumbnail.css";
import { format } from "date-fns";
import type { Sheet } from "../../types/sheet";
import Document from "../../assets/document.svg";
import Log from "../../assets/log.svg";
import Checklist from "../../assets/checklist.svg";

interface ThumbnailProps {
    sheet: Sheet;
}

const SheetThumbnail: React.FC<ThumbnailProps> = ({ sheet }) => {

    const formattedDate: string = format(sheet.createdAt, "E. do MMM y")

    // TODO: Håndtere editMode
    
    return(
        <div className="thumbnail-wrapper">
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
                <div className="thumbnail-title">
                    {sheet.title}
                </div>
                <div className="thumbnail-date">
                    {formattedDate}
                </div>
            </div>
        </div>
    )
}

export default SheetThumbnail;