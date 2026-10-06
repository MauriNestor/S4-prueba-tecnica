import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Group, Modal, Stack, TextInput } from '@mantine/core'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import type { Student } from '../api/types'
import { useSaveStudent } from '../hooks/useStudents'
import { fullName } from '../lib/format'
import { applyApiErrors } from '../lib/forms'
import { notifySuccess } from '../lib/notify'
import { type StudentFormValues, studentSchema } from '../lib/schemas'

const EMPTY: StudentFormValues = { studentCode: '', firstName: '', lastName: '' }
const FIELDS = ['studentCode', 'firstName', 'lastName'] as const

interface StudentFormModalProps {
  opened: boolean
  onClose: () => void
  /** When present the form edits this student; otherwise it creates one. */
  student?: Student
  onSaved?: (student: Student) => void
}

export function StudentFormModal({ opened, onClose, student, onSaved }: StudentFormModalProps) {
  const { mutate: save, reset: resetMutation, isPending } = useSaveStudent()
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<StudentFormValues>({ resolver: zodResolver(studentSchema), defaultValues: EMPTY })

  // Load the student being edited (or clear the form) every time the modal opens.
  useEffect(() => {
    if (opened) {
      reset(student ? { studentCode: student.studentCode, firstName: student.firstName, lastName: student.lastName } : EMPTY)
      resetMutation()
    }
  }, [opened, student, reset, resetMutation])

  const onSubmit = handleSubmit((values) =>
    save(
      { id: student?.id, input: values },
      {
        onSuccess: (saved) => {
          notifySuccess(student ? 'Estudiante actualizado' : 'Estudiante creado', `${fullName(saved)} (${saved.studentCode})`)
          onClose()
          onSaved?.(saved)
        },
        onError: (error) =>
          applyApiErrors(error, setError, FIELDS, {
            field: 'studentCode',
            message: `Ya existe un estudiante con el código ${values.studentCode.toUpperCase()}`,
          }),
      },
    ),
  )

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={student ? 'Editar estudiante' : 'Nuevo estudiante'}
      size={480}
      closeOnClickOutside={!isPending}
      styles={{ title: { fontFamily: 'var(--mantine-font-family-headings)', fontWeight: 700, fontSize: 22 } }}
    >
      <form onSubmit={onSubmit} noValidate>
        <Stack gap="md">
          <TextInput
            label="Código"
            withAsterisk
            placeholder="S-0001"
            description="Letras, números y guiones. Se guarda en mayúsculas."
            inputWrapperOrder={['label', 'input', 'error', 'description']}
            styles={{ input: { fontFamily: 'var(--mantine-font-family-monospace)' } }}
            error={errors.studentCode?.message}
            data-autofocus
            {...register('studentCode')}
          />
          <TextInput label="Nombre" withAsterisk placeholder="Ana" error={errors.firstName?.message} {...register('firstName')} />
          <TextInput label="Apellido" withAsterisk placeholder="Pérez" error={errors.lastName?.message} {...register('lastName')} />
        </Stack>
        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" loading={isPending}>
            {student ? 'Guardar cambios' : 'Guardar'}
          </Button>
        </Group>
      </form>
    </Modal>
  )
}
