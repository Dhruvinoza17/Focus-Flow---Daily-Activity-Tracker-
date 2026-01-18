import { GlassCard } from "../components/ui/GlassCard";
import { useTasks } from "../hooks/useTasks";
import { TaskCard } from "../components/ui/TaskCard";
import { HabitTracker } from "../components/ui/HabitTracker";
import { ProductivityChart } from "../components/ui/ProductivityChart";
import { useHabitHeatmap } from "../hooks/useAnalytics";
import { Target, CheckSquare, Flame, Sparkles } from "lucide-react";
import { format, subDays } from "date-fns";

export const DashboardPage = () => {
    const { data: tasks, isLoading } = useTasks(new Date()); // Fetch today's tasks
    const { data: heatmapData } = useHabitHeatmap();

    const completedCount = tasks?.filter((t: any) => t.status === 'Completed').length || 0;
    const totalCount = tasks?.length || 0;
    const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    // Calculate Streak
    const calculateStreak = () => {
        if (!heatmapData || heatmapData.length === 0) return 0;

        let streak = 0;
        const today = new Date();
        // Check if we have an entry for today
        const todayStr = format(today, 'yyyy-MM-dd');
        const hasToday = heatmapData.some(d => d.date === todayStr);

        // Start checking from today if we have a task, otherwise start from yesterday
        let currentCheck = hasToday ? today : subDays(today, 1);

        while (true) {
            const dateStr = format(currentCheck, 'yyyy-MM-dd');
            const hasData = heatmapData.some(d => d.date === dateStr);

            if (hasData) {
                streak++;
                currentCheck = subDays(currentCheck, 1);
            } else {
                break;
            }
        }
        return streak;
    };

    const currentStreak = calculateStreak();

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

    // Calculate Weekly Productivity Data
    const getWeeklyData = () => {
        const days = Array.from({ length: 7 }).map((_, i) => subDays(new Date(), 6 - i));

        return days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const entry = heatmapData?.find(d => d.date === dateStr);
            return {
                name: format(day, 'EEE'),
                completion: entry ? entry.count : 0
            };
        });
    };

    const weeklyData = getWeeklyData();

    return (
        <div className="space-y-6 relative min-h-full">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <GlassCard className="p-6">
                    <h3 className="text-secondary text-sm font-medium mb-2 flex items-center gap-2">
                        <Target size={16} className="text-accent" />
                        Daily Consistency
                    </h3>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-primary">{progress}%</span>
                        <span className="text-sm text-green-400 mb-1">Target: 80%</span>
                    </div>
                </GlassCard>

                <GlassCard className="p-6">
                    <h3 className="text-secondary text-sm font-medium mb-2 flex items-center gap-2">
                        <CheckSquare size={16} className="text-blue-400" />
                        Tasks Completed
                    </h3>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-primary">{completedCount}</span>
                        <span className="text-sm text-secondary mb-1">/ {totalCount} scheduled</span>
                    </div>
                </GlassCard>

                <GlassCard className="p-6">
                    <h3 className="text-secondary text-sm font-medium mb-2 flex items-center gap-2">
                        <Flame size={16} className="text-orange-500 fill-orange-500" />
                        Current Streak
                    </h3>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-primary">{currentStreak}</span>
                        <span className="text-sm text-accent mb-1">days</span>
                    </div>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <GlassCard className="min-h-[400px]">
                    <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                        <Sparkles size={20} className="text-yellow-400" />
                        Today's Focus
                    </h2>

                    <div className="flex flex-col gap-3">
                        {isLoading ? (
                            <p className="text-secondary text-center py-4">Loading tasks...</p>
                        ) : sortedTasks.length === 0 ? (
                            <div className="text-center py-8 text-secondary">
                                <p>No tasks for today.</p>
                            </div>
                        ) : (
                            sortedTasks.map((task: any) => (
                                <TaskCard key={task.id} task={task} />
                            ))
                        )}
                    </div>
                </GlassCard>

                <div className="flex flex-col gap-6">
                    <HabitTracker data={heatmapData || []} />
                    <ProductivityChart data={weeklyData} />
                </div>
            </div>

        </div>
    );
};
