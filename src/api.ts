import type { Application, Resume } from './types';

const API_URL = 'http://localhost:3001/api/applications';
const AI_API_URL = 'http://localhost:3001/api/ai';

export const fetchApplications = async (): Promise<Application[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch applications');
    }
    return response.json();
};

export const createApplication = async (application: any): Promise<Application> => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(application),
    });
    if (!response.ok) {
        throw new Error('Failed to create application');
    }
    return response.json();
};

export const updateApplicationStatus = async (id: string, status: string): Promise<Application> => {
    const response = await fetch(`${API_URL}/${id}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) {
        throw new Error('Failed to update application status');
    }
    return response.json();
};

export const analyzeApplication = async (resumeText: string, jobDescription: string, model: 'fast' | 'accurate' = 'fast') => {
    const response = await fetch(`${AI_API_URL}/analyze`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeText, jobDescription, model }),
    });
    if (!response.ok) {
        throw new Error('Failed to analyze application');
    }
    return response.json();
};

const RESUME_API_URL = 'http://localhost:3001/api/resumes';

export const fetchResumes = async (): Promise<Resume[]> => {
    const response = await fetch(RESUME_API_URL);
    if (!response.ok) throw new Error('Failed to fetch resumes');
    return response.json();
};

export const createResume = async (name: string, content: string): Promise<Resume> => {
    const response = await fetch(RESUME_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, content }),
    });
    if (!response.ok) throw new Error('Failed to create resume');
    return response.json();
};

export const uploadResume = async (file: File): Promise<Resume> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${RESUME_API_URL}/upload`, {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload resume');
    return response.json();
};

export const updateResume = async (id: number, name: string, content: string): Promise<Resume> => {
    const response = await fetch(`${RESUME_API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, content }),
    });
    if (!response.ok) throw new Error('Failed to update resume');
    return response.json();
};

export const deleteResume = async (id: number): Promise<void> => {
    const response = await fetch(`${RESUME_API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete resume');
};
