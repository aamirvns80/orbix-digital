import { PortalSidebar } from "@/components/portal-sidebar";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    // Optional: Check if user is really authorized for portal (e.g. role === client)
    // Though middleware handles most of this.

    return (
        <div className="min-h-screen bg-background">
            <div className="hidden md:block">
                <PortalSidebar />
            </div>

            <main className="md:pl-72 lg:pl-80 min-h-screen">
                <div className="container mx-auto p-4 md:p-8 pt-6 max-w-7xl">
                    {children}
                </div>
            </main>
        </div>
    );
}
