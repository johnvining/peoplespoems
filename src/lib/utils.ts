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
