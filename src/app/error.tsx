"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-screen flex-col items-center justify-center bg-gray-50 text-center px-4">
            <div className="rounded-full bg-red-100 p-6 mb-6">
                <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Something went wrong!
            </h2>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
                We encountered an unexpected error. Our team has been notified.
            </p>
            <div className="mt-8">
                <Button onClick={() => reset()} variant="secondary">
                    Try again
                </Button>
            </div>
        </div>
    );
}
