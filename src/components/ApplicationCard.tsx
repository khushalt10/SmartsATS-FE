import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Application } from '../types';
import { Calendar, Building2 } from 'lucide-react';

interface Props {
    application: Application;
    onClick?: () => void;
}

export function ApplicationCardView({ application, isDragging }: { application: Application, isDragging?: boolean }) {
    return (
        <div className={`bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-sm transition-colors ${isDragging ? 'opacity-50' : 'hover:bg-gray-750 hover:border-gray-600 cursor-grab active:cursor-grabbing'
            }`}>
            <h4 className="font-semibold text-gray-200 mb-1">{application.position}</h4>
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                <Building2 size={14} />
                <span>{application.company}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                <div className="flex items-center gap-1 bg-gray-900 px-2 py-1 rounded">
                    <Calendar size={12} />
                    <span>{application.dateApplied ? new Date(application.dateApplied).toLocaleDateString() : 'N/A'}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${application.status === 'Applied' ? 'bg-blue-900/30 text-blue-400' :
                    application.status === 'Interview' ? 'bg-yellow-900/30 text-yellow-400' :
                        application.status === 'Offer' ? 'bg-green-900/30 text-green-400' :
                            'bg-red-900/30 text-red-400'
                    }`}>
                    {application.status}
                </span>
            </div>
        </div>
    );
}

export default function SortableApplicationCard({ application, onClick }: Props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: application.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="bg-gray-800 p-4 rounded-xl border border-gray-700 opacity-30 h-[120px]"
            />
        );
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={onClick}>
            <ApplicationCardView application={application} />
        </div>
    );
}
