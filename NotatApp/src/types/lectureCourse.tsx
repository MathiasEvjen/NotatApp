import type { Sheet } from "./sheet";

export interface LectureCourse {
    lectureCourseId?: number;
    title: string;
    sheets: Sheet[];
    isNew?: boolean;
    editMode: boolean;
    tempId?: string;
}