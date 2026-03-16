import { useRef, useState, useEffect } from "react";
import "./thumbnail.css";
import { FaRegFolder } from "react-icons/fa";
import type { LectureCourse } from "../../types/lectureCourse";

interface LectureCourseThumbnailProps {
    lectureCourse: LectureCourse;
    editMode: boolean;
    saveLectureCourse: (lectureCourse: LectureCourse, newTitle: string) => void;
    cancelEditMode: (lectureCourse: LectureCourse) => void;
    openAndCloseLecturecourse: (lectureCourse: LectureCourse) => void;
}

const LectureCourseThumbnail: React.FC<LectureCourseThumbnailProps> = ({ 
    lectureCourse, 
    editMode, 
    saveLectureCourse,
    cancelEditMode,
    openAndCloseLecturecourse,
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);    

    const dynamicFontSize: number = lectureCourse.title.length <= 18 ? 18 : lectureCourse.title.length <= 15 ? 14 : 12;

    const [newTitle, setNewTitle] = useState<string>("");

    const handleKeyDown = (event: any) => {
        if (event.key === "Enter") {
            saveLectureCourse(lectureCourse, newTitle);
        }
        if (event.key === "Escape") {
            cancelEditMode(lectureCourse);
        }
    };

    useEffect(() => {
        if (editMode) {
            textareaRef.current?.focus();
        }
    }, [editMode]);

    return(
        <div className={`thumbnail-wrapper`} onClick={() => openAndCloseLecturecourse(lectureCourse)}>
            <div className="thumbnail-type-icon">
                <FaRegFolder />
            </div>

            {editMode ? (
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
        </div>
    );
};

export default LectureCourseThumbnail;