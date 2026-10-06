import { CloseButton, TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
}

export function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  return (
    <TextInput
      value={value}
      onChange={(event) => onChange(event.currentTarget.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      leftSection={<IconSearch size={18} />}
      rightSection={value ? <CloseButton size="sm" aria-label="Limpiar búsqueda" onClick={() => onChange('')} /> : null}
      variant="filled"
    />
  )
}
