"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    origin?: "bottom" | "left" | "right" | "top";
    distance?: string;
    once?: boolean;
    threshold?: number;
    stagger?: number;
    index?: number;
}

export function ScrollReveal({
    children,
    className = "",
    delay = 0,
    duration = 600,
    origin = "bottom",
    distance = "30px",
    once = true,
    threshold = 0.15,
    stagger = 0,
    index = 0,
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    const totalDelay = delay + stagger * index;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once) observer.disconnect();
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            { threshold }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [once, threshold]);

    const translateMap = {
        bottom: `translateY(${distance})`,
        top: `translateY(-${distance})`,
        left: `translateX(-${distance})`,
        right: `translateX(${distance})`,
    };

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translate(0)" : translateMap[origin],
                transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${totalDelay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${totalDelay}ms`,
                willChange: "opacity, transform",
            }}
        >
            {children}
        </div>
    );
}

/* Grid wrapper that automatically staggers children's reveal animations */
interface ScrollRevealGridProps {
    children: ReactNode;
    className?: string;
    stagger?: number;
    origin?: "bottom" | "left" | "right" | "top";
}

export function ScrollRevealGrid({
    children,
    className = "",
    stagger = 80,
    origin = "bottom",
}: ScrollRevealGridProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const translateMap = {
        bottom: "translateY(30px)",
        top: "translateY(-30px)",
        left: "translateX(-30px)",
        right: "translateX(30px)",
    };

    return (
        <div ref={ref} className={className}>
            {Array.isArray(children)
                ? children.map((child, i) => (
                    <div
                        key={i}
                        style={{
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible
                                ? "translate(0)"
                                : translateMap[origin],
                            transition: `opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) ${i * stagger}ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) ${i * stagger}ms`,
                            willChange: "opacity, transform",
                        }}
                    >
                        {child}
                    </div>
                ))
                : children}
        </div>
    );
}
