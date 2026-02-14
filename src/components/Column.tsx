import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableApplicationCard from './ApplicationCard';
import type { Application } from '../types';

interface ColumnProps {
    col: { id: string; title: string };
    applications: Application[];
    onCardClick?: (app: Application) => void;
}

export default function Column({ col, applications, onCardClick }: ColumnProps) {
    const { setNodeRef } = useDroppable({
        id: col.id,
    });

    return (
        <div className="flex flex-col w-80 shrink-0">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-400 uppercase tracking-wider text-sm flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.id === 'applied' ? 'bg-blue-500' :
                        col.id === 'interview' ? 'bg-yellow-500' :
                            col.id === 'offer' ? 'bg-green-500' :
                                'bg-red-500'
                        }`} />
                    {col.title}
                </h3>
                <span className="text-gray-600 text-xs font-medium bg-gray-800 px-2 py-1 rounded-full">
                    {applications.length}
                </span>
            </div>

            <div
                ref={setNodeRef}
                className="flex-1 bg-gray-900/50 rounded-xl border border-gray-800/50 p-2 space-y-3 min-h-[150px]"
            >
                <SortableContext items={applications.map(app => app.id)} strategy={verticalListSortingStrategy}>
                    {applications.map((app) => (
                        <SortableApplicationCard
                            key={app.id}
                            application={app}
                            onClick={() => onCardClick?.(app)}
                        />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}
