import type { Application } from './types';

const API_URL = 'http://localhost:3001/api/applications';
const AI_API_URL = 'http://localhost:3001/api/ai';

export const fetchApplications = async (): Promise<Application[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch applications');
    }
    return response.json();
};

export const createApplication = async (application: Omit<Application, 'id'>): Promise<Application> => {
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

export const analyzeApplication = async (resumeText: string, jobDescription: string) => {
    const response = await fetch(`${AI_API_URL}/analyze`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeText, jobDescription }),
    });
    if (!response.ok) {
        throw new Error('Failed to analyze application');
    }
    return response.json();
};
