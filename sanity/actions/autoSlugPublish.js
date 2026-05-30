import { useDocumentOperations } from 'sanity'

// Mirror Sanity's default slugification closely enough for clean, lowercase kebab-case
// slugs (e.g. "The Suburbanite" -> "the-suburbanite").
function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
    .replace(/-+$/g, '')
}

// Wrap the default Publish action: if the poem has no slug, derive one from the
// title (or first line of the body) before publishing, matching the field's `source`.
export function createAutoSlugPublishAction(originalPublishAction) {
  return (props) => {
    const original = originalPublishAction(props)
    const { patch } = useDocumentOperations(props.id, props.type)

    return {
      ...original,
      onHandle: () => {
        const doc = props.draft || props.published
        if (doc && !doc.slug?.current) {
          const source = doc.title || (doc.body ? doc.body.split('\n')[0] : '')
          const current = slugify(source) || `poem-${doc.number ?? ''}`.replace(/-$/, '')
          patch.execute([
            { setIfMissing: { slug: { _type: 'slug' } } },
            { set: { 'slug.current': current } },
          ])
        }
        original.onHandle?.()
      },
    }
  }
}
