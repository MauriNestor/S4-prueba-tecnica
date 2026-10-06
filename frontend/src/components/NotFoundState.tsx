import { Button, Center, Stack, Text, Title } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import { Link } from 'react-router'

import { SectionCard } from './SectionCard'

interface NotFoundStateProps {
  message?: string
  backTo?: string
  backLabel?: string
}

export function NotFoundState({
  message = 'La página que buscas no existe.',
  backTo = '/estudiantes',
  backLabel = 'Volver al listado',
}: NotFoundStateProps) {
  return (
    <SectionCard p="xl" maw={520} mx="auto" mt="xl">
      <Center>
        <Stack align="center" ta="center" gap="sm" py="lg">
          <Text ff="heading" fw={800} fz={96} lh={1} c="indigo.4">
            404
          </Text>
          <Title order={2}>No encontramos lo que buscas</Title>
          <Text c="gray.7">{message}</Text>
          <Button component={Link} to={backTo} leftSection={<IconArrowLeft size={18} />} size="md" mt="md">
            {backLabel}
          </Button>
        </Stack>
      </Center>
    </SectionCard>
  )
}
