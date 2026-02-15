"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_LINKS = [
    { label: "Services", href: "/services" },
    { label: "Pricing", href: "/pricing" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
];

export function PublicNav() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border glass-strong">
            <Container>
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">OrbixDigital</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map((link) => {
                            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                                        ? "text-primary bg-primary/[0.08]"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <ThemeToggle />
                        <Link href="/login">
                            <Button variant="default" size="sm">Sign in</Button>
                        </Link>
                        <Link href="/contact">
                            <Button size="sm" variant="default">
                                Get Started <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="flex md:hidden items-center gap-2">
                        <ThemeToggle />
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </Container>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-border bg-background animate-fade-down">
                    <Container>
                        <nav className="py-4 space-y-1">
                            {NAV_LINKS.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive
                                            ? "text-primary bg-primary/[0.08]"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                            <div className="pt-3 flex flex-col gap-2 border-t border-border mt-3">
                                <Link href="/login" onClick={() => setMobileOpen(false)}>
                                    <Button variant="outline" size="sm" className="w-full">Sign in</Button>
                                </Link>
                                <Link href="/contact" onClick={() => setMobileOpen(false)}>
                                    <Button variant="default" size="sm" className="w-full">
                                        Get Started <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </nav>
                    </Container>
                </div>
            )}
        </header>
    );
}
