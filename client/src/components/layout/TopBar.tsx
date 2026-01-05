import { Bell } from "lucide-react";
import { useAuthStore } from "../../contexts/authStore";

export const TopBar = () => {
    const { user } = useAuthStore();

    return (
        <header className="h-20 w-full flex items-center justify-between px-6 md:px-8 py-4 z-10 bg-background/50 backdrop-blur-md border-b border-primary/5 sticky top-0">
            <div className="flex items-center gap-4 md:hidden">
                {/* Mobile Menu Trigger Placeholder */}
                <div className="w-8 h-8 bg-card rounded-lg" />
            </div>

            <div className="flex flex-col justify-center">
                <h1 className="text-2xl md:text-3xl font-bold text-primary flex items-center gap-2">
                    Welcome back, <span className="text-accent font-extrabold">{user?.displayName}!</span> <span className="text-2xl">👋</span>
                </h1>
                <p className="text-sm text-secondary/80 font-medium">Here's your productivity summary</p>
            </div>

            <div className="flex items-center gap-6">
                <button className="p-2 text-secondary hover:text-primary transition-colors relative group">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-background group-hover:scale-110 transition-transform" />
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-primary/10 hidden md:flex">
                    <div className="text-right">
                        <p className="text-sm font-medium text-primary">{user?.displayName}</p>
                        <p className="text-xs text-secondary">Pro Plan</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-purple-500 border-2 border-card shadow-lg" />
                </div>
            </div>
        </header>
    );
};
