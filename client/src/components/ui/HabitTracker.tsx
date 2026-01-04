import { cn } from "../../lib/utils";
import { subDays, format, isSameDay } from "date-fns";
import { GlassCard } from "./GlassCard";

interface HabitTrackerProps {
    data: { date: string; count: number }[];
}

export const HabitTracker = ({ data }: HabitTrackerProps) => {
    const today = new Date();
    const days = Array.from({ length: 365 }).map((_, i) => {
        return subDays(today, 364 - i);
    });

    return (
        <GlassCard className="p-6">
            <h3 className="text-secondary text-sm font-medium mb-4">Consistency Heatmap</h3>
            <div className="flex flex-wrap gap-1">
                {days.map((day, i) => {
                    const activity = data.find(d => isSameDay(new Date(d.date), day));
                    const count = activity?.count || 0;

                    let colorClass = "bg-white/5";
                    if (count > 0) colorClass = "bg-accent/20";
                    if (count > 2) colorClass = "bg-accent/40";
                    if (count > 4) colorClass = "bg-accent/60";
                    if (count > 6) colorClass = "bg-accent/80";
                    if (count > 8) colorClass = "bg-accent";

                    return (
                        <div
                            key={i}
                            title={`${format(day, 'MMM d, yyyy')}: ${count} tasks`}
                            className={cn("w-3 h-3 rounded-sm transition-colors hover:border hover:border-white/50", colorClass)}
                        />
                    );
                })}
            </div>
        </GlassCard>
    );
};
