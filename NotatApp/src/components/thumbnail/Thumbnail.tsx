import "./thumbnail.css";
import { format } from "date-fns";
import type { SheetType } from "../../types/sheet";
import Lecture from "../../assets/lecture.svg";
import Log from "../../assets/log.svg";
import Checklist from "../../assets/checklist.svg";

interface ThumbnailProps {
    title: string;
    date: Date;
    type: SheetType;
}

const Thumbnail: React.FC<ThumbnailProps> = ({ title, date, type }) => {

    const formattedDate: string = format(date, "E. do MMM y")

    
    return(
        <div className="thumbnail-wrapper">
            <div className="thumbnail-type-icon">
                {type === "Lecture" ? (
                    <img src={Lecture} />
                ) : type === "List" ? (
                    <img src={Checklist} />
                ) : type === "Log" ? (
                    <img src={Log} />
                ) : ""}
            </div>
            <div className="thumbnail-info">
                <div className="thumbnail-title">
                    {title}
                </div>
                <div className="thumbnail-date">
                    {formattedDate}
                </div>
            </div>
        </div>
    )
}

export default Thumbnail;