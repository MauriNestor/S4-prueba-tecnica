import { Stack, Text } from '@mantine/core'
import type { ReactNode } from 'react'

export function InfoField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Stack gap={6}>
      <Text fz={12} fw={600} tt="uppercase" c="gray.6" style={{ letterSpacing: '0.04em' }}>
        {label}
      </Text>
      <Text component="div" fw={500}>
        {children}
      </Text>
    </Stack>
  )
}
