import { GlassCard } from "../components/ui/GlassCard";
import { useHabitHeatmap } from "../hooks/useAnalytics";
import { HabitTracker } from "../components/ui/HabitTracker";
import { ProductivityChart } from "../components/ui/ProductivityChart";
import { BarChart2 } from "lucide-react";
import { format, subDays } from "date-fns";

export const AnalyticsPage = () => {
    const { data: heatmapData } = useHabitHeatmap();

    // Calculate Weekly Data (Same as Dashboard, but could be extended)
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
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <BarChart2 className="text-green-400" />
                    Analytics
                </h1>
                <p className="text-secondary text-sm">Insights into your productivity</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <HabitTracker data={heatmapData || []} />
                    <GlassCard className="p-6">
                        <h2 className="text-lg font-bold text-white mb-4">Summary</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5  p-4 rounded-xl">
                                <p className="text-secondary text-xs">Total Days Tracked</p>
                                <p className="text-2xl font-bold text-white">{heatmapData?.length || 0}</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl">
                                <p className="text-secondary text-xs">Total Tasks</p>
                                <p className="text-2xl font-bold text-white">{heatmapData?.reduce((acc, curr) => acc + curr.count, 0) || 0}</p>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                <GlassCard className="min-h-[400px] p-6 flex flex-col">
                    <h2 className="text-lg font-bold text-white mb-4">Weekly Trend</h2>
                    <div className="flex-1">
                        <ProductivityChart data={weeklyData} />
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};
