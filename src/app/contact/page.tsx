"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    Sparkles,
    Check,
    ArrowRight,
    Loader2,
    Mail,
    Phone,
    MapPin,
    Clock,
    Shield,
    Zap,
    Users,
    Crown,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "@/components/ui/toast";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const SERVICES = [
    "SEO & Content Marketing",
    "Social Media Management",
    "Paid Advertising (PPC)",
    "Web Design & Development",
    "Email Marketing",
    "Brand Strategy",
    "Video Production",
    "Analytics & Reporting",
    "Influencer Marketing",
    "Celebrity Marketing",
    "AI Influencer",
];

const BUDGETS = [
    "Under ₹25,000/mo",
    "₹25,000 - ₹75,000/mo",
    "₹75,000 - ₹2,00,000/mo",
    "₹2,00,000 - ₹5,00,000/mo",
    "₹5,00,000+/mo",
];

const TIMELINES = [
    "ASAP",
    "1-3 Months",
    "3-6 Months",
    "6-12 Months",
    "Just Exploring",
];

const TRUST_POINTS = [
    { icon: Shield, text: "500+ businesses served worldwide" },
    { icon: Zap, text: "Average 3x ROI in first 90 days" },
    { icon: Users, text: "Dedicated growth strategist assigned" },
    { icon: Clock, text: "Response within 24 hours guaranteed" },
];

const PLAN_INFO: Record<string, { name: string; price: string; icon: typeof Sparkles; gradient: string }> = {
    starter: { name: "Starter", price: "₹4,999/mo", icon: Sparkles, gradient: "from-blue-500 to-cyan-400" },
    growth: { name: "Growth", price: "₹14,999/mo", icon: Zap, gradient: "from-violet-500 to-purple-500" },
    enterprise: { name: "Enterprise", price: "Custom", icon: Crown, gradient: "from-amber-500 to-orange-500" },
};

function ContactForm() {
    const searchParams = useSearchParams();
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        phone: "",
        website: "",
        budget: "",
        timeline: "",
        message: "",
    });

    // Capture UTM params + plan
    const [utm, setUtm] = useState({
        utmSource: "",
        utmMedium: "",
        utmCampaign: "",
        utmTerm: "",
        utmContent: "",
    });

    useEffect(() => {
        const planParam = searchParams.get("plan");
        if (planParam && PLAN_INFO[planParam]) {
            setSelectedPlan(planParam);
        }
        setUtm({
            utmSource: searchParams.get("utm_source") ?? "",
            utmMedium: searchParams.get("utm_medium") ?? "",
            utmCampaign: searchParams.get("utm_campaign") ?? "",
            utmTerm: searchParams.get("utm_term") ?? "",
            utmContent: searchParams.get("utm_content") ?? "",
        });
    }, [searchParams]);

    const plan = selectedPlan ? PLAN_INFO[selectedPlan] : null;

    function toggleService(service: string) {
        setSelectedServices((prev) =>
            prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
        );
    }

    function updateField(field: string, value: string) {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error for this field when user starts typing
        if (fieldErrors[field]) {
            setFieldErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFieldErrors({});
        if (!formData.email) {
            setFieldErrors({ email: ["Email is required"] });
            return;
        }
        setIsLoading(true);

        try {
            const res = await fetch("/api/leads/capture", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    serviceInterest: selectedServices,
                    source: "website",
                    ...(selectedPlan ? { selectedPlan: PLAN_INFO[selectedPlan]?.name } : {}),
                    ...Object.fromEntries(
                        Object.entries(utm).filter(([, v]) => v)
                    ),
                }),
            });

            if (res.ok) {
                setSubmitted(true);
            } else {
                const data = await res.json();
                // Show field-specific errors if available
                if (data.details?.fieldErrors) {
                    setFieldErrors(data.details.fieldErrors);
                    toast("Please fix the highlighted fields below.");
                } else {
                    toast(data.error || "Something went wrong");
                }
            }
        } catch {
            toast("Failed to submit. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    if (submitted) {
        return (
            <div className="min-h-screen flex flex-col">
                <header className="flex items-center justify-between p-6">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">OrbixDigital</span>
                    </Link>
                    <ThemeToggle />
                </header>
                <main className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center animate-fade-up space-y-4 max-w-md">
                        <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <Check className="h-8 w-8 text-emerald-500" />
                        </div>
                        <h1 className="text-3xl font-bold">Thank You!</h1>
                        <p className="text-muted-foreground">
                            We&apos;ve received your inquiry and will get back to you within 24 hours.
                        </p>
                        <Link href="/">
                            <Button variant="default" size="lg" className="mt-4">
                                Back to Home <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <header className="flex items-center justify-between p-6 relative z-20">
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-bold tracking-tight">OrbixDigital</span>
                </Link>
                <ThemeToggle />
            </header>

            <main className="flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)]">
                    {/* Left Side — Visual Panel */}
                    <div className="relative hidden lg:flex flex-col justify-center p-12 xl:p-16 overflow-hidden">
                        {/* Gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-violet-600/90 to-indigo-700/90" />
                        <div className="absolute inset-0">
                            <div className="gradient-orb animate-float-slow w-[400px] h-[400px] bg-white/10 top-[-100px] left-[-50px]" />
                            <div className="gradient-orb animate-float-delay w-[300px] h-[300px] bg-cyan-300/15 bottom-[10%] right-[-50px]" />
                            <div className="gradient-orb animate-float w-[200px] h-[200px] bg-amber-300/10 top-[50%] left-[30%]" />
                        </div>

                        <div className="relative z-10 space-y-10 text-white">
                            <ScrollReveal delay={100}>
                                <div className="space-y-4">
                                    <h2 className="text-3xl xl:text-4xl font-extrabold leading-tight">
                                        Let&apos;s Build Something
                                        <br />
                                        <span className="text-cyan-300">Extraordinary</span>
                                    </h2>
                                    <p className="text-white/70 text-lg max-w-md">
                                        Partner with us and unlock the marketing strategies that have helped 500+ businesses scale.
                                    </p>
                                </div>
                            </ScrollReveal>

                            {/* Trust points */}
                            <div className="space-y-4">
                                {TRUST_POINTS.map((point, i) => (
                                    <ScrollReveal key={point.text} stagger={100} index={i}>
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                                                <point.icon className="h-4 w-4 text-cyan-300" />
                                            </div>
                                            <span className="text-sm text-white/80">{point.text}</span>
                                        </div>
                                    </ScrollReveal>
                                ))}
                            </div>

                            {/* Contact info */}
                            <ScrollReveal delay={500}>
                                <div className="pt-6 border-t border-white/10 space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-white/60">
                                        <Mail className="h-4 w-4" />
                                        <span>hello@OrbixDigital.com</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-white/60">
                                        <Phone className="h-4 w-4" />
                                        <span>+1 (555) 987-6543</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-white/60">
                                        <MapPin className="h-4 w-4" />
                                        <span>San Francisco, CA</span>
                                    </div>
                                </div>
                            </ScrollReveal>

                            {/* Client logos */}
                            <ScrollReveal delay={600}>
                                <div className="space-y-3">
                                    <p className="text-xs text-white/40 uppercase tracking-wider font-medium">Trusted by</p>
                                    <div className="flex items-center gap-4 flex-wrap opacity-50">
                                        {[
                                            { name: "GrowthLab", src: "/images/logos/growthlab.svg" },
                                            { name: "Brightwave", src: "/images/logos/brightwave.svg" },
                                            { name: "NovaStar", src: "/images/logos/novastar.svg" },
                                        ].map((logo) => (
                                            <Image
                                                key={logo.name}
                                                src={logo.src}
                                                alt={logo.name}
                                                width={100}
                                                height={24}
                                                className="h-5 w-auto brightness-200 invert"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>

                    {/* Right Side — Form */}
                    <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16">
                        <div className="max-w-lg mx-auto w-full">
                            {/* Plan Banner */}
                            {plan && (
                                <ScrollReveal delay={50}>
                                    <div className={`mb-6 p-4 rounded-xl bg-gradient-to-r ${plan.gradient} bg-opacity-10 border border-border relative`}>
                                        <button
                                            onClick={() => setSelectedPlan(null)}
                                            className="absolute top-3 right-3 p-1 rounded-full hover:bg-black/10 transition-colors"
                                            aria-label="Dismiss plan selection"
                                        >
                                            <X className="h-3.5 w-3.5 text-white/60" />
                                        </button>
                                        <div className="flex items-center gap-3">
                                            <div className={`h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0`}>
                                                <plan.icon className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">
                                                    {plan.name} Plan — {plan.price}
                                                </p>
                                                <p className="text-xs text-white/70">
                                                    Selected plan · <Link href="/pricing" className="underline hover:text-white transition-colors">Change plan</Link>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            )}

                            <ScrollReveal delay={100}>
                                <div className="mb-8 space-y-2">
                                    <h1 className="text-3xl font-bold">
                                        {plan ? (
                                            <>Start Your <span className="gradient-text">{plan.name} Plan</span></>
                                        ) : (
                                            <>Get Your <span className="gradient-text">Free Strategy Call</span></>
                                        )}
                                    </h1>
                                    <p className="text-muted-foreground text-sm">
                                        {plan
                                            ? `Complete the form below and we'll set up your ${plan.name} plan — includes a 14-day free trial.`
                                            : "Tell us about your project and we'll create a custom growth plan — no commitment required."
                                        }
                                    </p>
                                </div>
                            </ScrollReveal>

                            <ScrollReveal delay={200}>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Contact Info */}
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">First Name</Label>
                                                <Input
                                                    id="firstName"
                                                    value={formData.firstName}
                                                    onChange={(e) => updateField("firstName", e.target.value)}
                                                    placeholder="John"
                                                    className={fieldErrors.firstName ? "border-red-500 focus:ring-red-500" : ""}
                                                />
                                                {fieldErrors.firstName && (
                                                    <p className="text-xs text-red-500">{fieldErrors.firstName[0]}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input
                                                    id="lastName"
                                                    value={formData.lastName}
                                                    onChange={(e) => updateField("lastName", e.target.value)}
                                                    placeholder="Doe"
                                                    className={fieldErrors.lastName ? "border-red-500 focus:ring-red-500" : ""}
                                                />
                                                {fieldErrors.lastName && (
                                                    <p className="text-xs text-red-500">{fieldErrors.lastName[0]}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => updateField("email", e.target.value)}
                                                placeholder="john@company.com"
                                                required
                                                className={fieldErrors.email ? "border-red-500 focus:ring-red-500" : ""}
                                            />
                                            {fieldErrors.email && (
                                                <p className="text-xs text-red-500">{fieldErrors.email[0]}</p>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="company">Company</Label>
                                                <Input
                                                    id="company"
                                                    value={formData.company}
                                                    onChange={(e) => updateField("company", e.target.value)}
                                                    placeholder="Acme Inc"
                                                    className={fieldErrors.company ? "border-red-500 focus:ring-red-500" : ""}
                                                />
                                                {fieldErrors.company && (
                                                    <p className="text-xs text-red-500">{fieldErrors.company[0]}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone</Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => updateField("phone", e.target.value)}
                                                    placeholder="+1 (555) 123-4567"
                                                    className={fieldErrors.phone ? "border-red-500 focus:ring-red-500" : ""}
                                                />
                                                {fieldErrors.phone && (
                                                    <p className="text-xs text-red-500">{fieldErrors.phone[0]}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Services */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium">Services You&apos;re Interested In</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {SERVICES.map((service) => {
                                                const isSelected = selectedServices.includes(service);
                                                return (
                                                    <button
                                                        key={service}
                                                        type="button"
                                                        onClick={() => toggleService(service)}
                                                        className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs text-left transition-all cursor-pointer ${isSelected
                                                            ? "border-primary bg-primary/5 text-primary"
                                                            : "border-border hover:border-primary/30"
                                                            }`}
                                                    >
                                                        <div
                                                            className={`h-3.5 w-3.5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${isSelected
                                                                ? "bg-primary border-primary"
                                                                : "border-border"
                                                                }`}
                                                        >
                                                            {isSelected && <Check className="h-2.5 w-2.5 text-white" />}
                                                        </div>
                                                        {service}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Budget & Timeline */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Monthly Budget</label>
                                            <select
                                                value={formData.budget}
                                                onChange={(e) => updateField("budget", e.target.value)}
                                                className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                            >
                                                <option value="">Select budget</option>
                                                {BUDGETS.map((b) => (
                                                    <option key={b} value={b}>{b}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Timeline</label>
                                            <select
                                                value={formData.timeline}
                                                onChange={(e) => updateField("timeline", e.target.value)}
                                                className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                            >
                                                <option value="">Select timeline</option>
                                                {TIMELINES.map((t) => (
                                                    <option key={t} value={t}>{t}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div className="space-y-2">
                                        <Label htmlFor="message">Tell us about your project</Label>
                                        <Textarea
                                            id="message"
                                            value={formData.message}
                                            onChange={(e) => updateField("message", e.target.value)}
                                            placeholder="What are your goals? Any specific challenges?"
                                            className="min-h-[100px]"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        variant="default"
                                        size="lg"
                                        className="w-full"
                                        disabled={isLoading || !formData.email}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                Get Your Free Strategy Call
                                                <ArrowRight className="h-4 w-4 ml-2" />
                                            </>
                                        )}
                                    </Button>

                                    <p className="text-xs text-center text-muted-foreground">
                                        We respect your privacy. Your information will never be shared.
                                    </p>
                                </form>
                            </ScrollReveal>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function ContactPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        }>
            <ContactForm />
        </Suspense>
    );
}
