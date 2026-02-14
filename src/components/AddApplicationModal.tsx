import { useState, useEffect } from 'react';
import { createApplication, fetchResumes } from '../api';
import type { Resume } from '../types';
import { X } from 'lucide-react';

interface Props {
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddApplicationModal({ onClose, onSuccess }: Props) {
    const [formData, setFormData] = useState({
        company: '',
        position: '',
        status: 'Applied',
        dateApplied: new Date().toISOString().split('T')[0],
        jobDescription: '',
        resumeId: '',
    });
    const [loading, setLoading] = useState(false);
    const [resumes, setResumes] = useState<Resume[]>([]);

    useEffect(() => {
        fetchResumes().then(setResumes).catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createApplication({
                ...formData,
                resumeId: formData.resumeId ? Number(formData.resumeId) : undefined,
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to create application');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-lg p-6 relative shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold mb-6 text-white">Add New Application</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Company</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.company}
                                onChange={e => setFormData({ ...formData, company: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Position</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.position}
                                onChange={e => setFormData({ ...formData, position: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                            <select
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="Applied">Applied</option>
                                <option value="Interview">Interview</option>
                                <option value="Offer">Offer</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Date Applied</label>
                            <input
                                type="date"
                                required
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.dateApplied}
                                onChange={e => setFormData({ ...formData, dateApplied: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Link Resume (Optional)</label>
                        <select
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.resumeId}
                            onChange={e => setFormData({ ...formData, resumeId: e.target.value })}
                        >
                            <option value="">-- No Resume Linked --</option>
                            {resumes.map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            The resume content will be used for AI analysis.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Job Description</label>
                        <textarea
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                            placeholder="Paste job description here for AI analysis..."
                            value={formData.jobDescription}
                            onChange={e => setFormData({ ...formData, jobDescription: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Application'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
