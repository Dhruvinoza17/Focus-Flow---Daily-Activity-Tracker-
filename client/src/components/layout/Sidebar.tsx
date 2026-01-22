import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, History, BarChart2, Settings, LogOut, ArchiveRestore } from "lucide-react";
import { BullseyeArrow } from "../icons/BullseyeArrow";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";
import { useAuthStore } from "../../contexts/authStore";

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Calendar, label: "Tomorrow", path: "/tomorrow" },
    { icon: History, label: "History", path: "/history" },
    { icon: ArchiveRestore, label: "Backlog", path: "/backlog" },
    { icon: BarChart2, label: "Analytics", path: "/analytics" },
    { icon: Settings, label: "Settings", path: "/settings" },
];

export const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuthStore();

    return (
        <aside className="w-64 h-full bg-card border-r border-white/5 flex flex-col p-4 hidden md:flex">
            <div className="flex items-center gap-3 px-2 mb-8 mt-2">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20 shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                    <BullseyeArrow size={28} className="text-accent animate-pulse" />
                </div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight">
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
                                        isActive ? "text-accent" : "text-secondary hover:text-primary"
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

            <button
                onClick={logout}
                className="flex items-center gap-3 px-4 py-3 text-secondary hover:text-primary transition-colors mt-auto w-full text-left"
            >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
            </button>
        </aside>
    );
};
