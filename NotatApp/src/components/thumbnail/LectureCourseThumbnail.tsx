import { useRef, useState, useEffect } from "react";
import "./thumbnail.css";
import { FaRegFolder } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import { LuTrash2 } from "react-icons/lu";
import { FaRegEdit } from "react-icons/fa";
import type { LectureCourse } from "../../types/lectureCourse";

interface LectureCourseThumbnailProps {
    lectureCourse: LectureCourse;
    saveLectureCourse: (lectureCourse: LectureCourse, newTitle: string) => void;
    cancelEditMode: (lectureCourse: LectureCourse) => void;
    openAndCloseLectureCourse: (lectureCourse: LectureCourse) => void;
}

const LectureCourseThumbnail: React.FC<LectureCourseThumbnailProps> = ({ 
    lectureCourse, 
    saveLectureCourse,
    cancelEditMode,
    openAndCloseLectureCourse,
}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);    

    const dynamicFontSize: number = lectureCourse.title.length <= 18 ? 18 : lectureCourse.title.length <= 15 ? 14 : 12;

    const [newTitle, setNewTitle] = useState<string>("");

    const [showOptions, setShowOptions] = useState<boolean>(false);

    const handleShowOptions = () => {
        setShowOptions(!showOptions);
    };

    const handleEditTitle = () => {
        setShowOptions(false);
        setNewTitle(lectureCourse.title);
        lectureCourse.editMode = true;
    };

    const handleKeyDown = (event: any) => {
        if (event.key === "Enter") {
            saveLectureCourse(lectureCourse, newTitle);
        }
        if (event.key === "Escape") {
            cancelEditMode(lectureCourse);
        }
    };

    useEffect(() => {
        if (lectureCourse.editMode) {
            textareaRef.current?.focus();
        }
    }, [lectureCourse.editMode]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current && 
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setShowOptions(false);
                cancelEditMode(lectureCourse);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return(
        <div ref={wrapperRef} className={`thumbnail-wrapper`} onClick={() => lectureCourse.editMode ? "" : openAndCloseLectureCourse(lectureCourse)}>
            <div className="thumbnail-type-icon">
                <FaRegFolder />
            </div>

            {lectureCourse.editMode ? (
                <div className="thumbnail-title-edit">
                    <textarea 
                        ref={textareaRef}
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e)} />
                </div>
            ) : (
                <div 
                    className="thumbnail-title-lecture-course" 
                    style={{
                        fontSize: `${dynamicFontSize}px`
                    }}
                >
                    {lectureCourse.title}
                </div>
            )}

            <div className="thumbnail-options-button">
                <button onClick={
                    (e) => {
                        e.stopPropagation();
                        handleShowOptions()
                    }}
                >
                    <SlOptionsVertical />
                </button>
            </div>
            
            {showOptions && (
                <div className="thumbnail-options">
                    <div 
                        className="thumbnail-options-entry" 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEditTitle();
                        }
                    }>
                        <FaRegEdit />
                        <p>Edit</p>
                    </div>
                    <div className="thumbnail-options-entry delete">
                        <LuTrash2 />
                        <p>Delete</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LectureCourseThumbnail;