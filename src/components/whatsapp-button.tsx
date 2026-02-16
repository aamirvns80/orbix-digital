"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
    return (
        <a
            href="https://wa.me/91860456223?text=Hi%20OrbixDigital!%20I%27m%20interested%20in%20your%20services."
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        >
            <MessageCircle className="h-7 w-7 group-hover:scale-110 transition-transform" />
            <span className="absolute right-full mr-3 bg-card border border-border text-foreground text-sm font-medium px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Chat with us!
            </span>
        </a>
    );
}
