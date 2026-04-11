import { useEffect } from 'react'
import { useClient, set, NumberInput } from 'sanity'

export function AutoNumberInput(props) {
  const client = useClient({ apiVersion: '2024-01-01' })

  useEffect(() => {
    if (props.value !== undefined) return
    client
      .fetch('*[_type == "poem"] | order(number desc) [0].number')
      .then((max) => props.onChange(set((max ?? 0) + 1)))
  }, [])

  return <NumberInput {...props} readOnly />
}
