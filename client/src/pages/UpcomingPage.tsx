import { useState } from "react";
import {
    format,
    addDays,
    isAfter,
    startOfDay,
    endOfWeek,
    isWithinInterval,
    addWeeks,
    startOfWeek,
} from "date-fns";
import { GlassCard } from "../components/ui/GlassCard";
import { useTasks, type Task } from "../hooks/useTasks";
import { AddTaskModal } from "../components/ui/AddTaskModal";
import { Button } from "../components/ui/Button";
import { Plus, Telescope, Zap, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "../lib/utils";

export const UpcomingPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: allTasks = [], isLoading } = useTasks();

    // 1. Filter: Remove Completed & Past Tasks
    const today = startOfDay(new Date());
    const tomorrow = addDays(today, 1);

    const activeTasks = allTasks.filter(task => {
        if (task.status === 'Completed') return false;
        if (!task.date) return false;
        // Parse date safely
        const taskDate = new Date(task.date);
        return isAfter(taskDate, today) || task.date === format(tomorrow, 'yyyy-MM-dd');
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // 2. Grouping
    const groups = {
        imminent: [] as Task[], // Tomorrow + Day After
        thisWeek: [] as Task[], // Rest of this week
        nextWeek: [] as Task[], // Next full week
        later: [] as Task[]     // Everything else
    };

    const dayAfter = addDays(tomorrow, 1);
    const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 });
    const startOfNextWeek = startOfWeek(addWeeks(today, 1), { weekStartsOn: 1 });
    const endOfNextWeek = endOfWeek(addWeeks(today, 1), { weekStartsOn: 1 });

    activeTasks.forEach(task => {
        // Safe parse
        let tDate = new Date(task.date);
        const dateStr = task.date.split('T')[0];
        const tomorrowStr = format(tomorrow, 'yyyy-MM-dd');
        const dayAfterStr = format(dayAfter, 'yyyy-MM-dd');

        if (dateStr === tomorrowStr || dateStr === dayAfterStr) {
            groups.imminent.push(task);
        } else if (isWithinInterval(tDate, { start: addDays(dayAfter, 0), end: endOfCurrentWeek })) {
            groups.thisWeek.push(task);
        } else if (isWithinInterval(tDate, { start: startOfNextWeek, end: endOfNextWeek })) {
            groups.nextWeek.push(task);
        } else {
            groups.later.push(task);
        }
    });

    const PriorityBadge = ({ priority }: { priority: string }) => {
        const colors = {
            High: 'bg-red-500/20 text-red-400 border-red-500/30',
            Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            Low: 'bg-green-500/20 text-green-400 border-green-500/30'
        };
        return (
            <span className={cn("text-[10px] px-2 py-0.5 rounded-full border border-white/5 uppercase tracking-wide font-medium", (colors as any)[priority] || colors.Low)}>
                {priority}
            </span>
        );
    };

    const MinimalTaskRow = ({ task }: { task: Task }) => (
        <div className="group flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3 overflow-hidden">
                <div className={cn("w-1.5 h-8 rounded-full",
                    task.priority === 'High' ? 'bg-red-500' :
                        task.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                )} />
                <div className="flex flex-col truncate">
                    <span className="text-sm font-medium text-primary truncate">{task.title}</span>
                    <span className="text-xs text-secondary flex items-center gap-2">
                        {format(new Date(task.date), 'EEE, MMM d')} • {task.category}
                    </span>
                </div>
            </div>
            {/* <PriorityBadge priority={task.priority} /> */}
        </div>
    );

    return (
        <div className="space-y-8 min-h-full pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
                        <Telescope className="text-indigo-400" size={32} />
                        Future Horizon
                    </h1>
                    <p className="text-secondary mt-1">A clear view of what lies ahead</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} className="mr-2" />
                    New Task
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center text-secondary py-20">Scanning horizon...</div>
            ) : activeTasks.length === 0 ? (
                <GlassCard className="p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                        <Zap className="text-yellow-400" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-2">No upcoming tasks!</h3>
                    <p className="text-secondary max-w-md mx-auto mb-6">
                        Your future schedule is completely clear. Enjoy the freedom or plan ahead.
                    </p>
                    <Button onClick={() => setIsModalOpen(true)}>
                        Plan a Task
                    </Button>
                </GlassCard>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* LEFT COLUMN: IMMINENT (Next 48 Hours) - Takes 5 cols */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="flex items-center gap-2 text-primary/80 font-medium mb-2">
                            <Zap size={18} className="text-yellow-400" />
                            <span>Imminent (Next 48h)</span>
                        </div>

                        {groups.imminent.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {groups.imminent.map(task => (
                                    <GlassCard key={task.id} className="p-5 border-l-4 border-l-accent relative overflow-hidden group">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                                                {format(new Date(task.date), 'EEEE')}
                                            </span>
                                            <PriorityBadge priority={task.priority} />
                                        </div>
                                        <h3 className="text-lg font-semibold text-primary mb-1">{task.title}</h3>
                                        <div className="flex items-center gap-3 text-sm text-secondary">
                                            <span>{task.category}</span>
                                            {task.timeEstimate && <span>• {task.timeEstimate}m</span>}
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 rounded-xl border-2 border-dashed border-white/5 text-center text-secondary">
                                Nothing due in the next 48 hours. Clear skies!
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: THE HORIZON - Takes 7 cols */}
                    <div className="lg:col-span-7 space-y-8">

                        {/* 1. This Week */}
                        {groups.thisWeek.length > 0 && (
                            <div>
                                <h4 className="text-sm font-bold text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                    Rest of This Week
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {groups.thisWeek.map(task => (
                                        <MinimalTaskRow key={task.id} task={task} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 2. Next Week */}
                        {groups.nextWeek.length > 0 && (
                            <div>
                                <h4 className="text-sm font-bold text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                                    Next Week
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {groups.nextWeek.map(task => (
                                        <MinimalTaskRow key={task.id} task={task} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 3. Later */}
                        {groups.later.length > 0 && (
                            <div>
                                <h4 className="text-sm font-bold text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                    Later
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {groups.later.map(task => (
                                        <MinimalTaskRow key={task.id} task={task} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {groups.thisWeek.length === 0 && groups.nextWeek.length === 0 && groups.later.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-secondary opacity-50">
                                <CalendarIcon size={48} className="mb-4" />
                                <p>Horizon is clear</p>
                            </div>
                        )}

                    </div>
                </div>
            )}

            <AddTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};
