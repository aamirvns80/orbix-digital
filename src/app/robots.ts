import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://OrbixDigital.com";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/", "/services", "/about", "/case-studies", "/blog", "/contact"],
                disallow: ["/dashboard", "/api", "/login", "/register"],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
