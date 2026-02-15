export default function PublicInvoiceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b py-4">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="font-bold text-xl tracking-tight">OrbixDigital</div>
                    <div className="text-sm text-muted-foreground">Secure Invoice View</div>
                </div>
            </header>
            <main className="flex-1 container mx-auto px-4 py-8">
                {children}
            </main>
            <footer className="py-6 text-center text-sm text-muted-foreground border-t bg-white">
                &copy; {new Date().getFullYear()} OrbixDigital. All rights reserved.
            </footer>
        </div>
    );
}
