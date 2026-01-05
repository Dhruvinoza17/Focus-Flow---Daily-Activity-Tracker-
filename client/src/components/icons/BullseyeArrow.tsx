import { cn } from "../../lib/utils";

export const BullseyeArrow = ({ className, size = 24 }: { className?: string; size?: number }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("lucide lucide-bullseye-arrow", className)}
        >
            <path d="M22 12A10 10 0 1 1 12 2a10 10 0 0 1 5 1.35" />
            <path d="M22 2l-7.5 7.5" />
            <path d="M18.5 2h3.5v3.5" />
            <path d="M12 8a4 4 0 1 1-4 4" />
            <circle cx="12" cy="12" r="1.5" stroke="none" fill="currentColor" />
        </svg>
    );
};
