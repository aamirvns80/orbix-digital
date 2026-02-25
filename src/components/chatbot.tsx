"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
    MessageCircle,
    X,
    Send,
    Bot,
    User,
    Sparkles,
    ArrowRight,
    Phone,
    Mail,
    Globe,
    Zap,
} from "lucide-react";

// ─── Knowledge Base ──────────────────────────────────────────────────
interface QuickReply {
    label: string;
    value: string;
}

interface KBEntry {
    keywords: string[];
    answer: string;
    followUp?: QuickReply[];
}

const QUICK_REPLIES: QuickReply[] = [
    { label: "💰 Pricing & Plans", value: "pricing" },
    { label: "🤖 AI Services", value: "ai-services" },
    { label: "🌐 Web Development", value: "web-development" },
    { label: "📈 SEO & Marketing", value: "seo-marketing" },
    { label: "📞 Talk to a Human", value: "talk-human" },
    { label: "📝 Get a Free Quote", value: "get-quote" },
];

const KNOWLEDGE_BASE: KBEntry[] = [
    {
        keywords: ["pricing", "cost", "price", "budget", "how much", "rate", "charges", "plans"],
        answer:
            "Our pricing varies by service:\n\n" +
            "🔍 **SEO & Content** — from ₹12,000/mo\n" +
            "🎯 **Paid Ads (PPC)** — from ₹8,000/mo\n" +
            "📱 **Social Media** — from ₹15,000/mo\n" +
            "🌐 **Web Design** — from ₹20,000\n" +
            "🤖 **AI Automation** — from ₹8,000/mo\n\n" +
            "Would you like a custom quote for your specific needs?",
        followUp: [
            { label: "📝 Get a Free Quote", value: "get-quote" },
            { label: "🤖 AI Services Details", value: "ai-services" },
        ],
    },
    {
        keywords: ["ai", "automation", "chatbot", "calling", "receptionist", "ai service"],
        answer:
            "Our **AI Automation Services** include:\n\n" +
            "📞 **AI Calling Service** — Human-like voice agents for sales & support (₹15,000/mo)\n" +
            "🎧 **AI Receptionist** — 24/7 virtual receptionist that never misses a call (₹10,000/mo)\n" +
            "💬 **WhatsApp AI Automation** — Smart chatbot for lead capture & orders (₹8,000/mo)\n" +
            "🤖 **AI Chatbot for Website** — Like me! Trained on your business data (₹12,000/mo)\n\n" +
            "These AI agents work 24/7 and scale effortlessly!",
        followUp: [
            { label: "💰 See Pricing", value: "pricing" },
            { label: "📝 Get a Free Quote", value: "get-quote" },
        ],
    },
    {
        keywords: ["web", "website", "design", "development", "landing", "ecommerce", "store"],
        answer:
            "We build stunning, high-performance websites:\n\n" +
            "📄 **Landing Pages** — from ₹10,000\n" +
            "🏢 **Business Websites** (5–10 pages) — from ₹25,000\n" +
            "🛒 **E-Commerce Stores** — from ₹40,000\n" +
            "🔄 **Website Redesign** — from ₹20,000\n" +
            "⚡ **Speed Optimization** — from ₹8,000\n\n" +
            "All websites are mobile-responsive, SEO-optimized, and blazing fast!",
        followUp: [
            { label: "📝 Get a Free Quote", value: "get-quote" },
            { label: "📈 SEO Services", value: "seo-marketing" },
        ],
    },
    {
        keywords: ["seo", "content", "marketing", "search", "rank", "organic", "blog", "keyword"],
        answer:
            "Our **SEO & Content Marketing** helps you dominate search:\n\n" +
            "🔍 **Technical SEO Audit** — from ₹8,000\n" +
            "📝 **Content Writing** — 4 blog posts/month from ₹15,000/mo\n" +
            "🔗 **Link Building** — 10+ backlinks/mo from ₹12,000/mo\n" +
            "📍 **Local SEO** — from ₹8,000/mo\n\n" +
            "Most clients see results within 3–6 months. SEO compounds over time!",
        followUp: [
            { label: "💰 See Full Pricing", value: "pricing" },
            { label: "📝 Get a Free Quote", value: "get-quote" },
        ],
    },
    {
        keywords: ["human", "person", "speak", "call", "contact", "agent", "representative", "talk"],
        answer:
            "Of course! You can reach our team anytime:\n\n" +
            "📞 **Phone:** +91 98765 43210\n" +
            "📧 **Email:** hello@marketifydigiai.com\n" +
            "💬 **WhatsApp:** Click the green button below!\n\n" +
            "Or fill out our contact form and we'll get back within 24 hours.",
        followUp: [
            { label: "📝 Contact Form", value: "get-quote" },
        ],
    },
    {
        keywords: ["quote", "free", "consultation", "start", "begin", "interested", "get started"],
        answer:
            "Great! I'd love to help you get started. 🚀\n\n" +
            "To prepare a custom quote, I just need a few details. Could you share your:\n\n" +
            "1. **Name**\n" +
            "2. **Email** or **Phone**\n" +
            "3. **Which service are you interested in?**\n\n" +
            "Or you can fill out our contact form directly!",
        followUp: [
            { label: "📝 Go to Contact Form", value: "contact-form" },
        ],
    },
    {
        keywords: ["social", "media", "instagram", "facebook", "linkedin", "reels"],
        answer:
            "Our **Social Media Management** covers everything:\n\n" +
            "📅 **Content Calendar & Strategy** — from ₹8,000/mo\n" +
            "🎬 **Reels & Shorts Creation** — from ₹12,000/mo\n" +
            "❤️ **Community Management** — from ₹10,000/mo\n" +
            "📊 **Monthly Analytics** — from ₹3,000/mo\n\n" +
            "We manage Instagram, Facebook, LinkedIn, X, YouTube & Pinterest!",
        followUp: [
            { label: "💰 See Full Pricing", value: "pricing" },
            { label: "📝 Get a Free Quote", value: "get-quote" },
        ],
    },
    {
        keywords: ["whatsapp", "bulk", "broadcast", "message"],
        answer:
            "Our **WhatsApp Marketing** services include:\n\n" +
            "📩 **Bulk Campaigns** — from ₹3,000/mo\n" +
            "🔗 **Business API Integration** — from ₹10,000/setup\n" +
            "🤖 **Chatbot & Auto-Replies** — from ₹8,000/setup\n" +
            "📢 **Click-to-WhatsApp Ads** — from ₹5,000/mo + ad spend\n\n" +
            "Reach customers where they already are!",
        followUp: [
            { label: "🤖 AI Automation", value: "ai-services" },
            { label: "📝 Get a Free Quote", value: "get-quote" },
        ],
    },
    {
        keywords: ["influencer", "celebrity", "brand ambassador"],
        answer:
            "We offer both **Influencer** and **Celebrity Marketing**:\n\n" +
            "👥 **Micro-Influencer Campaigns** — from ₹15,000\n" +
            "📢 **Macro-Influencer Outreach** — from ₹40,000\n" +
            "⭐ **Celebrity Endorsements** — from ₹2,00,000+\n" +
            "🏆 **Brand Ambassadorships** — from ₹5,00,000+/year\n\n" +
            "We handle everything — outreach, contracts, content approval & ROI tracking!",
        followUp: [
            { label: "💰 See Pricing", value: "pricing" },
            { label: "📝 Get a Free Quote", value: "get-quote" },
        ],
    },
    {
        keywords: ["email", "newsletter", "drip", "automation", "sequence"],
        answer:
            "Our **Email Marketing** services include:\n\n" +
            "✉️ **Welcome Sequences** — from ₹5,000/setup\n" +
            "📰 **Newsletter Campaigns** — from ₹6,000/mo\n" +
            "⚡ **Drip Automation** — from ₹8,000/setup\n" +
            "📈 **Lead Nurturing** — from ₹7,000/setup\n\n" +
            "Nurture leads and drive sales on autopilot!",
        followUp: [
            { label: "💰 See Full Pricing", value: "pricing" },
            { label: "📝 Get a Free Quote", value: "get-quote" },
        ],
    },
    {
        keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"],
        answer:
            "Hello! 👋 Welcome to MarketifyDigiAI!\n\n" +
            "I'm Marketify, your AI assistant. I can help you with:\n\n" +
            "• Service information & pricing\n" +
            "• Getting a free quote\n" +
            "• Connecting with our team\n\n" +
            "How can I help you today?",
        followUp: QUICK_REPLIES.slice(0, 4),
    },
    {
        keywords: ["thank", "thanks", "bye", "goodbye"],
        answer:
            "You're welcome! 😊 If you need anything else, I'm always here.\n\n" +
            "Have a great day! 🚀",
    },
];

const FALLBACK_ANSWER =
    "I'm not sure I understand that completely. Let me help you with some popular topics, or connect you with our team!\n\n" +
    "📞 **Call:** +91 98765 43210\n" +
    "📧 **Email:** hello@marketifydigiai.com";

const FALLBACK_FOLLOW_UP: QuickReply[] = [
    { label: "💰 Pricing", value: "pricing" },
    { label: "🤖 AI Services", value: "ai-services" },
    { label: "📞 Talk to Human", value: "talk-human" },
];

function findAnswer(input: string): { answer: string; followUp?: QuickReply[] } {
    const lower = input.toLowerCase();

    // check quick reply values first (exact match)
    for (const entry of KNOWLEDGE_BASE) {
        if (entry.keywords.some((kw) => kw === lower)) {
            return { answer: entry.answer, followUp: entry.followUp };
        }
    }

    // fuzzy keyword matching
    let bestMatch: KBEntry | null = null;
    let bestScore = 0;

    for (const entry of KNOWLEDGE_BASE) {
        let score = 0;
        for (const kw of entry.keywords) {
            if (lower.includes(kw)) {
                score += kw.length; // longer keyword matches = higher score
            }
        }
        if (score > bestScore) {
            bestScore = score;
            bestMatch = entry;
        }
    }

    if (bestMatch && bestScore > 0) {
        return { answer: bestMatch.answer, followUp: bestMatch.followUp };
    }

    return { answer: FALLBACK_ANSWER, followUp: FALLBACK_FOLLOW_UP };
}

// ─── Types ───────────────────────────────────────────────────────────
interface ChatMessage {
    id: string;
    role: "bot" | "user";
    content: string;
    quickReplies?: QuickReply[];
    timestamp: Date;
}

// ─── Component ───────────────────────────────────────────────────────
export function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [hasOpened, setHasOpened] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    // focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // initialize welcome message on first open
    const handleOpen = useCallback(() => {
        setIsOpen(true);
        if (!hasOpened) {
            setHasOpened(true);
            setMessages([
                {
                    id: "welcome",
                    role: "bot",
                    content:
                        "Hi there! 👋 I'm **Marketify**, your AI assistant at MarketifyDigiAI.\n\nI can help you explore our services, get pricing, or connect you with our team.\n\nWhat would you like to know?",
                    quickReplies: QUICK_REPLIES,
                    timestamp: new Date(),
                },
            ]);
        }
    }, [hasOpened]);

    const addBotReply = useCallback((content: string, quickReplies?: QuickReply[]) => {
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages((prev) => [
                ...prev,
                {
                    id: `bot-${Date.now()}`,
                    role: "bot",
                    content,
                    quickReplies,
                    timestamp: new Date(),
                },
            ]);
        }, 600 + Math.random() * 800);
    }, []);

    const handleSend = useCallback(
        (text: string) => {
            const trimmed = text.trim();
            if (!trimmed) return;

            // handle special actions
            if (trimmed === "contact-form") {
                window.location.href = "/contact";
                return;
            }

            // add user message
            setMessages((prev) => [
                ...prev,
                {
                    id: `user-${Date.now()}`,
                    role: "user",
                    content: trimmed,
                    timestamp: new Date(),
                },
            ]);
            setInput("");

            // find answer
            const { answer, followUp } = findAnswer(trimmed);
            addBotReply(answer, followUp);
        },
        [addBotReply]
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSend(input);
    };

    const handleQuickReply = (reply: QuickReply) => {
        if (reply.value === "contact-form") {
            window.location.href = "/contact";
            return;
        }

        // show the label as user message
        setMessages((prev) => [
            ...prev,
            {
                id: `user-${Date.now()}`,
                role: "user",
                content: reply.label,
                timestamp: new Date(),
            },
        ]);

        const { answer, followUp } = findAnswer(reply.value);
        addBotReply(answer, followUp);
    };

    // simple markdown bold renderer
    function renderText(text: string) {
        const parts = text.split(/(\*\*[^*]+\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith("**") && part.endsWith("**")) {
                return (
                    <strong key={i} className="font-semibold text-foreground">
                        {part.slice(2, -2)}
                    </strong>
                );
            }
            return <span key={i}>{part}</span>;
        });
    }

    return (
        <>
            {/* ── Floating Trigger Button ── */}
            <button
                onClick={() => (isOpen ? setIsOpen(false) : handleOpen())}
                aria-label={isOpen ? "Close chat" : "Open chat"}
                className={`fixed bottom-24 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group ${isOpen
                    ? "bg-muted text-muted-foreground hover:bg-destructive hover:text-white scale-90"
                    : "gradient-primary text-white hover:scale-110"
                    }`}
            >
                {isOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <>
                        <Bot className="h-7 w-7 group-hover:scale-110 transition-transform" />
                        {/* notification dot */}
                        {!hasOpened && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 border-2 border-background animate-pulse" />
                        )}
                        <span className="absolute right-full mr-3 bg-card border border-border text-foreground text-sm font-medium px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Chat with AI ✨
                        </span>
                    </>
                )}
            </button>

            {/* ── Chat Window ── */}
            {isOpen && (
                <div className="fixed bottom-[calc(6rem+3.5rem+0.75rem)] right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-12rem)] rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden animate-scale-in">
                    {/* Header */}
                    <div className="gradient-primary px-5 py-4 flex items-center gap-3 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold text-sm">MarketifyDigiAI</h3>
                            <p className="text-white/70 text-xs flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-400 inline-block" />
                                Online • Replies instantly
                            </p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/60 hover:text-white transition-colors"
                            aria-label="Close chat"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                        {messages.map((msg) => (
                            <div key={msg.id}>
                                <div
                                    className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                        }`}
                                >
                                    {/* Avatar */}
                                    <div
                                        className={`h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "bot"
                                            ? "gradient-primary text-white"
                                            : "bg-muted text-muted-foreground"
                                            }`}
                                    >
                                        {msg.role === "bot" ? (
                                            <Bot className="h-3.5 w-3.5" />
                                        ) : (
                                            <User className="h-3.5 w-3.5" />
                                        )}
                                    </div>

                                    {/* Bubble */}
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === "bot"
                                            ? "bg-muted text-foreground rounded-tl-sm"
                                            : "gradient-primary text-white rounded-tr-sm"
                                            }`}
                                    >
                                        {msg.content.split("\n").map((line, i) => (
                                            <p key={i} className={i > 0 ? "mt-1" : ""}>
                                                {renderText(line)}
                                            </p>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Replies */}
                                {msg.role === "bot" && msg.quickReplies && (
                                    <div className="mt-2.5 ml-9 flex flex-wrap gap-1.5">
                                        {msg.quickReplies.map((qr) => (
                                            <button
                                                key={qr.value}
                                                onClick={() => handleQuickReply(qr)}
                                                className="text-xs font-medium px-3 py-1.5 rounded-full border border-primary/30 text-primary bg-primary/5 hover:bg-primary/15 hover:border-primary/50 transition-all duration-200 active:scale-95"
                                            >
                                                {qr.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isTyping && (
                            <div className="flex gap-2.5">
                                <div className="h-7 w-7 rounded-full gradient-primary text-white flex items-center justify-center flex-shrink-0">
                                    <Bot className="h-3.5 w-3.5" />
                                </div>
                                <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions Bar */}
                    <div className="px-4 py-2 border-t border-border flex gap-2 flex-shrink-0">
                        <a
                            href="tel:+919876543210"
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Phone className="h-3 w-3" /> Call
                        </a>
                        <a
                            href="mailto:hello@marketifydigiai.com"
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Mail className="h-3 w-3" /> Email
                        </a>
                        <a
                            href="/services"
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Globe className="h-3 w-3" /> Services
                        </a>
                        <a
                            href="/contact"
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors ml-auto"
                        >
                            <Zap className="h-3 w-3" /> Get Quote <ArrowRight className="h-3 w-3" />
                        </a>
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-border flex gap-2 flex-shrink-0">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your question..."
                            className="flex-1 h-10 px-4 rounded-full border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className="h-10 w-10 rounded-full gradient-primary text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                            aria-label="Send message"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </form>

                    {/* Powered By */}
                    <div className="px-4 py-1.5 text-center border-t border-border flex-shrink-0">
                        <p className="text-[10px] text-muted-foreground/50">
                            Powered by <span className="font-semibold">MarketifyDigiAI</span>
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
