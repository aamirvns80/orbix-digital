import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { CTASection } from "@/components/ui/cta-section";
import { Container } from "@/components/ui/container";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { getPosts } from "@/lib/mdx";

export const metadata: Metadata = {
    title: "Blog — MarketifyDigiAI",
    description: "Marketing tips, agency growth strategies, and industry insights from the MarketifyDigiAI team.",
};

export default function BlogPage() {
    // Fetch all posts dynamically from MDX
    const posts = getPosts();

    // If we have no posts, we can show a placeholder state or just an empty grid
    const featuredPost = posts.find(p => p.metadata.featured) || posts[0];
    const gridPosts = featuredPost
        ? posts.filter(p => p.slug !== featuredPost.slug)
        : posts;

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
                                The MarketifyDigiAI <span className="gradient-text">Blog</span>
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
            {featuredPost && (
                <section className="pb-12">
                    <Container>
                        <ScrollReveal distance="40px">
                            <Link href={`/blog/${featuredPost.slug}`}>
                                <div className="group rounded-xl border border-border bg-card overflow-hidden card-hover-lift grid grid-cols-1 md:grid-cols-2">
                                    <div className={`h-48 md:h-auto bg-gradient-to-br ${featuredPost.metadata.gradient || 'from-blue-500 to-cyan-400'} flex items-center justify-center min-h-[200px] relative overflow-hidden`}>
                                        {featuredPost.metadata.image ? (
                                            <Image
                                                src={featuredPost.metadata.image}
                                                alt={featuredPost.metadata.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/50 font-bold text-4xl">
                                                {featuredPost.metadata.category}
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                        <span className="relative z-10 text-white/90 text-sm font-medium bg-black/30 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/10">
                                            Featured
                                        </span>
                                    </div>
                                    <div className="p-8 flex flex-col justify-center">
                                        <span className="text-xs font-semibold text-primary mb-2">{featuredPost.metadata.category}</span>
                                        <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                                            {featuredPost.metadata.title}
                                        </h2>
                                        <p className="text-muted-foreground mb-4 leading-relaxed">{featuredPost.metadata.excerpt}</p>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span>{featuredPost.metadata.author}</span>
                                            <span>·</span>
                                            <span>{featuredPost.metadata.date}</span>
                                            <span>·</span>
                                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{featuredPost.metadata.readTime}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </ScrollReveal>
                    </Container>
                </section>
            )}

            {/* Post Grid */}
            {gridPosts.length > 0 && (
                <section className="pb-20">
                    <Container>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {gridPosts.map((post, i) => (
                                <ScrollReveal key={post.slug} stagger={100} index={i}>
                                    <Link href={`/blog/${post.slug}`}>
                                        <article className="group rounded-xl border border-border bg-card overflow-hidden card-hover-lift h-full flex flex-col">
                                            <div className={`h-36 bg-gradient-to-br ${post.metadata.gradient || 'from-gray-700 to-gray-900'} relative overflow-hidden flex items-center justify-center`}>
                                                {post.metadata.image ? (
                                                    <Image
                                                        src={post.metadata.image}
                                                        alt={post.metadata.title}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-white/50 font-bold text-xl">
                                                        {post.metadata.category}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-6 flex flex-col flex-1">
                                                <span className="text-xs font-semibold text-primary mb-2">{post.metadata.category}</span>
                                                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                                                    {post.metadata.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                                                    {post.metadata.excerpt}
                                                </p>
                                                <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                                                    <span>{post.metadata.author}</span>
                                                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.metadata.readTime}</span>
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
            )}

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
