import { Bell } from "lucide-react";

export const TopBar = () => {
    return (
        <header className="h-16 w-full flex items-center justify-between px-6 md:px-8 py-4 z-10">
            <div className="flex items-center gap-4 md:hidden">
                {/* Mobile Menu Trigger Placeholder */}
                <div className="w-8 h-8 bg-card rounded-lg" />
            </div>

            <div className="flex-1 md:flex-none" />

            <div className="flex items-center gap-4">
                <button className="p-2 text-secondary hover:text-white transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-white">Guest User</p>
                        <p className="text-xs text-secondary">Free Plan</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-purple-500 border-2 border-card" />
                </div>
            </div>
        </header>
    );
};
