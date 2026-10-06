import { notifications } from '@mantine/notifications'
import { IconAlertCircle, IconCheck } from '@tabler/icons-react'

import { ApiError } from '../api/client'

export function notifySuccess(title: string, message?: string) {
  notifications.show({ color: 'green', title, message, icon: <IconCheck size={18} /> })
}

export function notifyError(error: unknown, title = 'No se pudo completar la operación') {
  const message = error instanceof ApiError ? error.message : 'Intenta de nuevo en unos segundos.'
  notifications.show({ color: 'red', title, message, icon: <IconAlertCircle size={18} />, autoClose: 6000 })
}
