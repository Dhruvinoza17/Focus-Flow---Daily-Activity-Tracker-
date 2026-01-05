import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { GlassCard } from './GlassCard';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ProductivityChartProps {
    data: { name: string; completion: number }[];
}

export const ProductivityChart = ({ data }: ProductivityChartProps) => {
    // Calculate trend based on last two data points
    const lastPoint = data[data.length - 1].completion;
    const prevPoint = data[data.length - 2].completion;
    const isTrendingUp = lastPoint >= prevPoint;

    return (
        <GlassCard className="h-full min-h-[300px] flex flex-col p-6">
            <h3 className="text-secondary text-sm font-medium mb-4 flex items-center gap-2">
                {isTrendingUp ? (
                    <TrendingUp size={16} className="text-green-400" />
                ) : (
                    <TrendingDown size={16} className="text-red-400" />
                )}
                Weekly Productivity
            </h3>
            <div className="flex-1 w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                        <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#151821', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="completion" stroke="#14B8A6" fillOpacity={1} fill="url(#colorPv)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
};
