"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    Search,
    Filter,
    LayoutGrid,
    List,
    Plus,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Pipeline } from "@/components/ui/pipeline";

const STATUSES = ["new", "qualified", "proposal", "negotiation", "won", "lost"] as const;
const SOURCES = ["website", "organic", "paid", "referral", "direct", "social"] as const;

type LeadItem = {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    company: string | null;
    phone: string | null;
    status: string;
    score: number;
    source: string;
    createdAt: Date | string;
    [key: string]: unknown;
};

function LeadsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [view, setView] = useState<"table" | "pipeline">("table");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | undefined>(
        searchParams.get("status") ?? undefined
    );
    const [page, setPage] = useState(0);
    const limit = 20;

    const { data, isLoading } = trpc.leads.list.useQuery({
        limit,
        offset: page * limit,
        search: search || undefined,
        status: statusFilter as any,
    });

    const columns: Column<LeadItem>[] = [
        {
            key: "name",
            header: "Name",
            render: (item) => (
                <div>
                    <p className="font-medium">
                        {item.firstName || item.lastName
                            ? `${item.firstName ?? ""} ${item.lastName ?? ""}`.trim()
                            : item.email}
                    </p>
                    {(item.firstName || item.lastName) && (
                        <p className="text-xs text-muted-foreground">{item.email}</p>
                    )}
                </div>
            ),
        },
        { key: "company", header: "Company", sortable: true },
        {
            key: "status",
            header: "Status",
            render: (item) => <StatusBadge status={item.status} />,
        },
        {
            key: "score",
            header: "Score",
            sortable: true,
            className: "text-right",
            render: (item) => (
                <span className="font-semibold text-primary">{item.score}</span>
            ),
        },
        { key: "source", header: "Source", sortable: true },
        {
            key: "createdAt",
            header: "Created",
            sortable: true,
            render: (item) =>
                new Date(item.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                }),
        },
    ];

    const totalPages = data ? Math.ceil(data.total / limit) : 0;

    return (
        <Container>
            <div className="space-y-6 py-2">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Leads</h1>
                        <p className="text-sm text-muted-foreground">
                            {data?.total ?? 0} total leads in pipeline
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex rounded-lg border border-border overflow-hidden">
                            <button
                                onClick={() => setView("table")}
                                className={`p-2 transition-colors cursor-pointer ${view === "table"
                                    ? "bg-primary text-white"
                                    : "hover:bg-muted"
                                    }`}
                            >
                                <List className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setView("pipeline")}
                                className={`p-2 transition-colors cursor-pointer ${view === "pipeline"
                                    ? "bg-primary text-white"
                                    : "hover:bg-muted"
                                    }`}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </button>
                        </div>
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm">← Back</Button>
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(0);
                            }}
                            className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <select
                            value={statusFilter ?? ""}
                            onChange={(e) => {
                                setStatusFilter(e.target.value || undefined);
                                setPage(0);
                            }}
                            className="h-9 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            <option value="">All statuses</option>
                            {STATUSES.map((s) => (
                                <option key={s} value={s}>
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
                    </div>
                ) : view === "table" ? (
                    <>
                        <DataTable
                            columns={columns}
                            data={(data?.items as LeadItem[]) ?? []}
                            onRowClick={(item) => router.push(`/dashboard/leads/${item.id}`)}
                            emptyMessage="No leads found. Create a lead or share your contact form."
                        />
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Showing {page * limit + 1}–{Math.min((page + 1) * limit, data?.total ?? 0)} of {data?.total}
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                                        disabled={page === 0}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <span className="text-sm">
                                        Page {page + 1} of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage((p) => p + 1)}
                                        disabled={page >= totalPages - 1}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <Pipeline
                        items={(data?.items as LeadItem[]) ?? []}
                        onItemClick={(item) => router.push(`/dashboard/leads/${item.id}`)}
                    />
                )}
            </div>
        </Container>
    );
}

export default function LeadsPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        }>
            <LeadsContent />
        </Suspense>
    );
}
