import { useState, useEffect } from 'react';
import { fetchApplications } from '../api';
import type { Application } from '../types';
import { Calendar, Building2, Briefcase } from 'lucide-react';

export default function ApplicationsList() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications()
            .then(setApplications)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-gray-400 p-8">Loading applications...</div>;

    return (
        <div className="bg-gray-900 text-white p-6 rounded-xl border border-gray-800">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Briefcase className="text-blue-400" />
                All Applications
            </h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-800 text-gray-400 text-sm uppercase tracking-wider">
                            <th className="p-4 font-medium">Company</th>
                            <th className="p-4 font-medium">Position</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium">Date Applied</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {applications.map((app) => (
                            <tr key={app.id} className="border-b border-gray-800/50 hover:bg-gray-800/50 transition-colors">
                                <td className="p-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400">
                                        <Building2 size={16} />
                                    </div>
                                    <span className="font-medium text-gray-200">{app.company}</span>
                                </td>
                                <td className="p-4 text-gray-300">{app.position}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${app.status === 'Applied' ? 'bg-blue-900/30 text-blue-400' :
                                            app.status === 'Interview' ? 'bg-yellow-900/30 text-yellow-400' :
                                                app.status === 'Offer' ? 'bg-green-900/30 text-green-400' :
                                                    'bg-red-900/30 text-red-400'
                                        }`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-500 font-mono">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} />
                                        {new Date(app.dateApplied).toLocaleDateString()}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
