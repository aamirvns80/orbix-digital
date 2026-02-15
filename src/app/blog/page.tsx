import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { CTASection } from "@/components/ui/cta-section";
import { Container } from "@/components/ui/container";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const metadata: Metadata = {
    title: "Blog — OrbixDigital",
    description: "Marketing tips, agency growth strategies, and industry insights from the OrbixDigital team.",
};

const BLOG_POSTS = [
    {
        slug: "lead-scoring-guide",
        title: "The Ultimate Guide to Lead Scoring for Businesses",
        excerpt: "Learn how to build a lead scoring model that helps your team focus on the highest-value opportunities and close deals faster.",
        author: "Sarah Chen",
        date: "Feb 10, 2026",
        readTime: "8 min read",
        category: "Lead Management",
        gradient: "from-blue-500 to-cyan-400",
        image: "/images/blog/lead-scoring.svg",
    },
    {
        slug: "seo-trends-2026",
        title: "SEO Trends to Watch in 2026: AI, SGE, and Beyond",
        excerpt: "A deep dive into the search landscape shifts that will define the next era of organic marketing and how businesses should adapt.",
        author: "Marcus Rivera",
        date: "Feb 5, 2026",
        readTime: "12 min read",
        category: "SEO",
        gradient: "from-violet-500 to-purple-400",
        image: "/images/blog/seo-trends.svg",
    },
    {
        slug: "agency-crm-comparison",
        title: "Agency CRM Showdown: What Actually Matters",
        excerpt: "We compared 10 popular CRMs through the lens of agency workflows. Spoiler: most of them aren't built for how businesses actually work.",
        author: "Emily Zhao",
        date: "Jan 28, 2026",
        readTime: "10 min read",
        category: "Tools & Tech",
        gradient: "from-amber-500 to-orange-400",
        image: "/images/blog/crm-comparison.svg",
    },
    {
        slug: "email-marketing-automation",
        title: "Email Automation Playbook: 7 Sequences Every Agency Needs",
        excerpt: "From welcome series to win-back campaigns, these email sequences will keep your pipeline warm and your clients engaged.",
        author: "Sarah Chen",
        date: "Jan 22, 2026",
        readTime: "9 min read",
        category: "Email Marketing",
        gradient: "from-emerald-500 to-teal-400",
        image: "/images/blog/email-automation.svg",
    },
    {
        slug: "social-media-roi",
        title: "How to Prove Social Media ROI to Skeptical Clients",
        excerpt: "A framework for measuring and communicating the real business impact of social media marketing beyond vanity metrics.",
        author: "Marcus Rivera",
        date: "Jan 15, 2026",
        readTime: "7 min read",
        category: "Social Media",
        gradient: "from-pink-500 to-rose-400",
        image: "/images/blog/social-roi.svg",
    },
    {
        slug: "scaling-agency-operations",
        title: "Scaling from 5 to 50 Clients Without Burning Out",
        excerpt: "Lessons learned from businesses that successfully scaled their operations while maintaining quality and team happiness.",
        author: "Emily Zhao",
        date: "Jan 8, 2026",
        readTime: "11 min read",
        category: "Agency Growth",
        gradient: "from-sky-500 to-blue-400",
        image: "/images/blog/scaling-ops.svg",
    },
];

export default function BlogPage() {
    return (
        <div className="min-h-screen">
            <PublicNav />

            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="gradient-orb animate-float-slow w-[500px] h-[400px] bg-primary/25 top-[-100px] left-[15%]" />
                </div>
                <Container size="lg">
                    <div className="text-center space-y-4">
                        <ScrollReveal delay={100}>
                            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                                The OrbixDigital <span className="gradient-text">Blog</span>
                            </h1>
                        </ScrollReveal>
                        <ScrollReveal delay={250}>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Marketing tips, agency growth strategies, and industry insights to help you build a thriving agency.
                            </p>
                        </ScrollReveal>
                    </div>
                </Container>
            </section>

            {/* Featured Post */}
            <section className="pb-12">
                <Container>
                    <ScrollReveal distance="40px">
                        <Link href={`/blog/${BLOG_POSTS[0].slug}`}>
                            <div className="group rounded-xl border border-border bg-card overflow-hidden card-hover-lift grid grid-cols-1 md:grid-cols-2">
                                <div className={`h-48 md:h-auto bg-gradient-to-br ${BLOG_POSTS[0].gradient} flex items-center justify-center min-h-[200px] relative overflow-hidden`}>
                                    {/* @ts-ignore */}
                                    {BLOG_POSTS[0].image && (
                                        <Image
                                            // @ts-ignore
                                            src={BLOG_POSTS[0].image}
                                            alt={BLOG_POSTS[0].title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                    <span className="relative z-10 text-white/90 text-sm font-medium bg-black/30 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/10">
                                        Featured
                                    </span>
                                </div>
                                <div className="p-8 flex flex-col justify-center">
                                    <span className="text-xs font-semibold text-primary mb-2">{BLOG_POSTS[0].category}</span>
                                    <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                                        {BLOG_POSTS[0].title}
                                    </h2>
                                    <p className="text-muted-foreground mb-4 leading-relaxed">{BLOG_POSTS[0].excerpt}</p>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span>{BLOG_POSTS[0].author}</span>
                                        <span>·</span>
                                        <span>{BLOG_POSTS[0].date}</span>
                                        <span>·</span>
                                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{BLOG_POSTS[0].readTime}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </ScrollReveal>
                </Container>
            </section>

            {/* Post Grid */}
            <section className="pb-20">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {BLOG_POSTS.slice(1).map((post, i) => (
                            <ScrollReveal key={post.slug} stagger={100} index={i}>
                                <Link href={`/blog/${post.slug}`}>
                                    <article className="group rounded-xl border border-border bg-card overflow-hidden card-hover-lift h-full flex flex-col">
                                        <div className={`h-36 bg-gradient-to-br ${post.gradient} relative overflow-hidden`}>
                                            {/* @ts-ignore */}
                                            {post.image && (
                                                <Image
                                                    // @ts-ignore
                                                    src={post.image}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                                />
                                            )}
                                        </div>
                                        <div className="p-6 flex flex-col flex-1">
                                            <span className="text-xs font-semibold text-primary mb-2">{post.category}</span>
                                            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                                                {post.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                                                {post.excerpt}
                                            </p>
                                            <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                                                <span>{post.author}</span>
                                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}</span>
                                            </div>
                                            <div className="flex items-center gap-1 mt-3 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                                                Read more <ArrowRight className="h-4 w-4" />
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
                headline="Stay Ahead of the Curve"
                subtitle="Subscribe to our newsletter for weekly marketing insights and agency tips."
                primaryLabel="Subscribe Now"
                secondaryLabel=""
            />

            <PublicFooter />
        </div>
    );
}
