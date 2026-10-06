import { useDebouncedValue } from '@mantine/hooks'
import { useState } from 'react'

import type { Course, Student } from '../api/types'
import { useCourseList } from '../hooks/useCourses'
import { useEnroll } from '../hooks/useEnrollments'
import { useStudentList } from '../hooks/useStudents'
import { fullName } from '../lib/format'
import { notifyError, notifySuccess } from '../lib/notify'
import { EnrollModal, type EnrollOption } from './EnrollModal'

const PICKER_SIZE = 50

interface PickerProps<T> {
  opened: boolean
  onClose: () => void
  target: T
  enrolledIds: Set<number>
}

/** From a student's detail page: pick a class to enroll them in. */
export function EnrollInCoursePicker({ opened, onClose, target: student, enrolledIds }: PickerProps<Student>) {
  const [search, setSearch] = useState('')
  const [debounced] = useDebouncedValue(search.trim(), 300)
  const courses = useCourseList({ search: debounced || undefined, page: 0, size: PICKER_SIZE, sort: 'code,asc' }, opened)
  const enroll = useEnroll()

  const handleEnroll = (option: EnrollOption) =>
    enroll.mutate(
      { courseId: option.id, studentId: student.id },
      {
        onSuccess: () => notifySuccess('Inscripción registrada', `${fullName(student)} → ${option.label}`),
        onError: (error) => notifyError(error),
      },
    )

  const close = () => {
    setSearch('')
    onClose()
  }

  return (
    <EnrollModal
      opened={opened}
      onClose={close}
      title={`Inscribir a ${fullName(student)} en una clase`}
      searchPlaceholder="Buscar clase por código o título…"
      search={search}
      onSearchChange={setSearch}
      options={courses.data?.content.map((course: Course) => ({ id: course.id, code: course.code, label: course.title }))}
      truncated={(courses.data?.totalElements ?? 0) > PICKER_SIZE}
      isLoading={courses.isFetching}
      error={courses.error}
      onRetry={() => courses.refetch()}
      enrolledIds={enrolledIds}
      pendingId={enroll.isPending ? enroll.variables.courseId : null}
      onEnroll={handleEnroll}
      enrolledHint="Las clases ya inscritas aparecen deshabilitadas."
    />
  )
}

/** From a class's detail page: pick a student to enroll in it. */
export function EnrollStudentPicker({ opened, onClose, target: course, enrolledIds }: PickerProps<Course>) {
  const [search, setSearch] = useState('')
  const [debounced] = useDebouncedValue(search.trim(), 300)
  const students = useStudentList(
    { search: debounced || undefined, page: 0, size: PICKER_SIZE, sort: 'lastName,asc' },
    opened,
  )
  const enroll = useEnroll()

  const handleEnroll = (option: EnrollOption) =>
    enroll.mutate(
      { courseId: course.id, studentId: option.id },
      {
        onSuccess: () => notifySuccess('Inscripción registrada', `${option.label} → ${course.title}`),
        onError: (error) => notifyError(error),
      },
    )

  const close = () => {
    setSearch('')
    onClose()
  }

  return (
    <EnrollModal
      opened={opened}
      onClose={close}
      title={`Inscribir estudiante en ${course.code}`}
      searchPlaceholder="Buscar estudiante por código o nombre…"
      search={search}
      onSearchChange={setSearch}
      options={students.data?.content.map((student: Student) => ({ id: student.id, code: student.studentCode, label: fullName(student) }))}
      truncated={(students.data?.totalElements ?? 0) > PICKER_SIZE}
      isLoading={students.isFetching}
      error={students.error}
      onRetry={() => students.refetch()}
      enrolledIds={enrolledIds}
      pendingId={enroll.isPending ? enroll.variables.studentId : null}
      onEnroll={handleEnroll}
      enrolledHint="Los estudiantes ya inscritos aparecen deshabilitados."
    />
  )
}
