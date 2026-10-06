import { request, toQueryString } from './client'
import type { Course, CourseInput, ListParams, Page, Student } from './types'

/** Classes are exposed by the API under /api/classes. */
export const coursesApi = {
  list: (params: ListParams) => request<Page<Course>>(`/classes${toQueryString({ ...params })}`),
  get: (id: number) => request<Course>(`/classes/${id}`),
  create: (input: CourseInput) => request<Course>('/classes', { method: 'POST', body: JSON.stringify(input) }),
  update: (id: number, input: CourseInput) =>
    request<Course>(`/classes/${id}`, { method: 'PUT', body: JSON.stringify(input) }),
  remove: (id: number) => request<void>(`/classes/${id}`, { method: 'DELETE' }),
  students: (id: number) => request<Student[]>(`/classes/${id}/students`),
}
