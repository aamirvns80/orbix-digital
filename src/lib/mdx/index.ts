import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { format, parseISO } from 'date-fns';

const contentDir = path.join(process.cwd(), 'src', 'content', 'blog');

export type BlogPostMetadata = {
    title: string;
    excerpt: string;
    date: string;
    author: string;
    category: string;
    image?: string;
    gradient?: string;
    readTime?: string;
    featured?: boolean;
};

export type BlogPost = {
    slug: string;
    metadata: BlogPostMetadata;
    content: string;
};

export function getPosts(): BlogPost[] {
    // Ensure the directory exists
    if (!fs.existsSync(contentDir)) {
        return [];
    }

    const files = fs.readdirSync(contentDir);

    const posts = files
        .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
        .map((file) => {
            const slug = file.replace(/\.mdx?$/, '');
            return getPostBySlug(slug);
        })
        .filter((post): post is BlogPost => post !== null)
        .sort((a, b) => {
            // Sort by date descending
            return new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime();
        });

    return posts;
}

export function getPostBySlug(slug: string): BlogPost | null {
    try {
        let rawContent;

        // Try .mdx first
        const mdxPath = path.join(contentDir, `${slug}.mdx`);
        if (fs.existsSync(mdxPath)) {
            rawContent = fs.readFileSync(mdxPath, 'utf8');
        } else {
            // Fallback to .md
            const mdPath = path.join(contentDir, `${slug}.md`);
            if (fs.existsSync(mdPath)) {
                rawContent = fs.readFileSync(mdPath, 'utf8');
            } else {
                return null;
            }
        }

        const { data, content } = matter(rawContent);

        // Format date if it's an object or unformatted string
        let formattedDate = data.date;
        if (typeof data.date === 'object') {
            formattedDate = format(data.date, 'MMM d, yyyy');
        } else if (typeof data.date === 'string' && data.date.includes('-')) {
            try {
                formattedDate = format(parseISO(data.date), 'MMM d, yyyy');
            } catch (e) {
                // keep raw if parsing fails
            }
        }

        // Default read time estimation
        const wordCount = content.split(/\s+/g).length;
        const readTime = data.readTime || `${Math.ceil(wordCount / 200)} min read`;

        return {
            slug,
            metadata: {
                title: data.title || 'Untitled',
                excerpt: data.excerpt || '',
                date: formattedDate || 'Unknown Date',
                author: data.author || 'MarketifyDigiAI Team',
                category: data.category || 'General',
                image: data.image,
                gradient: data.gradient || 'from-blue-500 to-cyan-400',
                readTime,
                featured: data.featured === true,
            },
            content,
        };
    } catch (error) {
        console.error(`Error reading blog post: ${slug}`, error);
        return null;
    }
}
