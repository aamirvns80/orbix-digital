"use client";

import * as React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DrawerProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
    title?: string;
    description?: string;
    side?: "left" | "right";
    size?: "sm" | "md" | "lg";
}

const sizeMap = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
};

export function Drawer({
    open,
    onClose,
    children,
    className,
    title,
    description,
    side = "right",
    size = "md",
}: DrawerProps) {
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (open) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [open, onClose]);

    const slideDirection = side === "right" ? { x: "100%" } : { x: "-100%" };

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                        aria-hidden="true"
                    />
                    <motion.div
                        initial={slideDirection}
                        animate={{ x: 0 }}
                        exit={slideDirection}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className={cn(
                            "fixed inset-y-0 z-50 flex flex-col border-border bg-card shadow-xl",
                            side === "right" ? "right-0 border-l" : "left-0 border-r",
                            sizeMap[size],
                            "w-full",
                            className
                        )}
                        role="dialog"
                        aria-modal="true"
                        aria-label={title}
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between p-6 pb-4 border-b border-border">
                            <div>
                                {title && (
                                    <h2 className="text-lg font-semibold text-foreground">
                                        {title}
                                    </h2>
                                )}
                                {description && (
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {description}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
                                aria-label="Close"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">{children}</div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
