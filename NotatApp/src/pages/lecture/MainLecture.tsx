import { useSearchParams } from "react-router-dom";
import "./mainLecture.css";
import { useEffect, useState } from "react";
import type { LectureCourse } from "../../types/lectureCourse";
import type { Sheet } from "../../types/sheet";
import { fetchAllLectureCourses, updateSheet } from "../../api";
import CoursesMenu from "./CoursesMenu";
import LectureEditor from "./LectureEditor";

const MainLecture: React.FC = () => {
    const [searchParams] = useSearchParams();

    const courseIdString = searchParams.get("course");
    const courseId: number | null = courseIdString ? Number(courseIdString) : null;

    const sheetIdString = searchParams.get("sheet");
    const sheetId: number | null = sheetIdString ? Number(sheetIdString) : null;

    const [lectureCourses, setLectureCourses] = useState<LectureCourse[]>();
    const [sheets, setSheets] = useState<Sheet[]>();

    const [selectedCourse, setSelectedCourse] = useState<LectureCourse>();
    const [selectedSheet, setSelectedSheet] = useState<Sheet>();


    const handleUpdateTitle = (newTitle: string) => {
        
        setSelectedSheet(prev => ({
            ...prev!, title: newTitle
        }));
    };

    const handleUpdatecontent = async (htmlText: string) => {
        if (!selectedSheet) return;
        const sheetToUpdate = {...selectedSheet, content: htmlText, editedAt: new Date()};

        setSelectedSheet(sheetToUpdate);

        await updateSheet(sheetToUpdate.sheetId!, sheetToUpdate)
    };

    useEffect(() => {
        const selectedCourse = lectureCourses?.find(lc => 
                lc.lectureCourseId === courseId);

        const newSelectedSheet = 
            selectedCourse?.sheets.find(sheet => 
                    sheet.sheetId === sheetId);

        setSelectedSheet(newSelectedSheet);

        setSheets(selectedCourse?.sheets);
    }, [lectureCourses])

    const fetchAndSetLectureCourses = async () => {
        const fetchedLectureCourses = await fetchAllLectureCourses();
        console.log(fetchedLectureCourses);

        setLectureCourses(fetchedLectureCourses);
    };

    useEffect(() => {
        fetchAndSetLectureCourses();
    }, [])

    return(
        <div className="main-lecture-wrapper">
            {/* <CoursesMenu 
                selectedCourseId={courseId} 
                selectedSheetId={sheetId}
                lectureCourses={lectureCourses}
                sheets={sheets} /> */}
            {selectedSheet && (
                <LectureEditor 
                    sheet={selectedSheet}
                    handleUpdateTitle={handleUpdateTitle} 
                    handleUpdateContent={handleUpdatecontent}/>
            )}
        </div>
    );
};

export default MainLecture;