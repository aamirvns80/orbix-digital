import Link from "next/link";
import Image from "next/image";
import { ArrowRight, type LucideIcon } from "lucide-react";

interface ServiceCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    features: string[];
    price?: string;
    href?: string;
    color?: string;
    bgColor?: string;
    image?: string;
}

export function ServiceCard({
    icon: Icon,
    title,
    description,
    features,
    price,
    href = "/contact",
    color = "text-primary",
    bgColor = "bg-primary/10",
    image,
}: ServiceCardProps) {
    return (
        <div className="group rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1">
            {image && (
                <div className="relative h-48 w-full overflow-hidden bg-muted/50">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                </div>
            )}
            <div className="p-6 sm:p-8">
                <div className={`h-12 w-12 rounded-xl ${bgColor} flex items-center justify-center mb-5`}>
                    <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {description}
                </p>
                <ul className="space-y-2 mb-6">
                    {features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                            <span className={`mt-1 h-1.5 w-1.5 rounded-full ${bgColor} flex-shrink-0`} />
                            <span className="text-muted-foreground">{f}</span>
                        </li>
                    ))}
                </ul>
                <div className="flex flex-col items-start gap-3 mt-auto pt-4 border-t border-border/50">
                    <Link
                        href={href}
                        className={`inline-flex items-center gap-2 text-sm font-semibold ${color} hover:gap-3 transition-all`}
                    >
                        View Details <ArrowRight className="h-4 w-4" />
                    </Link>
                    {price && (
                        <p className="text-sm text-muted-foreground">
                            <span className="opacity-70">From</span> <span className={`font-semibold ${color}`}>{price.replace("Starts at ", "")}</span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
