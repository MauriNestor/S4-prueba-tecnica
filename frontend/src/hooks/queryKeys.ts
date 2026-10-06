import type { ListParams } from '../api/types'

/** Hierarchical keys: invalidating ['students'] refreshes every student list and detail. */
export const queryKeys = {
  students: {
    all: ['students'] as const,
    list: (params: ListParams) => ['students', 'list', params] as const,
    detail: (id: number) => ['students', 'detail', id] as const,
    classes: (id: number) => ['students', 'detail', id, 'classes'] as const,
  },
  courses: {
    all: ['courses'] as const,
    list: (params: ListParams) => ['courses', 'list', params] as const,
    detail: (id: number) => ['courses', 'detail', id] as const,
    students: (id: number) => ['courses', 'detail', id, 'students'] as const,
  },
}
