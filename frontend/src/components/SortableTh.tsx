import { Group, Table, Text, UnstyledButton } from '@mantine/core'
import { IconArrowDown, IconArrowUp, IconSelector } from '@tabler/icons-react'
import type { ComponentProps, ReactNode } from 'react'

import type { SortState } from '../hooks/useListParams'
import classes from './DataTable.module.css'

interface SortableThProps {
  field: string
  sort: SortState
  onSort: (field: string) => void
  children: ReactNode
}

export function SortableTh({ field, sort, onSort, children }: SortableThProps) {
  const active = sort.field === field
  const Icon = !active ? IconSelector : sort.direction === 'asc' ? IconArrowUp : IconArrowDown
  const ariaSort = !active ? 'none' : sort.direction === 'asc' ? 'ascending' : 'descending'

  return (
    <Table.Th aria-sort={ariaSort} className={classes.th}>
      <UnstyledButton onClick={() => onSort(field)} className={classes.sortButton} data-active={active || undefined}>
        <Group gap={6} wrap="nowrap">
          <Text component="span" inherit>
            {children}
          </Text>
          <Icon size={14} stroke={2} />
        </Group>
      </UnstyledButton>
    </Table.Th>
  )
}

export function Th({ children, ...props }: { children?: ReactNode } & ComponentProps<typeof Table.Th>) {
  return (
    <Table.Th className={classes.th} {...props}>
      {children}
    </Table.Th>
  )
}
