'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal, ExternalLink } from 'lucide-react';
import { cn } from '@/utils/helpers';
import toast from 'react-hot-toast';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(idx);
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  // 1. Split content by code blocks: ```[lang]\n[code]\n```
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n?([\s\S]*?)```/g;
  const blocks: Array<{ type: 'code' | 'markdown'; lang?: string; text: string }> = [];

  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      blocks.push({
        type: 'markdown',
        text: content.substring(lastIndex, match.index),
      });
    }

    blocks.push({
      type: 'code',
      lang: match[1] || 'text',
      text: match[2].trim(),
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    blocks.push({
      type: 'markdown',
      text: content.substring(lastIndex),
    });
  }

  return (
    <div className={cn('space-y-2.5 text-xs sm:text-sm leading-relaxed text-gray-800 dark:text-gray-200', className)}>
      {blocks.map((block, bIdx) => {
        if (block.type === 'code') {
          return (
            <div
              key={`code-${bIdx}`}
              className="my-3 rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 shadow-md overflow-hidden font-mono"
            >
              {/* Code header bar */}
              <div className="flex items-center justify-between px-3.5 py-2 bg-slate-950/80 border-b border-slate-800 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5 font-semibold text-purple-400 uppercase tracking-wider">
                  <Terminal size={13} />
                  <span>{block.lang || 'CHART / TEXT'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode(block.text, bIdx)}
                  className="flex items-center gap-1 hover:text-white transition-colors px-2 py-0.5 rounded-md hover:bg-slate-800"
                  title="Copy text"
                >
                  {copiedCodeIdx === bIdx ? (
                    <>
                      <Check size={12} className="text-emerald-400" />
                      <span className="text-emerald-400 font-semibold text-[10px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span className="text-[10px]">Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code content */}
              <div className="p-3 sm:p-4 overflow-x-auto touch-scroll">
                <pre className="font-mono text-[11px] sm:text-xs leading-relaxed text-emerald-300 dark:text-emerald-400 whitespace-pre">
                  {block.text}
                </pre>
              </div>
            </div>
          );
        }

        // Render Markdown block lines
        return <div key={`md-${bIdx}`}>{renderMarkdownLines(block.text)}</div>;
      })}
    </div>
  );
}

// Line-by-line parser for standard markdown elements
function renderMarkdownLines(rawText: string) {
  const lines = rawText.split('\n');
  const elements: React.ReactNode[] = [];
  let tableRows: string[] = [];

  const flushTable = () => {
    if (tableRows.length > 0) {
      elements.push(renderTable(tableRows, elements.length));
      tableRows = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check for table lines
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      tableRows.push(trimmed);
      continue;
    } else {
      flushTable();
    }

    if (!trimmed) {
      elements.push(<div key={`spacer-${i}`} className="h-1" />);
      continue;
    }

    // Horizontal Rule
    if (trimmed === '***' || trimmed === '---' || trimmed === '___') {
      elements.push(<hr key={`hr-${i}`} className="my-2.5 border-gray-200 dark:border-slate-700" />);
      continue;
    }

    // Headers
    if (trimmed.startsWith('# ')) {
      elements.push(
        <h3 key={`h1-${i}`} className="text-base sm:text-lg font-extrabold text-purple-700 dark:text-purple-300 pt-2 pb-1 border-b border-purple-100 dark:border-purple-900/50">
          {renderInline(trimmed.replace(/^#\s+/, ''))}
        </h3>
      );
      continue;
    }
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h4 key={`h2-${i}`} className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 pt-2 pb-0.5">
          {renderInline(trimmed.replace(/^##\s+/, ''))}
        </h4>
      );
      continue;
    }
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h5 key={`h3-${i}`} className="text-xs sm:text-sm font-bold text-purple-700 dark:text-purple-300 pt-1.5">
          {renderInline(trimmed.replace(/^###\s+/, ''))}
        </h5>
      );
      continue;
    }
    if (trimmed.startsWith('#### ')) {
      elements.push(
        <h6 key={`h4-${i}`} className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 pt-1.5 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400 flex-shrink-0" />
          <span>{renderInline(trimmed.replace(/^####\s+/, ''))}</span>
        </h6>
      );
      continue;
    }
    if (trimmed.startsWith('##### ')) {
      elements.push(
        <p key={`h5-${i}`} className="text-xs font-bold text-gray-800 dark:text-gray-200 pt-1">
          {renderInline(trimmed.replace(/^#####\s+/, ''))}
        </p>
      );
      continue;
    }

    // Standalone major title line like **Vidyalaya School Overview Report**
    if (/^\*\*([^*]+)\*\*$/.test(trimmed)) {
      const titleMatch = trimmed.match(/^\*\*([^*]+)\*\*$/);
      if (titleMatch) {
        elements.push(
          <div key={`title-${i}`} className="text-sm sm:text-base font-extrabold text-purple-700 dark:text-purple-300 pt-1 pb-0.5">
            {titleMatch[1]}
          </div>
        );
        continue;
      }
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      elements.push(
        <div
          key={`quote-${i}`}
          className="border-l-4 border-purple-500 bg-purple-50/60 dark:bg-purple-950/40 p-2.5 rounded-r-xl italic text-xs my-2 text-purple-950 dark:text-purple-200"
        >
          {renderInline(trimmed.replace(/^>\s+/, ''))}
        </div>
      );
      continue;
    }

    // Bullet points: • or - or *
    if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const bulletContent = trimmed.replace(/^[•\-*]\s+/, '');
      elements.push(
        <div key={`bullet-${i}`} className="flex items-start gap-2 pl-2 my-1">
          <span className="text-purple-600 dark:text-purple-400 font-bold text-xs mt-0.5 flex-shrink-0">•</span>
          <div className="flex-1 leading-relaxed">{renderInline(bulletContent)}</div>
        </div>
      );
      continue;
    }

    // Numbered list: 1. 2. etc
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      elements.push(
        <div key={`num-${i}`} className="flex items-start gap-2 pl-2 my-1">
          <span className="text-purple-600 dark:text-purple-400 font-bold text-xs mt-0.5 flex-shrink-0">
            {numMatch[1]}.
          </span>
          <div className="flex-1 leading-relaxed">{renderInline(numMatch[2])}</div>
        </div>
      );
      continue;
    }

    // Standard paragraph
    elements.push(
      <p key={`p-${i}`} className="leading-relaxed">
        {renderInline(line)}
      </p>
    );
  }

  flushTable();
  return elements;
}

// Markdown Table Parser
function renderTable(rows: string[], keyIdx: number) {
  if (rows.length < 2) return null;

  // Split cells
  const parseRow = (r: string) =>
    r
      .split('|')
      .slice(1, -1)
      .map((c) => c.trim());

  const headers = parseRow(rows[0]);
  const isSeparator = rows[1].includes('---');
  const bodyRows = isSeparator ? rows.slice(2) : rows.slice(1);

  return (
    <div key={`table-${keyIdx}`} className="my-3 overflow-x-auto rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-purple-50 dark:bg-purple-950/50 text-purple-900 dark:text-purple-200 font-bold border-b border-gray-200 dark:border-slate-700">
          <tr>
            {headers.map((h, hIdx) => (
              <th key={hIdx} className="px-3.5 py-2.5">
                {renderInline(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
          {bodyRows.map((r, rIdx) => {
            const cells = parseRow(r);
            return (
              <tr key={rIdx} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/60 transition-colors">
                {cells.map((c, cIdx) => (
                  <td key={cIdx} className="px-3.5 py-2 text-gray-700 dark:text-gray-300">
                    {renderInline(c)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Inline Formatter for **bold**, *italic*, `code`, and [link](url)
function renderInline(text: string): React.ReactNode {
  // Regex to match: **bold**, *italic*, `code`, [text](url)
  const tokenRegex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, idx) => {
    if (!part) return null;

    // Bold: **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={idx} className="font-bold text-gray-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic: *text*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <em key={idx} className="italic text-gray-800 dark:text-gray-300">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Inline Code: `text`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-mono text-[11px] border border-purple-200/60 dark:border-purple-800/60 font-semibold"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Markdown link: [text](url)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return (
        <a
          key={idx}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 dark:text-purple-400 font-semibold hover:underline inline-flex items-center gap-0.5"
        >
          <span>{linkMatch[1]}</span>
          <ExternalLink size={10} />
        </a>
      );
    }

    return part;
  });
}
