import { GlassCard } from "../components/ui/GlassCard";
import { useHabitHeatmap } from "../hooks/useAnalytics";
import { useTasks } from "../hooks/useTasks";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { BarChart2, TrendingUp, CheckCircle2, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";

export const AnalyticsPage = () => {
    const { data: heatmapData } = useHabitHeatmap();
    const { data: allTasks } = useTasks(); // Fetch all tasks

    // --- Statistics Calculations ---

    const totalTasks = allTasks?.length || 0;
    const completedTasks = allTasks?.filter(t => t.status === 'Completed').length || 0;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // 1. Category Distribution (Pie Chart)
    const categoryDataRaw = allTasks?.reduce((acc: any, task) => {
        acc[task.category] = (acc[task.category] || 0) + 1;
        return acc;
    }, {});

    const categoryData = Object.keys(categoryDataRaw || {}).map(key => ({
        name: key,
        value: categoryDataRaw[key]
    }));

    const COLORS = ['#14B8A6', '#A855F7', '#3B82F6', '#EC4899', '#F59E0B'];

    // 2. Priority Breakdown (Bar Chart - Completed vs Pending)
    const priorityDataRaw = allTasks?.reduce((acc: any, task) => {
        if (!acc[task.priority]) acc[task.priority] = { name: task.priority, Completed: 0, Pending: 0 };
        const statusKey = task.status === 'Completed' ? 'Completed' : 'Pending';
        acc[task.priority][statusKey]++;
        return acc;
    }, {});

    const priorityData = ['High', 'Medium', 'Low'].map(p => priorityDataRaw?.[p] || { name: p, Completed: 0, Pending: 0 });


    // 3. Most Productive Day
    const dayCounts = heatmapData?.reduce((acc: any, entry) => {
        const dayName = format(new Date(entry.date), 'EEEE');
        acc[dayName] = (acc[dayName] || 0) + entry.count;
        return acc;
    }, {});

    let mostProductiveDay = 'N/A';
    let maxCount = 0;
    Object.entries(dayCounts || {}).forEach(([day, count]: [string, any]) => {
        if (count > maxCount) {
            maxCount = count;
            mostProductiveDay = day;
        }
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                    <BarChart2 className="text-accent" />
                    Deep Analytics
                </h1>
                <p className="text-secondary text-sm">Understand your productivity patterns</p>
            </div>

            {/* Top Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <GlassCard className="p-4 flex flex-col items-center justify-center text-center">
                    <CheckCircle2 className="text-green-400 mb-2" size={24} />
                    <span className="text-3xl font-bold text-primary">{completionRate}%</span>
                    <span className="text-xs text-secondary">Completion Rate</span>
                </GlassCard>
                <GlassCard className="p-4 flex flex-col items-center justify-center text-center">
                    <TrendingUp className="text-blue-400 mb-2" size={24} />
                    <span className="text-3xl font-bold text-primary">{completedTasks}</span>
                    <span className="text-xs text-secondary">Tasks Done</span>
                </GlassCard>
                <GlassCard className="p-4 flex flex-col items-center justify-center text-center">
                    <Calendar className="text-purple-400 mb-2" size={24} />
                    <span className="text-xl font-bold text-primary truncate max-w-full px-2">{mostProductiveDay}</span>
                    <span className="text-xs text-secondary">Best Day</span>
                </GlassCard>
                <GlassCard className="p-4 flex flex-col items-center justify-center text-center">
                    <Clock className="text-yellow-400 mb-2" size={24} />
                    <span className="text-3xl font-bold text-primary">{totalTasks}</span>
                    <span className="text-xs text-secondary">Total Created</span>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Distribution */}
                <GlassCard className="min-h-[350px] p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-primary mb-4">Focus Distribution</h3>
                    <div className="flex-1 w-full h-[250px]">
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((_entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                                        itemStyle={{ color: '#F3F4F6' }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-secondary">No data available</div>
                        )}
                    </div>
                </GlassCard>

                {/* Priority Breakdown */}
                <GlassCard className="min-h-[350px] p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-primary mb-4">Task Completion by Priority</h3>
                    <div className="flex-1 w-full h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={priorityData}>
                                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                                />
                                <Legend />
                                <Bar dataKey="Completed" fill="#14B8A6" radius={[4, 4, 0, 0]} stackId="a" />
                                <Bar dataKey="Pending" fill="#374151" radius={[4, 4, 0, 0]} stackId="a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};
