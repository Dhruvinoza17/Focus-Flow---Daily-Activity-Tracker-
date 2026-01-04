import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, Tag } from "lucide-react";
import { type Task, useUpdateTask } from "../../hooks/useTasks";
import { cn } from "../../lib/utils";

interface TaskCardProps {
    task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
    const { mutate: updateTask } = useUpdateTask();

    const handleStatusToggle = () => {
        const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
        updateTask({ id: task.id, status: newStatus });
    };

    const priorityColors = {
        Low: "bg-blue-500/10 text-blue-500",
        Medium: "bg-yellow-500/10 text-yellow-500",
        High: "bg-red-500/10 text-red-500",
    };

    const categoryColors = {
        Learning: "text-purple-400",
        Fitness: "text-green-400",
        Work: "text-blue-400",
        Personal: "text-pink-400",
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "group flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-card/50 hover:bg-card transition-colors",
                task.status === 'Completed' && "opacity-50"
            )}
        >
            <button
                onClick={handleStatusToggle}
                title={task.status === 'Completed' ? "Mark as pending" : "Mark as completed"}
                className="text-secondary hover:text-accent transition-colors"
            >
                {task.status === 'Completed' ? (
                    <CheckCircle2 size={24} className="text-accent" />
                ) : (
                    <Circle size={24} />
                )}
            </button>

            <div className="flex-1 min-w-0">
                <h4 className={cn(
                    "font-medium text-white truncate transition-all",
                    task.status === 'Completed' && "line-through text-secondary"
                )}>
                    {task.title}
                </h4>
                <div className="flex items-center gap-3 mt-1 text-xs text-secondary">
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
                </div>
            </div>

            <div className={cn("px-2 py-1 rounded text-xs font-medium", priorityColors[task.priority])}>
                {task.priority}
            </div>
        </motion.div>
    );
};
