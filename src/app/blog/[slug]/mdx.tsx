import React, { ComponentPropsWithoutRef } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { components } from "@/mdx-components";

const Mdx = ({ content }: { content: string }) => {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <MDXRemote
        source={content}
        components={{
          ...components,
          h2: (props: ComponentPropsWithoutRef<"h1">) => (
            <h2
              className="text-zinc-100 text-xl font-medium pb-2 mt-8 mb-3"
              {...props}
            />
          ),
          code: (props: ComponentPropsWithoutRef<"code">) => (
            <code
              className="border border-zinc-800 px-2 py-1 rounded text-sm font-mono text-zinc-300"
              {...props}
            />
          ),
          pre: ({ children, ...props }: ComponentPropsWithoutRef<"pre">) => (
            <pre
              className="bg-zinc-900 border border-zinc-800 p-4 rounded-sm overflow-x-auto text-sm font-mono text-zinc-300 my-4"
              {...props}
            >
              {children}
            </pre>
          ),
          ul: (props: ComponentPropsWithoutRef<"ul">) => (
            <ul className="list-disc ml-5 space-y-2 my-4" {...props} />
          ),
          li: (props: ComponentPropsWithoutRef<"li">) => (
            <li className="leading-7 text-zinc-400" {...props} />
          ),
        }}
      />
    </div>
  );
};

export default Mdx;