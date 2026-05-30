import { marked } from 'marked'

/**
 * Renders the context field as inline markdown by default, grouping consecutive
 * lines that start with `>` into a blockquote that breaks onto its own block.
 */
export function renderContext(text: string): string {
  const out: string[] = []
  let inline: string[] = []
  let quote: string[] = []
  const flushInline = () => {
    if (inline.length) { out.push(inline.map((l) => marked.parseInline(l)).join('<br>')); inline = [] }
  }
  const flushQuote = () => {
    if (quote.length) { out.push(`<blockquote>${quote.map((l) => marked.parseInline(l)).join('<br>')}</blockquote>`); quote = [] }
  }
  for (const line of text.split('\n')) {
    const m = /^\s*>\s?(.*)$/.exec(line)
    if (m) { flushInline(); quote.push(m[1]) }
    else { flushQuote(); inline.push(line) }
  }
  flushInline()
  flushQuote()
  return out.join('')
}

/** Returns the first non-empty line of a poem's body. */
export function firstLine(body: string | undefined): string {
  return body?.split('\n').find((l) => l.trim())?.trim() ?? 'Untitled'
}

/** Formats a Sanity date string (YYYY-MM-DD) without timezone shift. */
export function fmtDate(d: string): string {
  return new Date(`${d}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/** Publication label: full date if known, else year, else "n.d.". */
export function pubLabel(poem: { datePublished?: string; yearPublished?: number }): string {
  if (poem.datePublished) return fmtDate(poem.datePublished)
  if (poem.yearPublished) return String(poem.yearPublished)
  return 'n.d.'
}
