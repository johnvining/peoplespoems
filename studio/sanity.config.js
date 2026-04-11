import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import poem from '../sanity/schema/poem.js'
import editor from '../sanity/schema/editor.js'
import { AutoNumberInput } from './components/AutoNumberInput.jsx'

const poemWithAutoNumber = {
  ...poem,
  fields: poem.fields.map((field) =>
    field.name === 'number'
      ? { ...field, components: { input: AutoNumberInput }, readOnly: true }
      : field
  ),
}

export default defineConfig({
  name: 'peoplespoems',
  title: "People's Poems",
  projectId: '5nnx65nr',
  dataset: 'production',
  plugins: [structureTool()],
  schema: {
    types: [poemWithAutoNumber, editor],
  },
})
