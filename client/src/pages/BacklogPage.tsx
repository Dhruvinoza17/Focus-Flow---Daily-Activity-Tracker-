import { useState } from "react";
import { isBefore, startOfDay } from "date-fns";
import { GlassCard } from "../components/ui/GlassCard";
import { useTasks } from "../hooks/useTasks";
import { TaskCard } from "../components/ui/TaskCard";
import { ArchiveRestore, CalendarClock } from "lucide-react";
import { RescheduleModal } from "../components/ui/RescheduleModal";
import type { Task as TaskType } from "../hooks/useTasks";

export const BacklogPage = () => {
    const { data: allTasks = [], isLoading } = useTasks();
    const [rescheduleTask, setRescheduleTask] = useState<TaskType | null>(null);

    // Filter for Backlog: Pending AND Date is before Today
    const today = startOfDay(new Date());
    const backlogTasks = allTasks.filter(task => {
        if (task.status === 'Completed') return false;
        if (!task.date) return true; // No date = Backlog
        const taskDate = startOfDay(new Date(task.date));
        return isBefore(taskDate, today);
    }).sort((a, b) => new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime());

    return (
        <div className="space-y-6 h-full pb-10">
            <div className="flex items-center justify-between py-4 border-b border-primary/5">
                <div>
                    <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                        <ArchiveRestore className="text-orange-400" />
                        Backlog
                    </h1>
                    <p className="text-secondary text-sm">Tasks that need your attention</p>
                </div>
                <div className="bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                    <span className="text-sm font-medium text-orange-400">
                        {backlogTasks.length} Overdue
                    </span>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center text-secondary py-20">Loading backlog...</div>
            ) : backlogTasks.length === 0 ? (
                <GlassCard className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                        <CalendarClock className="text-green-500" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-2">All caught up!</h3>
                    <p className="text-secondary max-w-md mx-auto">
                        You have no overdue tasks. Great job staying on track!
                    </p>
                </GlassCard>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {backlogTasks.map((task: any) => (
                        <div key={task.id} className="relative group">
                            <TaskCard
                                task={task}
                                onReschedule={() => setRescheduleTask(task)}
                            />
                            {/* Visual indicator for overdue */}
                            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-12 bg-orange-500/50 rounded-r-full" />
                        </div>
                    ))}
                </div>
            )}

            {rescheduleTask && (
                <RescheduleModal
                    isOpen={!!rescheduleTask}
                    onClose={() => setRescheduleTask(null)}
                    task={rescheduleTask}
                />
            )}
        </div>
    );
};
