import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";
import type { LucideIcon } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: LucideIcon;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, icon: Icon, ...props }, ref) => {
        return (
            <div className="space-y-1.5">
                {label && (
                    <label className="text-sm font-medium text-secondary ml-1">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    {Icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-accent transition-colors">
                            <Icon size={18} />
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={cn(
                            "w-full bg-card border border-white/10 rounded-xl py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-accent transition-all disabled:opacity-50",
                            Icon ? "pl-11 pr-4" : "px-4",
                            error && "border-red-500 focus:border-red-500",
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
            </div>
        );
    }
);
