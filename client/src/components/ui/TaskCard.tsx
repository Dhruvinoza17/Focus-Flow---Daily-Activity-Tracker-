import { format } from "date-fns";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, Tag, Trash2, CalendarDays } from "lucide-react";
import { type Task, useUpdateTask, useDeleteTask } from "../../hooks/useTasks";
import { cn } from "../../lib/utils";

interface TaskCardProps {
    task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
    const { mutate: updateTask } = useUpdateTask();
    const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this task?")) {
            deleteTask(task.id);
        }
    };

    const handleStatusToggle = () => {
        const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';

        let updates: any = { status: newStatus };

        // Sync subtasks with the new status (Check all or Uncheck all)
        if (task.subtasks) {
            updates.subtasks = task.subtasks.map(st => ({
                ...st,
                completed: newStatus === 'Completed'
            }));
        }

        updateTask({ id: task.id, ...updates });
    };

    const handleSubtaskToggle = (subtaskId: string) => {
        if (!task.subtasks) return;

        const newSubtasks = task.subtasks.map(st =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );

        // Check if all subtasks are complete
        const allComplete = newSubtasks.every(st => st.completed);
        const newStatus = allComplete ? 'Completed' : 'Pending';

        updateTask({
            id: task.id,
            subtasks: newSubtasks,
            status: newStatus
        });
    };

    const priorityColors = {
        Low: "bg-blue-500/10 text-blue-500",
        Medium: "bg-yellow-500/10 text-yellow-500",
        High: "bg-red-500/10 text-red-500",
    };

    const categoryColors = {
        Learning: "text-purple-400",
        Work: "text-blue-400",
        Personal: "text-pink-400",
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "group flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-card/50 hover:bg-card transition-colors",
                task.status === 'Completed' && "opacity-50"
            )}
        >
            <button
                onClick={handleStatusToggle}
                title={task.status === 'Completed' ? "Mark as pending" : "Mark as completed"}
                className="text-secondary hover:text-accent transition-colors mt-1"
            >
                {task.status === 'Completed' ? (
                    <CheckCircle2 size={24} className="text-accent" />
                ) : (
                    <Circle size={24} />
                )}
            </button>

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                    <h4 className={cn(
                        "font-medium text-primary truncate transition-all text-base",
                        task.status === 'Completed' && "line-through text-secondary"
                    )}>
                        {task.title}
                    </h4>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        <div className={cn("px-2 py-1 rounded text-xs font-medium", priorityColors[task.priority])}>
                            {task.priority}
                        </div>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="p-1 text-secondary/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3 mt-1.5 text-xs text-secondary flex-wrap">
                    <span className={cn("flex items-center gap-1", categoryColors[task.category])}>
                        <Tag size={12} />
                        {task.category}
                    </span>
                    {task.timeEstimate && (
                        <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {task.timeEstimate}m
                        </span>
                    )}
                    <span className="flex items-center gap-1 text-secondary/70">
                        <CalendarDays size={12} />
                        {task.createdAt ? format(new Date(task.createdAt), "MMM d, h:mm a") : 'Just now'}
                    </span>
                </div>

                {/* Subtasks List */}
                {task.subtasks && task.subtasks.length > 0 && (
                    <div className="mt-4 space-y-2">
                        {task.subtasks.map(subtask => (
                            <button
                                key={subtask.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSubtaskToggle(subtask.id);
                                }}
                                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left group/sub"
                            >
                                <div className={cn(
                                    "w-4 h-4 rounded border border-white/20 flex items-center justify-center transition-colors",
                                    subtask.completed ? "bg-accent border-accent" : "group-hover/sub:border-accent"
                                )}>
                                    {subtask.completed && <CheckCircle2 size={12} className="text-primary" />}
                                </div>
                                <span className={cn(
                                    "text-sm transition-all",
                                    subtask.completed ? "text-secondary line-through" : "text-gray-300"
                                )}>
                                    {subtask.title}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};
