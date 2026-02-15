"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

/**
 * Wraps page content with a fade-up entrance animation on route change.
 * Uses a key based on pathname to re-trigger the animation.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);
    const prevPath = useRef(pathname);

    useEffect(() => {
        // Reset and re-trigger animation when path changes
        if (prevPath.current !== pathname) {
            setIsVisible(false);
            prevPath.current = pathname;
            // Small delay so the "hidden" state renders before fading in
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsVisible(true);
                });
            });
        } else {
            // Initial load
            setIsVisible(true);
        }
    }, [pathname]);

    return (
        <div
            className="page-transition"
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 400ms ease-out, transform 400ms ease-out",
            }}
        >
            {children}
        </div>
    );
}
