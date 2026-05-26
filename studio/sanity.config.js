import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import poem from '../sanity/schema/poem.js'
import editor from '../sanity/schema/editor.js'

export default defineConfig({
  name: 'peoplespoems',
  title: "People's Poems",
  projectId: '5nnx65nr',
  dataset: 'production',
  plugins: [structureTool()],
  schema: {
    types: [poem, editor],
  },
})
