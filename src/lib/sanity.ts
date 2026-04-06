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

export interface Poem {
  _id: string
  number: number
  title: string
  body: string
  author?: string
  source?: string
  yearPublished?: number
  sourceNotItalic?: boolean
  editor?: { name: string; initials: string; email?: string }
  context?: string
  dateAdded?: string
  slug: { current: string }
}
