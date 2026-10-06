import { Badge, Group, Stack, Text, Title } from '@mantine/core'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: ReactNode
  badge?: ReactNode
  description?: ReactNode
  actions?: ReactNode
}

export function PageHeader({ title, badge, description, actions }: PageHeaderProps) {
  return (
    <Group justify="space-between" align="flex-start" gap="md" mb="xl" wrap="wrap">
      <Stack gap={6}>
        <Group gap="sm" align="center" wrap="wrap">
          <Title order={1}>{title}</Title>
          {badge !== undefined && (
            <Badge variant="light" size="lg" radius="xl" tt="none" fw={600}>
              {badge}
            </Badge>
          )}
        </Group>
        {description && <Text c="gray.7">{description}</Text>}
      </Stack>
      {actions && <Group gap="sm">{actions}</Group>}
    </Group>
  )
}
