import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { cn } from "../../lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export const GlassCard = ({ children, className, hoverEffect = true, ...props }: GlassCardProps) => {
    return (
        <motion.div
            whileHover={hoverEffect ? { y: -4, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)" } : {}}
            className={cn(
                "bg-card text-primary rounded-2xl border border-white/5 backdrop-blur-sm p-6 shadow-lg transition-colors",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};
