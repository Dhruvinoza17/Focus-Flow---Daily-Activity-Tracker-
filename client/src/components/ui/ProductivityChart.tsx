import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { GlassCard } from './GlassCard';

const data = [
    { name: 'Mon', completion: 40 },
    { name: 'Tue', completion: 60 },
    { name: 'Wed', completion: 75 },
    { name: 'Thu', completion: 50 },
    { name: 'Fri', completion: 85 },
    { name: 'Sat', completion: 90 },
    { name: 'Sun', completion: 70 },
];

export const ProductivityChart = () => {
    return (
        <GlassCard className="h-full min-h-[300px] flex flex-col p-6">
            <h3 className="text-secondary text-sm font-medium mb-4">Weekly Productivity</h3>
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
