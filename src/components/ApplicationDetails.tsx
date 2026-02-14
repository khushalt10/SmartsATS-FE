import { useState, useEffect } from 'react';
import type { Application } from '../types';
import { analyzeApplication } from '../api';
import { X, Sparkles, Loader2 } from 'lucide-react';

interface Props {
    application: Application;
    onClose: () => void;
}

export default function ApplicationDetails({ application, onClose }: Props) {
    const [resumeText, setResumeText] = useState(
        application.resume?.content || application.resumeText || ''
    );
    const [jobDescription, setJobDescription] = useState(application.jobDescription || '');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [model, setModel] = useState<'fast' | 'accurate'>('fast');
    const [analysisResult, setAnalysisResult] = useState<{ match_score: number; missing_keywords: string[], common_keywords: string[], model_used: string } | null>(null);

    const [activeTab, setActiveTab] = useState<'analysis' | 'interview'>('analysis');
    const [interviewQuestions, setInterviewQuestions] = useState<{ type: string, question: string, context: string }[]>([]);
    const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        try {
            const result = await analyzeApplication(resumeText, jobDescription, model);
            setAnalysisResult(result);
        } catch (error) {
            console.error(error);
            alert('Analysis failed');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleGetQuestions = async () => {
        setIsLoadingQuestions(true);
        try {
            // Import dynamically to avoid circular dependency issues if any, or just use global import
            const { fetchInterviewQuestions } = await import('../api');
            const result = await fetchInterviewQuestions(resumeText, jobDescription);
            setInterviewQuestions(result.questions);
        } catch (error) {
            console.error(error);
            alert('Failed to get interview questions');
        } finally {
            setIsLoadingQuestions(false);
        }
    };

    // Auto-fetch questions when switching to interview tab if analysis is done
    useEffect(() => {
        if (activeTab === 'interview' && interviewQuestions.length === 0 && resumeText && jobDescription) {
            handleGetQuestions();
        }
    }, [activeTab]);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-gray-900 z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-white">{application.position}</h2>
                        <p className="text-blue-400">{application.company}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex bg-gray-800 rounded-lg p-1">
                            <button
                                onClick={() => setActiveTab('analysis')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'analysis' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-gray-200'}`}
                            >
                                Analysis
                            </button>
                            <button
                                onClick={() => setActiveTab('interview')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'interview' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-gray-200'}`}
                            >
                                Interview Prep
                            </button>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    {activeTab === 'analysis' ? (
                        <div className="space-y-6">
                            <div className="flex justify-end mb-4">
                                <select
                                    value={model}
                                    onChange={(e) => setModel(e.target.value as 'fast' | 'accurate')}
                                    className="bg-gray-800 text-gray-300 text-sm border border-gray-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="fast">⚡ Fast (MiniLM)</option>
                                    <option value="accurate">🎯 Accurate (MPNet)</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Job Description</label>
                                    <textarea
                                        className="w-full h-48 bg-gray-950 border border-gray-800 rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none transition-all"
                                        placeholder="Paste job description here..."
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400 flex justify-between">
                                        <span>Resume Text</span>
                                        {application.resume && (
                                            <span className="text-xs text-blue-400 flex items-center gap-1">
                                                <Sparkles size={12} />
                                                Linked: {application.resume.name}
                                            </span>
                                        )}
                                    </label>
                                    <textarea
                                        className="w-full h-48 bg-gray-950 border border-gray-800 rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none transition-all"
                                        placeholder="Paste resume text here..."
                                        value={resumeText}
                                        onChange={(e) => setResumeText(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleAnalyze}
                                    disabled={isAnalyzing || !resumeText || !jobDescription}
                                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
                                >
                                    {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                                    <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Match'}</span>
                                </button>
                            </div>

                            {analysisResult && (
                                <div className="mt-6 bg-gray-950 border border-gray-800 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4">
                                    {/* ... existing analysis result UI ... */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-200">Analysis Result</h3>
                                            <p className="text-xs text-gray-500">Model: {analysisResult.model_used}</p>
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${analysisResult.match_score >= 70 ? 'bg-green-500/20 text-green-400' :
                                            analysisResult.match_score >= 40 ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-red-500/20 text-red-400'
                                            }`}>
                                            {analysisResult.match_score}% Match
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-400 mb-2">Missing Keywords</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {analysisResult.missing_keywords.length > 0 ? (
                                                    analysisResult.missing_keywords.map((kw) => (
                                                        <span key={kw} className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded-md border border-red-500/20">
                                                            {kw}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-500 text-sm">None! Good job.</span>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-gray-400 mb-2">Common Keywords</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {analysisResult.common_keywords.length > 0 ? (
                                                    analysisResult.common_keywords.map((kw) => (
                                                        <span key={kw} className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-md border border-green-500/20">
                                                            {kw}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-500 text-sm">No common keywords found.</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="bg-blue-900/10 border border-blue-900/30 rounded-lg p-4 mb-4">
                                <h3 className="text-blue-400 font-semibold mb-1 flex items-center gap-2">
                                    <Sparkles size={16} />
                                    AI-Generated Interview Questions
                                </h3>
                                <p className="text-sm text-gray-400">
                                    Based on your resume and the job description, here are some questions you should prepare for.
                                </p>
                            </div>

                            {isLoadingQuestions ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="animate-spin text-blue-500" size={32} />
                                </div>
                            ) : interviewQuestions.length > 0 ? (
                                <div className="grid gap-4">
                                    {interviewQuestions.map((q, i) => (
                                        <div key={i} className="bg-gray-950 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors group">
                                            <div className="flex justify-between items-start mb-3">
                                                <span className={`px-2 py-1 rounded text-xs font-medium border ${q.type === 'Technical' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                    q.type === 'Behavioral' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                        'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                                    }`}>
                                                    {q.type}
                                                </span>
                                                <span className="text-xs text-gray-500 italic opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {q.context}
                                                </span>
                                            </div>
                                            <p className="text-gray-200 font-medium leading-relaxed">
                                                {q.question}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <p>No questions generated yet.</p>
                                    <button
                                        onClick={handleGetQuestions}
                                        className="mt-4 text-blue-400 hover:text-blue-300 underline"
                                    >
                                        Generate Questions
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
