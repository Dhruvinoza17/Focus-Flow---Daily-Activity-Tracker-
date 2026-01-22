import { useState } from "react";
import { format, addDays } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar as CalendarIcon } from "lucide-react";
import { useUpdateTask } from "../../hooks/useTasks";
import type { Task } from "../../hooks/useTasks";
import { Button } from "./Button";
import { GlassCard } from "./GlassCard";

interface RescheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task;
}

export const RescheduleModal = ({ isOpen, onClose, task }: RescheduleModalProps) => {
    const { mutate: updateTask, isPending } = useUpdateTask();
    const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

    const handleReschedule = () => {
        updateTask({
            id: task.id,
            date: selectedDate
        }, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    const quickOptions = [
        { label: "Today", value: format(new Date(), 'yyyy-MM-dd') },
        { label: "Tomorrow", value: format(addDays(new Date(), 1), 'yyyy-MM-dd') },
        { label: "Next Week", value: format(addDays(new Date(), 7), 'yyyy-MM-dd') },
    ];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-md"
                >
                    <GlassCard className="p-6 relative overflow-hidden">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-secondary hover:text-primary transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-xl font-bold text-primary mb-1">Reschedule Task</h2>
                        <p className="text-secondary text-sm mb-6 line-clamp-1">"{task.title}"</p>

                        <div className="space-y-6">
                            {/* Quick Options */}
                            <div className="grid grid-cols-3 gap-2">
                                {quickOptions.map((opt) => (
                                    <button
                                        key={opt.label}
                                        onClick={() => setSelectedDate(opt.value)}
                                        className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${selectedDate === opt.value
                                            ? "bg-accent text-white border-accent"
                                            : "bg-card border-white/10 text-secondary hover:bg-white/5"
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>

                            {/* Custom Date Picker */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                                    Or pick a date
                                </label>
                                <div className="relative">
                                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-10 py-3 text-primary focus:outline-none focus:border-accent/50 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1"
                                    onClick={handleReschedule}
                                    isLoading={isPending}
                                >
                                    Confirm
                                </Button>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
