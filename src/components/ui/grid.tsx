import * as React from "react";
import { cn } from "@/lib/utils";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
    cols?: 1 | 2 | 3 | 4 | 5 | 6;
    gap?: "sm" | "md" | "lg";
}

const colsMap = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
    6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
};

const gapMap = {
    sm: "gap-3",
    md: "gap-5",
    lg: "gap-8",
};

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
    ({ className, cols = 3, gap = "md", ...props }, ref) => (
        <div
            ref={ref}
            className={cn("grid", colsMap[cols], gapMap[gap], className)}
            {...props}
        />
    )
);
Grid.displayName = "Grid";

export { Grid };
