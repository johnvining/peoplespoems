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
    { name: 'yearPublished', title: 'Year Published', type: 'number' },
    { name: 'sourceNotItalic', title: 'Don\'t italicize source', type: 'boolean' },
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
