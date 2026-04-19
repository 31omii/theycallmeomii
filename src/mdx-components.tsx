import React, { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { highlight } from "sugar-high";

type HeadingProps = ComponentPropsWithoutRef<"h1">;
type ParagraphProps = ComponentPropsWithoutRef<"p">;
type ListProps = ComponentPropsWithoutRef<"ul">;
type ListItemProps = ComponentPropsWithoutRef<"li">;
type AnchorProps = ComponentPropsWithoutRef<"a">;
type BlockquoteProps = ComponentPropsWithoutRef<"blockquote">;

export const components = {
  h1: (props: HeadingProps) => (
    <h1 className="font-medium pt-12 mb-0 text-white" {...props} />
  ),
  h2: (props: HeadingProps) => (
    <h2 className="text-zinc-100 text-xl font-medium pb-2 mt-8 mb-3 border-b border-zinc-800 w-fit" {...props} />
  ),
  h3: (props: HeadingProps) => (
    <h3 className="text-zinc-200 font-medium mt-8 mb-3" {...props} />
  ),
  h4: (props: HeadingProps) => (
    <h4 className="font-medium text-zinc-200" {...props} />
  ),
  p: (props: ParagraphProps) => (
    <p className="text-zinc-300 leading-relaxed" {...props} />
  ),
  ol: (props: ListProps) => (
    <ol className="text-zinc-400 list-decimal ml-5 space-y-2 my-4" {...props} />
  ),
  ul: (props: ListProps) => (
    <ul className="text-zinc-400 list-disc ml-5 space-y-2 my-4" {...props} />
  ),
  li: (props: ListItemProps) => (
    <li className="leading-7 text-zinc-300" {...props} />
  ),
  em: (props: ComponentPropsWithoutRef<"em">) => (
    <em className="font-medium" {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-medium text-zinc-200" {...props} />
  ),
  a: ({ href, children, ...props }: AnchorProps) => {
    const className = "text-zinc-300 hover:text-white underline underline-offset-2 transition-colors";
    if (href?.startsWith("/")) {
      return <Link href={href} className={className} {...props}>{children}</Link>;
    }
    if (href?.startsWith("#")) {
      return <a href={href} className={className} {...props}>{children}</a>;
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...props}>
        {children}
      </a>
    );
  },
  code: ({ children, ...props }: ComponentPropsWithoutRef<"code">) => {
    const codeHTML = highlight(children as string);
    return (
      <code
        className="border border-zinc-800 bg-zinc-900 px-2 py-0.5 rounded text-sm font-mono text-zinc-300"
        dangerouslySetInnerHTML={{ __html: codeHTML }}
        {...props}
      />
    );
  },
  pre: ({ children, ...props }: ComponentPropsWithoutRef<"pre">) => (
    <pre className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg overflow-x-auto text-sm font-mono text-zinc-300 my-4" {...props}>
      {children}
    </pre>
  ),
  table: ({ children, ...props }: ComponentPropsWithoutRef<"table">) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse border border-zinc-800 text-zinc-400" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: ComponentPropsWithoutRef<"thead">) => (
    <thead className="bg-zinc-900" {...props}>{children}</thead>
  ),
  tbody: ({ children, ...props }: ComponentPropsWithoutRef<"tbody">) => (
    <tbody {...props}>{children}</tbody>
  ),
  tr: ({ children, ...props }: ComponentPropsWithoutRef<"tr">) => (
    <tr className="border-b border-zinc-800" {...props}>{children}</tr>
  ),
  th: ({ children, ...props }: ComponentPropsWithoutRef<"th">) => (
    <th className="border border-zinc-800 px-4 py-3 text-left font-medium text-zinc-200" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: ComponentPropsWithoutRef<"td">) => (
    <td className="border border-zinc-800 px-4 py-3" {...props}>{children}</td>
  ),
  hr: ({ ...props }: ComponentPropsWithoutRef<"hr">) => (
    <hr className="my-8 border-zinc-800" {...props} />
  ),
  blockquote: (props: BlockquoteProps) => (
    <blockquote className="border-l-2 border-zinc-700 pl-4 text-zinc-500 italic my-4" {...props} />
  ),
};

declare global {
  type MDXProvidedComponents = typeof components;
}

export function useMDXComponents(): MDXProvidedComponents {
  return components;
}