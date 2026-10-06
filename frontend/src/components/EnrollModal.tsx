import { Badge, Button, Group, Loader, Modal, ScrollArea, Stack, Text } from '@mantine/core'
import { IconCheck, IconInfoCircle } from '@tabler/icons-react'

import { CodeBadge } from './CodeBadge'
import { ErrorState } from './ListStates'
import { SearchInput } from './SearchInput'
import classes from './EnrollModal.module.css'

export interface EnrollOption {
  id: number
  code: string
  label: string
}

interface EnrollModalProps {
  opened: boolean
  onClose: () => void
  title: string
  searchPlaceholder: string
  search: string
  onSearchChange: (value: string) => void
  options: EnrollOption[] | undefined
  /** More matches exist than the ones shown. */
  truncated: boolean
  isLoading: boolean
  error: unknown
  onRetry: () => void
  enrolledIds: Set<number>
  pendingId: number | null
  onEnroll: (option: EnrollOption) => void
  enrolledHint: string
}

/**
 * Searchable picker shared by both directions of the relation
 * (student -> class and class -> student). Already enrolled rows are disabled.
 */
export function EnrollModal(props: EnrollModalProps) {
  const { opened, onClose, title, searchPlaceholder, search, onSearchChange, options, truncated } = props
  const { isLoading, error, onRetry, enrolledIds, pendingId, onEnroll, enrolledHint } = props

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      size={580}
      styles={{ title: { fontFamily: 'var(--mantine-font-family-headings)', fontWeight: 700, fontSize: 22 } }}
    >
      <Stack gap="md">
        <SearchInput value={search} onChange={onSearchChange} placeholder={searchPlaceholder} />

        <div className={classes.list}>
          {error ? (
            <ErrorState error={error} onRetry={onRetry} />
          ) : isLoading && !options ? (
            <Group justify="center" py="xl">
              <Loader size="sm" />
            </Group>
          ) : options && options.length === 0 ? (
            <Text c="dimmed" ta="center" py="xl">
              Sin resultados para “{search}”.
            </Text>
          ) : (
            <ScrollArea.Autosize mah={360}>
              {options?.map((option) => {
                const enrolled = enrolledIds.has(option.id)
                return (
                  <Group key={option.id} className={classes.row} data-enrolled={enrolled || undefined} justify="space-between" wrap="nowrap">
                    <Group gap="sm" wrap="nowrap" miw={0}>
                      <CodeBadge code={option.code} color={enrolled ? 'gray' : undefined} />
                      <Text truncate fw={500}>
                        {option.label}
                      </Text>
                    </Group>
                    {enrolled ? (
                      <Badge color="green" c="green.9" variant="light" leftSection={<IconCheck size={14} />} tt="none" radius="xl" size="lg">
                        Inscrito
                      </Badge>
                    ) : (
                      <Button
                        size="xs"
                        variant={pendingId === option.id ? 'filled' : 'light'}
                        loading={pendingId === option.id}
                        disabled={pendingId !== null && pendingId !== option.id}
                        onClick={() => onEnroll(option)}
                      >
                        Inscribir
                      </Button>
                    )}
                  </Group>
                )
              })}
            </ScrollArea.Autosize>
          )}
        </div>

        {truncated && (
          <Text fz="xs" c="dimmed">
            Se muestran los primeros resultados; escribe para afinar la búsqueda.
          </Text>
        )}

        <Group justify="space-between" pt="sm" className={classes.footer}>
          <Group gap={6} c="dimmed">
            <IconInfoCircle size={16} />
            <Text fz="sm">{enrolledHint}</Text>
          </Group>
          <Button variant="default" onClick={onClose}>
            Cerrar
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
