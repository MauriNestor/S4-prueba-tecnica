import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import { queryKeys } from './queryKeys'

/**
 * Students and classes appear inside each other's detail pages, so any write
 * refreshes both trees. With this data volume it is simpler and always correct.
 */
export function useInvalidateAll() {
  const queryClient = useQueryClient()
  return useCallback(
    () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.students.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.courses.all }),
      ]),
    [queryClient],
  )
}
