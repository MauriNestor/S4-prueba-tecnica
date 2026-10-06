import { AppShell, Box, Burger, Group, NavLink, Stack, Text, ThemeIcon } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconStack2, IconUsers } from '@tabler/icons-react'
import { NavLink as RouterNavLink, Outlet, useLocation } from 'react-router'

import classes from './AppLayout.module.css'

const NAV_ITEMS = [
  { to: '/estudiantes', label: 'Estudiantes', icon: IconUsers },
  { to: '/clases', label: 'Clases', icon: IconStack2 },
]

function Brand() {
  return (
    <Group gap="sm" wrap="nowrap">
      <ThemeIcon size={44} radius="md" variant="filled">
        <Text fw={700} fz="lg" ff="heading">
          S4
        </Text>
      </ThemeIcon>
      <Box>
        <Text fw={700} ff="heading" lh={1.1}>
          S4
        </Text>
        <Text fz="xs" c="dimmed">
          Scheduling System
        </Text>
      </Box>
    </Group>
  )
}

export function AppLayout() {
  const [opened, { toggle, close }] = useDisclosure()
  const { pathname } = useLocation()

  return (
    <AppShell
      header={{ height: { base: 60, sm: 0 } }}
      navbar={{ width: 260, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding={0}
    >
      <AppShell.Header hiddenFrom="sm" px="md">
        <Group h="100%" justify="space-between">
          <Brand />
          <Burger opened={opened} onClick={toggle} size="sm" aria-label="Abrir navegación" />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md" className={classes.navbar}>
        <Box visibleFrom="sm" px="xs" pt="xs" pb="lg">
          <Brand />
        </Box>
        <Stack gap={6} component="nav" aria-label="Navegación principal">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              component={RouterNavLink}
              to={to}
              label={label}
              leftSection={<Icon size={20} stroke={1.7} />}
              active={pathname.startsWith(to)}
              variant="filled"
              onClick={close}
              className={classes.link}
            />
          ))}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main className={classes.main}>
        <Box className={classes.content}>
          <Outlet />
        </Box>
      </AppShell.Main>
    </AppShell>
  )
}
