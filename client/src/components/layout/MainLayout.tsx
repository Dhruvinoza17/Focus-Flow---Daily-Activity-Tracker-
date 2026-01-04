import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export const MainLayout = () => {
    return (
        <div className="flex h-screen w-full bg-background text-primary overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 h-full relative">
                <TopBar />
                <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
