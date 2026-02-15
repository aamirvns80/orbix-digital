import type { Metadata } from "next";
import { Target, Heart, Lightbulb, Rocket, Award, Users } from "lucide-react";
import Image from "next/image";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { CTASection } from "@/components/ui/cta-section";
import { StatsCounter } from "@/components/ui/stats-counter";
import { Container } from "@/components/ui/container";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const metadata: Metadata = {
    title: "About — OrbixDigital",
    description: "We're on a mission to give every business the tools to compete with the biggest players. Learn about our story, values, and team.",
};

const VALUES = [
    {
        icon: Target,
        title: "Results-Driven",
        description: "Every feature we build is designed to move the needle on your bottom line.",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        icon: Heart,
        title: "Customer-First",
        description: "We obsess over business workflows so you can obsess over your clients.",
        color: "text-pink-500",
        bg: "bg-pink-500/10",
    },
    {
        icon: Lightbulb,
        title: "Innovation",
        description: "We ship fast and iterate weekly based on what businesses actually need.",
        color: "text-amber-500",
        bg: "bg-amber-500/10",
    },
    {
        icon: Rocket,
        title: "Speed",
        description: "Built on cutting-edge tech so your team never waits on the platform.",
        color: "text-violet-500",
        bg: "bg-violet-500/10",
    },
    {
        icon: Award,
        title: "Quality",
        description: "Enterprise-grade infrastructure with a design that feels beautiful and intuitive.",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
    },
    {
        icon: Users,
        title: "Community",
        description: "We grow with our customers through open feedback loops and shared learning.",
        color: "text-cyan-500",
        bg: "bg-cyan-500/10",
    },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            <PublicNav />

            {/* Hero */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="gradient-orb animate-float-slow w-[500px] h-[400px] bg-primary/25 top-[-100px] left-[20%]" />
                    <div className="gradient-orb animate-float-delay w-[300px] h-[300px] bg-violet-500/20 bottom-[-50px] right-[15%]" />
                </div>
                <Container size="md">
                    <div className="text-center space-y-6">
                        <ScrollReveal delay={100}>
                            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                                Built <span className="gradient-text">by Marketers</span>,<br />
                                for Marketers
                            </h1>
                        </ScrollReveal>
                        <ScrollReveal delay={250}>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                                We started OrbixDigital because we lived the pain. Managing leads in spreadsheets,
                                juggling five different tools, and losing deals to disorganization.
                                There had to be a better way — so we built it.
                            </p>
                        </ScrollReveal>
                    </div>
                    <ScrollReveal delay={400} distance="40px">
                        <div className="mt-12 relative h-[400px] w-full rounded-2xl overflow-hidden glow-border shadow-2xl">
                            {/* @ts-ignore */}
                            <Image
                                src="/images/about-team.svg"
                                alt="OrbixDigital Team"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
                        </div>
                    </ScrollReveal>
                </Container>
            </section>

            {/* Mission */}
            <section className="py-16 border-y border-border bg-card">
                <Container size="md">
                    <ScrollReveal>
                        <div className="text-center space-y-4">
                            <p className="text-sm font-semibold text-primary uppercase tracking-wider">
                                Our Mission
                            </p>
                            <blockquote className="text-2xl sm:text-3xl font-bold leading-snug">
                                Give every business the tools to compete with the{" "}
                                <span className="gradient-text">biggest players</span> —
                                without the enterprise price tag.
                            </blockquote>
                        </div>
                    </ScrollReveal>
                </Container>
            </section>

            {/* Stats */}
            <section className="py-16">
                <Container>
                    <StatsCounter
                        stats={[
                            { value: 500, suffix: "+", label: "Businesses Served" },
                            { value: 50000, suffix: "+", label: "Campaigns Managed" },
                            { value: 15, suffix: "M+", prefix: "$", label: "Client Revenue Generated" },
                            { value: 24, suffix: "/7", label: "Platform Uptime" },
                        ]}
                    />
                </Container>
            </section>

            {/* Values */}
            <section className="py-20 bg-muted/30">
                <Container>
                    <ScrollReveal>
                        <div className="text-center mb-12 space-y-4">
                            <h2 className="text-3xl sm:text-4xl font-bold">
                                Our <span className="gradient-text">Values</span>
                            </h2>
                            <p className="text-muted-foreground max-w-xl mx-auto">
                                The principles that guide every decision we make.
                            </p>
                        </div>
                    </ScrollReveal>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {VALUES.map((v, i) => (
                            <ScrollReveal key={v.title} stagger={100} index={i}>
                                <div
                                    className="group rounded-xl border border-border bg-card p-6 card-hover-lift"
                                >
                                    <div className={`h-11 w-11 rounded-lg ${v.bg} flex items-center justify-center mb-4`}>
                                        <v.icon className={`h-5 w-5 ${v.color} icon-bounce`} />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-1">{v.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {v.description}
                                    </p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </Container>
            </section>

            <CTASection
                headline="Join Hundreds of Growing Businesses"
                subtitle="Start your free trial today and see why businesses love OrbixDigital."
            />

            <PublicFooter />
        </div>
    );
}
