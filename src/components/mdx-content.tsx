import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';

const components = {
    h1: (props: any) => <h1 className="text-4xl font-extrabold mt-12 mb-6" {...props} />,
    h2: (props: any) => <h2 className="text-3xl font-bold mt-10 mb-5 text-foreground" {...props} />,
    h3: (props: any) => <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground" {...props} />,
    h4: (props: any) => <h4 className="text-xl font-bold mt-6 mb-3 text-foreground" {...props} />,
    p: (props: any) => <p className="text-lg leading-relaxed text-muted-foreground mb-6" {...props} />,
    ul: (props: any) => <ul className="list-disc pl-6 space-y-3 mb-6 text-muted-foreground text-lg" {...props} />,
    ol: (props: any) => <ol className="list-decimal pl-6 space-y-3 mb-6 text-muted-foreground text-lg" {...props} />,
    li: (props: any) => <li className="" {...props} />,
    a: (props: any) => <a className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors" {...props} />,
    blockquote: (props: any) => (
        <blockquote className="border-l-4 border-primary pl-6 italic text-muted-foreground my-8 bg-muted/30 py-4 pr-4 rounded-r-lg" {...props} />
    ),
    img: (props: any) => (
        <div className="relative w-full aspect-[16/9] my-8 rounded-xl overflow-hidden border border-border">
            <Image src={props.src} alt={props.alt || 'Blog image'} fill className="object-cover" />
        </div>
    ),
    code: (props: any) => <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground" {...props} />,
    pre: (props: any) => (
        <pre className="bg-muted p-4 rounded-xl overflow-x-auto mb-6 border border-border p-4 my-6">
            <code className="bg-transparent p-0 text-sm font-mono text-foreground" {...props} />
        </pre>
    ),
};

export function MDXContent({ source }: { source: string }) {
    return (
        <div className="prose prose-lg dark:prose-invert max-w-none">
            <MDXRemote source={source} components={components} />
        </div>
    );
}
