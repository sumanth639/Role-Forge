import React, { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { Copy, Check } from "lucide-react";

/* ----------------------------------------
   Code Block Component (Inline Copy Feedback)
----------------------------------------- */

function CodeComponent({ inline, className, children }: any) {
  const raw = String(children || "");
  const match = /language-(\w+)/.exec(className || "");
  const lang = match?.[1];
  const [copied, setCopied] = useState(false);

  if (inline || !lang) {
    return (
      <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[13px] font-medium text-foreground">
        {children}
      </code>
    );
  }

  const highlighted = useMemo(() => {
    try {
      return hljs.getLanguage(lang)
        ? hljs.highlight(raw, { language: lang }).value
        : hljs.highlightAuto(raw).value;
    } catch {
      return null;
    }
  }, [raw, lang]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6">
      <pre
        className="
          rounded-xl
          border border-border/50
         bg-[#191c22]
          p-1
          overflow-x-auto
          overflow-y-hidden
          text-[13.5px]
          leading-relaxed
          whitespace-pre
          min-w-0
          
        "
      >
        {highlighted ? (
          <code
            className={`hljs language-${lang} bg-[#191c22]`}
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        ) : (
          <code className="text-slate-100">{raw}</code>
        )}
      </pre>

      <button
        onClick={handleCopy}
        className="
          absolute top-3 right-3
          opacity-0 group-hover:opacity-100
          transition-opacity
          rounded-md
          bg-slate-800 hover:bg-slate-700
          text-slate-100
          px-2 py-1
          text-xs
          flex items-center gap-1
        "
      >
        {copied ? (
          <>
            <Check size={12}  />
            Copied
          </>
        ) : (
          <>
            <Copy size={12} />
            Copy Code
          </>
        )}
      </button>
    </div>
  );
}


/* ----------------------------------------
   Markdown Renderer
----------------------------------------- */

export function MarkdownRenderer({
  content,
  isStreaming,
}: {
  content: string;
  isStreaming?: boolean;
}) {
  // Streaming: raw text only
  if (isStreaming) {
    return (
      <pre
        className="
          rounded-lg
          bg-muted
          px-4 py-3
          text-[14px]
          leading-relaxed
          whitespace-pre-wrap
          break-words
          min-w-0
          text-foreground
        "
      >
        {content}
      </pre>
    );
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        /* Headings */
        h1: ({ children }) => (
          <h1 className="mt-10 mb-5 text-xl font-semibold tracking-tight text-foreground">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="mt-10 mb-4 text-lg font-semibold tracking-tight text-foreground">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-8 mb-3 text-base font-semibold text-foreground">
            {children}
          </h3>
        ),

        /* Paragraphs */
        p: ({ children }) => (
          <p className="my-4 text-[15.5px] leading-7 text-foreground">
            {children}
          </p>
        ),

        /* Lists */
        ul: ({ children }) => (
          <ul className="list-disc pl-6 my-5 space-y-2 text-[15.5px] leading-7 text-foreground">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-6 my-5 space-y-2 text-[15.5px] leading-7 text-foreground">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="leading-7">{children}</li>,

        /* Code */
        code: CodeComponent,

        /* Blockquote */
        blockquote: ({ children }) => (
          <blockquote className="my-6 border-l-4 border-primary/40 pl-4 italic text-foreground/90">
            {children}
          </blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
