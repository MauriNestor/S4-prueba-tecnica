import { useState } from 'react'

/**
 * Remembers the last non-null value so a closing modal keeps showing its content
 * during the exit animation instead of rendering an empty title.
 */
export function useLastDefined<T>(value: T | null): T | null {
  const [last, setLast] = useState(value)
  if (value !== null && value !== last) {
    setLast(value)
  }
  return value ?? last
}
