import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, TrendingUp, Building2, Tag, Target } from "lucide-react";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { CTASection } from "@/components/ui/cta-section";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const CASE_STUDIES = [
    {
        slug: "growthlab-seo-transformation",
        title: "How GrowthLab 3x'd Organic Traffic in 6 Months",
        client: "GrowthLab Digital",
        industry: "SaaS",
        metric: "3x Organic Traffic",
        excerpt: "GrowthLab partnered with us to overhaul their SEO strategy, resulting in a 300% increase in organic traffic and 150% more qualified leads.",
        tags: ["SEO", "Content Marketing"],
        gradient: "from-blue-500 to-cyan-400",
        image: "/images/case-studies/growthlab.svg",
        stats: [
            { label: "Organic Traffic", value: "3x", description: "increase in 6 months" },
            { label: "Qualified Leads", value: "150%", description: "more MQLs per month" },
            { label: "Domain Authority", value: "+28", description: "points gained" },
            { label: "Ranking Keywords", value: "2,400+", description: "in top 10 positions" },
        ],
        content: [
            { type: "heading", text: "The Challenge" },
            { type: "paragraph", text: "GrowthLab Digital was struggling to gain organic visibility in a crowded SaaS market. Their content strategy was unfocused, and technical SEO issues were holding back their rankings despite having a strong product." },
            { type: "heading", text: "Our Approach" },
            { type: "paragraph", text: "We started with a comprehensive technical SEO audit, identifying over 200 issues affecting crawlability and indexation. Simultaneously, we developed a topical authority strategy focused on their core value propositions." },
            { type: "list", items: ["Complete technical SEO overhaul including site speed optimization", "Topical cluster strategy with 12 pillar content pieces", "Strategic link building targeting high-authority publications", "Weekly content calendar aligned with buyer journey stages", "Custom analytics dashboard for real-time performance tracking"] },
            { type: "heading", text: "The Results" },
            { type: "paragraph", text: "Within 6 months, GrowthLab saw their organic traffic triple. More importantly, the quality of that traffic improved dramatically — qualified leads increased by 150%, and their sales team reported much warmer inbound conversations." },
            { type: "paragraph", text: "The foundation we built continues to compound. GrowthLab now ranks in the top 3 for their most valuable commercial keywords, driving a sustainable pipeline of high-intent prospects." },
        ],
    },
    {
        slug: "brightwave-lead-gen",
        title: "Brightwave Media: From 50 to 500 Leads/Month",
        client: "Brightwave Media",
        industry: "E-commerce",
        metric: "10x Lead Volume",
        excerpt: "A multi-channel lead generation campaign that combined PPC, social media, and email marketing to supercharge their pipeline.",
        tags: ["PPC", "Social Media", "Email"],
        gradient: "from-violet-500 to-purple-400",
        image: "/images/case-studies/brightwave.svg",
        stats: [
            { label: "Lead Volume", value: "10x", description: "increase in 4 months" },
            { label: "Cost Per Lead", value: "-62%", description: "reduction in CPL" },
            { label: "Conversion Rate", value: "8.4%", description: "landing page CVR" },
            { label: "Revenue", value: "$840K", description: "attributed to campaign" },
        ],
        content: [
            { type: "heading", text: "The Challenge" },
            { type: "paragraph", text: "Brightwave Media was generating only 50 leads per month through outdated marketing tactics. They needed a modern, multi-channel approach to fuel their ambitious growth targets." },
            { type: "heading", text: "Our Approach" },
            { type: "paragraph", text: "We designed an integrated campaign spanning Google Ads, Meta advertising, LinkedIn outreach, and automated email sequences, all feeding into a unified lead scoring system." },
            { type: "list", items: ["Multi-platform ad campaigns with unified tracking", "Custom landing pages optimized for conversion", "Automated email nurture sequences", "Real-time lead scoring and routing", "Weekly optimization based on performance data"] },
            { type: "heading", text: "The Results" },
            { type: "paragraph", text: "Within 4 months, Brightwave went from 50 to over 500 qualified leads per month while reducing their cost per lead by 62%. The automated systems we built continue to scale effortlessly." },
        ],
    },
    {
        slug: "pixel-pulse-rebrand",
        title: "Pixel & Pulse: A Complete Brand Transformation",
        client: "Pixel & Pulse",
        industry: "Creative Agency",
        metric: "85% Brand Recall",
        excerpt: "A full rebrand including visual identity, messaging, website redesign, and launch campaign that repositioned them as market leaders.",
        tags: ["Brand Strategy", "Web Design"],
        gradient: "from-amber-500 to-orange-400",
        image: "/images/case-studies/pixel.svg",
        stats: [
            { label: "Brand Recall", value: "85%", description: "among target audience" },
            { label: "Website Traffic", value: "4x", description: "increase post-launch" },
            { label: "New Clients", value: "23", description: "in first quarter" },
            { label: "Social Growth", value: "320%", description: "follower increase" },
        ],
        content: [
            { type: "heading", text: "The Challenge" },
            { type: "paragraph", text: "Pixel & Pulse had outgrown their original brand identity. Their visual language didn't reflect the caliber of work they produced, and they were losing pitch opportunities to better-branded competitors." },
            { type: "heading", text: "Our Approach" },
            { type: "paragraph", text: "We conducted extensive brand workshops, competitive analysis, and audience research to develop a new brand identity that was bold, memorable, and authentically represented their creative philosophy." },
            { type: "list", items: ["Brand strategy workshops and positioning", "New visual identity including logo, typography, and color system", "Complete website redesign with portfolio showcase", "Social media rebrand and content strategy", "Launch campaign across all channels"] },
            { type: "heading", text: "The Results" },
            { type: "paragraph", text: "The rebrand was a resounding success. Brand recall among their target audience hit 85%, website traffic quadrupled, and they signed 23 new clients in the first quarter alone." },
        ],
    },
    {
        slug: "finedge-enterprise-pipeline",
        title: "FinEdge Capital: Enterprise Pipeline Automation",
        client: "FinEdge Capital",
        industry: "Financial Services",
        metric: "$2.4M Pipeline",
        excerpt: "Built an automated lead scoring and nurturing system that generated $2.4M in qualified pipeline within the first quarter.",
        tags: ["Automation", "Analytics"],
        gradient: "from-emerald-500 to-teal-400",
        image: "/images/case-studies/finedge.svg",
        stats: [
            { label: "Pipeline Value", value: "$2.4M", description: "in first quarter" },
            { label: "Lead Response", value: "<5min", description: "average response time" },
            { label: "SQL Rate", value: "34%", description: "of MQLs converted" },
            { label: "Time Saved", value: "40hrs", description: "per week on manual tasks" },
        ],
        content: [
            { type: "heading", text: "The Challenge" },
            { type: "paragraph", text: "FinEdge Capital had a manual, inefficient sales process. Their team was spending 40+ hours per week on data entry, lead qualification, and follow-ups — time that could be spent closing deals." },
            { type: "heading", text: "Our Approach" },
            { type: "paragraph", text: "We built an end-to-end pipeline automation system using OrbixDigital, integrating their CRM, email marketing, and analytics platforms into a unified, intelligent workflow." },
            { type: "list", items: ["Automated lead scoring based on 15+ behavioral signals", "Intelligent routing to the right rep within minutes", "Multi-touch nurture sequences for each segment", "Real-time pipeline dashboards and forecasting", "Weekly automated reports for leadership"] },
            { type: "heading", text: "The Results" },
            { type: "paragraph", text: "The automation platform generated $2.4M in qualified pipeline in its first quarter. The sales team reclaimed 40 hours per week, and their lead response time dropped from hours to under 5 minutes." },
        ],
    },
    {
        slug: "sunrise-health-video",
        title: "Sunrise Health: Video-First Social Strategy",
        client: "Sunrise Health",
        industry: "Healthcare",
        metric: "400% Engagement",
        excerpt: "A video production and social media strategy that drove 4x engagement rates and established them as a thought leader in digital health.",
        tags: ["Video", "Social Media"],
        gradient: "from-pink-500 to-rose-400",
        image: "/images/case-studies/sunrise.svg",
        stats: [
            { label: "Engagement Rate", value: "4x", description: "increase across platforms" },
            { label: "Video Views", value: "2.1M", description: "total across campaign" },
            { label: "Followers", value: "+45K", description: "new followers gained" },
            { label: "Website Traffic", value: "180%", description: "increase from social" },
        ],
        content: [
            { type: "heading", text: "The Challenge" },
            { type: "paragraph", text: "Sunrise Health needed to establish thought leadership in the digital health space but was struggling to stand out on social media with traditional text and image content." },
            { type: "heading", text: "Our Approach" },
            { type: "paragraph", text: "We developed a video-first content strategy that humanized their brand through expert interviews, patient stories, and educational health content optimized for each platform." },
            { type: "list", items: ["Platform-specific video content (TikTok, Instagram Reels, YouTube)", "Expert interview series with healthcare professionals", "Educational animation series on health topics", "Community engagement and response strategy", "Paid amplification of top-performing organic content"] },
            { type: "heading", text: "The Results" },
            { type: "paragraph", text: "The video strategy drove 4x engagement rates, 2.1M total views, and established Sunrise Health as a leading voice in digital health content. Their social channels became a genuine patient acquisition funnel." },
        ],
    },
    {
        slug: "ecomking-revenue-growth",
        title: "E-Com King: $1M Revenue in 90 Days",
        client: "E-Com King",
        industry: "E-commerce",
        metric: "$1M Revenue",
        excerpt: "A full-funnel campaign combining paid ads, email sequences, and landing page optimization that generated $1M in new revenue.",
        tags: ["PPC", "Email", "CRO"],
        gradient: "from-sky-500 to-blue-400",
        image: "/images/case-studies/ecomking.svg",
        stats: [
            { label: "Revenue", value: "$1M", description: "in 90 days" },
            { label: "ROAS", value: "8.2x", description: "return on ad spend" },
            { label: "AOV", value: "+35%", description: "average order value" },
            { label: "Conversion Rate", value: "5.8%", description: "site-wide CVR" },
        ],
        content: [
            { type: "heading", text: "The Challenge" },
            { type: "paragraph", text: "E-Com King had a strong product catalog but was leaving money on the table with unoptimized ad spend, low email revenue, and landing pages that weren't converting." },
            { type: "heading", text: "Our Approach" },
            { type: "paragraph", text: "We implemented a full-funnel strategy: reconstructed their ad account structure, built dedicated landing pages for top products, and deployed automated email flows for cart recovery and post-purchase upsells." },
            { type: "list", items: ["Restructured Google & Meta ad accounts for efficiency", "A/B tested landing pages for conversion optimization", "Cart abandonment and browse abandonment email flows", "Post-purchase upsell and cross-sell sequences", "Dynamic retargeting across all platforms"] },
            { type: "heading", text: "The Results" },
            { type: "paragraph", text: "E-Com King hit $1M in attributed revenue within 90 days. Their ROAS improved to 8.2x, average order value jumped 35%, and the automated email flows now generate 28% of total revenue on autopilot." },
        ],
    },
];

export async function generateStaticParams() {
    return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const study = CASE_STUDIES.find((s) => s.slug === slug);
    if (!study) return { title: "Case Study Not Found" };
    return {
        title: `${study.title} — OrbixDigital Case Studies`,
        description: study.excerpt,
    };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const study = CASE_STUDIES.find((s) => s.slug === slug);
    if (!study) notFound();

    const currentIndex = CASE_STUDIES.findIndex((s) => s.slug === slug);
    const prevStudy = currentIndex > 0 ? CASE_STUDIES[currentIndex - 1] : null;
    const nextStudy = currentIndex < CASE_STUDIES.length - 1 ? CASE_STUDIES[currentIndex + 1] : null;

    return (
        <div className="min-h-screen">
            <PublicNav />

            {/* Hero */}
            <section className="relative py-16 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className={`absolute inset-0 bg-gradient-to-br ${study.gradient} opacity-[0.05]`} />
                    <div className="gradient-orb animate-float-slow w-[500px] h-[400px] bg-primary/15 top-[-100px] left-[20%]" />
                </div>
                <Container size="lg">
                    <ScrollReveal delay={100}>
                        <Link
                            href="/case-studies"
                            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Case Studies
                        </Link>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        <div className="space-y-6">
                            <ScrollReveal delay={150}>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {study.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-xs font-medium px-2.5 py-1 rounded-full border border-border bg-muted/50"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </ScrollReveal>

                            <ScrollReveal delay={200}>
                                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                                    {study.title}
                                </h1>
                            </ScrollReveal>

                            <ScrollReveal delay={250}>
                                <p className="text-lg text-muted-foreground">
                                    {study.excerpt}
                                </p>
                            </ScrollReveal>

                            <ScrollReveal delay={300}>
                                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1.5">
                                        <Building2 className="h-4 w-4" />
                                        {study.client}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Tag className="h-4 w-4" />
                                        {study.industry}
                                    </span>
                                </div>
                            </ScrollReveal>
                        </div>

                        <ScrollReveal delay={300} distance="40px">
                            <div className={`rounded-xl overflow-hidden bg-gradient-to-br ${study.gradient} aspect-[4/3] relative`}>
                                {study.image && (
                                    <Image
                                        src={study.image}
                                        alt={study.title}
                                        fill
                                        className="object-contain p-8"
                                    />
                                )}
                            </div>
                        </ScrollReveal>
                    </div>
                </Container>
            </section>

            {/* Key Metrics */}
            <section className="py-12 border-y border-border bg-muted/30">
                <Container>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {study.stats.map((stat, i) => (
                            <ScrollReveal key={stat.label} stagger={100} index={i}>
                                <div className="text-center space-y-1">
                                    <p className={`text-3xl sm:text-4xl font-extrabold bg-gradient-to-r ${study.gradient} bg-clip-text text-transparent`}>
                                        {stat.value}
                                    </p>
                                    <p className="text-sm font-semibold">{stat.label}</p>
                                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Content */}
            <section className="py-16">
                <Container size="md">
                    <ScrollReveal delay={100}>
                        <article className="prose prose-lg max-w-none">
                            {study.content.map((block, i) => {
                                if (block.type === "heading") {
                                    return (
                                        <h2
                                            key={i}
                                            className="text-2xl font-bold mt-10 mb-4 text-foreground"
                                        >
                                            {block.text}
                                        </h2>
                                    );
                                }
                                if (block.type === "paragraph") {
                                    return (
                                        <p
                                            key={i}
                                            className="text-base leading-relaxed text-muted-foreground mb-4"
                                        >
                                            {block.text}
                                        </p>
                                    );
                                }
                                if (block.type === "list" && block.items) {
                                    return (
                                        <ul
                                            key={i}
                                            className="space-y-2 mb-6 ml-1"
                                        >
                                            {block.items.map((item, j) => (
                                                <li key={j} className="flex items-start gap-2.5 text-base text-muted-foreground">
                                                    <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <Target className="h-3 w-3 text-primary" />
                                                    </span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    );
                                }
                                return null;
                            })}
                        </article>
                    </ScrollReveal>

                    {/* Navigation */}
                    <ScrollReveal delay={200}>
                        <div className="flex items-center justify-between mt-16 pt-8 border-t border-border gap-4">
                            {prevStudy ? (
                                <Link
                                    href={`/case-studies/${prevStudy.slug}`}
                                    className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                                    <div className="text-left">
                                        <p className="text-xs text-muted-foreground">Previous</p>
                                        <p className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">{prevStudy.title}</p>
                                    </div>
                                </Link>
                            ) : <div />}
                            {nextStudy ? (
                                <Link
                                    href={`/case-studies/${nextStudy.slug}`}
                                    className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors text-right"
                                >
                                    <div>
                                        <p className="text-xs text-muted-foreground">Next</p>
                                        <p className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">{nextStudy.title}</p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            ) : <div />}
                        </div>
                    </ScrollReveal>
                </Container>
            </section>

            <CTASection
                headline="Want Results Like These?"
                subtitle="Book a free strategy call and let's discuss how we can help your agency grow."
            />

            <PublicFooter />
        </div>
    );
}
