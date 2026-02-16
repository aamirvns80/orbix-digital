import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { CTASection } from "@/components/ui/cta-section";
import { Container } from "@/components/ui/container";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const metadata: Metadata = {
    title: "Case Studies — OrbixDigital",
    description: "See how businesses use OrbixDigital to capture leads, close deals, and scale their businesses.",
};

const CASE_STUDIES = [
    {
        slug: "techvista-seo-transformation",
        title: "How TechVista 3x'd Organic Traffic in 6 Months",
        client: "TechVista Solutions, Mumbai",
        industry: "SaaS",
        metric: "3x Organic Traffic",
        excerpt: "TechVista partnered with us to overhaul their SEO strategy, resulting in a 300% increase in organic traffic and 150% more qualified leads.",
        tags: ["SEO", "Content Marketing"],
        gradient: "from-blue-500 to-cyan-400",
        image: "/images/case-studies/growthlab.svg",
    },
    {
        slug: "brandshakti-lead-gen",
        title: "BrandShakti: From 50 to 500 Leads/Month",
        client: "BrandShakti Digital, Bangalore",
        industry: "D2C E-commerce",
        metric: "10x Lead Volume",
        excerpt: "A multi-channel lead generation campaign that combined PPC, social media, and email marketing to supercharge their pipeline.",
        tags: ["PPC", "Social Media", "Email"],
        gradient: "from-violet-500 to-purple-400",
        image: "/images/case-studies/brightwave.svg",
    },
    {
        slug: "pixelcraft-rebrand",
        title: "PixelCraft India: A Complete Brand Transformation",
        client: "PixelCraft India, Ahmedabad",
        industry: "Creative Agency",
        metric: "85% Brand Recall",
        excerpt: "A full rebrand including visual identity, messaging, website redesign, and launch campaign that repositioned them as market leaders.",
        tags: ["Brand Strategy", "Web Design"],
        gradient: "from-amber-500 to-orange-400",
        image: "/images/case-studies/pixel.svg",
    },
    {
        slug: "finedge-enterprise-pipeline",
        title: "FinEdge Capital: Enterprise Pipeline Automation",
        client: "FinEdge Capital, Delhi",
        industry: "Financial Services",
        metric: "₹2Cr Pipeline",
        excerpt: "Built an automated lead scoring and nurturing system that generated ₹2Cr in qualified pipeline within the first quarter.",
        tags: ["Automation", "Analytics"],
        gradient: "from-emerald-500 to-teal-400",
        image: "/images/case-studies/finedge.svg",
    },
    {
        slug: "sunrise-wellness-video",
        title: "Sunrise Wellness: Video-First Social Strategy",
        client: "Sunrise Wellness, Pune",
        industry: "Healthcare",
        metric: "400% Engagement",
        excerpt: "A video production and social media strategy that drove 4x engagement rates and established them as a thought leader in digital health.",
        tags: ["Video", "Social Media"],
        gradient: "from-pink-500 to-rose-400",
        image: "/images/case-studies/sunrise.svg",
    },
    {
        slug: "ecomking-revenue-growth",
        title: "E-Com King: ₹75L Revenue in 90 Days",
        client: "E-Com King, Jaipur",
        industry: "E-commerce",
        metric: "₹75L Revenue",
        excerpt: "A full-funnel campaign combining paid ads, email sequences, and landing page optimization that generated ₹75L in new revenue.",
        tags: ["PPC", "Email", "CRO"],
        gradient: "from-sky-500 to-blue-400",
        image: "/images/case-studies/ecomking.svg",
    },
];

export default function CaseStudiesPage() {
    return (
        <div className="min-h-screen">
            <PublicNav />

            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="gradient-orb animate-float-slow w-[500px] h-[400px] bg-primary/25 top-[-100px] right-[25%]" />
                </div>
                <Container size="lg">
                    <div className="text-center space-y-4">
                        <ScrollReveal delay={100}>
                            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                                Client <span className="gradient-text">Success Stories</span>
                            </h1>
                        </ScrollReveal>
                        <ScrollReveal delay={250}>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Real results from real businesses. See how our partners have transformed
                                their marketing and grown their businesses.
                            </p>
                        </ScrollReveal>
                    </div>
                </Container>
            </section>

            <section className="pb-20">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {CASE_STUDIES.map((cs, i) => (
                            <ScrollReveal key={cs.slug} stagger={100} index={i}>
                                <Link href={`/case-studies/${cs.slug}`}>
                                    <article className="group rounded-xl border border-border bg-card overflow-hidden card-hover-lift h-full flex flex-col">
                                        {/* Gradient Header */}
                                        <div className={`relative h-48 bg-gradient-to-br ${cs.gradient} flex items-end p-5 overflow-hidden`}>
                                            {/* @ts-ignore */}
                                            {cs.image && (
                                                <Image
                                                    // @ts-ignore
                                                    src={cs.image}
                                                    alt={cs.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                            <span className="relative z-10 text-white/90 text-xs font-medium bg-black/20 backdrop-blur-md rounded-full px-3 py-1 border border-white/10">
                                                {cs.industry}
                                            </span>
                                        </div>
                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-xs font-bold text-primary">
                                                    {cs.metric}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                                                {cs.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                                                {cs.excerpt}
                                            </p>
                                            <div className="flex items-center gap-2 mt-4 flex-wrap">
                                                {cs.tags.map((tag) => (
                                                    <span key={tag} className="text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-1 mt-4 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                                                Read Case Study <ArrowRight className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            </ScrollReveal>
                        ))}
                    </div>
                </Container>
            </section>

            <CTASection
                headline="Want Results Like These?"
                subtitle="Let's discuss how we can deliver similar results for your business."
            />

            <PublicFooter />
        </div>
    );
}
