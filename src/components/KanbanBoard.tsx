import { useState, useEffect } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import Column from './Column';
import { ApplicationCardView } from './ApplicationCard';
import ApplicationDetails from './ApplicationDetails';
import type { Application } from '../types';
import { fetchApplications, updateApplicationStatus } from '../api';

const defaultCols = [
    { id: 'applied', title: 'Applied' },
    { id: 'interview', title: 'Interview' },
    { id: 'offer', title: 'Offer' },
    { id: 'rejected', title: 'Rejected' },
];

export default function KanbanBoard() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeApplication, setActiveApplication] = useState<Application | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    useEffect(() => {
        fetchApplications()
            .then(setApplications)
            .catch(console.error);
    }, []);

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const activeApp = applications.find((app) => app.id === activeId);

        // Dropped on a column (changing status)
        if (defaultCols.some(col => col.id === overId)) {
            if (activeApp && activeApp.status !== overId) {
                // Optimistic UI update
                setApplications((apps) =>
                    apps.map(app => app.id === activeId ? { ...app, status: overId } : app)
                );
                // API call
                updateApplicationStatus(activeId, overId).catch(console.error);
            }
            setActiveId(null);
            return;
        }

        // Dropped on another item
        const overApp = applications.find((app) => app.id === overId);

        if (activeApp && overApp) {
            if (activeApp.status !== overApp.status) {
                // Moved to different column via item drop
                setApplications((apps) =>
                    apps.map(app => app.id === activeId ? { ...app, status: overApp.status } : app)
                );
                updateApplicationStatus(activeId, overApp.status).catch(console.error);
            } else {
                // Reordering within same column
                const oldIndex = applications.findIndex((app) => app.id === activeId);
                const newIndex = applications.findIndex((app) => app.id === overId);
                setApplications((apps) => arrayMove(apps, oldIndex, newIndex));
            }
        }

        setActiveId(null);
    }

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex h-full gap-6 overflow-x-auto pb-4">
                {defaultCols.map((col) => (
                    <Column
                        key={col.id}
                        col={col}
                        applications={applications.filter(app => app.status === col.id)}
                        onCardClick={(app) => setActiveApplication(app)}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeId ? (
                    <ApplicationCardView application={applications.find(app => app.id === activeId)!} isDragging />
                ) : null}
            </DragOverlay>

            {activeApplication && (
                <ApplicationDetails
                    application={activeApplication}
                    onClose={() => setActiveApplication(null)}
                />
            )}
        </DndContext>
    );
}
