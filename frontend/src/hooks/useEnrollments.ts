import { useMutation } from '@tanstack/react-query'

import { enrollmentsApi } from '../api/enrollments'
import { useInvalidateAll } from './useInvalidateAll'

interface EnrollmentVars {
  courseId: number
  studentId: number
}

export function useEnroll() {
  const invalidateAll = useInvalidateAll()
  return useMutation({
    mutationFn: ({ courseId, studentId }: EnrollmentVars) => enrollmentsApi.enroll(courseId, studentId),
    onSuccess: invalidateAll,
  })
}

export function useUnenroll() {
  const invalidateAll = useInvalidateAll()
  return useMutation({
    mutationFn: ({ courseId, studentId }: EnrollmentVars) => enrollmentsApi.unenroll(courseId, studentId),
    onSuccess: invalidateAll,
  })
}
