"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./badge";

const STAGES = [
    { key: "new", label: "New", color: "bg-blue-500" },
    { key: "qualified", label: "Qualified", color: "bg-indigo-500" },
    { key: "proposal", label: "Proposal", color: "bg-amber-500" },
    { key: "negotiation", label: "Negotiation", color: "bg-orange-500" },
    { key: "won", label: "Won", color: "bg-emerald-500" },
    { key: "lost", label: "Lost", color: "bg-red-500" },
] as const;

interface PipelineItem {
    id: string;
    status: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    company?: string | null;
    score: number;
    createdAt: Date | string;
}

interface PipelineProps {
    items: PipelineItem[];
    onItemClick?: (item: PipelineItem) => void;
    className?: string;
}

export function Pipeline({ items, onItemClick, className }: PipelineProps) {
    const grouped = React.useMemo(() => {
        const map: Record<string, PipelineItem[]> = {};
        for (const stage of STAGES) {
            map[stage.key] = [];
        }
        for (const item of items) {
            if (map[item.status]) {
                map[item.status].push(item);
            }
        }
        return map;
    }, [items]);

    return (
        <div className={cn("flex gap-4 overflow-x-auto pb-4", className)}>
            {STAGES.map((stage) => (
                <div
                    key={stage.key}
                    className="flex-shrink-0 w-[280px] flex flex-col"
                >
                    {/* Column header */}
                    <div className="flex items-center gap-2 mb-3 px-1">
                        <div className={cn("h-2.5 w-2.5 rounded-full", stage.color)} />
                        <span className="text-sm font-semibold text-foreground">
                            {stage.label}
                        </span>
                        <span className="ml-auto text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                            {grouped[stage.key].length}
                        </span>
                    </div>

                    {/* Cards */}
                    <div className="flex-1 space-y-2 rounded-lg bg-muted/30 p-2 min-h-[200px]">
                        {grouped[stage.key].length === 0 ? (
                            <div className="flex items-center justify-center h-24 text-xs text-muted-foreground">
                                No leads
                            </div>
                        ) : (
                            grouped[stage.key].map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => onItemClick?.(item)}
                                    className={cn(
                                        "rounded-lg border border-border bg-card p-3 shadow-sm transition-all duration-200",
                                        "hover:shadow-md hover:border-primary/30",
                                        onItemClick && "cursor-pointer"
                                    )}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="font-medium text-sm truncate">
                                                {item.firstName || item.lastName
                                                    ? `${item.firstName ?? ""} ${item.lastName ?? ""}`.trim()
                                                    : item.email}
                                            </p>
                                            {(item.firstName || item.lastName) && (
                                                <p className="text-xs text-muted-foreground truncate mt-0.5">
                                                    {item.email}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex-shrink-0 text-xs font-semibold text-primary">
                                            {item.score}
                                        </div>
                                    </div>
                                    {item.company && (
                                        <p className="text-xs text-muted-foreground mt-1.5 truncate">
                                            🏢 {item.company}
                                        </p>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

// Progress bar for a single lead's position in the pipeline
export function PipelineProgress({ status }: { status: string }) {
    const currentIndex = STAGES.findIndex((s) => s.key === status);

    return (
        <div className="flex items-center gap-1">
            {STAGES.filter((s) => s.key !== "lost").map((stage, i) => (
                <div key={stage.key} className="flex items-center gap-1">
                    <div
                        className={cn(
                            "h-2 w-8 rounded-full transition-colors",
                            i <= currentIndex && status !== "lost"
                                ? stage.color
                                : "bg-muted"
                        )}
                    />
                </div>
            ))}
        </div>
    );
}
