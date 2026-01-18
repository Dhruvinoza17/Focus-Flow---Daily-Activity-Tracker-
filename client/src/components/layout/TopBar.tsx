import { useState, useRef, useEffect } from "react";
import { Bell, CheckCircle2, AlertCircle, Quote } from "lucide-react";
import { useAuthStore } from "../../contexts/authStore";
import { useTasks } from "../../hooks/useTasks";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

const QUOTES = [
    "The secret of getting ahead is getting started.",
    "Focus on being productive instead of busy.",
    "Small steps every day lead to big results.",
    "Don't count the days, make the days count.",
    "Your future is created by what you do today."
];

export const TopBar = () => {
    const { user } = useAuthStore();
    const { data: tasks = [] } = useTasks();
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    // Generate Smart Notifications
    const pendingTasks = tasks.filter(t => t.status !== 'Completed');
    const highPriority = pendingTasks.filter(t => t.priority === 'High').length;
    const completedToday = tasks.filter(t => t.status === 'Completed' && t.date === format(new Date(), 'yyyy-MM-dd')).length;

    // Pick a random quote based on the day
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const quote = QUOTES[dayOfYear % QUOTES.length];

    // Notification Items
    const notifications = [
        {
            id: 'quote',
            title: 'Daily Inspiration',
            desc: quote,
            icon: Quote,
            color: 'text-purple-400',
            bg: 'bg-purple-400/10'
        },
        ...(highPriority > 0 ? [{
            id: 'high-priority',
            title: 'Focus Required',
            desc: `You have ${highPriority} high priority tasks pending.`,
            icon: AlertCircle,
            color: 'text-red-400',
            bg: 'bg-red-400/10'
        }] : []),
        {
            id: 'status',
            title: 'Current Status',
            desc: `${pendingTasks.length} tasks to go. ${completedToday} completed today.`,
            icon: CheckCircle2,
            color: 'text-accent',
            bg: 'bg-accent/10'
        }
    ];

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setIsNotifOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="h-20 w-full flex items-center justify-between px-6 md:px-8 py-4 z-10 bg-background/50 backdrop-blur-md border-b border-primary/5 sticky top-0">
            <div className="flex items-center gap-4 md:hidden">
                <div className="w-8 h-8 bg-card rounded-lg" />
            </div>

            <div className="flex flex-col justify-center">
                <h1 className="text-2xl md:text-3xl font-bold text-primary flex items-center gap-2">
                    Welcome back, <span className="text-accent font-extrabold">{user?.displayName}!</span> <span className="text-2xl">👋</span>
                </h1>
                <p className="text-sm text-secondary/80 font-medium">Here's your productivity summary</p>
            </div>

            <div className="flex items-center gap-6" ref={notifRef}>
                {/* Notification Bell */}
                <div className="relative">
                    <button
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className="p-2 text-secondary hover:text-primary transition-colors relative group outline-none"
                    >
                        <Bell size={20} className={isNotifOpen ? 'text-accent' : ''} />
                        {pendingTasks.length > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-background group-hover:scale-110 transition-transform animate-pulse" />
                        )}
                    </button>

                    <AnimatePresence>
                        {isNotifOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 top-full mt-2 w-80 bg-card/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden z-50"
                            >
                                <div className="p-4 border-b border-white/5 bg-white/5">
                                    <h3 className="font-bold text-primary">Notifications</h3>
                                    <p className="text-xs text-secondary">{format(new Date(), 'EEEE, MMMM do')}</p>
                                </div>
                                <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
                                    {notifications.map((item) => (
                                        <div key={item.id} className="p-4 hover:bg-white/5 transition-colors flex gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${item.bg} ${item.color}`}>
                                                <item.icon size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-primary">{item.title}</h4>
                                                <p className="text-xs text-secondary mt-1 leading-relaxed">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex items-center gap-3 pl-6 border-l border-primary/10 hidden md:flex">
                    <div className="text-right">
                        <p className="text-sm font-medium text-primary">{user?.displayName}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-accent/20 border-2 border-card shadow-lg flex items-center justify-center text-accent font-bold">
                        {user?.displayName?.[0] || 'U'}
                    </div>
                </div>
            </div>
        </header>
    );
};
