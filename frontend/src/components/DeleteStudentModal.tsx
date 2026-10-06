import type { Student } from '../api/types'
import { useDeleteStudent, useStudentClasses } from '../hooks/useStudents'
import { useLastDefined } from '../hooks/useLastDefined'
import { fullName } from '../lib/format'
import { notifyError, notifySuccess } from '../lib/notify'
import { ConfirmModal } from './ConfirmModal'

interface DeleteStudentModalProps {
  /** Student to delete; null keeps the modal closed. */
  student: Student | null
  onClose: () => void
  onDeleted?: () => void
}

export function DeleteStudentModal({ student, onClose, onDeleted }: DeleteStudentModalProps) {
  const shown = useLastDefined(student)
  const opened = student !== null
  // Ask how many enrollments will go away, so the warning is concrete.
  const classes = useStudentClasses(shown?.id ?? 0, opened)
  const remove = useDeleteStudent()

  const count = classes.data?.length
  const consequence =
    count === undefined
      ? 'También se eliminarán sus inscripciones.'
      : count === 0
        ? 'No tiene inscripciones.'
        : count === 1
          ? 'También se eliminará su inscripción.'
          : `También se eliminarán sus ${count} inscripciones.`

  const confirm = () => {
    if (!shown) return
    remove.mutate(shown.id, {
      onSuccess: () => {
        notifySuccess('Estudiante eliminado', `${fullName(shown)} (${shown.studentCode})`)
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
      title={shown ? `¿Eliminar a ${fullName(shown)} (${shown.studentCode})?` : ''}
      message={`${consequence} Esta acción no se puede deshacer.`}
      confirmLabel="Eliminar"
    />
  )
}
