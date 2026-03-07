import { MetadataRoute } from "next";
import { getPosts } from "@/lib/mdx";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://MarketifyDigiAI.com";

const CASE_STUDY_SLUGS = [
    "growthlab-seo-transformation",
    "brightwave-lead-gen",
    "pixel-pulse-rebrand",
    "finedge-enterprise-pipeline",
    "sunrise-health-video",
    "ecomking-revenue-growth",
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

    const posts = getPosts();
    const blogPosts = posts.map((post) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.metadata.date),
        changeFrequency: "monthly" as const,
        priority: 0.6,
    }));

    return [...staticPages, ...caseStudies, ...blogPosts];
}
