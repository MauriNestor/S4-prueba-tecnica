import { Paper, type PaperProps } from '@mantine/core'
import type { ReactNode } from 'react'

/** White "bento" surface: 20px radius, subtle border and ambient shadow. */
export function SectionCard({ children, ...props }: PaperProps & { children: ReactNode }) {
  return (
    <Paper radius="xl" withBorder shadow="sm" bg="white" style={{ borderColor: 'var(--mantine-color-gray-2)' }} {...props}>
      {children}
    </Paper>
  )
}
