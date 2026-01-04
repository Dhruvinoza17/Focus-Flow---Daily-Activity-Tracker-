import { useState } from "react";
import { GlassCard } from "../components/ui/GlassCard";
import { useAuthStore } from "../contexts/authStore";
import { useTasks } from "../hooks/useTasks";
import { TaskCard } from "../components/ui/TaskCard";
import { AddTaskModal } from "../components/ui/AddTaskModal";
import { HabitTracker } from "../components/ui/HabitTracker";
import { ProductivityChart } from "../components/ui/ProductivityChart";
import { Button } from "../components/ui/Button";
import { useHabitHeatmap } from "../hooks/useAnalytics";
import { Plus } from "lucide-react";

export const DashboardPage = () => {
    const { user } = useAuthStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: tasks, isLoading } = useTasks(new Date()); // Fetch today's tasks
    const { data: heatmapData } = useHabitHeatmap();

    const completedCount = tasks?.filter((t: any) => t.status === 'Completed').length || 0;
    const totalCount = tasks?.length || 0;
    const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Good Evening, <span className="text-accent">{user?.displayName}</span>
                    </h1>
                    <p className="text-secondary mt-1">Here is your daily overview.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} className="mr-2" />
                    Add Task
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="p-6">
                    <h3 className="text-secondary text-sm font-medium mb-2">Daily Consistency</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-white">{progress}%</span>
                        <span className="text-sm text-green-400 mb-1">Target: 80%</span>
                    </div>
                </GlassCard>

                <GlassCard className="p-6">
                    <h3 className="text-secondary text-sm font-medium mb-2">Tasks Completed</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-white">{completedCount}</span>
                        <span className="text-sm text-secondary mb-1">/ {totalCount} scheduled</span>
                    </div>
                </GlassCard>

                <GlassCard className="p-6">
                    <h3 className="text-secondary text-sm font-medium mb-2">Current Streak</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-white">7</span>
                        <span className="text-sm text-accent mb-1">days</span>
                    </div>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <GlassCard className="min-h-[400px]">
                    <h2 className="text-lg font-bold text-white mb-4">Today's Focus</h2>

                    <div className="flex flex-col gap-3">
                        {isLoading ? (
                            <p className="text-secondary text-center py-4">Loading tasks...</p>
                        ) : tasks?.length === 0 ? (
                            <div className="text-center py-8 text-secondary">
                                <p>No tasks for today.</p>
                                <Button variant="outline" size="sm" className="mt-4" onClick={() => setIsModalOpen(true)}>
                                    Plan your day
                                </Button>
                            </div>
                        ) : (
                            tasks?.map((task: any) => (
                                <TaskCard key={task.id} task={task} />
                            ))
                        )}
                    </div>
                </GlassCard>

                <div className="flex flex-col gap-6">
                    <HabitTracker data={heatmapData || []} />

                    <GlassCard className="flex-1 min-h-[200px]">
                        <h2 className="text-lg font-bold text-white mb-4">Productivity Trend</h2>
                        <ProductivityChart />
                    </GlassCard>
                </div>
            </div>

            <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};
