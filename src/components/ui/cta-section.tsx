import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

interface CTASectionProps {
    headline?: string;
    subtitle?: string;
    primaryLabel?: string;
    primaryHref?: string;
    secondaryLabel?: string;
    secondaryHref?: string;
}

export function CTASection({
    headline = "Ready to Accelerate Your Growth?",
    subtitle = "Book a free strategy call with our team and discover how we can transform your marketing.",
    primaryLabel = "Get Your Free Strategy Call",
    primaryHref = "/contact",
    secondaryLabel = "View Case Studies",
    secondaryHref = "/case-studies",
}: CTASectionProps) {
    return (
        <section className="relative py-24 overflow-hidden">
            {/* Gradient BG */}
            <div className="absolute inset-0 gradient-primary opacity-[0.06]" />
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-500/[0.08] rounded-full blur-3xl" />

            <Container size="lg">
                <div className="relative text-center space-y-6">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                        {headline.split(" ").map((word, i, arr) =>
                            i >= arr.length - 2 ? (
                                <span key={i} className="gradient-text">
                                    {i === arr.length - 2 ? " " : ""}{word}{i < arr.length - 1 ? " " : ""}
                                </span>
                            ) : (
                                <span key={i}>{word} </span>
                            )
                        )}
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        {subtitle}
                    </p>
                    <div className="flex items-center justify-center gap-4 flex-wrap pt-2">
                        <Link href={primaryHref}>
                            <Button size="lg" variant="default">
                                {primaryLabel} <ArrowRight className="h-5 w-5" />
                            </Button>
                        </Link>
                        {secondaryLabel && (
                            <Link href={secondaryHref}>
                                <Button size="lg" variant="outline">
                                    {secondaryLabel}
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </Container>
        </section>
    );
}
