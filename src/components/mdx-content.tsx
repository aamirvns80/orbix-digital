import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';

const components = {
    h1: (props: any) => <h1 className="text-3xl md:text-4xl font-extrabold mt-8 md:mt-12 mb-4 md:mb-6 leading-tight break-words" {...props} />,
    h2: (props: any) => <h2 className="text-2xl md:text-3xl font-bold mt-8 md:mt-10 mb-4 md:mb-5 text-foreground leading-snug break-words" {...props} />,
    h3: (props: any) => <h3 className="text-xl md:text-2xl font-bold mt-6 md:mt-8 mb-3 md:mb-4 text-foreground leading-snug break-words" {...props} />,
    h4: (props: any) => <h4 className="text-lg md:text-xl font-bold mt-4 md:mt-6 mb-2 md:mb-3 text-foreground break-words" {...props} />,
    p: (props: any) => <p className="text-base md:text-lg leading-relaxed text-muted-foreground mb-6 break-words" {...props} />,
    ul: (props: any) => <ul className="list-disc pl-5 md:pl-6 space-y-2 md:space-y-3 mb-6 text-muted-foreground text-base md:text-lg break-words" {...props} />,
    ol: (props: any) => <ol className="list-decimal pl-5 md:pl-6 space-y-2 md:space-y-3 mb-6 text-muted-foreground text-base md:text-lg break-words" {...props} />,
    li: (props: any) => <li className="pl-1" {...props} />,
    a: (props: any) => <a className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors break-words" {...props} />,
    blockquote: (props: any) => (
        <blockquote className="border-l-4 border-primary pl-4 md:pl-6 italic text-muted-foreground my-6 md:my-8 bg-muted/30 py-3 md:py-4 pr-3 md:pr-4 rounded-r-lg break-words text-base md:text-lg" {...props} />
    ),
    img: (props: any) => (
        <div className="relative w-full aspect-[16/9] my-6 md:my-8 rounded-xl overflow-hidden border border-border">
            <Image src={props.src} alt={props.alt || 'Blog image'} fill className="object-cover" />
        </div>
    ),
    code: (props: any) => <code className="bg-muted px-1.5 py-0.5 rounded text-xs md:text-sm font-mono text-foreground break-words" {...props} />,
    pre: (props: any) => (
        <pre className="bg-muted p-3 md:p-4 rounded-xl overflow-x-auto mb-6 border border-border my-6">
            <code className="bg-transparent p-0 text-xs md:text-sm font-mono text-foreground" {...props} />
        </pre>
    ),
};

export function MDXContent({ source }: { source: string }) {
    return (
        <div className="prose sm:prose-lg dark:prose-invert max-w-full w-full break-words">
            <MDXRemote source={source} components={components} />
        </div>
    );
}
