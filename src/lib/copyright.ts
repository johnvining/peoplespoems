import type { CopyrightStatus } from './sanity'

export interface CopyrightInfo {
  label: string
  description: string
  hidden?: boolean
}

export const COPYRIGHT: Record<CopyrightStatus, CopyrightInfo> = {
  pd_pre_1931: {
    label: 'U.S. pre-1931',
    description:
      'Published in the United States before 1931. The copyright term has expired unconditionally.',
  },
  pd_foreign_pre_1931: {
    label: 'Foreign pre-1931',
    description:
      'Published outside the United States before 1931. Generally in the public domain in the U.S. as well.',
  },
  pd_unpublished_author_pre_1956: {
    label: 'Unpublished, author pre-1956',
    description:
      'Unpublished work by an author who died before 1956. The life-plus-seventy-year copyright term has elapsed.',
    hidden: true,
  },
  pd_unpublished_anon_pre_1906: {
    label: 'Unpublished, anon pre-1906',
    description:
      'Unpublished work by an unknown or anonymous author created before 1906. The 120-year copyright term has elapsed.',
    hidden: true,
  },
  pd_no_notice: {
    label: 'No copyright notice pre-1977',
    description:
      'Published in the United States between 1931 and 1977 without a copyright notice. Under the law then in effect, notice was required for protection.',
  },
  pd_not_renewed: {
    label: 'Copyright not renewed',
    description:
      'Published in the United States between 1931 and 1963 with a copyright notice, but the copyright was never renewed after the initial 28-year term.',
  },
  pd_us_govt: {
    label: 'U.S. government work',
    description:
      'A work of the United States federal government, which is ineligible for copyright protection under 17 U.S.C. § 105.',
    hidden: true,
  },
  pd_chronicling_america_post_1931: {
    label: 'Chronicling America',
    description:
      'Sourced from Chronicling America, the Library of Congress\'s archive of digitized historical newspapers. Items from this archive are assumed to be in the public domain unless there is evidence they were syndicated or otherwise renewed.',
  },
}
