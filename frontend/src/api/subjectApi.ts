import axios from "axios";

// Dedicated axios instance for the academic microservice
const academicApi = axios.create({
    baseURL: import.meta.env.VITE_ACADEMIC_API,
    headers: {
        "Content-Type": "application/json"
    }
});

// Attach JWT token automatically on every request
academicApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ─── Types ─────────────────────────────────────────────────────────────────────

export type SubjectStatus = "ACTIVE" | "COMPLETED" | "DROPPED";

export interface Subject {
    id:           number;
    code:         string;
    name:         string;
    credits:      number;
    lecturer:     string | null;
    description:  string | null;
    currentGrade: string | null;
    progress:     number;
    status:       SubjectStatus;
    semesterId:   number;
    userId:       number;
    createdAt:    string;
    updatedAt:    string;
    semester?: {
        id:           number;
        name:         string;
        academicYear: string;
        startDate:    string;
        endDate:      string;
        status:       string;
    };
}

export interface CreateSubjectDto {
    code:          string;
    name:          string;
    credits:       number;
    semesterId:    number;
    status:        SubjectStatus;
    lecturer?:     string;
    description?:  string;
    currentGrade?: string;
    progress?:     number;
}

export type UpdateSubjectDto = Partial<CreateSubjectDto>;

// ─── API Functions ──────────────────────────────────────────────────────────────

/** Get all subjects for the logged-in user (optionally filtered by semesterId) */
export const getSubjects = (semesterId?: number) =>
    academicApi.get<Subject[]>(
        "/subjects",
        semesterId ? { params: { semesterId } } : undefined
    );

/** Get a single subject by ID */
export const getSubjectById = (id: number) =>
    academicApi.get<Subject>(`/subjects/${id}`);

/** Create a new subject */
export const createSubject = (data: CreateSubjectDto) =>
    academicApi.post<Subject>("/subjects", data);

/** Partial update of a subject */
export const updateSubject = (id: number, data: UpdateSubjectDto) =>
    academicApi.put<Subject>(`/subjects/${id}`, data);

/** Delete a subject */
export const deleteSubject = (id: number) =>
    academicApi.delete<{ message: string }>(`/subjects/${id}`);

export default academicApi;
