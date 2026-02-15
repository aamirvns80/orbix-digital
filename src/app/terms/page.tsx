
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";

export const metadata: Metadata = {
    title: "Terms of Service — OrbixDigital",
    description: "Terms and conditions for using OrbixDigital services.",
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background">
            <PublicNav />
            <main className="py-20">
                <Container size="md">
                    <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
                    <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
                        <p className="lead text-xl text-muted-foreground">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>

                        <section>
                            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Agreement to Terms</h2>
                            <p>
                                By accessing our website and using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                                If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Use License</h2>
                            <p>
                                Permission is granted to temporarily download one copy of the materials (information or software) on OrbixDigital's website for personal,
                                non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li>Modify or copy the materials;</li>
                                <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                                <li>Attempt to decompile or reverse engineer any software contained on OrbixDigital's website;</li>
                                <li>Remove any copyright or other proprietary notations from the materials; or</li>
                                <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Disclaimer</h2>
                            <p>
                                The materials on OrbixDigital's website are provided on an 'as is' basis. OrbixDigital makes no warranties, expressed or implied,
                                and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability,
                                fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Limitations</h2>
                            <p>
                                In no event shall OrbixDigital or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit,
                                or due to business interruption) arising out of the use or inability to use the materials on OrbixDigital's website, even if OrbixDigital or an authorized
                                representative has been notified orally or in writing of the possibility of such damage.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Governing Law</h2>
                            <p>
                                These terms and conditions are governed by and construed in accordance with the laws of the State and you irrevocably submit to the exclusive
                                jurisdiction of the courts in that State or location.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contact Information</h2>
                            <p>
                                Questions about the Terms of Service should be sent to us at:
                            </p>
                            <div className="mt-4 p-4 bg-muted rounded-lg">
                                <p>Email: legal@OrbixDigital.com</p>
                            </div>
                        </section>
                    </div>
                </Container>
            </main>
            <PublicFooter />
        </div>
    );
}
