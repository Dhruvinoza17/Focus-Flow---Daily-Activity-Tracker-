import { useState } from "react";
import { format, isAfter, startOfDay, addDays, parseISO } from "date-fns";
import { GlassCard } from "../components/ui/GlassCard";
import { useTasks } from "../hooks/useTasks";
import { TaskCard } from "../components/ui/TaskCard";
import { AddTaskModal } from "../components/ui/AddTaskModal";
import { Button } from "../components/ui/Button";
import { Plus, CalendarDays } from "lucide-react";

export const UpcomingPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Fetch ALL tasks (undefined date)
    const { data: allTasks, isLoading } = useTasks();

    const tomorrow = startOfDay(addDays(new Date(), 1));

    // Filter tasks for dates AFTER tomorrow
    const upcomingTasks = allTasks?.filter((task: any) => {
        if (!task.date) return false;
        // Parse date carefully
        const taskDate = new Date(task.date);
        // We want tasks strictly after tomorrow (or including tomorrow if we want a consolidated view, but "Tomorrow" page exists)
        // Let's say "Upcoming" means everything after tomorrow
        return isAfter(taskDate, tomorrow);
    }) || [];

    // Group by Date
    const groupedTasks = upcomingTasks.reduce((acc: any, task: any) => {
        const dateStr = task.date.split('T')[0];
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(task);
        return acc;
    }, {});

    // Sort dates
    const sortedDates = Object.keys(groupedTasks).sort();

    return (
        <div className="space-y-6 relative min-h-full">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <CalendarDays className="text-purple-400" />
                        Upcoming Tasks
                    </h1>
                    <p className="text-secondary text-sm">Look ahead into the future</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} className="mr-2" />
                    Add Task
                </Button>
            </div>

            <div className="space-y-6">
                {isLoading ? (
                    <GlassCard className="p-8 text-center text-secondary">Loading...</GlassCard>
                ) : sortedDates.length === 0 ? (
                    <GlassCard className="p-12 text-center text-secondary">
                        <p>No upcoming tasks scheduled.</p>
                        <Button variant="outline" size="sm" className="mt-4" onClick={() => setIsModalOpen(true)}>
                            Schedule a task
                        </Button>
                    </GlassCard>
                ) : (
                    sortedDates.map(dateStr => (
                        <div key={dateStr} className="space-y-3">
                            <h3 className="text-white font-medium sticky top-0 bg-background/50 backdrop-blur-md py-2 z-10 px-2 rounded-lg inline-block">
                                {format(parseISO(dateStr), 'EEEE, MMMM do')}
                            </h3>
                            <GlassCard className="p-4">
                                <div className="flex flex-col gap-3">
                                    {groupedTasks[dateStr].map((task: any) => (
                                        <TaskCard key={task.id} task={task} />
                                    ))}
                                </div>
                            </GlassCard>
                        </div>
                    ))
                )}
            </div>

            <AddTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};
