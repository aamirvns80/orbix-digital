import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Calendar, User, Tag } from "lucide-react";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { CTASection } from "@/components/ui/cta-section";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

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
        content: [
            { type: "paragraph", text: "Lead scoring is the backbone of any high-performing agency's sales process. Without it, your team wastes valuable time chasing prospects that will never convert, while hot leads slip through the cracks." },
            { type: "heading", text: "Why Lead Scoring Matters" },
            { type: "paragraph", text: "Businesses that implement lead scoring see an average 77% increase in lead generation ROI. The key is building a model that aligns with your specific ideal client profile (ICP) and buying signals." },
            { type: "heading", text: "Building Your Scoring Model" },
            { type: "paragraph", text: "Start with two dimensions: demographic fit and behavioral engagement. Demographic scoring looks at company size, industry, budget, and role. Behavioral scoring tracks website visits, content downloads, email engagement, and form submissions." },
            { type: "list", items: ["Assign 1-10 points for demographic attributes", "Track engagement signals like page views and email opens", "Set threshold scores for MQL and SQL stages", "Review and calibrate your model quarterly", "Automate lead routing based on score thresholds"] },
            { type: "heading", text: "Common Mistakes to Avoid" },
            { type: "paragraph", text: "The biggest mistake businesses make is over-complicating their scoring model from day one. Start simple — you can always add complexity later. Another common pitfall is not involving your sales team in the scoring criteria. They know firsthand which leads convert." },
            { type: "heading", text: "Automating the Process" },
            { type: "paragraph", text: "Modern CRM platforms like OrbixDigital automatically score leads based on predefined rules. This eliminates manual review, ensures consistency, and allows your team to focus on what they do best — closing deals and delivering results." },
            { type: "paragraph", text: "By implementing a data-driven lead scoring system, your agency can prioritize high-value opportunities, shorten sales cycles, and dramatically improve conversion rates." },
        ],
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
        content: [
            { type: "paragraph", text: "The SEO landscape is evolving faster than ever. With AI-powered search experiences, changing user behavior, and new algorithm updates, businesses need to stay ahead of the curve to deliver results for their clients." },
            { type: "heading", text: "AI-Powered Search is Here" },
            { type: "paragraph", text: "Search Generative Experience (SGE) is transforming how users interact with search results. AI-generated summaries appear above traditional results, meaning businesses must optimize for both traditional rankings and AI-featured answers." },
            { type: "heading", text: "E-E-A-T Matters More Than Ever" },
            { type: "paragraph", text: "Google's emphasis on Experience, Expertise, Authoritativeness, and Trustworthiness continues to grow. For businesses, this means building genuine topical authority through deep, well-researched content backed by real data and expert insights." },
            { type: "list", items: ["Prioritize first-hand experience in content", "Build author authority with consistent bylines", "Invest in original research and data", "Strengthen brand signals across the web", "Focus on topical clusters over individual keywords"] },
            { type: "heading", text: "Technical SEO Gets More Complex" },
            { type: "paragraph", text: "Core Web Vitals continue to be a ranking factor, and the bar keeps rising. Businesses must ensure their clients' sites deliver exceptional performance across all metrics — from Largest Contentful Paint to Interaction to Next Paint." },
            { type: "paragraph", text: "The businesses that thrive in 2026 will be those that embrace AI tools while maintaining the human creativity and strategic thinking that makes great marketing." },
        ],
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
        content: [
            { type: "paragraph", text: "Not all CRMs are created equal — and that's especially true when you're running an agency. Most CRM platforms are built for product companies with straightforward sales processes, not the complex, relationship-driven world of agency services." },
            { type: "heading", text: "What Businesses Actually Need" },
            { type: "paragraph", text: "Agency CRMs need to handle multi-stakeholder deals, project-based revenue, recurring retainers, and complex client relationships. The best ones also integrate tightly with project management and reporting tools." },
            { type: "list", items: ["Pipeline management with custom stages", "Multi-contact deal tracking", "Retainer and project-based billing", "Automated lead capture from multiple channels", "White-label client portals", "Built-in reporting and analytics"] },
            { type: "heading", text: "The Verdict" },
            { type: "paragraph", text: "After extensive testing, purpose-built agency platforms consistently outperformed generic CRMs. They understand the unique workflows of agency life — from lead capture to proposal to signed contract to ongoing client management." },
            { type: "paragraph", text: "If your agency is still using a generic CRM, you're leaving efficiency (and revenue) on the table." },
        ],
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
        content: [
            { type: "paragraph", text: "Email automation is the silent revenue engine for smart businesses. While your team sleeps, well-crafted sequences nurture leads, onboard clients, and re-engage dormant prospects — all on autopilot." },
            { type: "heading", text: "The 7 Essential Sequences" },
            { type: "list", items: ["Welcome Series — first impressions that convert", "Lead Nurture — educate and build trust over time", "Proposal Follow-up — gentle nudges that close deals", "Client Onboarding — set expectations and reduce churn", "Monthly Recap — showcase results and reinforce value", "Re-engagement — win back cold leads", "Referral Request — turn happy clients into advocates"] },
            { type: "heading", text: "Best Practices" },
            { type: "paragraph", text: "The most effective email sequences feel personal, not automated. Use dynamic fields, segment your audience, and always lead with value. Test subject lines relentlessly — they determine whether your carefully crafted email gets opened or ignored." },
            { type: "paragraph", text: "Start with just 2-3 sequences and refine them based on performance data before expanding. Quality beats quantity every time." },
        ],
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
        content: [
            { type: "paragraph", text: "Every social media marketer has heard it: 'But what's the ROI?' It's a fair question, and one that businesses need a solid framework to answer. The key is connecting social metrics to business outcomes." },
            { type: "heading", text: "The ROI Framework" },
            { type: "paragraph", text: "Move beyond vanity metrics (likes, follows) and track metrics that matter: website traffic from social, lead quality from social channels, conversion rates, and customer lifetime value of social-acquired customers." },
            { type: "list", items: ["Set up proper UTM tracking for all social links", "Define conversion events tied to revenue", "Calculate cost-per-acquisition from each platform", "Compare social CAC to other channel CACs", "Track brand sentiment and share of voice"] },
            { type: "heading", text: "Communicating Results" },
            { type: "paragraph", text: "Data is only as good as how you present it. Build monthly reports that tell a story — lead with the business impact, then support with the social metrics that drove those results. Clients want to see the money, not the likes." },
        ],
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
        content: [
            { type: "paragraph", text: "Scaling an agency is exciting — until it isn't. The transition from 5 to 50 clients is where most businesses either thrive or implode. The difference comes down to systems, processes, and people." },
            { type: "heading", text: "Systems First, Growth Second" },
            { type: "paragraph", text: "Before taking on more clients, document your core processes. If your onboarding, reporting, and communication workflows live in someone's head instead of a system, you'll hit a ceiling fast." },
            { type: "list", items: ["Standardize your onboarding process", "Create SOPs for every recurring task", "Invest in project management tools early", "Build a knowledge base for your team", "Automate repetitive work wherever possible"] },
            { type: "heading", text: "Hiring Smart" },
            { type: "paragraph", text: "Don't hire generalists forever. As you scale, you need specialists who can own specific functions. But balance specialization with a culture of collaboration — silos kill businesses." },
            { type: "heading", text: "Protecting Your Team" },
            { type: "paragraph", text: "Growth means nothing if your team burns out. Set realistic capacity targets, enforce work boundaries, and invest in your people's development. A happy team delivers better work, which leads to better results, which brings more clients. It's a virtuous cycle." },
        ],
    },
];

export async function generateStaticParams() {
    return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = BLOG_POSTS.find((p) => p.slug === slug);
    if (!post) return { title: "Post Not Found" };
    return {
        title: `${post.title} — OrbixDigital Blog`,
        description: post.excerpt,
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = BLOG_POSTS.find((p) => p.slug === slug);
    if (!post) notFound();

    const currentIndex = BLOG_POSTS.findIndex((p) => p.slug === slug);
    const prevPost = currentIndex > 0 ? BLOG_POSTS[currentIndex - 1] : null;
    const nextPost = currentIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[currentIndex + 1] : null;

    return (
        <div className="min-h-screen">
            <PublicNav />

            {/* Hero */}
            <section className="relative py-16 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient} opacity-[0.04]`} />
                    <div className="gradient-orb animate-float-slow w-[500px] h-[400px] bg-primary/15 top-[-100px] right-[20%]" />
                </div>
                <Container size="md">
                    <ScrollReveal delay={100}>
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Blog
                        </Link>
                    </ScrollReveal>

                    <ScrollReveal delay={150}>
                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${post.gradient} text-white`}>
                                {post.category}
                            </span>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={200}>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-6">
                            {post.title}
                        </h1>
                    </ScrollReveal>

                    <ScrollReveal delay={250}>
                        <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground mb-8">
                            <span className="flex items-center gap-1.5">
                                <User className="h-4 w-4" />
                                {post.author}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                {post.date}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                {post.readTime}
                            </span>
                        </div>
                    </ScrollReveal>

                    {/* Featured image */}
                    <ScrollReveal delay={300} distance="40px">
                        <div className={`rounded-xl overflow-hidden bg-gradient-to-br ${post.gradient} aspect-[2/1] relative`}>
                            {post.image && (
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-contain p-8"
                                />
                            )}
                        </div>
                    </ScrollReveal>
                </Container>
            </section>

            {/* Content */}
            <section className="pb-16">
                <Container size="md">
                    <ScrollReveal delay={100}>
                        <article className="prose prose-lg max-w-none">
                            {post.content.map((block, i) => {
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
                                                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
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
                            {prevPost ? (
                                <Link
                                    href={`/blog/${prevPost.slug}`}
                                    className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                                    <div className="text-left">
                                        <p className="text-xs text-muted-foreground">Previous</p>
                                        <p className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">{prevPost.title}</p>
                                    </div>
                                </Link>
                            ) : <div />}
                            {nextPost ? (
                                <Link
                                    href={`/blog/${nextPost.slug}`}
                                    className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors text-right"
                                >
                                    <div>
                                        <p className="text-xs text-muted-foreground">Next</p>
                                        <p className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">{nextPost.title}</p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            ) : <div />}
                        </div>
                    </ScrollReveal>
                </Container>
            </section>

            <CTASection
                headline="Ready to Grow Your Agency?"
                subtitle="Start your free trial and see how OrbixDigital can transform your pipeline."
            />

            <PublicFooter />
        </div>
    );
}
