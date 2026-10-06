import type { Course } from '../api/types'
import { useCourseStudents, useDeleteCourse } from '../hooks/useCourses'
import { useLastDefined } from '../hooks/useLastDefined'
import { notifyError, notifySuccess } from '../lib/notify'
import { ConfirmModal } from './ConfirmModal'

interface DeleteCourseModalProps {
  /** Class to delete; null keeps the modal closed. */
  course: Course | null
  onClose: () => void
  onDeleted?: () => void
}

export function DeleteCourseModal({ course, onClose, onDeleted }: DeleteCourseModalProps) {
  const shown = useLastDefined(course)
  const opened = course !== null
  const students = useCourseStudents(shown?.id ?? 0, opened)
  const remove = useDeleteCourse()

  const count = students.data?.length
  const consequence =
    count === undefined
      ? 'También se eliminarán sus inscripciones.'
      : count === 0
        ? 'No tiene estudiantes inscritos.'
        : count === 1
          ? 'También se eliminará la inscripción de 1 estudiante.'
          : `También se eliminarán las inscripciones de ${count} estudiantes.`

  const confirm = () => {
    if (!shown) return
    remove.mutate(shown.id, {
      onSuccess: () => {
        notifySuccess('Clase eliminada', `${shown.code} · ${shown.title}`)
        onClose()
        onDeleted?.()
      },
      onError: (error) => notifyError(error),
    })
  }

  return (
    <ConfirmModal
      opened={opened}
      onClose={onClose}
      onConfirm={confirm}
      loading={remove.isPending}
      title={shown ? `¿Eliminar la clase ${shown.code}?` : ''}
      message={`${consequence} Esta acción no se puede deshacer.`}
      confirmLabel="Eliminar"
    />
  )
}
