import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { cn } from "../../lib/utils";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
    variant?: "primary" | "secondary" | "outline" | "danger";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
}

export const Button = ({
    children,
    className,
    variant = "primary",
    size = "md",
    isLoading,
    ...props
}: ButtonProps) => {
    const baseStyles = "relative inline-flex items-center justify-center rounded-xl font-medium transition-all disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/20",
        secondary: "bg-card text-white hover:bg-white/5 border border-white/5",
        outline: "bg-transparent border border-white/20 text-white hover:border-white/40",
        danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2.5 text-sm",
        lg: "px-6 py-3 text-base",
    };

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
            ) : children}
        </motion.button>
    );
};
