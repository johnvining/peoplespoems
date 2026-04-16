import type { Editor, Poem } from './sanity'

const EDITOR = { name: 'Placeholder Editor', initials: 'P.E.', email: 'editor@example.com' }

export const MOCK_EDITORS: Editor[] = [
  {
    _id: 'editor-1',
    name: 'Placeholder Editor',
    initials: 'P.E.',
    email: 'editor@example.com',
    url: 'https://example.com',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
]

export const MOCK_POEMS: Poem[] = [
  {
    _id: 'mock-1',
    number: 1,
    title: 'Placeholder Poem Title',
    body: `Lorem ipsum dolor sit amet,
consectetur adipiscing elit,
sed do eiusmod tempor.

Ut labore et dolore magna
aliqua enim ad minim—
veniam, quis nostrud.

Exercitation ullamco laboris
nisi ut aliquip ex ea
commodo consequat.

Duis aute irure dolor
in reprehenderit in voluptate
velit esse cillum.`,
    author: 'Placeholder Author',
    source: 'Placeholder Source',
    sourceUrl: 'https://example.com/placeholder-source',
    cityState: 'Springfield, IL',
    yearPublished: 1970,
    datePublished: '1970-03-14',
    copyrightStatus: 'pd_no_notice',
    editor: EDITOR,
    context: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    dateAdded: '2026-03-01',
    slug: { current: 'placeholder-poem-title' },
  },
  {
    _id: 'mock-2',
    number: 2,
    title: 'Another Placeholder Title',
    body: `Sed ut perspiciatis unde omnis
iste natus error sit voluptatem
accusantium doloremque.

Nemo enim ipsam voluptatem
quia voluptas sit aspernatur
aut odit aut fugit.`,
    author: 'Second Placeholder Author',
    source: 'Placeholder Quarterly',
    yearPublished: 2001,
    editor: EDITOR,
    dateAdded: '2026-03-15',
    slug: { current: 'another-placeholder-title' },
  },
  {
    _id: 'mock-3',
    number: 3,
    title: 'A Third Placeholder',
    body: `At vero eos et accusamus
et iusto odio dignissimos
ducimus qui blanditiis.

Praesentium voluptatum deleniti
atque corrupti quos dolores
et quas molestias.`,
    author: undefined,
    source: 'The Placeholder Review',
    cityState: 'Boston, MA',
    yearPublished: 1925,
    copyrightStatus: 'pd_pre_1931',
    editor: EDITOR,
    dateAdded: '2026-04-01',
    slug: { current: 'a-third-placeholder' },
  },
  {
    _id: 'mock-4',
    number: 4,
    title: 'Fourth and Final Placeholder',
    body: `Nam libero tempore cum soluta
nobis eligendi optio cumque
nihil impedit quo minus.

Temporibus autem quibusdam
et aut officiis debitis
rerum necessitatibus.`,
    author: 'Fourth Placeholder Author',
    source: 'Placeholder Magazine',
    yearPublished: 2015,
    sourceNotItalic: true,
    editor: EDITOR,
    dateAdded: '2026-04-05',
    slug: { current: 'fourth-and-final-placeholder' },
  },
  {
    _id: 'mock-5',
    number: 5,
    title: 'A Longer Placeholder Poem',
    body: `Lorem ipsum dolor sit amet,
consectetur adipiscing elit,
sed do eiusmod tempor incididunt.

Ut labore et dolore magna aliqua,
enim ad minim veniam,
quis nostrud exercitation.

Ullamco laboris nisi ut aliquip
ex ea commodo consequat,
duis aute irure dolor.

In reprehenderit in voluptate
velit esse cillum dolore
eu fugiat nulla pariatur.

Excepteur sint occaecat cupidatat
non proident, sunt in culpa
qui officia deserunt mollit.

Anim id est laborum,
sed perspiciatis unde omnis
iste natus error sit.

Voluptatem accusantium doloremque
laudantium totam rem aperiam
eaque ipsa quae ab illo.`,
    author: 'Fifth Placeholder Author',
    source: 'Placeholder Collected Works',
    yearPublished: 1955,
    copyrightStatus: 'pd_chronicling_america_post_1931',
    editor: EDITOR,
    context: 'A longer poem to demonstrate the compact display mode for extended works.',
    dateAdded: '2026-04-05',
    slug: { current: 'a-longer-placeholder-poem' },
  },
]
