import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, ArrowLeft, CheckCircle2, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { CTASection } from "@/components/ui/cta-section";
import { SERVICE_DETAILS, getServiceBySlug, getAllServiceSlugs } from "@/lib/data/services";

// ─── Static generation ──────────────────────────────────────────────
export function generateStaticParams() {
    return getAllServiceSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
    const service = getServiceBySlug(params.slug);
    if (!service) return {};
    return {
        title: `${service.title} — OrbixDigital`,
        description: service.description,
    };
}

// ─── Page ────────────────────────────────────────────────────────────
export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
    const service = getServiceBySlug(params.slug);
    if (!service) notFound();

    return (
        <div className="min-h-screen">
            <PublicNav />

            {/* ── Hero ─────────────────────────────────────────────── */}
            <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-20">
                <div className="absolute inset-0 -z-10">
                    <div className={`gradient-orb animate-float-slow w-[500px] h-[500px] bg-gradient-to-br ${service.gradient} opacity-20 top-[-150px] left-[10%]`} />
                    <div className={`gradient-orb animate-float-delay w-[300px] h-[300px] bg-gradient-to-br ${service.gradient} opacity-10 bottom-[-50px] right-[10%]`} />
                </div>
                <Container size="lg">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <ScrollReveal>
                            <div className="space-y-6">
                                <Link
                                    href="/services"
                                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <ArrowLeft className="h-4 w-4" /> All Services
                                </Link>
                                <div className={`inline-flex items-center gap-2 rounded-full ${service.bgColor} px-4 py-1.5`}>
                                    <service.icon className={`h-4 w-4 ${service.color}`} />
                                    <span className={`text-sm font-medium ${service.color}`}>Starting from {service.startingPrice}</span>
                                </div>
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                                    {service.title}
                                </h1>
                                <p className="text-lg text-muted-foreground max-w-lg">
                                    {service.description}
                                </p>
                                <div className="flex items-center gap-4 flex-wrap">
                                    <Link href="/contact">
                                        <Button size="lg" variant="default">
                                            Get a Free Quote <ArrowRight className="h-5 w-5" />
                                        </Button>
                                    </Link>
                                    <a href="https://wa.me/91860456223" target="_blank" rel="noopener noreferrer">
                                        <Button size="lg" variant="outline" className="gap-2">
                                            <MessageCircle className="h-5 w-5" /> WhatsApp Us
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal delay={200}>
                            <div className="relative aspect-square max-w-md mx-auto">
                                <Image
                                    src={service.image}
                                    alt={service.title}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </ScrollReveal>
                    </div>
                </Container>
            </section>

            {/* ── Sub-Services Grid ────────────────────────────────── */}
            <section className="py-16 sm:py-24 bg-muted/30">
                <Container size="lg">
                    <ScrollReveal>
                        <div className="text-center space-y-4 mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                                What We Offer
                            </h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Choose the exact services you need — pick one, bundle a few, or go all-in.
                            </p>
                        </div>
                    </ScrollReveal>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {service.subServices.map((sub, i) => (
                            <ScrollReveal key={sub.slug} stagger={80} index={i}>
                                <div className="group relative rounded-xl border border-border bg-card p-6 sm:p-8 transition-all duration-300 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 h-full flex flex-col">
                                    {/* Icon */}
                                    <div className={`h-12 w-12 rounded-xl ${service.bgColor} flex items-center justify-center mb-5`}>
                                        <sub.icon className={`h-6 w-6 ${service.color}`} />
                                    </div>

                                    {/* Title & Description */}
                                    <h3 className="text-lg font-semibold mb-2">{sub.name}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                        {sub.description}
                                    </p>

                                    {/* Deliverables */}
                                    <ul className="space-y-2 mb-6 flex-1">
                                        {sub.deliverables.map((d) => (
                                            <li key={d} className="flex items-start gap-2 text-sm">
                                                <CheckCircle2 className={`h-4 w-4 mt-0.5 flex-shrink-0 ${service.color}`} />
                                                <span className="text-muted-foreground">{d}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Price & CTA */}
                                    <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Starting from</p>
                                            <p className={`text-lg font-bold ${service.color}`}>{sub.price}</p>
                                        </div>
                                        <Link
                                            href={`/contact?service=${sub.slug}`}
                                            className={`inline-flex items-center gap-1.5 text-sm font-semibold ${service.color} hover:gap-2.5 transition-all`}
                                        >
                                            Get Quote <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </Container>
            </section>

            {/* ── How We Work ──────────────────────────────────────── */}
            <section className="py-16 sm:py-24">
                <Container size="lg">
                    <ScrollReveal>
                        <div className="text-center space-y-4 mb-14">
                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                                How We Work
                            </h2>
                            <p className="text-muted-foreground max-w-xl mx-auto">
                                A simple 3-step process to get your project off the ground.
                            </p>
                        </div>
                    </ScrollReveal>
                    <div className="grid md:grid-cols-3 gap-8">
                        {service.process.map((p, i) => (
                            <ScrollReveal key={p.step} stagger={120} index={i}>
                                <div className="relative text-center space-y-4 p-6">
                                    <div className={`inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br ${service.gradient} items-center justify-center text-white text-2xl font-bold mx-auto`}>
                                        {p.step}
                                    </div>
                                    <h3 className="text-xl font-semibold">{p.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                                    {i < service.process.length - 1 && (
                                        <div className="hidden md:block absolute top-14 -right-4 w-8">
                                            <ArrowRight className="h-5 w-5 text-muted-foreground/40" />
                                        </div>
                                    )}
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </Container>
            </section>

            {/* ── FAQ ──────────────────────────────────────────────── */}
            <section className="py-16 sm:py-24 bg-muted/30">
                <Container size="md">
                    <ScrollReveal>
                        <div className="text-center space-y-4 mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                                Frequently Asked Questions
                            </h2>
                        </div>
                    </ScrollReveal>
                    <div className="space-y-4">
                        {service.faqs.map((faq, i) => (
                            <ScrollReveal key={i} stagger={80} index={i}>
                                <details className="group rounded-xl border border-border bg-card overflow-hidden">
                                    <summary className="flex cursor-pointer items-center justify-between p-5 sm:p-6 text-left font-medium hover:bg-muted/50 transition-colors">
                                        <span className="pr-4">{faq.question}</span>
                                        <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground group-open:rotate-90 transition-transform" />
                                    </summary>
                                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-muted-foreground leading-relaxed">
                                        {faq.answer}
                                    </div>
                                </details>
                            </ScrollReveal>
                        ))}
                    </div>
                </Container>
            </section>

            {/* ── CTA ──────────────────────────────────────────────── */}
            <CTASection
                headline="Ready to Get Started?"
                subtitle={`Let's discuss how our ${service.title} services can help your business grow. Book a free strategy call today.`}
            />

            <PublicFooter />
        </div>
    );
}
