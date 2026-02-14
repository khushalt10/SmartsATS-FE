import { useState, useEffect } from 'react';
import { fetchResumes, createResume, deleteResume, uploadResume } from '../api';
import type { Resume } from '../types';
import { FileText, Plus, Trash2, Calendar, Upload, Type } from 'lucide-react';

export default function ResumesList() {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newName, setNewName] = useState('');
    const [newContent, setNewContent] = useState('');
    const [uploadMode, setUploadMode] = useState<'file' | 'text'>('file');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        loadResumes();
    }, []);

    const loadResumes = () => {
        setLoading(true);
        fetchResumes()
            .then(setResumes)
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (uploadMode === 'file' && selectedFile) {
                await uploadResume(selectedFile);
            } else {
                await createResume(newName, newContent);
            }
            setShowModal(false);
            setNewName('');
            setNewContent('');
            setSelectedFile(null);
            loadResumes();
        } catch (error) {
            console.error(error);
            alert('Failed to save resume');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this resume?')) return;
        try {
            await deleteResume(id);
            loadResumes();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="text-gray-400 p-8">Loading resumes...</div>;

    return (
        <div className="bg-gray-900 text-white p-6 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <FileText className="text-purple-400" />
                    Resume Library
                </h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                    <Plus size={16} />
                    Add Resume
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resumes.map((resume) => (
                    <div key={resume.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-colors group relative">
                        <div className="flex items-start justify-between mb-3">
                            <div className="p-2 bg-purple-900/30 rounded-lg text-purple-400">
                                <FileText size={24} />
                            </div>
                            <button
                                onClick={() => handleDelete(resume.id)}
                                className="text-gray-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <h3 className="font-semibold text-lg text-gray-200 mb-1">{resume.name}</h3>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mb-4">
                            <Calendar size={12} />
                            Updated: {new Date(resume.updatedAt).toLocaleDateString()}
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-3 font-mono bg-gray-950/50 p-2 rounded">
                            {resume.content}
                        </p>
                    </div>
                ))}
            </div>

            {resumes.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <FileText size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No resumes found. Create one to get started!</p>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
                        <h3 className="text-xl font-bold mb-4">Add New Resume</h3>

                        <div className="flex bg-gray-800 p-1 rounded-lg mb-4">
                            <button
                                type="button"
                                onClick={() => setUploadMode('file')}
                                className={`flex-1 py-1 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-colors ${uploadMode === 'file' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-gray-200'
                                    }`}
                            >
                                <Upload size={14} /> Upload File
                            </button>
                            <button
                                type="button"
                                onClick={() => setUploadMode('text')}
                                className={`flex-1 py-1 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-colors ${uploadMode === 'text' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-gray-200'
                                    }`}
                            >
                                <Type size={14} /> Paste Text
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4">
                            {uploadMode === 'text' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Resume Name</label>
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            placeholder="e.g. Frontend Developer Resume"
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Resume Content (Text)</label>
                                        <textarea
                                            value={newContent}
                                            onChange={(e) => setNewContent(e.target.value)}
                                            placeholder="Paste your resume text here..."
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-48 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            {uploadMode === 'file' && (
                                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-blue-500/50 transition-colors">
                                    <input
                                        type="file"
                                        id="resume-upload"
                                        accept=".pdf,.docx,.txt"
                                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                        className="hidden"
                                    />
                                    <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                        <Upload size={32} className="text-gray-500" />
                                        <span className="text-gray-300 font-medium">Click to upload PDF or DOCX</span>
                                        <span className="text-xs text-gray-500">Supported: PDF, DOCX, TXT</span>
                                    </label>
                                    {selectedFile && (
                                        <div className="mt-4 p-2 bg-blue-900/30 text-blue-300 rounded text-sm">
                                            Selected: {selectedFile.name}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-white px-4 py-2 text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || (uploadMode === 'file' && !selectedFile)}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Saving...' : 'Save Resume'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
