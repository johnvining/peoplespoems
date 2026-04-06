import { createClient } from '@sanity/client'
import { MOCK_POEMS } from './mock'

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID

export const client = createClient({
  projectId: projectId ?? 'placeholder',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
})

export async function safeFetch<T>(query: string, params?: Record<string, unknown>): Promise<T[]> {
  if (!projectId) return MOCK_POEMS as unknown as T[]
  return client.fetch<T[]>(query, params)
}

// Public domain basis for each poem. Values are derived from the Cornell copyright chart:
// https://guides.library.cornell.edu/copyright/publicdomain
export type CopyrightStatus =
  // U.S. published before 1931 — copyright term has expired unconditionally
  | 'pd_pre_1931'
  // Published outside the U.S. before 1931 — generally expired in the U.S. as well
  | 'pd_foreign_pre_1931'
  // Unpublished; author died before 1956 — life + 70 year term has elapsed
  | 'pd_unpublished_author_pre_1956'
  // Unpublished, anonymous/unknown author, created before 1906 — 120-year term has elapsed
  | 'pd_unpublished_anon_pre_1906'
  // U.S. published 1931–1977 without a copyright notice — protection never attached (notice was a required formality)
  | 'pd_no_notice'
  // U.S. published 1931–1963 with notice, but copyright was never renewed after the initial 28-year term
  | 'pd_not_renewed'
  // U.S. federal government work — ineligible for copyright under 17 U.S.C. § 105
  | 'pd_us_govt'
  // Post 1931, found via LOC Chronicling America; judged to be non-syndicated, non-modern content
  | 'pd_chronicling_america_post_1931'

export interface Poem {
  _id: string
  number: number
  title: string
  body: string
  author?: string
  source?: string
  sourceUrl?: string
  cityState?: string
  yearPublished?: number
  datePublished?: string
  sourceNotItalic?: boolean
  copyrightStatus?: CopyrightStatus
  editor?: { name: string; initials: string; email?: string }
  context?: string
  dateAdded?: string
  slug: { current: string }
}
