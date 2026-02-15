
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";

export const metadata: Metadata = {
    title: "Privacy Policy — OrbixDigital",
    description: "Our commitment to protecting your privacy and personal data.",
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background">
            <PublicNav />
            <main className="py-20">
                <Container size="md">
                    <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                    <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
                        <p className="lead text-xl text-muted-foreground">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>

                        <section>
                            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
                            <p>
                                Welcome to OrbixDigital. We respect your privacy and are committed to protecting your personal data.
                                This privacy policy will inform you as to how we look after your personal data when you visit our website
                                (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-8 mb-4">2. The Data We Collect</h2>
                            <p>
                                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li><strong>Identity Data</strong>: includes first name, last name, username or similar identifier.</li>
                                <li><strong>Contact Data</strong>: includes billing address, delivery address, email address and telephone numbers.</li>
                                <li><strong>Technical Data</strong>: includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                                <li><strong>Usage Data</strong>: includes information about how you use our website, products and services.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Data</h2>
                            <p>
                                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                                <li>Where we need to comply with a legal obligation.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Security</h2>
                            <p>
                                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Contact Us</h2>
                            <p>
                                If you have any questions about this privacy policy or our privacy practices, please contact us at:
                            </p>
                            <div className="mt-4 p-4 bg-muted rounded-lg">
                                <p>Email: privacy@OrbixDigital.com</p>
                                <p>Address: 123 Marketing Street, Creative City, ST 12345</p>
                            </div>
                        </section>
                    </div>
                </Container>
            </main>
            <PublicFooter />
        </div>
    );
}
