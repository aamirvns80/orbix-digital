import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex h-screen flex-col items-center justify-center bg-gray-50 text-center">
            <div className="rounded-full bg-gray-100 p-6 mb-6">
                <FileQuestion className="h-12 w-12 text-gray-500" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">404 - Page Not Found</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-md mx-auto">
                Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
                <Link href="/">
                    <Button variant="outline">Go Home</Button>
                </Link>
                <Link href="/dashboard">
                    <Button>Back to Dashboard</Button>
                </Link>
            </div>
        </div>
    );
}
