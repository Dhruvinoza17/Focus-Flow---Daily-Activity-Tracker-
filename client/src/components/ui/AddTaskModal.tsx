import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCreateTask } from "../../hooks/useTasks";
import { Button } from "./Button";
import { Input } from "./Input";
import { type SubTask } from "../../hooks/useTasks";
import { useState } from "react";

const schema = z.object({
    title: z.string().min(1, "Title is required"),
    category: z.enum(['Learning', 'Fitness', 'Work', 'Personal']),
    priority: z.enum(['Low', 'Medium', 'High']),
    timeEstimate: z.coerce.number().optional(),
    date: z.string(), // ISO Date String
});

interface FormData {
    title: string;
    category: 'Learning' | 'Fitness' | 'Work' | 'Personal';
    priority: 'Low' | 'Medium' | 'High';
    timeEstimate?: number;
    date: string;
}

interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultDate?: Date;
}

export const AddTaskModal = ({ isOpen, onClose, defaultDate = new Date() }: AddTaskModalProps) => {
    const { mutate: createTask, isPending } = useCreateTask();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema) as any,
        defaultValues: {
            category: 'Learning',
            priority: 'Medium',
            date: defaultDate.toISOString().split('T')[0],
        }
    });

    // Subtask state
    const [subtasks, setSubtasks] = useState<Omit<SubTask, 'id' | 'completed'>[]>([]);
    const [newSubtask, setNewSubtask] = useState("");

    const addSubtask = () => {
        if (!newSubtask.trim()) return;
        setSubtasks([...subtasks, { title: newSubtask.trim() }]);
        setNewSubtask("");
    };

    const removeSubtask = (index: number) => {
        setSubtasks(subtasks.filter((_, i) => i !== index));
    };

    const onSubmit = (data: FormData) => {
        createTask({
            ...data,
            date: data.date,
            timeEstimate: data.timeEstimate, // Already a number from coercion
            subtasks: subtasks.map(st => ({
                id: crypto.randomUUID(),
                title: st.title,
                completed: false
            })),
        }, {
            onSuccess: () => {
                reset();
                setSubtasks([]);
                onClose();
            }
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 m-auto w-full max-w-md h-fit bg-card border border-white/10 rounded-2xl p-6 shadow-2xl z-50"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">New Task</h2>
                            <button onClick={onClose} className="text-secondary hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <Input label="What needs to be done?" {...register("title")} error={errors.title?.message} autoFocus />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-secondary ml-1">Category</label>
                                    <select {...register("category")} className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent">
                                        <option value="Learning">Learning</option>
                                        <option value="Fitness">Fitness</option>
                                        <option value="Work">Work</option>
                                        <option value="Personal">Personal</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs text-secondary ml-1">Priority</label>
                                    <select {...register("priority")} className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent">
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Date" type="date" {...register("date")} error={errors.date?.message} />
                                <Input label="Duration (min)" type="number" {...register("timeEstimate")} />
                            </div>

                            {/* Subtasks Section */}
                            <div className="space-y-3">
                                <label className="text-xs text-secondary ml-1">Subtasks (Optional)</label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add a step..."
                                        value={newSubtask}
                                        onChange={(e) => setNewSubtask(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addSubtask();
                                            }
                                        }}
                                    />
                                    <Button type="button" variant="secondary" onClick={addSubtask} className="px-3">
                                        <Plus size={20} />
                                    </Button>
                                </div>

                                {subtasks.length > 0 && (
                                    <div className="space-y-2 mt-2">
                                        {subtasks.map((task, index) => (
                                            <div key={index} className="flex items-center justify-between bg-card/50 px-3 py-2 rounded-lg border border-white/5">
                                                <span className="text-sm text-white">{task.title}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSubtask(index)}
                                                    className="text-secondary hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                                <Button type="submit" isLoading={isPending}>Create Task</Button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
