import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  BarChart3,
  Users,
  Globe,
  Target,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { StatsCounter } from "@/components/ui/stats-counter";
import { TestimonialCard } from "@/components/ui/testimonial-card";
import { CTASection } from "@/components/ui/cta-section";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const metadata: Metadata = {
  title: "OrbixDigital — Run Your Marketing Agency Like a Machine",
  description:
    "The all-in-one platform to manage leads, clients, content, and campaigns. Stop juggling tools and start scaling your business.",
};

const FEATURES = [
  {
    icon: Users,
    title: "Lead Management",
    description: "Track every lead from first touch to closed deal. Visual pipelines, automated follow-ups, and smart scoring.",
    span: 2,
    color: "gradient-primary",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "Admin, team, and client portals with fine-grained permissions.",
    color: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    description: "Real-time dashboards and reporting for every campaign.",
    color: "bg-amber-500/10",
    iconColor: "text-amber-500",
  },
  {
    icon: Zap,
    title: "Automations",
    description: "Email sequences, task assignments, and notifications on autopilot.",
    color: "bg-violet-500/10",
    iconColor: "text-violet-500",
  },
  {
    icon: Globe,
    title: "Content Management",
    description: "Create, schedule, and publish content across all channels. Blog posts, case studies, and landing pages.",
    span: 2,
    color: "bg-sky-500/10",
    iconColor: "text-sky-500",
  },
];

const SERVICES_PREVIEW = [
  { icon: Target, label: "SEO & Content" },
  { icon: BarChart3, label: "Paid Advertising" },
  { icon: Users, label: "Social Media" },
  { icon: Globe, label: "Web Development" },
  { icon: Mail, label: "Email Marketing" },
  { icon: Sparkles, label: "Brand Strategy" },
];

const CLIENT_LOGOS = [
  { name: "TechVista", src: "/images/logos/growthlab.svg" },
  { name: "BrandShakti", src: "/images/logos/brightwave.svg" },
  { name: "PixelCraft India", src: "/images/logos/pixelpulse.svg" },
  { name: "NovaStar Digital", src: "/images/logos/novastar.svg" },
  { name: "VelocityMKT", src: "/images/logos/velocitymkt.svg" },
];

const TESTIMONIALS = [
  {
    quote: "OrbixDigital completely transformed our lead management. We closed 3x more deals in the first quarter itself. Their team truly understands the Indian market.",
    name: "Rajesh Sharma",
    title: "Founder & CEO",
    company: "TechVista Solutions, Mumbai",
    rating: 5,
    avatar: "/images/avatars/sarah-chen.svg",
  },
  {
    quote: "The WhatsApp marketing and CRM integration is seamless. Our team saves 10+ hours per week on manual follow-ups. Best decision we made for our D2C brand.",
    name: "Priya Mehta",
    title: "Head of Marketing",
    company: "BrandShakti, Bangalore",
    rating: 5,
    avatar: "/images/avatars/marcus-rivera.svg",
  },
  {
    quote: "Finally, a digital marketing partner that delivers real ROI. Our organic traffic grew 5x in 6 months and our cost per lead dropped by 60%. Highly recommended!",
    name: "Amit Patel",
    title: "Co-Founder",
    company: "PixelCraft India, Ahmedabad",
    rating: 5,
    avatar: "/images/avatars/emily-zhao.svg",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <PublicNav />

      {/* Hero */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="gradient-orb animate-float-slow w-[600px] h-[600px] bg-primary/30 top-[-200px] left-[10%]" />
          <div className="gradient-orb animate-float-delay w-[400px] h-[400px] bg-violet-500/25 bottom-[-100px] right-[5%]" />
          <div className="gradient-orb animate-float w-[300px] h-[300px] bg-cyan-400/20 top-[40%] right-[20%]" />
        </div>
        <Container size="lg">
          <div className="text-center space-y-8">
            <ScrollReveal delay={100}>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Built for Modern Marketing Businesses
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
                Run Your Business
                <br />
                <span className="gradient-text">Like a Machine</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={350}>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                The all-in-one platform to manage leads, clients, content, and campaigns.
                Stop juggling tools and start scaling.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={450}>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link href="/contact">
                  <Button size="lg" variant="default">
                    Start Free Trial <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/case-studies">
                  <Button size="lg" variant="outline">
                    View Case Studies
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={500}>
              <div className="flex flex-col items-center gap-3 pt-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Trusted by 500+ Indian Businesses</p>
                <div className="flex items-center gap-6 flex-wrap justify-center opacity-60 hover:opacity-100 transition-opacity duration-500">
                  {CLIENT_LOGOS.map((logo) => (
                    <Image
                      key={logo.name}
                      src={logo.src}
                      alt={logo.name}
                      width={120}
                      height={28}
                      className="h-7 w-auto"
                    />
                  ))}
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={550} distance="40px">
              <div className="mt-12 relative w-full aspect-[16/9] max-w-5xl mx-auto rounded-xl overflow-hidden glow-border shadow-2xl">
                <Image
                  src="/images/hero-dashboard.svg"
                  alt="OrbixDigital Dashboard"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* Social Proof Stats */}
      <section className="border-y border-border bg-card">
        <Container>
          <StatsCounter
            stats={[
              { value: 500, suffix: "+", label: "Businesses Served" },
              { value: 12000, suffix: "+", label: "Leads Captured" },
              { value: 98, suffix: "%", label: "Client Satisfaction" },
              { value: 2, prefix: "₹", suffix: "Cr+", label: "Revenue Generated" },
            ]}
          />
        </Container>
      </section>

      {/* Services Preview */}
      <section className="py-20">
        <Container>
          <ScrollReveal>
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Full-Service <span className="gradient-text">Marketing Suite</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Everything your business needs to attract, convert, and retain clients.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {SERVICES_PREVIEW.map((s, i) => (
              <ScrollReveal key={s.label} stagger={80} index={i}>
                <Link href="/services">
                  <div className="group flex flex-col items-center gap-3 p-5 rounded-xl border border-border bg-card card-hover-lift cursor-pointer">
                    <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center">
                      <s.icon className="h-5 w-5 text-primary icon-bounce" />
                    </div>
                    <span className="text-sm font-medium text-center">{s.label}</span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal delay={400}>
            <div className="text-center mt-8">
              <Link href="/services">
                <Button variant="outline">
                  View All Services <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Features Bento Grid */}
      <section className="py-20 bg-muted/30">
        <Container>
          <ScrollReveal>
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Everything you need to <span className="gradient-text">grow</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Purpose-built tools for marketing businesses that want to move fast and deliver results.
              </p>
            </div>
          </ScrollReveal>
          <div className="bento-grid-3">
            {FEATURES.map((f, i) => (
              <ScrollReveal key={f.title} stagger={100} index={i}>
                <Card
                  className={`${f.span === 2 ? "bento-span-2" : ""} group card-hover-lift hover:border-primary/50`}
                >
                  <CardContent className="p-8 space-y-4">
                    <div className={`h-12 w-12 rounded-xl ${f.color} flex items-center justify-center ${f.span === 2 ? "shadow-lg" : ""}`}>
                      <f.icon className={`h-6 w-6 ${f.iconColor || "text-white"} icon-bounce`} />
                    </div>
                    <h3 className="text-xl font-semibold">{f.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {f.description}
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <Container size="lg">
          <ScrollReveal>
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Simple 3-Step <span className="gradient-text">Process</span>
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Capture Leads", desc: "Embed forms, capture UTM data, and auto-score incoming leads." },
              { step: "02", title: "Nurture & Convert", desc: "Track interactions, manage pipelines, and close deals faster." },
              { step: "03", title: "Scale & Report", desc: "Analyze performance, optimize campaigns, and grow revenue." },
            ].map((item, i) => (
              <ScrollReveal key={item.step} stagger={150} index={i}>
                <div className="text-center space-y-4">
                  <div className="mx-auto h-14 w-14 rounded-full gradient-primary flex items-center justify-center text-white text-lg font-bold shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <Container>
          <ScrollReveal>
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Loved by <span className="gradient-text">Businesses</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                See what marketing teams are saying about OrbixDigital.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <ScrollReveal key={t.name} stagger={120} index={i}>
                <TestimonialCard {...t} />
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Checklist / Why Us */}
      <section className="py-20">
        <Container size="md">
          <ScrollReveal>
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Why Businesses <span className="gradient-text">Choose Us</span>
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Visual lead pipeline with drag & drop",
              "UTM tracking on every lead",
              "Automated lead scoring",
              "Blog & case study CMS",
              "Team & client portals",
              "Real-time analytics dashboard",
              "Embeddable lead capture forms",
              "Dark mode everything",
            ].map((item, i) => (
              <ScrollReveal key={item} stagger={60} index={i} origin="left">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <CTASection />

      <PublicFooter />
    </div>
  );
}
