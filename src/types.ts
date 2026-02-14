export interface Application {
    id: string;
    company: string;
    position: string;
    status: string;
    dateApplied: string;
    jobDescription?: string;
    resumeText?: string;
    notes?: string;
    resumeId?: number;
    resume?: Resume;
}

export interface Resume {
    id: number;
    name: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}
