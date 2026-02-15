import type { Metadata } from "next";
import Link from "next/link";
import {
    ArrowRight,
    Check,
    HelpCircle,
    Sparkles,
    Zap,
    Crown,
    ChevronDown,
} from "lucide-react";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { CTASection } from "@/components/ui/cta-section";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const metadata: Metadata = {
    title: "Pricing — OrbixDigital",
    description: "Simple, transparent pricing for businesses of every size. Start free, scale as you grow.",
};

const PLANS = [
    {
        name: "Starter",
        icon: Sparkles,
        description: "Perfect for solo founders and small businesses just getting started.",
        price: 4999,
        period: "/mo",
        highlight: false,
        badge: null,
        gradient: "from-blue-500 to-cyan-400",
        features: [
            "Up to 3 team members",
            "100 lead captures / mo",
            "Basic CRM pipeline",
            "Email support",
            "5 landing pages",
            "Basic analytics dashboard",
            "Community access",
        ],
        cta: "Start Free Trial",
    },
    {
        name: "Growth",
        icon: Zap,
        description: "For scaling businesses that need advanced tools and automation.",
        price: 14999,
        period: "/mo",
        highlight: true,
        badge: "Most Popular",
        gradient: "from-violet-500 to-purple-500",
        features: [
            "Up to 15 team members",
            "Unlimited lead captures",
            "Advanced CRM + automations",
            "Priority email & chat support",
            "Unlimited landing pages",
            "Advanced analytics + reports",
            "API access",
            "White-label client portal",
            "Custom integrations",
        ],
        cta: "Start Free Trial",
    },
    {
        name: "Enterprise",
        icon: Crown,
        description: "For large businesses needing custom solutions and dedicated support.",
        price: null,
        period: "",
        highlight: false,
        badge: null,
        gradient: "from-amber-500 to-orange-500",
        features: [
            "Unlimited team members",
            "Unlimited everything",
            "Custom CRM workflows",
            "Dedicated account manager",
            "Custom SLA & uptime",
            "Advanced security & SSO",
            "Custom API rate limits",
            "On-premise deployment option",
            "Quarterly strategy reviews",
            "Custom training & onboarding",
        ],
        cta: "Contact Sales",
    },
];

const FAQS = [
    {
        question: "Is there a free trial?",
        answer: "Yes! All plans include a 14-day free trial with full access. No credit card or payment details required to start.",
    },
    {
        question: "Can I switch plans later?",
        answer: "Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.",
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and bank transfers for annual Enterprise plans.",
    },
    {
        question: "Is there a discount for annual billing?",
        answer: "Yes, you save 20% when you choose annual billing on any plan. That's like getting 2+ months free. All prices are in INR (₹).",
    },
    {
        question: "What happens when I exceed my limits?",
        answer: "We'll notify you when you're approaching your plan limits. You can upgrade seamlessly, or we'll pause new captures until the next billing cycle — no surprise charges.",
    },
    {
        question: "Do you offer refunds?",
        answer: "We offer a 30-day money-back guarantee on all plans. If you're not satisfied, contact support for a full refund.",
    },
];

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
    return (
        <ScrollReveal stagger={80} index={index}>
            <details className="group border border-border rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-muted/50 transition-colors">
                    <span className="text-sm font-semibold pr-4">{question}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                    {answer}
                </div>
            </details>
        </ScrollReveal>
    );
}

export default function PricingPage() {
    return (
        <div className="min-h-screen">
            <PublicNav />

            {/* Hero */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="gradient-orb animate-float-slow w-[500px] h-[400px] bg-primary/25 top-[-100px] left-[20%]" />
                    <div className="gradient-orb animate-float-delay w-[400px] h-[350px] bg-violet-500/15 bottom-[-50px] right-[15%]" />
                </div>
                <Container size="lg">
                    <div className="text-center space-y-4">
                        <ScrollReveal delay={100}>
                            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                                Simple, Transparent <span className="gradient-text">Pricing</span>
                            </h1>
                        </ScrollReveal>
                        <ScrollReveal delay={200}>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Start free, scale as you grow. No hidden fees, no surprises.
                                Every plan includes a 14-day free trial.
                            </p>
                        </ScrollReveal>
                    </div>
                </Container>
            </section>

            {/* Pricing Cards */}
            <section className="pb-20">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
                        {PLANS.map((plan, i) => (
                            <ScrollReveal key={plan.name} stagger={120} index={i}>
                                <div
                                    className={`relative rounded-2xl border p-6 sm:p-8 flex flex-col transition-all duration-300 ${plan.highlight
                                        ? "border-primary shadow-xl shadow-primary/10 scale-[1.02] bg-card"
                                        : "border-border bg-card hover:border-primary/30 hover:shadow-lg"
                                        }`}
                                >
                                    {/* Badge */}
                                    {plan.badge && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                            <span className="gradient-primary text-white text-xs font-semibold px-4 py-1 rounded-full shadow-lg">
                                                {plan.badge}
                                            </span>
                                        </div>
                                    )}

                                    {/* Header */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}>
                                            <plan.icon className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold">{plan.name}</h3>
                                        </div>
                                    </div>

                                    <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

                                    {/* Price */}
                                    <div className="mb-6">
                                        {plan.price !== null ? (
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-4xl font-extrabold">₹{plan.price.toLocaleString('en-IN')}</span>
                                                <span className="text-muted-foreground text-sm">{plan.period}</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-4xl font-extrabold">Custom</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* CTA */}
                                    <Link href={`/contact?plan=${plan.name.toLowerCase()}`} className="mb-6">
                                        <Button
                                            variant={plan.highlight ? "default" : "outline"}
                                            size="lg"
                                            className="w-full"
                                        >
                                            {plan.cta}
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    </Link>

                                    {/* Features */}
                                    <div className="space-y-3 pt-6 border-t border-border">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">What&apos;s included</p>
                                        <ul className="space-y-2.5">
                                            {plan.features.map((feature) => (
                                                <li key={feature} className="flex items-start gap-2.5 text-sm">
                                                    <Check className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </Container>
            </section>

            {/* FAQ */}
            <section className="pb-20">
                <Container size="md">
                    <ScrollReveal>
                        <div className="text-center mb-10 space-y-3">
                            <div className="flex items-center justify-center gap-2">
                                <HelpCircle className="h-5 w-5 text-primary" />
                                <h2 className="text-2xl sm:text-3xl font-bold">Frequently Asked Questions</h2>
                            </div>
                            <p className="text-muted-foreground">
                                Everything you need to know about our plans and billing.
                            </p>
                        </div>
                    </ScrollReveal>
                    <div className="space-y-3">
                        {FAQS.map((faq, i) => (
                            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} index={i} />
                        ))}
                    </div>
                </Container>
            </section>

            <CTASection
                headline="Ready to Get Started?"
                subtitle="Join 500+ businesses already growing with OrbixDigital. Start your free trial today."
            />

            <PublicFooter />
        </div>
    );
}
