import "./thumbnail.css";
import { format } from "date-fns";
import { FaRegCheckSquare, FaRegEdit } from "react-icons/fa";
import { IoDocumentOutline } from "react-icons/io5";
import { SlOptions } from "react-icons/sl";
import { FiBook } from "react-icons/fi";
import type { SheetType } from "../../types/sheet";

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
                    <IoDocumentOutline />
                ) : type === "List" ? (
                    <FaRegCheckSquare />
                ) : type === "Log" ? (
                    <FiBook />
                ) : ""}
            </div>
            

            <div className="thumbnail-container">
                <div className="thumbnail-title">
                    {title}
                </div>
                <div className="thumbnail-edit">
                    <FaRegEdit />
                </div>
            </div>

            <div className="thumbnail-bottom-bar">
                {formattedDate}
                <SlOptions />
            </div>
        </div>
    )
}

export default Thumbnail;