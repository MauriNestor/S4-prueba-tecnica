import { Group, Pagination, Text } from '@mantine/core'

interface ListFooterProps {
  page: number
  size: number
  totalElements: number
  totalPages: number
  noun: { singular: string; plural: string }
  onPageChange: (page: number) => void
}

/** "Mostrando 1–20 de 57 estudiantes" + pagination. `page` is 1-based. */
export function ListFooter({ page, size, totalElements, totalPages, noun, onPageChange }: ListFooterProps) {
  const from = (page - 1) * size + 1
  const to = Math.min(page * size, totalElements)

  return (
    <Group justify="space-between" px="xl" py="md" gap="sm">
      <Text fz="sm" c="gray.7">
        Mostrando{' '}
        <Text span fw={600} c="gray.9" inherit>
          {from}–{to}
        </Text>{' '}
        de{' '}
        <Text span fw={600} c="gray.9" inherit>
          {totalElements}
        </Text>{' '}
        {totalElements === 1 ? noun.singular : noun.plural}
      </Text>
      {totalPages > 1 && <Pagination total={totalPages} value={page} onChange={onPageChange} size="sm" radius="md" />}
    </Group>
  )
}
