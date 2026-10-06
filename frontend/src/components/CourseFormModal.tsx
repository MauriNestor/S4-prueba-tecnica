import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Divider, Group, Modal, Stack, Text, TextInput, Textarea } from '@mantine/core'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'

import type { Course } from '../api/types'
import { useSaveCourse } from '../hooks/useCourses'
import { applyApiErrors } from '../lib/forms'
import { notifySuccess } from '../lib/notify'
import { type CourseFormValues, courseSchema, DESCRIPTION_MAX_LENGTH } from '../lib/schemas'

const EMPTY: CourseFormValues = { code: '', title: '', description: '' }
const FIELDS = ['code', 'title', 'description'] as const

interface CourseFormModalProps {
  opened: boolean
  onClose: () => void
  /** When present the form edits this class; otherwise it creates one. */
  course?: Course
}

export function CourseFormModal({ opened, onClose, course }: CourseFormModalProps) {
  const { mutate: save, reset: resetMutation, isPending } = useSaveCourse()
  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors },
  } = useForm<CourseFormValues>({ resolver: zodResolver(courseSchema), defaultValues: EMPTY })

  useEffect(() => {
    if (opened) {
      reset(course ? { code: course.code, title: course.title, description: course.description ?? '' } : EMPTY)
      resetMutation()
    }
  }, [opened, course, reset, resetMutation])

  const descriptionLength = useWatch({ control, name: 'description' })?.length ?? 0

  const onSubmit = handleSubmit((values) =>
    save(
      // an empty description is sent as null (the backend stores it as null too)
      { id: course?.id, input: { ...values, description: values.description || null } },
      {
        onSuccess: (saved) => {
          notifySuccess(course ? 'Clase actualizada' : 'Clase creada', `${saved.code} · ${saved.title}`)
          onClose()
        },
        onError: (error) =>
          applyApiErrors(error, setError, FIELDS, {
            field: 'code',
            message: `Ya existe una clase con el código ${values.code.toUpperCase()}`,
          }),
      },
    ),
  )

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={course ? 'Editar clase' : 'Nueva clase'}
      size={560}
      closeOnClickOutside={!isPending}
      styles={{ title: { fontFamily: 'var(--mantine-font-family-headings)', fontWeight: 700, fontSize: 22 } }}
    >
      <form onSubmit={onSubmit} noValidate>
        <Stack gap="md">
          <TextInput
            label="Código"
            withAsterisk
            placeholder="MATH-101"
            description="Letras, números y guiones. Se guarda en mayúsculas."
            inputWrapperOrder={['label', 'input', 'error', 'description']}
            styles={{ input: { fontFamily: 'var(--mantine-font-family-monospace)' } }}
            error={errors.code?.message}
            data-autofocus
            {...register('code')}
          />
          <TextInput label="Título" withAsterisk placeholder="Cálculo I" error={errors.title?.message} {...register('title')} />
          <div>
            <Textarea
              label={
                <>
                  Descripción{' '}
                  <Text span c="dimmed" fw={400} inherit>
                    (Opcional)
                  </Text>
                </>
              }
              placeholder="Temas principales de la clase…"
              autosize
              minRows={4}
              maxRows={8}
              error={errors.description?.message}
              {...register('description')}
            />
            <Text fz="xs" ta="right" mt={4} c={descriptionLength > DESCRIPTION_MAX_LENGTH ? 'red.9' : 'dimmed'}>
              {descriptionLength}/{DESCRIPTION_MAX_LENGTH}
            </Text>
          </div>
        </Stack>
        <Divider my="lg" color="gray.2" />
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" loading={isPending}>
            {course ? 'Guardar cambios' : 'Guardar'}
          </Button>
        </Group>
      </form>
    </Modal>
  )
}
