import { Paper, type PaperProps } from '@mantine/core'
import type { ReactNode } from 'react'

import classes from './SectionCard.module.css'

/** White "bento" surface: 20px radius, subtle border and ambient shadow. */
export function SectionCard({ children, className, ...props }: PaperProps & { children: ReactNode }) {
  return (
    <Paper radius="xl" withBorder shadow="sm" bg="white" className={[classes.card, className].filter(Boolean).join(' ')} {...props}>
      {children}
    </Paper>
  )
}
