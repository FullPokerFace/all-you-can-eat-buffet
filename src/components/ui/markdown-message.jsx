import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function MarkdownMessage({ content, className = "" }) {
  return (
    <div className={className}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Paragraphs with proper spacing for chat context
          p: ({ children }) => (
            <p className="mb-2 last:mb-0 leading-relaxed">
              {children}
            </p>
          ),
          
          // Strong and emphasis styling
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">
              {children}
            </strong>
          ),
          
          em: ({ children }) => (
            <em className="italic text-gray-700">
              {children}
            </em>
          ),
          
          // Inline code styling
          code: ({ node, inline, children, ...props }) =>
            inline ? (
              <code
                className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            ) : (
              <code
                className="block bg-gray-50 text-gray-800 p-3 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed"
                {...props}
              >
                {children}
              </code>
            ),
          
          // Code blocks
          pre: ({ children }) => (
            <pre className="bg-gray-50 border border-gray-200 p-3 rounded-lg overflow-x-auto text-sm mb-3">
              {children}
            </pre>
          ),
          
          // Lists with proper spacing
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-3 space-y-1 pl-2">
              {children}
            </ul>
          ),
          
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-3 space-y-1 pl-2">
              {children}
            </ol>
          ),
          
          li: ({ children }) => (
            <li className="text-sm leading-relaxed">
              {children}
            </li>
          ),
          
          // Blockquotes for Warren Buffett wisdom
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-200 pl-4 italic text-gray-600 mb-3 bg-blue-50/30 py-2 rounded-r">
              {children}
            </blockquote>
          ),
          
          // Tables for financial data
          table: ({ children }) => (
            <div className="overflow-x-auto mb-3">
              <table className="min-w-full border-collapse border border-gray-200 text-xs">
                {children}
              </table>
            </div>
          ),
          
          thead: ({ children }) => (
            <thead className="bg-gray-50">
              {children}
            </thead>
          ),
          
          th: ({ children }) => (
            <th className="border border-gray-200 px-2 py-1 text-left font-semibold text-gray-700">
              {children}
            </th>
          ),
          
          td: ({ children }) => (
            <td className="border border-gray-200 px-2 py-1 text-gray-600">
              {children}
            </td>
          ),
          
          // Safe external links
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-600 hover:text-blue-800 underline transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          
          // Headings sized appropriately for chat
          h1: ({ children }) => (
            <h1 className="text-lg font-bold text-gray-900 mb-2 mt-1">
              {children}
            </h1>
          ),
          
          h2: ({ children }) => (
            <h2 className="text-base font-bold text-gray-900 mb-2 mt-1">
              {children}
            </h2>
          ),
          
          h3: ({ children }) => (
            <h3 className="text-sm font-bold text-gray-900 mb-1 mt-1">
              {children}
            </h3>
          ),
          
          // Horizontal rules
          hr: () => (
            <hr className="border-gray-200 my-3" />
          ),
          
          // Strikethrough text
          del: ({ children }) => (
            <del className="line-through text-gray-500">
              {children}
            </del>
          ),
          
          // Task lists
          input: ({ type, checked, ...props }) => (
            type === 'checkbox' ? (
              <input
                type="checkbox"
                checked={checked}
                disabled
                className="mr-2 rounded"
                {...props}
              />
            ) : (
              <input {...props} />
            )
          )
        }}
      >
        {content}
      </Markdown>
    </div>
  )
}