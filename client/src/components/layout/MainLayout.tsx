import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { AddTaskModal } from "../ui/AddTaskModal";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const MainLayout = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex h-screen w-full bg-background text-primary overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 h-full relative">
                <TopBar />
                <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth relative">
                    <Outlet />

                    {/* Global Floating Action Button */}
                    <AnimatePresence>
                        <motion.button
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{
                                scale: 1,
                                rotate: 0,
                                boxShadow: "0 0 0 0 rgba(20, 184, 166, 0.7)"
                            }}
                            whileHover={{
                                scale: 1.1,
                                rotate: 90,
                                transition: { duration: 0.2 }
                            }}
                            whileTap={{ scale: 0.9 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20
                            }}
                            onClick={() => setIsModalOpen(true)}
                            className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-tr from-accent to-teal-400 text-white rounded-full shadow-lg shadow-accent/30 flex items-center justify-center z-50 group overflow-hidden"
                        >
                            {/* Pulse Effect Rings */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.5, 2],
                                    opacity: [0.5, 0.2, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeOut"
                                }}
                                className="absolute inset-0 rounded-full bg-white/30"
                            />

                            <Plus size={32} className="relative z-10 drop-shadow-md" />
                        </motion.button>
                    </AnimatePresence>

                    <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                </main>
            </div>
        </div>
    );
};
