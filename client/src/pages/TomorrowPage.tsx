import { useState } from "react";
import { addDays } from "date-fns";
import { GlassCard } from "../components/ui/GlassCard";
import { useTasks } from "../hooks/useTasks";
import { TaskCard } from "../components/ui/TaskCard";
import { AddTaskModal } from "../components/ui/AddTaskModal";
import { Button } from "../components/ui/Button";
import { Plus, Calendar } from "lucide-react";

export const TomorrowPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const tomorrow = addDays(new Date(), 1);
    const { data: tasks, isLoading } = useTasks(tomorrow);

    const getPriorityWeight = (p: string) => {
        const lower = p?.toLowerCase();
        if (lower === 'high') return 0;
        if (lower === 'medium') return 1;
        if (lower === 'low') return 2;
        return 3;
    };

    const sortedTasks = tasks ? [...tasks].sort((a: any, b: any) => {
        return getPriorityWeight(a.priority) - getPriorityWeight(b.priority);
    }) : [];

    return (
        <div className="space-y-6 relative min-h-full">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                        <Calendar className="text-accent" />
                        Tomorrow's Plan
                    </h1>
                    <p className="text-secondary text-sm">Prepare for the day ahead</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} className="mr-2" />
                    Add Task
                </Button>
            </div>

            <GlassCard className="min-h-[500px] p-6">
                <div className="flex flex-col gap-3">
                    {isLoading ? (
                        <p className="text-secondary text-center py-8">Loading tasks...</p>
                    ) : sortedTasks.length === 0 ? (
                        <div className="text-center py-12 text-secondary">
                            <p>No tasks scheduled for tomorrow.</p>
                            <Button variant="outline" size="sm" className="mt-4" onClick={() => setIsModalOpen(true)}>
                                Plan ahead
                            </Button>
                        </div>
                    ) : (
                        sortedTasks.map((task: any) => (
                            <TaskCard key={task.id} task={task} />
                        ))
                    )}
                </div>
            </GlassCard>

            <AddTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                defaultDate={tomorrow}
            />
        </div>
    );
};
