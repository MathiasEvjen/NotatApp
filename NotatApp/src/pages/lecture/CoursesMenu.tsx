import type { LectureCourse } from "../../types/lectureCourse";
import type { Sheet } from "../../types/sheet";
import "./coursesMenu.css";

interface CoursesMenuProps {
    selectedCourseId: number | null;
    selectedSheetId: number | null;

    lectureCourses: LectureCourse[] | undefined;
    sheets: Sheet[] | undefined;
}

const CoursesMenu: React.FC<CoursesMenuProps> = ({ selectedCourseId, selectedSheetId, lectureCourses, sheets }) => {


    return (
        <div className="courses-menu-wrapper">
            <div className="courses-menu-courses-container">
                <div className="courses-menu-courses-header">
                    <p>Emner</p>
                </div>
                {lectureCourses?.map(course => 
                    <div className={`course-menu-course ${course.lectureCourseId === selectedCourseId ? "selected" : ""}`}>
                        {course.title}
                    </div>
                )}
            </div>
            <div className="courses-menu-sheets-container">
                <div className="courses-menu-sheet-header">
                    <p>Notater</p>
                </div>
                {sheets?.map(sheet => 
                    <div className={`course-menu-sheet ${sheet.sheetId === selectedSheetId ? "selected" : ""}`}>
                        {sheet.title}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoursesMenu;