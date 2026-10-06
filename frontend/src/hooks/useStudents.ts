import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'

import { studentsApi } from '../api/students'
import type { ListParams, StudentInput } from '../api/types'
import { queryKeys } from './queryKeys'
import { useInvalidateAll } from './useInvalidateAll'

export function useStudentList(params: ListParams, enabled = true) {
  return useQuery({
    enabled,
    queryKey: queryKeys.students.list(params),
    queryFn: () => studentsApi.list(params),
    // keep showing the previous page while the next one loads (no flicker)
    placeholderData: keepPreviousData,
  })
}

export function useStudent(id: number) {
  return useQuery({ queryKey: queryKeys.students.detail(id), queryFn: () => studentsApi.get(id) })
}

export function useStudentClasses(id: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.students.classes(id),
    queryFn: () => studentsApi.classes(id),
    enabled,
  })
}

export function useSaveStudent() {
  const invalidateAll = useInvalidateAll()
  return useMutation({
    mutationFn: ({ id, input }: { id?: number; input: StudentInput }) =>
      id === undefined ? studentsApi.create(input) : studentsApi.update(id, input),
    onSuccess: invalidateAll,
  })
}

/**
 * Invalidation is not awaited: the caller may navigate away from the deleted
 * record's page right away, instead of first refetching it (and getting a 404).
 */
export function useDeleteStudent() {
  const invalidateAll = useInvalidateAll()
  return useMutation({
    mutationFn: (id: number) => studentsApi.remove(id),
    onSuccess: () => void invalidateAll(),
  })
}
