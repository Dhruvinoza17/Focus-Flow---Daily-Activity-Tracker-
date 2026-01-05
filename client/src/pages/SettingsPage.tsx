import { GlassCard } from "../components/ui/GlassCard";
import { useAuthStore } from "../contexts/authStore";
import { Settings, LogOut, Bell, Palette } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useTheme } from "../hooks/useTheme";

export const SettingsPage = () => {
    const { user, logout } = useAuthStore();
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                    <Settings className="text-gray-400" />
                    Settings
                </h1>
                <p className="text-secondary text-sm">Manage your account and preferences</p>
            </div>

            <GlassCard className="p-0 overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent text-2xl font-bold">
                            {user?.displayName?.[0] || 'U'}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-primary">{user?.displayName || 'User'}</h2>
                            <p className="text-secondary text-sm">{user?.email}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-secondary uppercase tracking-wider">Appearance</h3>
                        <div
                            onClick={toggleTheme}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-3 text-primary">
                                <Palette size={20} />
                                <span>Theme</span>
                            </div>
                            <span className="text-sm text-secondary capitalize">{theme} Mode</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-secondary uppercase tracking-wider">Notifications</h3>
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3 text-primary">
                                <Bell size={20} />
                                <span>Push Notifications</span>
                            </div>
                            <span className="text-sm text-accent">Enabled</span>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                        <Button variant="danger" className="w-full justify-center" onClick={logout}>
                            <LogOut size={18} className="mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};
