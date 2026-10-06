import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'

import { ApiError } from '../api/client'
import { notifyError } from './notify'

/**
 * Puts server-side errors where the user is looking:
 * - 409 (duplicated code) -> on the code field, with a Spanish message
 * - 400 with field errors -> on each field
 * - anything else -> error notification
 */
export function applyApiErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fields: readonly Path<T>[],
  conflict: { field: Path<T>; message: string },
) {
  if (error instanceof ApiError && error.status === 409) {
    setError(conflict.field, { type: 'server', message: conflict.message }, { shouldFocus: true })
    return
  }
  if (error instanceof ApiError && error.status === 400) {
    const known = Object.entries(error.fieldErrors).filter(([field]) => fields.includes(field as Path<T>))
    if (known.length > 0) {
      for (const [field, message] of known) {
        setError(field as Path<T>, { type: 'server', message })
      }
      return
    }
  }
  notifyError(error)
}
