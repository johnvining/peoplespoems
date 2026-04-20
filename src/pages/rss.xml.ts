import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { safeFetch, type Poem } from '../lib/sanity'
import { firstLine } from '../lib/utils'

function poemUrl(poem: Poem): string {
  const num = String(poem.number).padStart(5, '0')
  return `/${num}/${poem.slug.current}`
}

function poemHtml(poem: Poem): string {
  const lines = poem.body
    .split('\n')
    .map((l) => (l.trim() === '' ? '<br>' : `${l}<br>`))
    .join('\n')
  const byline = poem.author ? `<p><em>— ${poem.author}</em></p>` : ''
  return `<p style="font-family:Georgia,serif;line-height:1.8">${lines}</p>${byline}`
}

export async function GET(context: APIContext) {
  const poems = await safeFetch<Poem>(
    `*[_type == "poem"] | order(dateAdded desc, number desc) { _id, _createdAt, number, title, body, author, dateAdded, slug }`
  )

  return rss({
    title: "People's Poems",
    description: 'A feed of poems',
    site: context.site!,
    items: poems.map((poem) => ({
      title: poem.title ?? firstLine(poem.body),
      pubDate: poem.dateAdded ? new Date(`${poem.dateAdded}T00:00:00`) : new Date(poem._createdAt),
      link: poemUrl(poem),
      content: poemHtml(poem),
    })),
    customData: `<language>en-us</language>`,
  })
}
