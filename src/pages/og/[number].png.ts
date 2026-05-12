import type { APIRoute } from 'astro'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { list, put } from '@vercel/blob'
import { safeFetch } from '../../lib/sanity'
import type { Poem } from '../../lib/sanity'
import { firstLine } from '../../lib/utils'

// Bump when rendering logic changes to invalidate all cached PNGs.
const RENDER_VERSION = 'v1'
const BLOB_PREFIX = 'og/'
const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN

type CachedPoem = Pick<Poem, 'number' | 'title' | 'author' | 'body' | 'source' | 'yearPublished' | 'sourceNotItalic'>

function contentHash(poem: CachedPoem): string {
  const h = createHash('sha1')
  h.update(RENDER_VERSION); h.update('\0')
  h.update(poem.title ?? ''); h.update('\0')
  h.update(poem.author ?? ''); h.update('\0')
  h.update(poem.body ?? ''); h.update('\0')
  h.update(poem.source ?? ''); h.update('\0')
  h.update(String(poem.yearPublished ?? '')); h.update('\0')
  h.update(String(poem.sourceNotItalic ?? ''))
  return h.digest('hex').slice(0, 10)
}

// Lazy-loaded index of existing blob pathnames → URLs. Walked once per build.
let blobIndexPromise: Promise<Map<string, string>> | null = null
function getBlobIndex(): Promise<Map<string, string>> {
  if (blobIndexPromise) return blobIndexPromise
  blobIndexPromise = (async () => {
    const index = new Map<string, string>()
    if (!hasBlobToken) return index
    let cursor: string | undefined
    do {
      const r = await list({ prefix: BLOB_PREFIX, cursor, limit: 1000 })
      for (const b of r.blobs) index.set(b.pathname, b.url)
      cursor = r.cursor
    } while (cursor)
    return index
  })()
  return blobIndexPromise
}

const fontRegular = readFileSync(
  new URL('../../../node_modules/@fontsource/playfair-display/files/playfair-display-latin-400-normal.woff', import.meta.url)
)
const fontItalic = readFileSync(
  new URL('../../../node_modules/@fontsource/playfair-display/files/playfair-display-latin-400-italic.woff', import.meta.url)
)

// 2x canvas for retina sharpness
const W = 2400
const H = 1260
const S = 2

const BG   = '#f5f0e8'
const INK  = '#1a1a1a'
const DIM  = '#aaa'
const RULE = '#d8d0c0'

const PAD     = 64 * S               // 128px padding each side
const AVAIL_W = W - PAD * 2          // 2144px
const COL_GAP = 48 * S               // 96px between columns
// Conservative estimate of height consumed by header, source, rule, footer
const FIXED_H = 320
const AVAIL_H = H - PAD * 2 - FIXED_H  // ~620px for poem body

export async function getStaticPaths() {
  const poems = await safeFetch<Pick<Poem, 'number'>>(`
    *[_type == "poem" && defined(slug.current)] { number }
  `)
  return poems.map(p => ({ params: { number: String(p.number).padStart(5, '0') } }))
}

export const GET: APIRoute = async ({ params }) => {
  const { number } = params as { number: string }

  const poems = await safeFetch<Pick<Poem, 'number' | 'title' | 'author' | 'body' | 'source' | 'yearPublished' | 'sourceNotItalic'>>(`
    *[_type == "poem" && defined(slug.current)] { number, title, author, body, source, yearPublished, sourceNotItalic }
  `)
  const poem = poems.find(p => String(p.number).padStart(5, '0') === number)
  if (!poem) return new Response('Not found', { status: 404 })

  const cacheKey = `${BLOB_PREFIX}${number}-${contentHash(poem)}.png`
  const pngHeaders = { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' }

  if (hasBlobToken) {
    const index = await getBlobIndex()
    const cachedUrl = index.get(cacheKey)
    if (cachedUrl) {
      const res = await fetch(cachedUrl)
      if (res.ok) {
        const bytes = new Uint8Array(await res.arrayBuffer())
        return new Response(bytes, { headers: pngHeaders })
      }
    }
  }

  const rawLines = poem.body.split('\n')
  const start   = rawLines.findIndex(l => l.trim())
  const end     = rawLines.length - 1 - [...rawLines].reverse().findIndex(l => l.trim())
  const lines   = rawLines.slice(start, end + 1)

  function d(children: unknown, style: Record<string, unknown>) {
    return { type: 'div', props: { style: { display: 'flex', ...style }, children } }
  }
  function txt(content: string, fontStyle: 'normal' | 'italic', size: number, color: string) {
    return d(content, { fontFamily: 'Playfair Display', fontStyle, fontSize: size * S, color })
  }

  function makeLineEls(lns: string[], fontSize: number, lineHeight: number, maxChars: number) {
    return lns.map(l => {
      if (!l.trim()) return d('', { height: fontSize * S * 0.65 })
      const leading = l.match(/^(\s+)/)?.[1].length ?? 0
      const content = l.trimStart().length > maxChars ? l.trimStart().slice(0, maxChars - 1) + '...' : l.trimStart()
      return d(content, {
        fontFamily:  'Playfair Display',
        fontStyle:   'normal',
        fontSize:    fontSize * S,
        color:       INK,
        lineHeight,
        paddingLeft: leading * fontSize * S * 0.32,
      })
    })
  }

  // Layout helpers
  function colWidthPx(nCols: number): number {
    return (AVAIL_W - (nCols - 1) * COL_GAP) / nCols
  }

  // Approximate max readable chars per column given column width and font size.
  // Playfair Display averages ~0.52em per character.
  function approxMaxChars(nCols: number, fontSize: number): number {
    return Math.floor(colWidthPx(nCols) / (fontSize * S * 0.52))
  }

  function colHeightPx(col: string[], fontSize: number): number {
    const lh    = fontSize * S * 1.65
    const blankH = fontSize * S * 0.65
    return col.reduce((h, l) => h + (l.trim() ? lh : blankH), 0)
  }

  // Split lines into N columns greedily: fill each column with as many complete
  // stanzas as fit within AVAIL_H before moving to the next column. Falls back to
  // any-line splits when there aren't enough stanza breaks to fill the columns.
  function splitIntoN(lns: string[], n: number, fs: number): string[][] {
    if (n === 1) return [lns]
    const stanzaStarts: number[] = []
    for (let i = 1; i < lns.length; i++) {
      if (!lns[i - 1].trim() && lns[i].trim()) stanzaStarts.push(i)
    }
    const candidates = stanzaStarts.length >= n - 1
      ? stanzaStarts
      : Array.from({ length: lns.length - 1 }, (_, i) => i + 1)
    const result: string[][] = []
    let prev = 0
    for (let c = 0; c < n - 1; c++) {
      const colsLeft = n - c - 1
      const splits = candidates.filter(s => s > prev)
      const usable = splits.slice(0, Math.max(1, splits.length - colsLeft + 1))
      // Greedy: advance as long as the column fits
      let split = usable[0] ?? lns.length
      for (const s of usable) {
        if (colHeightPx(lns.slice(prev, s), fs) <= AVAIL_H) split = s
        else break
      }
      result.push(lns.slice(prev, split))
      prev = split
    }
    result.push(lns.slice(prev))
    return result
  }

  // Pick the largest font size and fewest columns that fit the whole poem.
  // Try 3 columns only when lines are short enough to be readable at that width.
  const maxLineLen = Math.max(0, ...lines.map(l => l.trimStart().length))
  const FONT_SIZES = [27, 22, 18, 16, 14, 13, 12]

  let chosen: { nCols: number; fontSize: number; maxChars: number; cols: string[][] } | null = null

  outer:
  for (const fontSize of FONT_SIZES) {
    for (const nCols of [1, 2, 3]) {
      const mc = approxMaxChars(nCols, fontSize)
      // Skip 3-col when lines would be too cramped
      if (nCols === 3 && maxLineLen > mc + 5) continue
      const cols = splitIntoN(lines, nCols, fontSize)
      const maxH = Math.max(...cols.map(c => colHeightPx(c, fontSize)))
      if (maxH <= AVAIL_H) {
        chosen = { nCols, fontSize, maxChars: mc, cols }
        break outer
      }
    }
  }

  // Absolute fallback: smallest font, 3 columns
  if (!chosen) {
    const fontSize = FONT_SIZES[FONT_SIZES.length - 1]
    const cols = splitIntoN(lines, 3, fontSize)
    chosen = { nCols: 3, fontSize, maxChars: approxMaxChars(3, fontSize), cols }
  }

  const { nCols, fontSize, maxChars, cols } = chosen
  const lineHeight = 1.65

  // Hard-cap each column to what fits in AVAIL_H. Lines beyond this are dropped
  // rather than overflowing — extreme overflow has crashed Resvg's geometry pass.
  const lh = fontSize * S * lineHeight
  const blankH = fontSize * S * 0.65
  const clippedCols = cols.map(col => {
    const out: string[] = []
    let h = 0
    for (const l of col) {
      const add = l.trim() ? lh : blankH
      if (h + add > AVAIL_H) break
      out.push(l)
      h += add
    }
    return out
  })

  let poemSection: unknown

  if (nCols === 1) {
    poemSection = d(
      makeLineEls(clippedCols[0], fontSize, lineHeight, maxChars),
      { flexDirection: 'column', flexGrow: 1, minHeight: 0, justifyContent: 'center', overflow: 'hidden' }
    )
  } else {
    const rowChildren: unknown[] = []
    for (let i = 0; i < clippedCols.length; i++) {
      rowChildren.push(
        d(makeLineEls(clippedCols[i], fontSize, lineHeight, maxChars),
          { flexDirection: 'column', flexGrow: 1, minHeight: 0, overflow: 'hidden' })
      )
      if (i < clippedCols.length - 1) rowChildren.push(d('', { width: COL_GAP }))
    }
    poemSection = d(rowChildren,
      { flexDirection: 'row', flexGrow: 1, minHeight: 0, overflow: 'hidden' })
  }

  const title = poem.title ?? null
  const ldquo = '"'
  const rdquo = '"'
  const titleDisplay = title
    ? txt(ldquo + title + rdquo, 'normal', 22, INK)
    : txt('[' + firstLine(poem.body) + ']', 'normal', 22, '#888')

  const headerParts: unknown[] = []
  if (poem.author) headerParts.push(txt(poem.author + ',', 'normal', 22, INK))
  if (poem.author) headerParts.push(d('', { width: 6 * S }))
  headerParts.push(titleDisplay)

  const sourceParts: unknown[] = []
  if (poem.source) sourceParts.push(txt(poem.source, poem.sourceNotItalic ? 'normal' : 'italic', 16, DIM))
  if (poem.yearPublished) {
    if (poem.source) { sourceParts.push(txt(',', 'normal', 16, DIM)); sourceParts.push(d('', { width: 4 * S })) }
    sourceParts.push(txt(String(poem.yearPublished), 'normal', 16, DIM))
  }

  const card = d([
    ...(headerParts.length ? [d(headerParts, { flexDirection: 'row', alignItems: 'baseline', marginBottom: sourceParts.length ? 6 * S : 32 * S })] : []),
    ...(sourceParts.length ? [d(sourceParts, { flexDirection: 'row', alignItems: 'baseline', marginBottom: 32 * S })] : []),

    poemSection,

    d('', { height: S, backgroundColor: RULE, marginTop: 20 * S, marginBottom: 12 * S }),

    d([
      txt("People's Poems", 'italic', 21, '#666'),
      txt(String(poem.number).padStart(5, '0'), 'normal', 15, '#999'),
    ], { flexDirection: 'column', alignItems: 'flex-end' }),
  ], {
    flexDirection:   'column',
    width:           W,
    height:          H,
    backgroundColor: BG,
    padding:         PAD,
    overflow:        'hidden',
  })

  const svg = await satori(card as Parameters<typeof satori>[0], {
    width: W, height: H,
    fonts: [
      { name: 'Playfair Display', data: fontRegular, weight: 400, style: 'normal' },
      { name: 'Playfair Display', data: fontItalic,  weight: 400, style: 'italic'  },
    ],
  })

  const png = new Resvg(svg).render().asPng()
  const bytes = new Uint8Array(png.buffer as ArrayBuffer)

  if (hasBlobToken) {
    try {
      await put(cacheKey, Buffer.from(bytes), {
        access: 'public',
        contentType: 'image/png',
        addRandomSuffix: false,
        allowOverwrite: true,
      })
    } catch (e) {
      console.warn(`Blob upload failed for ${cacheKey}:`, e)
    }
  }

  return new Response(bytes, { headers: pngHeaders })
}
