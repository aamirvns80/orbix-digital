"use client";

import * as React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
    key: string;
    header: string;
    sortable?: boolean;
    className?: string;
    render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    onRowClick?: (item: T) => void;
    emptyMessage?: string;
    className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
    columns,
    data,
    onRowClick,
    emptyMessage = "No data found.",
    className,
}: DataTableProps<T>) {
    const [sortKey, setSortKey] = React.useState<string | null>(null);
    const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc");

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
    };

    const sorted = React.useMemo(() => {
        if (!sortKey) return data;
        return [...data].sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];
            if (aVal == null && bVal == null) return 0;
            if (aVal == null) return 1;
            if (bVal == null) return -1;
            const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
            return sortDir === "asc" ? cmp : -cmp;
        });
    }, [data, sortKey, sortDir]);

    return (
        <div className={cn("overflow-x-auto rounded-lg border border-border", className)}>
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-border bg-muted/50">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className={cn(
                                    "px-4 py-3 text-left font-medium text-muted-foreground",
                                    col.sortable && "cursor-pointer select-none hover:text-foreground",
                                    col.className
                                )}
                                onClick={col.sortable ? () => handleSort(col.key) : undefined}
                            >
                                <span className="inline-flex items-center gap-1">
                                    {col.header}
                                    {col.sortable && sortKey === col.key && (
                                        sortDir === "asc"
                                            ? <ChevronUp className="h-3.5 w-3.5" />
                                            : <ChevronDown className="h-3.5 w-3.5" />
                                    )}
                                </span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sorted.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-4 py-12 text-center text-muted-foreground"
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        sorted.map((item, i) => (
                            <tr
                                key={i}
                                onClick={onRowClick ? () => onRowClick(item) : undefined}
                                className={cn(
                                    "border-b border-border last:border-0 transition-colors",
                                    onRowClick && "cursor-pointer hover:bg-muted/30"
                                )}
                            >
                                {columns.map((col) => (
                                    <td key={col.key} className={cn("px-4 py-3", col.className)}>
                                        {col.render
                                            ? col.render(item)
                                            : (item[col.key] as React.ReactNode) ?? "—"}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
