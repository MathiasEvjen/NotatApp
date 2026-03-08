export interface Sheet {
    sheetId?: number;
    title: string;
    content: string;
    noteType: SheetType;
    createdAt: Date;
    editedAt: Date;

    lectureCourseId?: number;
}

export type SheetType = "Lecture" | "List" | "Log";