import "./coursesMenu.css";
import type { LectureCourse } from "../../types/lectureCourse";
import type { Sheet } from "../../types/sheet";
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";

interface CoursesMenuProps {
    selectedCourseId: number | null;
    selectedSheetId: number | null;

    lectureCourses: LectureCourse[] | undefined;

    handleOpenCourse: (id: number) => void;
    addSheetToLectureCourse: (lectureCourseId: number) => void;
    handleActivateConfirmDelete: (sheetId: number, lectureCourseId: number) => void;
    handleDeleteSheet: (sheetId: number) => void;
    handleCancelDeleteSheet: (sheetId: number, lectureCourseId: number) => void;
}

const CoursesMenu: React.FC<CoursesMenuProps> = ({ 
    selectedCourseId, 
    selectedSheetId, 
    lectureCourses, 
    handleOpenCourse, 
    addSheetToLectureCourse, 
    handleActivateConfirmDelete,
    handleDeleteSheet,
    handleCancelDeleteSheet
}) => {
    const navigate = useNavigate();

    const isCourseSelected = (courseId: number) => {
        return courseId === selectedCourseId;
    };

    const handleChangeSheet = (sheet: Sheet) => {
        navigate(`/lecture/document?course=${sheet.lectureCourseId}&sheet=${sheet.sheetId}`);
    };

    return (
        <div className="courses-menu-wrapper">
            <div className="courses-menu-courses-container">
                <div className="courses-menu-courses-header">
                    <p>Emner</p>
                    <button className="btn-success"><FaPlus /></button>
                </div>
                {lectureCourses?.sort((a,b) => a.title.localeCompare(b.title)).map(course => 
                    <div>
                        <div 
                            key={course.lectureCourseId} 
                            className={`course-menu-course ${isCourseSelected(course.lectureCourseId!) ? "active" : ""}`} 
                            onClick={() => handleOpenCourse(course.lectureCourseId!)}
                        >
                            {course.isOpen ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}
                            {course.title}
                        </div>
                        {course.isOpen &&
                            course.sheets.sort((a, b) => {return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()}).map(sheet =>
                                <div 
                                    key={sheet.sheetId} 
                                    className={`course-menu-sheet ${sheet.sheetId === selectedSheetId ? "active" : ""}`}
                                    onClick={
                                        (e) => {
                                            e.stopPropagation();
                                            handleChangeSheet(sheet);
                                        }
                                    }
                                >
                                    {sheet.editMode ? (
                                        <>
                                            {sheet.title}
                                            <button 
                                                className="btn-trash" 
                                                onClick={
                                                    (e) => {
                                                        e.stopPropagation();
                                                        handleDeleteSheet(sheet.sheetId!);
                                                    }
                                                }
                                            >
                                                <FaTrash />
                                            </button>
                                            <button 
                                                className="btn-trash" 
                                                onClick={
                                                    (e) => {
                                                        e.stopPropagation();
                                                        handleCancelDeleteSheet(sheet.sheetId!, sheet.lectureCourseId!);
                                                    }
                                                }
                                            >
                                                <RxCross1 />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {sheet.title}
                                            <button 
                                                className="btn-trash" 
                                                onClick={
                                                    (e) => {
                                                        e.stopPropagation();
                                                        handleActivateConfirmDelete(sheet.sheetId!, sheet.lectureCourseId!);
                                                    }
                                                }
                                            >
                                                <FaTrash />
                                            </button>
                                        </>
                                    )}
                                </div>
                        )}
                        {course.isOpen && 
                            <div 
                                className="course-menu-new-sheet" 
                                onClick={
                                    (e) => {
                                        e.stopPropagation();
                                        addSheetToLectureCourse(course.lectureCourseId!);
                                    }
                                }
                            >
                                <FaPlus />
                                <p>Nytt notat</p>
                            </div>
                        }
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoursesMenu;