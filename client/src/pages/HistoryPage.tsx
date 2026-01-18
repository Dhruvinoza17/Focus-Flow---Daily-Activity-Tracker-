import { format, isYesterday, isToday } from "date-fns";
import { GlassCard } from "../components/ui/GlassCard";
import { useTasks } from "../hooks/useTasks";
import { TaskCard } from "../components/ui/TaskCard";
import { History, CheckCircle2, CircleDot } from "lucide-react";
import { motion } from "framer-motion";

export const HistoryPage = () => {
    const { data: allTasks = [], isLoading } = useTasks();

    // 1. Filter: Keep only Completed Tasks
    const completedTasks = allTasks
        .filter(task => task.status === 'Completed')
        .sort((a, b) => {
            const dateA = new Date(a.date || a.createdAt);
            const dateB = new Date(b.date || b.createdAt);
            return dateB.getTime() - dateA.getTime();
        });

    // 2. Grouping by Date
    const groupedTasks = completedTasks.reduce((acc: any, task) => {
        let dateKey = task.date;
        if (!dateKey) dateKey = task.createdAt.split('T')[0];
        if (dateKey.includes('T')) dateKey = dateKey.split('T')[0];

        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(task);
        return acc;
    }, {});

    const sortedDates = Object.keys(groupedTasks).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    const getDateLabel = (dateSchema: string) => {
        try {
            const date = new Date(dateSchema);
            if (isToday(date)) return "Today";
            if (isYesterday(date)) return "Yesterday";
            return format(date, "MMMM do, yyyy");
        } catch (e) {
            return dateSchema;
        }
    };

    return (
        <div className="space-y-6 h-full pb-10">
            <div className="flex items-center justify-between py-4 border-b border-primary/5">
                <div>
                    <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                        <History className="text-green-400" />
                        Timeline History
                    </h1>
                    <p className="text-secondary text-sm">Your journey of achievements</p>
                </div>
                <div className="bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                    <span className="text-sm font-medium text-primary">
                        {completedTasks.length} Completed
                    </span>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center text-secondary py-20">Loading timeline...</div>
            ) : completedTasks.length === 0 ? (
                <GlassCard className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                    <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                        <CheckCircle2 className="text-green-400 opacity-50" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-2">No completed tasks yet</h3>
                    <p className="text-secondary max-w-md mx-auto">
                        Your history is empty. Finish some tasks to build your legacy!
                    </p>
                </GlassCard>
            ) : (
                <div className="relative pl-8 md:pl-10 space-y-12 py-4">
                    {/* Vertical Timeline Rail */}
                    <div className="absolute left-3 md:left-4 top-4 bottom-0 w-0.5 bg-gradient-to-b from-green-500/50 via-green-500/10 to-transparent" />

                    {sortedDates.map((dateStr, index) => (
                        <motion.div
                            key={dateStr}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative"
                        >
                            {/* Date Node */}
                            <div className="absolute -left-[34px] md:-left-[39px] top-0 flex items-center justify-center">
                                <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-background border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)] z-10">
                                    <CircleDot size={16} className="text-green-500" />
                                </div>
                            </div>

                            {/* Date Header */}
                            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-3">
                                {getDateLabel(dateStr)}
                                <span className="text-xs font-normal text-secondary bg-primary/5 px-2 py-0.5 rounded-full">
                                    {groupedTasks[dateStr].length} tasks
                                </span>
                            </h3>

                            {/* Tasks Stack */}
                            <div className="space-y-4">
                                {groupedTasks[dateStr].map((task: any) => (
                                    <div key={task.id} className="relative">
                                        {/* Connector Line */}
                                        <div className="absolute -left-6 top-6 w-4 h-0.5 bg-white/5" />
                                        <TaskCard task={task} />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};
