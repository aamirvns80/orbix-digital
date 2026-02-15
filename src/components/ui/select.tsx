import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps
    extends React.SelectHTMLAttributes<HTMLSelectElement> {
    error?: string;
    label?: string;
    options: { value: string; label: string }[];
    placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, error, label, id, options, placeholder, ...props }, ref) => {
        const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
        return (
            <div className="space-y-1.5">
                {label && (
                    <label
                        htmlFor={selectId}
                        className="text-sm font-medium text-foreground"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        id={selectId}
                        className={cn(
                            "flex h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 pr-10 text-sm text-foreground transition-all duration-200",
                            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:border-transparent",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            error && "border-destructive focus:ring-destructive",
                            className
                        )}
                        ref={ref}
                        {...props}
                    >
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
                {error && (
                    <p className="text-xs text-destructive">{error}</p>
                )}
            </div>
        );
    }
);
Select.displayName = "Select";

export { Select };
