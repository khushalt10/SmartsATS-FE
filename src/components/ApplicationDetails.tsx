import { useState } from 'react';
import type { Application } from '../types';
import { analyzeApplication } from '../api';
import { X, Sparkles, Loader2 } from 'lucide-react';

interface Props {
    application: Application;
    onClose: () => void;
}

export default function ApplicationDetails({ application, onClose }: Props) {
    const [resumeText, setResumeText] = useState(application.resumeText || '');
    const [jobDescription, setJobDescription] = useState(application.jobDescription || '');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<{ match_score: number; missing_keywords: string[], common_keywords: string[] } | null>(null);

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        try {
            const result = await analyzeApplication(resumeText, jobDescription);
            setAnalysisResult(result);
        } catch (error) {
            console.error(error);
            alert('Analysis failed');
        } finally {
            setIsAnalyzing(false);
        }
    };



    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-gray-900 z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-white">{application.position}</h2>
                        <p className="text-blue-400">{application.company}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
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
                            <label className="text-sm font-medium text-gray-400">Resume Text</label>
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
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-200">Analysis Result</h3>
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
            </div>
        </div>
    );
}
