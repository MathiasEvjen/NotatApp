import { useEffect, useState } from "react";
import "./lecturePage.css";
import type { LectureCourse } from "../../types/lectureCourse";
import LectureCourseThumbnail from "../../components/thumbnail/LectureCourseThumbnail";
import { createLectureCourse, deleteLectureCourse, fetchAllLectureCourses, updateLectureCourse } from "../../api";
import SheetThumbnail from "../../components/thumbnail/SheetThumbnail";
import type { Sheet } from "../../types/sheet";
import { FaRegFolder } from "react-icons/fa";
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

interface LecurePageProps {
    smallMenu: boolean;
    handleSetSmallMenu: () => void;
}

const LecturePage: React.FC<LecurePageProps> = ({ smallMenu, handleSetSmallMenu }) => {

    const navigate = useNavigate();
    

    const handleOpenSheet = (sheet: Sheet) => {
        if (!smallMenu) handleSetSmallMenu();
        navigate(`/lecture/document?course=${sheet.lectureCourseId}&sheet=${sheet.sheetId}`);
    };


    const [lectureCourses, setLectureCourses] = useState<LectureCourse[]>([]);

    const [isLectureCourseOpened, setIsLectureCourseOpened] = useState<boolean>(false);
    const [openedLectureCourse, setOpenedLectureCourse] = useState<LectureCourse | null>(null);
    const [openedLectureCourseSheets, setOpenedLectureCourseSheets] = useState<Sheet[] | null>(null);

    // ------------------------
    // LectureCourse functions
    // ------------------------

    const fetchAndSetLectureCourses = async () => {
        const courses: LectureCourse[] = await fetchAllLectureCourses();
        setLectureCourses(courses);
    };

    const newLectureCourse = () => {
        setLectureCourses([...lectureCourses, {
            tempId: crypto.randomUUID(),
            title: "",
            sheets: [],
            isNew: true,
            editMode: true,
        }]);
    };

    const cancelEditModeLectureCourse = (editLc: LectureCourse) => {
        if (editLc.isNew) {
            setLectureCourses(
                lectureCourses.filter(
                    lc => lc.tempId !== editLc.tempId 
                    || lc.lectureCourseId !== editLc.lectureCourseId
                )
            );
        } else {
            setLectureCourses(
                lectureCourses.map(lc => 
                    lc.lectureCourseId === editLc.lectureCourseId
                    ? {...editLc, editMode: false}
                    : lc
                )
            );
        }
    };

    const saveLectureCourse = (lcToSave: LectureCourse, newTitle: string) => {
        const updatedLc: LectureCourse = {...lcToSave, title: newTitle, editMode: false};
        
        if (lcToSave.isNew) {
            setLectureCourses(prevLCs => 
                prevLCs.map(lc => 
                    lc.tempId === updatedLc.tempId 
                    ? updatedLc
                    : lc
                )
            );
            createAndSetLectureCourse(updatedLc);
        } else {
            setLectureCourses(prevLCs => 
                prevLCs.map(lc => 
                    lc.lectureCourseId === updatedLc.lectureCourseId 
                    ? updatedLc
                    : lc
                )
            );
            updateLectureCourseTitle(updatedLc);
        }
    };

    const removeLectureCourse = async (lcToDelete: LectureCourse) => {
        setLectureCourses(lectureCourses.filter(lc => lc.lectureCourseId !== lcToDelete.lectureCourseId));
        await deleteLectureCourse(lcToDelete.lectureCourseId!);
    };

    const createAndSetLectureCourse = async (newLc: LectureCourse) => {
        const createdLc: LectureCourse = await createLectureCourse(newLc);

        setLectureCourses(prevLCs => 
            prevLCs.map(lc => 
                lc.isNew 
                ? {...createdLc, editMode: false}
                : lc
            )
        );

        // TODO: Skal også åpne denne mappa så man kan lage filer med en gang
    };

    const updateLectureCourseTitle = async (lc: LectureCourse) => {
        await updateLectureCourse(lc.lectureCourseId!, lc)
    }
    
    const openLectureCourse = (lc: LectureCourse) => {
        setOpenedLectureCourse(lc);
        setIsLectureCourseOpened(true);
        setOpenedLectureCourseSheets(lc.sheets);
    };

    const closeLectureCourse = () => {
        setOpenedLectureCourse(null);
        setIsLectureCourseOpened(false);

        // TODO: Skal oppdatere og lagre dersom antallet sheets endrer seg
    }

    useEffect(() => {
        fetchAndSetLectureCourses();
    }, [])


    // ------------------------
    // Sheet functions
    // ------------------------

    const newSheet = () => {
        if (openedLectureCourseSheets && openedLectureCourse) 
            setOpenedLectureCourseSheets(
                [... openedLectureCourseSheets, {
                tempId: crypto.randomUUID(),
                title: "",
                content: "",
                noteType: "Lecture",
                createdAt: new Date(),
                editedAt: new Date(),
                isNew: true,
                editMode: true,
                lectureCourseId: openedLectureCourse.lectureCourseId
            }]);
    };

    const cancelEditModeSheet = (editSheet: Sheet) => {
        if (!openedLectureCourseSheets) return;

        setOpenedLectureCourseSheets(
            openedLectureCourseSheets.filter(
                lc => lc.tempId !== editSheet.tempId 
                || lc.lectureCourseId !== editSheet.lectureCourseId
            )
        );
    };

    const saveSheet = (sheetToSave: Sheet, newTitle: string) => {
        const updatedSheet: Sheet = {...sheetToSave, title: newTitle, editMode: false};
        

        // TODO: Her skal oppdatering av navn komme
    };


    return(
        <div className={`lecture-page-wrapper`}>
            {!isLectureCourseOpened && (
                <div className="lecture-page-content-wrapper">
                    <div className="lecture-page-content-header">
                        <p>Emner</p>
                        <button className="btn-success" onClick={newLectureCourse}>Nytt emne</button>
                    </div>

                    <div className="lecture-page-divider-line" />

                    <div className="lecture-page-content">
                        {lectureCourses.map(lc => 
                            <LectureCourseThumbnail 
                                key={lc.lectureCourseId ? lc.lectureCourseId : lc.tempId}
                                lectureCourse={lc} 
                                saveLectureCourse={saveLectureCourse}
                                cancelEditMode={cancelEditModeLectureCourse}
                                openAndCloseLectureCourse={openLectureCourse}
                                removeLectureCourse={removeLectureCourse} />
                        )}
                    </div>
                </div>
            )}
            
            {(isLectureCourseOpened && openedLectureCourse && openedLectureCourseSheets) && (
                <div className={`lecture-page-content-wrapper`}>
                    <>
                    <div className="lecture-page-content-header">
                        <p><button onClick={closeLectureCourse} ><IoChevronBack /></button><FaRegFolder /> {openedLectureCourse.title}</p>
                        <button className="btn-success" onClick={newSheet}>Nytt notat</button>
                    </div>

                    <div className="lecture-page-divider-line" />

                    <div className="lecture-page-content">
                        {openedLectureCourseSheets.map(sheet => 
                            <SheetThumbnail 
                                key={sheet.lectureCourseId ? sheet.lectureCourseId : sheet.tempId} 
                                sheet={sheet}
                                saveSheet={saveSheet}
                                cancelEditMode={cancelEditModeSheet}
                                handleOpenSheet={handleOpenSheet} />
                        )}
                    </div>
                    </>
                </div>
            ) }
        </div>
    )
};

export default LecturePage;