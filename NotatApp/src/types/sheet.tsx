export interface Sheet {
    sheetId?: number;
    title: string;
    content: string;
    noteType: string;
    createdAt: Date;
    editedAt: Date;

    lectureCourseId?: number;
}