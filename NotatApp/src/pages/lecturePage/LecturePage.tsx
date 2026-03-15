import { useState } from "react";
import "./lecturePage.css";
import type { LectureCourse } from "../../types/lectureCourse";
import LectureCourseThumbnail from "../../components/thumbnail/LectureCourseThumbnail";
import { createLectureCourse } from "../../api";
import SheetThumbnail from "../../components/thumbnail/SheetThumbnail";
import type { Sheet } from "../../types/sheet";

const LecturePage: React.FC = () => {

    const [lectureCourses, setLectureCourses] = useState<LectureCourse[]>([
        {lectureCourseId: 1, title: "IN1000", isNew: false, sheets: [], editMode: false},
        {lectureCourseId: 2, title: "Programmering og systemarkitektur", isNew: false, sheets: [], editMode: false},
        {lectureCourseId: 3, title: "Dette er en tittel", isNew: false, sheets: [], editMode: false},
        {lectureCourseId: 4, title: "Algoritmer og datastrukturer", isNew: false, sheets: [], editMode: false},
        // {lectureCourseId: 5, title: "", isNew: true, sheets: [], editMode: true},
    ]);

    const [isLectureCourseOpened, setIsLectureCourseOpened] = useState<boolean>(false);
    const [openedLectureCourse, setOpenedLectureCourse] = useState<LectureCourse | null>(null);
    const [openedLectureCourseSheets, setOpenedLectureCourseSheets] = useState<Sheet[] | null>(null);

    // ------------------------
    // LectureCourse functions
    // ------------------------

    const newLectureCourse = () => {
        setLectureCourses([...lectureCourses, {
            tempId: crypto.randomUUID(),
            title: "",
            sheets: [],
            isNew: true,
            editMode: true,
        }]);
    };

    const cancelEditMode = (editLc: LectureCourse) => {
        setLectureCourses(
            lectureCourses.filter(
                lc => lc.tempId !== editLc.tempId 
                || lc.lectureCourseId !== editLc.lectureCourseId
            )
        );
    };

    const saveLectureCourse = (lcToSave: LectureCourse, newTitle: string) => {
        const updatedLc: LectureCourse = {...lcToSave, title: newTitle, editMode: false};
        setLectureCourses(prevLCs => 
            prevLCs.map(lc => 
                lc.tempId === updatedLc.tempId 
                ? updatedLc
                : lc
            )
        );

        if (lcToSave.isNew) {
            createAndSetLectureCourse(updatedLc);
        }

        // TODO: Her skal oppdatering av navn komme
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
    
    const openAndCloseLecturecourse = (lc: LectureCourse) => {
        if (lc.lectureCourseId === openedLectureCourse?.lectureCourseId) {
            setOpenedLectureCourse(null);
            setIsLectureCourseOpened(false);

            // TODO: Skal oppdatere og lagre dersom antallet sheets endrer seg
        } else {
            setOpenedLectureCourse(lc);
            setIsLectureCourseOpened(true);
            setOpenedLectureCourseSheets(lc.sheets);
        }
    };


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

    return(
        <div className={`lecture-page-wrapper ${isLectureCourseOpened ? "lecture-open" : ""}`}>
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
                            editMode={lc.editMode}
                            isOpen={lc.lectureCourseId === openedLectureCourse?.lectureCourseId}
                            saveLectureCourse={saveLectureCourse}
                            cancelEditMode={cancelEditMode}
                            openAndCloseLecturecourse={openAndCloseLecturecourse} />
                    )}
                </div>
            </div>
            
            <div className={`lecture-page-content-wrapper lecture-panel ${isLectureCourseOpened ? "visible" : ""}`}>
                {(isLectureCourseOpened && openedLectureCourse && openedLectureCourseSheets) && (
                    <>
                    <div className="lecture-page-content-header">
                        <p>Notater - {openedLectureCourse.title}</p>
                        <button className="btn-success" onClick={newSheet}>Nytt notat</button>
                    </div>

                    <div className="lecture-page-divider-line" />

                    <div className="lecture-page-content">
                        {openedLectureCourseSheets.map(sheet => 
                            <SheetThumbnail key={sheet.lectureCourseId ? sheet.lectureCourseId : sheet.tempId} sheet={sheet} />
                        )}
                    </div>
                    </>
                ) }
            </div>
        </div>
    )
};

export default LecturePage;