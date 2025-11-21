import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        h1: ({ children }) => (
            <h1 className="text-4xl font-bold mt-8 mb-4 text-foreground">{children}</h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-3xl font-semibold mt-6 mb-3 text-foreground border-b pb-2">{children}</h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-2xl font-semibold mt-4 mb-2 text-foreground">{children}</h3>
        ),
        h4: ({ children }) => (
            <h4 className="text-xl font-semibold mt-3 mb-2 text-foreground">{children}</h4>
        ),
        p: ({ children }) => (
            <p className="mb-4 text-muted-foreground leading-7">{children}</p>
        ),
        ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-2 text-muted-foreground">{children}</ul>
        ),
        ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2 text-muted-foreground">{children}</ol>
        ),
        li: ({ children }) => (
            <li className="ml-4">{children}</li>
        ),
        code: ({ children }) => (
            <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">{children}</code>
        ),
        pre: ({ children }) => (
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 border">
                {children}
            </pre>
        ),
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
                {children}
            </blockquote>
        ),
        a: ({ href, children }) => (
            <a href={href} className="text-primary hover:underline font-medium">
                {children}
            </a>
        ),
        table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
                <table className="min-w-full border-collapse border border-border">
                    {children}
                </table>
            </div>
        ),
        th: ({ children }) => (
            <th className="border border-border bg-muted px-4 py-2 text-left font-semibold">
                {children}
            </th>
        ),
        td: ({ children }) => (
            <td className="border border-border px-4 py-2">{children}</td>
        ),
        hr: () => <hr className="my-8 border-border" />,
        ...components,
    }
}
