"use client";

import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "next-themes";

export function Toaster() {
    const { theme } = useTheme();

    return (
        <SonnerToaster
            theme={theme as "light" | "dark" | "system"}
            position="bottom-right"
            toastOptions={{
                style: {
                    background: "var(--card)",
                    color: "var(--card-foreground)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                },
            }}
            richColors
            closeButton
        />
    );
}

// Re-export toast function for convenience
export { toast } from "sonner";
