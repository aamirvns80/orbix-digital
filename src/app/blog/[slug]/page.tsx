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

import { getPosts, getPostBySlug } from "@/lib/mdx";
import { MDXContent } from "@/components/mdx-content";

export async function generateStaticParams() {
    const posts = getPosts();
    return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) return { title: "Post Not Found" };

    return {
        title: `${post.metadata.title} — MarketifyDigiAI Blog`,
        description: post.metadata.excerpt,
        openGraph: {
            title: post.metadata.title,
            description: post.metadata.excerpt,
            type: "article",
            publishedTime: post.metadata.date,
            authors: [post.metadata.author],
        }
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) notFound();

    const allPosts = getPosts();
    const currentIndex = allPosts.findIndex((p) => p.slug === slug);
    const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
    const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.metadata.title,
        description: post.metadata.excerpt,
        image: post.metadata.image ? [
            new URL(post.metadata.image, process.env.NEXT_PUBLIC_APP_URL || "https://MarketifyDigiAI.com").toString()
        ] : [],
        datePublished: new Date(post.metadata.date).toISOString(),
        author: [{
            "@type": "Person",
            "name": post.metadata.author,
        }]
    };

    return (
        <div className="min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <PublicNav />

            {/* Hero */}
            <section className="relative py-16 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className={`absolute inset-0 bg-gradient-to-br ${post.metadata.gradient || 'from-gray-700 to-gray-900'} opacity-[0.04]`} />
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
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${post.metadata.gradient || 'from-blue-500 to-cyan-400'} text-white`}>
                                {post.metadata.category}
                            </span>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={200}>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-6">
                            {post.metadata.title}
                        </h1>
                    </ScrollReveal>

                    <ScrollReveal delay={250}>
                        <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground mb-8">
                            <span className="flex items-center gap-1.5">
                                <User className="h-4 w-4" />
                                {post.metadata.author}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                {post.metadata.date}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                {post.metadata.readTime}
                            </span>
                        </div>
                    </ScrollReveal>

                    {/* Featured image */}
                    {post.metadata.image && (
                        <ScrollReveal delay={300} distance="40px">
                            <div className={`rounded-xl overflow-hidden bg-gradient-to-br ${post.metadata.gradient || 'from-gray-700 to-gray-900'} aspect-[2/1] relative`}>
                                <Image
                                    src={post.metadata.image}
                                    alt={post.metadata.title}
                                    fill
                                    className="object-contain p-8"
                                />
                            </div>
                        </ScrollReveal>
                    )}
                </Container>
            </section>

            {/* Content */}
            <section className="pb-16">
                <Container size="md">
                    <ScrollReveal delay={100}>
                        <MDXContent source={post.content} />
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
                                        <p className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">{prevPost.metadata.title}</p>
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
                                        <p className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">{nextPost.metadata.title}</p>
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
                subtitle="Start your free trial and see how MarketifyDigiAI can transform your pipeline."
            />

            <PublicFooter />
        </div>
    );
}
