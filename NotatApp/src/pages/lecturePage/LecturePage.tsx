import { useState } from "react";
import "./lecturePage.css";
import type { LectureCourse } from "../../types/lectureCourse";
import LectureCourseThumbnail from "../../components/thumbnail/LectureCourseThumbnail";
import { createLectureCourse } from "../../api";

const LecturePage: React.FC = () => {

    const [lectureCourses, setLectureCourses] = useState<LectureCourse[]>([
        {lectureCourseId: 1, title: "IN1000", isNew: false, sheets: [], editMode: false},
        {lectureCourseId: 2, title: "Programmering og systemarkitektur", isNew: false, sheets: [], editMode: false},
        {lectureCourseId: 3, title: "Dette er en tittel", isNew: false, sheets: [], editMode: false},
        {lectureCourseId: 4, title: "Algoritmer og datastrukturer", isNew: false, sheets: [], editMode: false},
        // {lectureCourseId: 5, title: "", isNew: true, sheets: [], editMode: true},
    ]);

    const [lectureCourseOpened, setLectureCourseOpened] = useState<boolean>(false);

    const newLectureCourse = () => {
        setLectureCourses([...lectureCourses, {
            tempId: crypto.randomUUID(),
            title: "",
            sheets: [],
            isNew: true,
            editMode: true,
        }]);
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

    return(
        <div className="lecture-page-wrapper">
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
                            saveLectureCourse={saveLectureCourse} />
                    )}
                </div>
            </div>
            
            {lectureCourseOpened ? (
                <div className="lecture-page-content-wrapper">
                    <div className="lecture-page-content-header">
                        <p>Forelesningsnotater</p>
                        <button className="btn-success">Nytt notat</button>
                    </div>
                    <div className="lecture-page-divider-line" />
                </div>
            ) : ""}
        </div>
    )
};

export default LecturePage;