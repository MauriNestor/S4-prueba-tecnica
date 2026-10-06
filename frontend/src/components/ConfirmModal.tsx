import { Button, Group, Modal, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import type { ReactNode } from 'react'

interface ConfirmModalProps {
  opened: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: ReactNode
  confirmLabel: string
  loading?: boolean
}

/** Destructive confirmation (delete a record, remove an enrollment). */
export function ConfirmModal({ opened, onClose, onConfirm, title, message, confirmLabel, loading }: ConfirmModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} withCloseButton={false} size={460} closeOnClickOutside={!loading}>
      <Stack align="center" ta="center" gap="sm">
        <ThemeIcon size={64} radius="xl" color="red" variant="light">
          <IconTrash size={28} />
        </ThemeIcon>
        <Title order={3} mt="xs">
          {title}
        </Title>
        <Text c="gray.7">{message}</Text>
      </Stack>
      <Group grow mt="xl">
        <Button variant="default" size="md" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button color="red.9" size="md" leftSection={<IconTrash size={18} />} onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </Group>
    </Modal>
  )
}
