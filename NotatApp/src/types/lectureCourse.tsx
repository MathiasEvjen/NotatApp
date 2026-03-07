import type { Sheet } from "./sheet";

export interface LectureCourse {
    lectureCourseId?: number;
    title: number;
    sheets: Sheet[];
}