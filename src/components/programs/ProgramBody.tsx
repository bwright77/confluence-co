import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ProgramBodyProps {
  body: string
}

export default function ProgramBody({ body }: ProgramBodyProps) {
  return (
    <div className="program-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ node: _node, ...props }) => (
            <h2
              className="heading-section mt-10 text-2xl text-cc-navy md:text-3xl first:mt-0"
              {...props}
            />
          ),
          h3: ({ node: _node, ...props }) => (
            <h3
              className="mt-8 font-display text-xl font-semibold text-cc-navy"
              {...props}
            />
          ),
          p: ({ node: _node, ...props }) => (
            <p className="mt-4 font-body text-base leading-relaxed text-cc-dark" {...props} />
          ),
          ul: ({ node: _node, ...props }) => (
            <ul className="mt-4 list-disc space-y-2 pl-6 font-body text-cc-dark" {...props} />
          ),
          ol: ({ node: _node, ...props }) => (
            <ol className="mt-4 list-decimal space-y-2 pl-6 font-body text-cc-dark" {...props} />
          ),
          li: ({ node: _node, ...props }) => (
            <li className="leading-relaxed" {...props} />
          ),
          a: ({ node: _node, ...props }) => (
            <a
              className="text-cc-sky underline underline-offset-2 hover:text-cc-navy"
              target={props.href?.startsWith('http') ? '_blank' : undefined}
              rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              {...props}
            />
          ),
          strong: ({ node: _node, ...props }) => (
            <strong className="font-semibold text-cc-navy" {...props} />
          ),
          em: ({ node: _node, ...props }) => <em className="italic" {...props} />,
          blockquote: ({ node: _node, ...props }) => (
            <blockquote
              className="my-6 border-l-4 border-cc-sky bg-cc-warm py-3 pl-5 pr-4 font-accent italic text-cc-dark"
              {...props}
            />
          ),
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  )
}
