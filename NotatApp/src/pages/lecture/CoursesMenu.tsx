import "./coursesMenu.css";
import type { LectureCourse } from "../../types/lectureCourse";
import type { Sheet } from "../../types/sheet";
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import { useNavigate } from "react-router-dom";

interface CoursesMenuProps {
    selectedCourseId: number | null;
    selectedSheetId: number | null;

    lectureCourses: LectureCourse[] | undefined;
    sheets: Sheet[] | undefined;

    handleOpenCourse: (id: number) => void;
}

const CoursesMenu: React.FC<CoursesMenuProps> = ({ selectedCourseId, selectedSheetId, lectureCourses, sheets, handleOpenCourse }) => {
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
                                    onClick={() => handleChangeSheet(sheet)}
                                >
                                    {sheet.title}
                                </div>
                            )
                        }
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoursesMenu;