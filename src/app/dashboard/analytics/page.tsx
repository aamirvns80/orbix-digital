"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/trpc/react";
import { StatsCards } from "@/components/analytics/stats-cards";
import { LeadsTrendChart, PipelineBarChart, ActivityPieChart } from "@/components/analytics/charts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsPage() {
    // Fetch data in parallel
    const statsQuery = api.analytics.getDashboardStats.useQuery();
    const trendQuery = api.analytics.getLeadsOverTime.useQuery();
    const pipelineQuery = api.analytics.getPipelineDistribution.useQuery();
    const activityQuery = api.analytics.getActivityVolume.useQuery();

    const isLoading = statsQuery.isLoading || trendQuery.isLoading;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
                    <p className="text-muted-foreground">Overview of agency performance and lead generation.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <StatsCards
                data={statsQuery.data || { totalLeads: 0, activeClients: 0, openTickets: 0, wonLeads: 0 }}
                isLoading={statsQuery.isLoading}
            />

            {/* Charts Grid */}
            <div className="grid gap-6 md:grid-cols-4">
                {/* Main Trend Chart */}
                {trendQuery.isLoading ? (
                    <Skeleton className="col-span-4 h-[350px] rounded-xl" />
                ) : (
                    <LeadsTrendChart
                        data={trendQuery.data || []}
                        title="Lead Growth (Last 30 Days)"
                    />
                )}

                {/* Pipeline Stats */}
                {pipelineQuery.isLoading ? (
                    <Skeleton className="col-span-4 lg:col-span-2 h-[350px] rounded-xl" />
                ) : (
                    <PipelineBarChart
                        data={pipelineQuery.data || []}
                        title="Pipeline Distribution"
                    />
                )}

                {/* Activity Breakdown */}
                {activityQuery.isLoading ? (
                    <Skeleton className="col-span-4 lg:col-span-2 h-[350px] rounded-xl" />
                ) : (
                    <ActivityPieChart
                        data={activityQuery.data || []}
                        title="Team Activity Volume"
                    />
                )}
            </div>
        </div>
    );
}
