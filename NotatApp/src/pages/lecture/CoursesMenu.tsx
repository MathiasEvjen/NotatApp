import "./coursesMenu.css";
import type { LectureCourse } from "../../types/lectureCourse";
import type { Sheet } from "../../types/sheet";
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";

interface CoursesMenuProps {
    selectedCourseId: number | null;
    selectedSheetId: number | null;

    lectureCourses: LectureCourse[] | undefined;
    sheets: Sheet[] | undefined;
}

const CoursesMenu: React.FC<CoursesMenuProps> = ({ selectedCourseId, selectedSheetId, lectureCourses, sheets }) => {

    const isCourseSelected = (courseId: number) => {
        return courseId === selectedCourseId;
    };

    return (
        <div className="courses-menu-wrapper">
            <div className="courses-menu-courses-container">
                <div className="courses-menu-courses-header">
                    <p>Emner</p>
                </div>
                {lectureCourses?.map(course => 
                    <div>
                        <div key={course.lectureCourseId} className={`course-menu-course`}>
                            {isCourseSelected(course.lectureCourseId!) ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}
                            {course.title}
                        </div>
                        {isCourseSelected(course.lectureCourseId!) &&
                            course.sheets.map(sheet =>
                                <div key={sheet.sheetId} className={`course-menu-sheet `}>
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