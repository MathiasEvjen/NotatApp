import axios from "axios";
import type { LectureCourse } from "./types/lectureCourse";
import type { Sheet } from "./types/sheet";
import type { Todo } from "./types/todo";

const api = axios.create({
    baseURL: "http://localhost:5106",
    headers: {
        "Content-Type": "application/json"
    }
});

//  -----------------------
//  LectureCourse methods
//  -----------------------

export const fetchAllLectureCourses = async (): Promise<LectureCourse[]> => {
    const response = await api.get(`/api/LectureCourse/getAll`);
    return response.data;
};

export const fetchLectureCourseById = async (id: number): Promise<LectureCourse> => {
    const response = await api.get(`/api/LectureCourse/getById/${id}`);
    return response.data;
};

export const createLectureCourse = async (course: LectureCourse): Promise<LectureCourse> => {
    const response = await api.post(`/api/LectureCourse/create/`, course);
    return response.data;
};

export const updateLectureCourse = async (id: number, course: LectureCourse): Promise<LectureCourse> => {
    const response = await api.put(`/api/LectureCourse/update/${id}`, course);
    return response.data;
};

export const deleteLectureCourse = async (id: number) => {
    const response = await api.delete(`/api/LectureCourse/delete/${id}`);
    return response.data;
};

//  -----------------------
//  Sheet methods
//  -----------------------

export const fetchSheets = async (): Promise<Sheet[]> => {
    const response = await api.get(`/api/Sheet/getAll`);
    return response.data;
};

export const fetchSheetById = async (id: number): Promise<Sheet> => {
    const response = await api.get(`/api/Sheet/getById/${id}`);
    return response.data;
};

export const createSheet = async (sheet: Sheet): Promise<Sheet> => {
    const response = await api.post(`/api/Sheet/create/`, sheet);
    return response.data;
};

export const updateSheet = async (id: number, sheet: Sheet): Promise<Sheet> => {
    const response = await api.put(`/api/Sheet/update/${id}`, sheet);
    return response.data;
};

export const deleteSheet = async (id: number) => {
    const response = await api.delete(`/api/Sheet/delete/${id}`);
    return response.data;
};

//  -----------------------
//  Sheet methods
//  -----------------------

export const fetchTodos = async (): Promise<Todo[]> => {
    const response = await api.get(`/api/Todo/getAll`);
    return response.data;
};

export const fetchTodoById = async (id: number): Promise<Todo> => {
    const response = await api.get(`/api/Todo/getById/${id}`);
    return response.data;
};

export const createTodo = async (todo: Todo): Promise<Todo> => {
    const response = await api.post(`/api/Todo/create/`, todo);
    return response.data;
};

export const updateTodo = async (id: number, todo: Todo): Promise<Todo> => {
    const response = await api.put(`/api/Todo/update/${id}`, todo);
    return response.data;
};

export const deleteTodo = async (id: number) => {
    const response = await api.delete(`/api/Todo/delete/${id}`);
    return response.data;
};