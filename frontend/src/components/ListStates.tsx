import { Alert, Button, Center, Skeleton, Stack, Table, Text, ThemeIcon, Title } from '@mantine/core'
import { IconCloudOff, IconRefresh, IconSearchOff } from '@tabler/icons-react'
import type { ReactNode } from 'react'

import { ApiError } from '../api/client'

export function TableSkeletonRows({ rows = 5, columns }: { rows?: number; columns: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, row) => (
        <Table.Tr key={row}>
          {Array.from({ length: columns }, (_, col) => (
            <Table.Td key={col}>
              <Skeleton height={col === 0 ? 24 : 14} width={col === 0 ? 80 : `${50 + ((row + col) % 3) * 15}%`} radius="sm" />
            </Table.Td>
          ))}
        </Table.Tr>
      ))}
    </>
  )
}

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Center py={56} px="md">
      <Stack align="center" gap="sm" maw={420} ta="center">
        <ThemeIcon size={56} radius="lg" variant="light">
          {icon}
        </ThemeIcon>
        <Title order={3}>{title}</Title>
        {description && <Text c="gray.7">{description}</Text>}
        {action && <div style={{ marginTop: 8 }}>{action}</div>}
      </Stack>
    </Center>
  )
}

export function NoResultsState({ search, onClear }: { search: string; onClear: () => void }) {
  return (
    <EmptyState
      icon={<IconSearchOff size={26} />}
      title={`No hay resultados para “${search}”`}
      description="Prueba con otro término de búsqueda."
      action={
        <Button variant="light" onClick={onClear}>
          Limpiar búsqueda
        </Button>
      }
    />
  )
}

export function ErrorState({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  const detail =
    error instanceof ApiError && error.status === 0
      ? 'Revisa tu conexión o que el servidor esté en marcha.'
      : error instanceof Error
        ? error.message
        : 'Ocurrió un error inesperado.'

  return (
    <Alert
      color="red"
      variant="light"
      radius="lg"
      icon={<IconCloudOff size={20} />}
      title="No pudimos cargar los datos"
      m="lg"
    >
      <Stack gap="sm" align="flex-start">
        <Text fz="sm">{detail}</Text>
        <Button variant="default" size="xs" leftSection={<IconRefresh size={14} />} onClick={onRetry}>
          Reintentar
        </Button>
      </Stack>
    </Alert>
  )
}
