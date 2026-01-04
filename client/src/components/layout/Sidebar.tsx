import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, CalendarDays, BarChart2, CheckCircle2, Settings, LogOut } from "lucide-react";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: CheckCircle2, label: "Today", path: "/today" },
    { icon: Calendar, label: "Tomorrow", path: "/tomorrow" },
    { icon: CalendarDays, label: "Upcoming", path: "/upcoming" },
    { icon: BarChart2, label: "Analytics", path: "/analytics" },
    { icon: Settings, label: "Settings", path: "/settings" },
];

export const Sidebar = () => {
    const location = useLocation();

    return (
        <aside className="w-64 h-full bg-card border-r border-white/5 flex flex-col p-4 hidden md:flex">
            <div className="flex items-center gap-2 px-2 mb-8 mt-2">
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-accent animate-pulse" />
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    FocusFlow
                </h1>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link key={item.path} to={item.path}>
                            <div className="relative group">
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute inset-0 bg-accent/10 rounded-xl"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <div
                                    className={cn(
                                        "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200",
                                        isActive ? "text-accent" : "text-secondary hover:text-white"
                                    )}
                                >
                                    <item.icon size={20} />
                                    <span className="font-medium">{item.label}</span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <button className="flex items-center gap-3 px-4 py-3 text-secondary hover:text-white transition-colors mt-auto">
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
            </button>
        </aside>
    );
};
