# People's Poems — Style Guide

## Decades

Write decades with an apostrophe before the *s*: **1920's**, **1970's**. This was the dominant convention through most of the twentieth century. In HTML, use a proper right single curly quote: `&rsquo;s`.

## Poem titles

Display in "double curly quotes" (`&ldquo;` / `&rdquo;`). When a poem has no title, show the first line in [square brackets] in a visually distinct style.

## Sources

Italicize source names (newspapers, periodicals, books) by default. Set the `sourceNotItalic` flag in Sanity for sources that should not be italicized (e.g. individual letters, manuscripts, or other non-publication sources).

## Dates

Display dates in long form: *April 14, 2026*. The `fmtDate` utility handles this from Sanity's `YYYY-MM-DD` format.

## Poem numbering

Poems are numbered sequentially and zero-padded to five digits in URLs: `/00001/slug`.

