"use client";

import Image from "next/image";
import { Star } from "lucide-react";

interface TestimonialCardProps {
    quote: string;
    name: string;
    title: string;
    company: string;
    rating?: number;
    avatar?: string;
}

export function TestimonialCard({
    quote,
    name,
    title,
    company,
    rating = 5,
    avatar,
}: TestimonialCardProps) {
    return (
        <div className="group relative rounded-xl border border-border bg-card p-6 sm:p-8 flex flex-col gap-4 card-hover-lift overflow-hidden">
            {/* Animated quote decoration */}
            <div className="absolute top-3 right-4 text-6xl font-serif text-primary/[0.07] leading-none select-none transition-all duration-500 group-hover:text-primary/[0.15] group-hover:scale-110">
                &ldquo;
            </div>

            {/* Stars */}
            <div className="flex gap-0.5 relative z-10">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        className={`h-4 w-4 ${i < rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-border"
                            }`}
                    />
                ))}
            </div>

            {/* Quote */}
            <blockquote className="text-sm sm:text-base leading-relaxed text-foreground flex-1 relative z-10">
                &ldquo;{quote}&rdquo;
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-3 pt-3 border-t border-border relative z-10">
                <div className="h-11 w-11 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
                    {avatar ? (
                        <Image
                            src={avatar}
                            alt={name}
                            width={44}
                            height={44}
                            className="h-11 w-11 rounded-full object-cover"
                        />
                    ) : (
                        <div className="h-11 w-11 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-semibold">
                            {name.charAt(0)}
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-sm font-semibold">{name}</p>
                    <p className="text-xs text-muted-foreground">
                        {title}, {company}
                    </p>
                </div>
            </div>
        </div>
    );
}
