import { request, toQueryString } from './client'
import type { Course, ListParams, Page, Student, StudentInput } from './types'

export const studentsApi = {
  list: (params: ListParams) => request<Page<Student>>(`/students${toQueryString({ ...params })}`),
  get: (id: number) => request<Student>(`/students/${id}`),
  create: (input: StudentInput) => request<Student>('/students', { method: 'POST', body: JSON.stringify(input) }),
  update: (id: number, input: StudentInput) =>
    request<Student>(`/students/${id}`, { method: 'PUT', body: JSON.stringify(input) }),
  remove: (id: number) => request<void>(`/students/${id}`, { method: 'DELETE' }),
  classes: (id: number) => request<Course[]>(`/students/${id}/classes`),
}
