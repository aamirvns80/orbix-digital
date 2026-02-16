"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Mail } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

const FOOTER_LINKS = {
    Services: [
        { label: "SEO & Content", href: "/services#seo" },
        { label: "Paid Advertising", href: "/services#ppc" },
        { label: "Social Media", href: "/services#social" },
        { label: "Web Development", href: "/services#web" },
        { label: "Email Marketing", href: "/services#email" },
        { label: "Brand Strategy", href: "/services#brand" },
    ],
    "More Services": [
        { label: "Video Production", href: "/services#video" },
        { label: "Analytics & Reporting", href: "/services#analytics" },
        { label: "Influencer Marketing", href: "/services#influencer" },
        { label: "Celebrity Marketing", href: "/services#celebrity" },
        { label: "AI Influencer", href: "/services#ai" },
        { label: "WhatsApp Marketing", href: "/services#whatsapp" },
    ],
    Resources: [
        { label: "Blog", href: "/blog" },
        { label: "Case Studies", href: "/case-studies" },
        { label: "Contact", href: "/contact" },
    ],
    Company: [
        { label: "About", href: "/about" },
        { label: "Sign In", href: "/login" },
        { label: "Get Started", href: "/register" },
    ],
};

export function PublicFooter() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleNewsletter(e: React.FormEvent) {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        try {
            const res = await fetch("/api/leads/capture", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    source: "newsletter",
                    serviceInterest: ["Newsletter"],
                }),
            });
            if (res.ok) {
                toast("Subscribed! You'll hear from us soon.");
                setEmail("");
            } else {
                toast("Something went wrong. Try again.");
            }
        } catch {
            toast("Failed to subscribe.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <footer className="border-t border-border bg-card">
            <Container>
                <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
                    {/* Brand + Newsletter */}
                    <div className="lg:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-lg font-bold tracking-tight">OrbixDigital</span>
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                            The all-in-one platform for marketing businesses. Manage leads, deliver campaigns,
                            and scale your business from a single dashboard.
                        </p>
                        <form onSubmit={handleNewsletter} className="flex gap-2 max-w-sm">
                            <div className="relative flex-1">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full h-10 pl-10 pr-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                            <Button type="submit" size="sm" variant="default" disabled={loading}>
                                {loading ? "..." : <ArrowRight className="h-4 w-4" />}
                            </Button>
                        </form>
                    </div>

                    {/* Link Columns */}
                    {Object.entries(FOOTER_LINKS).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="text-sm font-semibold mb-4">{title}</h4>
                            <ul className="space-y-2.5">
                                {links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-border py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} OrbixDigital. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
