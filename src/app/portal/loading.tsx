export default function PortalLoading() {
    return (
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="h-10 w-10 rounded-lg gradient-primary animate-pulse" />
                    <div className="absolute inset-0 h-10 w-10 rounded-lg gradient-primary animate-ping opacity-20" />
                </div>
                <p className="text-sm text-muted-foreground animate-pulse">Loading portal...</p>
            </div>
        </div>
    );
}
