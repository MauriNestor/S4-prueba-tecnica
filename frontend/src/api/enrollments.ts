import { request } from './client'

export const enrollmentsApi = {
  /** Idempotent on the server: enrolling twice keeps a single enrollment. */
  enroll: (courseId: number, studentId: number) =>
    request<void>(`/classes/${courseId}/students/${studentId}`, { method: 'PUT' }),
  unenroll: (courseId: number, studentId: number) =>
    request<void>(`/classes/${courseId}/students/${studentId}`, { method: 'DELETE' }),
}
