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

    const [selectedSheet, setSelectedSheet] = useState<Sheet>();

    const handleUpdateTitle = (newTitle: string) => {
        
        setSelectedSheet(prev => ({
            ...prev!, title: newTitle
        }));
    };

    useEffect(() => {
        if (!selectedSheet?.sheetId) return;

        const editDate = new Date();

        const delayDebounceFn = setTimeout(async () => {
            const sheetToUpdate = {
                ...selectedSheet,
                editedAt: editDate
            };

            await updateSheet(selectedSheet.sheetId!, sheetToUpdate);

            setSelectedSheet(prev => {
                if (!prev) return;
                return { ...prev, editedAt: editDate };
            });

            setLectureCourses(prevCourses => {
                if (!prevCourses) return prevCourses;
                
                return prevCourses.map(course => {
                    if (course.lectureCourseId === courseId) {
                        return {
                            ...course,
                            sheets: course.sheets.map(sheet => 
                                sheet.sheetId === selectedSheet.sheetId
                                    ? { ...sheet, title: selectedSheet.title, editedAt: editDate }
                                    : sheet
                            )
                        };
                    }
                    return course;
                });
            });

        }, 2000);

        return () => clearTimeout(delayDebounceFn);
    }, [selectedSheet?.title]);

    const handleUpdatecontent = async (htmlText: string) => {
        if (!selectedSheet) return;
        const sheetToUpdate = {...selectedSheet, content: htmlText, editedAt: new Date()};

        setSelectedSheet(sheetToUpdate);

        await updateSheet(sheetToUpdate.sheetId!, sheetToUpdate)
    };

    const handleOpenCourse = (id: number) => {
        setLectureCourses(prevCourses => {
            if (!prevCourses) return prevCourses;

            return prevCourses.map(course => 
                course.lectureCourseId === id 
                ? {...course, isOpen: !course.isOpen}
                : course
            );
        });
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

        const updatedCourses = fetchedLectureCourses.map(course => 
            course.lectureCourseId === courseId 
            ? { ...course, isOpen: true }
            : course
        );

        setLectureCourses(updatedCourses);
    };

    useEffect(() => {
        fetchAndSetLectureCourses();
    }, [courseId]);

    useEffect(() => {
        const newSelectedSheet = lectureCourses?.find(course => 
                                            course.lectureCourseId === courseId)?.sheets.find(sheet => 
                                                        sheet.sheetId === sheetId
                                                    );
        setSelectedSheet(newSelectedSheet);
    }, [sheetId]);

    return(
        <div className="main-lecture-wrapper">
            <CoursesMenu 
                selectedCourseId={courseId} 
                selectedSheetId={sheetId}
                lectureCourses={lectureCourses}
                sheets={sheets}
                handleOpenCourse={handleOpenCourse}/>
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