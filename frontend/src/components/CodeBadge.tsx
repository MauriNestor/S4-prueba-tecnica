import { Badge, type BadgeProps } from '@mantine/core'

/** Academic codes (S-0001, MATH-101) in monospace, as defined in the design system. */
export function CodeBadge({ code, ...props }: { code: string } & BadgeProps) {
  return (
    // min-width: max-content keeps narrow table columns from truncating the code
    <Badge variant="light" radius="sm" size="lg" tt="none" ff="monospace" fw={600} fz="xs" miw="max-content" {...props}>
      {code}
    </Badge>
  )
}
