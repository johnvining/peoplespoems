/** Returns the first non-empty line of a poem's body. */
export function firstLine(body: string | undefined): string {
  return body?.split('\n').find((l) => l.trim())?.trim() ?? 'Untitled'
}
