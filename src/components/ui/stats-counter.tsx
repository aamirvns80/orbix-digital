"use client";

import { useEffect, useRef, useState } from "react";

interface StatItemProps {
    value: number;
    suffix?: string;
    prefix?: string;
    label: string;
}

function StatItem({ value, suffix = "", prefix = "", label }: StatItemProps) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    const duration = 1500;
                    const start = performance.now();

                    function tick(now: number) {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        // ease-out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setCount(Math.floor(eased * value));
                        if (progress < 1) requestAnimationFrame(tick);
                    }

                    requestAnimationFrame(tick);
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [value]);

    return (
        <div ref={ref} className="text-center space-y-1">
            <p className="text-4xl sm:text-5xl font-extrabold gradient-text tracking-tight">
                {prefix}{count.toLocaleString()}{suffix}
            </p>
            <p className="text-sm text-muted-foreground font-medium">{label}</p>
        </div>
    );
}

interface StatsCounterProps {
    stats: StatItemProps[];
}

export function StatsCounter({ stats }: StatsCounterProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-12">
            {stats.map((stat) => (
                <StatItem key={stat.label} {...stat} />
            ))}
        </div>
    );
}
