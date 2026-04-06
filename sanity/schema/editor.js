export default {
  name: 'editor',
  title: 'Editor',
  type: 'document',
  fields: [
    { name: 'name', title: 'Full Name', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'initials', title: 'Initials', type: 'string', validation: (Rule) => Rule.required().max(6) },
    { name: 'email', title: 'Email', type: 'string' },
  ],
  preview: {
    select: { title: 'name', subtitle: 'initials' },
  },
}
