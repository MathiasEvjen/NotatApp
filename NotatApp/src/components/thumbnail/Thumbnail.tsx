import "./thumbnail.css";
import { format } from "date-fns";
import { FaRegEdit } from "react-icons/fa";

interface ThumbnailProps {
    title: string;
    date: Date;
}

const Thumbnail: React.FC<ThumbnailProps> = ({ title, date }) => {

    const formattedDate: string = format(date, "E. do MMM y")
    
    return(
        <div className="thumbnail-wrapper">
            <div className="thumbnail-default">
                <div>
                    {title}
                </div>
                <div className="thumbnail-date-wrapper">
                    <p>Last edited:</p>
                    {formattedDate}
                </div>
            </div>
            <div className="thumbnail-hover">
                {title}
                <FaRegEdit />
            </div>
        </div>
    )
}

export default Thumbnail;