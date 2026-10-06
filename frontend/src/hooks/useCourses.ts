import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'

import { coursesApi } from '../api/courses'
import type { CourseInput, ListParams } from '../api/types'
import { queryKeys } from './queryKeys'
import { useInvalidateAll } from './useInvalidateAll'

export function useCourseList(params: ListParams, enabled = true) {
  return useQuery({
    enabled,
    queryKey: queryKeys.courses.list(params),
    queryFn: () => coursesApi.list(params),
    placeholderData: keepPreviousData,
  })
}

export function useCourse(id: number) {
  return useQuery({ queryKey: queryKeys.courses.detail(id), queryFn: () => coursesApi.get(id) })
}

export function useCourseStudents(id: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.courses.students(id),
    queryFn: () => coursesApi.students(id),
    enabled,
  })
}

export function useSaveCourse() {
  const invalidateAll = useInvalidateAll()
  return useMutation({
    mutationFn: ({ id, input }: { id?: number; input: CourseInput }) =>
      id === undefined ? coursesApi.create(input) : coursesApi.update(id, input),
    onSuccess: invalidateAll,
  })
}

/**
 * Invalidation is not awaited: the caller may navigate away from the deleted
 * record's page right away, instead of first refetching it (and getting a 404).
 */
export function useDeleteCourse() {
  const invalidateAll = useInvalidateAll()
  return useMutation({
    mutationFn: (id: number) => coursesApi.remove(id),
    onSuccess: () => void invalidateAll(),
  })
}
