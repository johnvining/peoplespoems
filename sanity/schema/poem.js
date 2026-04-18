import { createElement } from 'react'

export default {
  name: 'poem',
  title: 'Poem',
  type: 'document',
  fields: [
    {
      name: 'number',
      title: 'Number',
      type: 'number',
      description: 'Sequential ID used in the URL (e.g. 1 → /1/slug)',
      validation: (Rule) => Rule.required().integer().positive(),
    },
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'body', title: 'Poem Text', type: 'text' },
    { name: 'author', title: 'Author', type: 'string' },
    { name: 'source', title: 'Source', type: 'string' },
    { name: 'sourceUrlPrivate', title: 'Source URL (private)', type: 'url', description: 'Internal reference only — never displayed. Use for paywalled links (newspapers.com, etc.).' },
    { name: 'sourceUrlPublic', title: 'Source URL (public)', type: 'url', description: 'Displayed on the site. Use only for freely accessible links (LOC, archive.org, etc.).' },
    { name: 'cityState', title: 'City, State', type: 'string' },
    { name: 'yearPublished', title: 'Year Published', type: 'number' },
    { name: 'datePublished', title: 'Date Published (full)', type: 'date', description: 'Optional — use when the exact publication date is known. Year Published is still used for the By Date index.' },
    { name: 'sourceNotItalic', title: 'Don\'t italicize source', type: 'boolean' },
    {
      name: 'copyrightStatus',
      title: 'Copyright Status',
      type: 'string',
      description: createElement('span', null, 'See the ', createElement('a', { href: 'https://peoplespoems.vercel.app/copyright', target: '_blank', rel: 'noopener noreferrer' }, 'copyright guide'), ' for descriptions.'),
      options: {
        list: [
          { value: 'pd_pre_1931',                    title: 'Expired — U.S. published before 1931' },
          { value: 'pd_foreign_pre_1931',             title: 'Expired — published abroad before 1931' },
          { value: 'pd_unpublished_author_pre_1956',  title: 'Expired — unpublished, author died before 1956' },
          { value: 'pd_unpublished_anon_pre_1906',    title: 'Expired — unpublished, anonymous/unknown, created before 1906' },
          { value: 'pd_no_notice',                    title: 'No notice — U.S. published 1931–1977 without copyright notice' },
          { value: 'pd_not_renewed',                  title: 'Not renewed — U.S. published 1931–1963, copyright not renewed' },
          { value: 'pd_us_govt',                      title: 'U.S. Government work — ineligible for copyright' },
          { value: 'pd_chronicling_america_post_1931', title: 'Chronicling America — post-1931, non-syndicated, non-modern content' },
        ],
      },
    },
    { name: 'editor', title: 'Editor', type: 'reference', to: [{ type: 'editor' }] },
    { name: 'context', title: 'Context', type: 'text' },
    { name: 'dateAdded', title: 'Date Added', type: 'date' },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'author' },
  },
}
