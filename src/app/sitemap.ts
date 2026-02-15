import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://OrbixDigital.com";

const CASE_STUDY_SLUGS = [
    "growthlab-seo-transformation",
    "brightwave-lead-gen",
    "pixel-pulse-rebrand",
    "finedge-enterprise-pipeline",
    "sunrise-health-video",
    "ecomking-revenue-growth",
];

const BLOG_SLUGS = [
    "lead-scoring-guide",
    "seo-trends-2026",
    "agency-crm-comparison",
    "email-marketing-automation",
    "social-media-roi",
    "scaling-agency-operations",
];

export default function sitemap(): MetadataRoute.Sitemap {
    const staticPages = [
        { url: `${BASE_URL}/`, changeFrequency: "weekly" as const, priority: 1.0 },
        { url: `${BASE_URL}/services`, changeFrequency: "monthly" as const, priority: 0.9 },
        { url: `${BASE_URL}/about`, changeFrequency: "monthly" as const, priority: 0.7 },
        { url: `${BASE_URL}/case-studies`, changeFrequency: "weekly" as const, priority: 0.8 },
        { url: `${BASE_URL}/blog`, changeFrequency: "weekly" as const, priority: 0.8 },
        { url: `${BASE_URL}/contact`, changeFrequency: "monthly" as const, priority: 0.9 },
    ];

    const caseStudies = CASE_STUDY_SLUGS.map((slug) => ({
        url: `${BASE_URL}/case-studies/${slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }));

    const blogPosts = BLOG_SLUGS.map((slug) => ({
        url: `${BASE_URL}/blog/${slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.6,
    }));

    return [...staticPages, ...caseStudies, ...blogPosts];
}
