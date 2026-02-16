import type { Metadata } from "next";
import {
    Search,
    BarChart3,
    Users,
    Globe,
    Mail,
    Sparkles,
    Video,
    PieChart,
    Megaphone,
    Star,
    Bot,
    MessageCircle,
} from "lucide-react";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { CTASection } from "@/components/ui/cta-section";
import { ServiceCard } from "@/components/ui/service-card";
import { Container } from "@/components/ui/container";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const metadata: Metadata = {
    title: "Services — OrbixDigital",
    description: "Full-service digital marketing: SEO, PPC, social media, web development, email marketing, brand strategy, video production, and analytics.",
};

const SERVICES = [
    {
        icon: Search,
        title: "SEO & Content Marketing",
        description: "Dominate search rankings with data-driven SEO strategies and compelling content that converts visitors into leads.",
        features: [
            "Technical SEO audits & optimization",
            "Content strategy & editorial calendars",
            "Link building & outreach",
            "Keyword research & tracking",
        ],
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        image: "/images/services/seo-marketing.svg",
    },
    {
        icon: BarChart3,
        title: "Paid Advertising (PPC)",
        description: "Maximize ROI with targeted ad campaigns across Google, Meta, LinkedIn, and TikTok.",
        features: [
            "Google Ads & Shopping campaigns",
            "Social media advertising",
            "Retargeting & lookalike audiences",
            "A/B testing & optimization",
        ],
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
        image: "/images/services/ppc.svg",
    },
    {
        icon: Users,
        title: "Social Media Management",
        description: "Build authentic connections with your audience through strategic social media presence and community management.",
        features: [
            "Content creation & scheduling",
            "Community management",
            "Influencer partnerships",
            "Social listening & analytics",
        ],
        color: "text-pink-500",
        bgColor: "bg-pink-500/10",
        image: "/images/services/social.svg",
    },
    {
        icon: Globe,
        title: "Web Design & Development",
        description: "Stunning, conversion-optimized websites that deliver exceptional user experiences and drive business results.",
        features: [
            "Custom website design",
            "E-commerce solutions",
            "Landing page optimization",
            "Performance & accessibility",
        ],
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
        image: "/images/services/web.svg",
    },
    {
        icon: Mail,
        title: "Email Marketing",
        description: "Nurture leads and retain customers with personalized email campaigns that drive engagement and revenue.",
        features: [
            "Automated drip campaigns",
            "Newsletter design & strategy",
            "List segmentation & personalization",
            "Deliverability optimization",
        ],
        color: "text-violet-500",
        bgColor: "bg-violet-500/10",
        image: "/images/services/email.svg",
    },
    {
        icon: Sparkles,
        title: "Brand Strategy",
        description: "Define your brand identity and position yourself as a market leader with a cohesive brand strategy.",
        features: [
            "Brand identity & guidelines",
            "Messaging & positioning",
            "Competitive analysis",
            "Brand voice & tone",
        ],
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        image: "/images/services/brand.svg",
    },
    {
        icon: Video,
        title: "Video Production",
        description: "Engage your audience with high-quality video content for social media, ads, and brand storytelling.",
        features: [
            "Social media video content",
            "Product & explainer videos",
            "Testimonial & case study videos",
            "Motion graphics & animation",
        ],
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        image: "/images/services/video.svg",
    },
    {
        icon: PieChart,
        title: "Analytics & Reporting",
        description: "Make data-driven decisions with comprehensive analytics, custom dashboards, and actionable insights.",
        features: [
            "Custom dashboard setup",
            "Attribution modeling",
            "ROI tracking & reporting",
            "Data visualization",
        ],
        color: "text-cyan-500",
        bgColor: "bg-cyan-500/10",
        image: "/images/services/analytics.svg",
    },
    {
        icon: Megaphone,
        title: "Influencer Marketing",
        description: "Amplify your brand reach and credibility by partnering with influential voices in your niche.",
        features: [
            "Influencer identification & outreach",
            "Campaign strategy & management",
            "Contract negotiation",
            "Performance tracking",
        ],
        color: "text-rose-500",
        bgColor: "bg-rose-500/10",
        image: "/images/services/influencer.svg",
    },
    {
        icon: Star,
        title: "Celebrity Marketing",
        description: "Elevate your brand status and visibility through strategic high-profile celebrity endorsements and partnerships.",
        features: [
            "Celebrity endorsement deals",
            "Brand ambassadorships",
            "Red carpet & event integration",
            "PR & media alignment",
        ],
        color: "text-indigo-500",
        bgColor: "bg-indigo-500/10",
        image: "/images/services/celebrity.svg",
    },
    {
        icon: Bot,
        title: "AI Influencer",
        description: "Leverage cutting-edge AI to create hyper-realistic virtual influencers and automated ad content at scale — no human talent required.",
        features: [
            "AI-generated ad creatives",
            "AI avatar creation & customization",
            "AI UGC-style ads",
            "Voice cloning & multilingual dubbing",
            "AI script writing & storyboarding",
            "Deepfake-safe, brand-compliant output",
        ],
        color: "text-fuchsia-500",
        bgColor: "bg-fuchsia-500/10",
        image: "/images/services/ai-influencer.svg",
    },
    {
        icon: MessageCircle,
        title: "WhatsApp Marketing",
        description: "Unlock the power of WhatsApp to engage customers directly, automate conversations, and drive conversions through the world's most popular messaging platform.",
        features: [
            "Bulk WhatsApp campaigns",
            "WhatsApp Business API integration",
            "Chatbot & auto-replies",
            "Broadcast lists & group marketing",
            "Click-to-WhatsApp ads",
            "Performance analytics & reporting",
        ],
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        image: "/images/services/whatsapp.svg",
    },
];

export default function ServicesPage() {
    return (
        <div className="min-h-screen">
            <PublicNav />

            {/* Hero */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="gradient-orb animate-float-slow w-[600px] h-[400px] bg-primary/25 top-[-100px] right-[20%]" />
                    <div className="gradient-orb animate-float-delay w-[350px] h-[350px] bg-violet-500/20 bottom-[-80px] left-[10%]" />
                </div>
                <Container size="lg">
                    <div className="text-center space-y-4">
                        <ScrollReveal delay={100}>
                            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                                Our <span className="gradient-text">Services</span>
                            </h1>
                        </ScrollReveal>
                        <ScrollReveal delay={250}>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Full-stack marketing solutions designed to drive growth at every stage of the funnel.
                                Each service is tailored to your unique business goals.
                            </p>
                        </ScrollReveal>
                    </div>
                </Container>
            </section>

            {/* Services Grid */}
            <section className="pb-20">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {SERVICES.map((service, i) => (
                            <ScrollReveal key={service.title} stagger={80} index={i}>
                                <ServiceCard
                                    icon={service.icon}
                                    title={service.title}
                                    description={service.description}
                                    features={service.features}
                                    color={service.color}
                                    bgColor={service.bgColor}
                                    image={service.image}
                                />
                            </ScrollReveal>
                        ))}
                    </div>
                </Container>
            </section>

            <CTASection
                headline="Ready to Scale Your Marketing?"
                subtitle="Book a free consultation and we'll build a custom strategy for your business."
            />

            <PublicFooter />
        </div>
    );
}
