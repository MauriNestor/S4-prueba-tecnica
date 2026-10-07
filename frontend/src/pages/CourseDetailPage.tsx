import { Anchor, Breadcrumbs, Button, Group, Skeleton, Stack, Table, Text, Title } from '@mantine/core'
import { IconPencil, IconTrash, IconUserPlus, IconUsers } from '@tabler/icons-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import { ApiError } from '../api/client'
import type { Student } from '../api/types'
import { CodeBadge } from '../components/CodeBadge'
import { ConfirmModal } from '../components/ConfirmModal'
import { CourseFormModal } from '../components/CourseFormModal'
import tableClasses from '../components/DataTable.module.css'
import { DeleteCourseModal } from '../components/DeleteCourseModal'
import { EnrollStudentPicker } from '../components/EnrollPickers'
import { EmptyState, ErrorState, TableSkeletonRows } from '../components/ListStates'
import { NotFoundState } from '../components/NotFoundState'
import { SectionCard } from '../components/SectionCard'
import { Th } from '../components/SortableTh'
import { useCourse, useCourseStudents } from '../hooks/useCourses'
import { useUnenroll } from '../hooks/useEnrollments'
import { useLastDefined } from '../hooks/useLastDefined'
import { formatDate, fullName } from '../lib/format'
import { notifyError, notifySuccess } from '../lib/notify'

export function CourseDetailPage() {
  const id = Number(useParams().id)
  if (!Number.isInteger(id) || id <= 0) {
    return <NotFoundState message="La clase no existe." backTo="/clases" backLabel="Volver a clases" />
  }
  return <CourseDetail id={id} />
}

function CourseDetail({ id }: { id: number }) {
  const navigate = useNavigate()
  const courseQuery = useCourse(id)
  const studentsQuery = useCourseStudents(id)
  const unenroll = useUnenroll()

  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [enrolling, setEnrolling] = useState(false)
  const [toRemove, setToRemove] = useState<Student | null>(null)
  const removing = useLastDefined(toRemove)

  const enrolledIds = useMemo(() => new Set(studentsQuery.data?.map((student) => student.id)), [studentsQuery.data])

  if (courseQuery.error instanceof ApiError && courseQuery.error.status === 404) {
    return <NotFoundState message="La clase pudo haber sido eliminada." backTo="/clases" backLabel="Volver a clases" />
  }
  if (courseQuery.isError) {
    return <ErrorState error={courseQuery.error} onRetry={() => courseQuery.refetch()} />
  }

  const course = courseQuery.data
  const students = studentsQuery.data

  const confirmRemove = () => {
    if (!course || !removing) return
    unenroll.mutate(
      { courseId: course.id, studentId: removing.id },
      {
        onSuccess: () => {
          notifySuccess('Inscripción eliminada', `${fullName(removing)} ya no está en ${course.title}`)
          setToRemove(null)
        },
        onError: (error) => notifyError(error),
      },
    )
  }

  const enrollButton = (
    <Button leftSection={<IconUserPlus size={18} />} onClick={() => setEnrolling(true)} disabled={!course}>
      Inscribir estudiante
    </Button>
  )

  return (
    <>
      <Breadcrumbs mb="md" separatorMargin={6} fz="sm">
        <Anchor component={Link} to="/clases" c="gray.7">
          Clases
        </Anchor>
        <Text fz="sm" fw={500}>
          {course?.code ?? '…'}
        </Text>
      </Breadcrumbs>

      <SectionCard p="xl" mb="lg">
        {course ? (
          <Group justify="space-between" align="flex-start" gap="md">
            <Stack gap="xs" style={{ flex: 1, minWidth: 260 }}>
              <Group gap="sm">
                <Title order={1}>{course.title}</Title>
                <CodeBadge code={course.code} radius="xl" />
              </Group>
              <Text c={course.description ? 'gray.8' : 'dimmed'} fz="lg">
                {course.description ?? 'Sin descripción.'}
              </Text>
              <Text fz="sm" c="dimmed">
                Creada el {formatDate(course.createdAt)} · Actualizada el {formatDate(course.updatedAt)}
              </Text>
            </Stack>
            <Group gap="sm">
              <Button variant="default" size="md" leftSection={<IconPencil size={18} />} onClick={() => setEditing(true)}>
                Editar
              </Button>
              <Button variant="outline" color="red.9" size="md" leftSection={<IconTrash size={18} />} onClick={() => setDeleting(true)}>
                Eliminar
              </Button>
            </Group>
          </Group>
        ) : (
          <Stack>
            <Skeleton height={40} width={320} />
            <Skeleton height={20} width="70%" />
          </Stack>
        )}
      </SectionCard>

      <SectionCard>
        <Group justify="space-between" p="xl" pb="lg">
          <Group gap="xs">
            <Title order={3}>Estudiantes inscritos</Title>
            {students && (
              <Text fz="sm" fw={600} c="gray.7" bg="gray.1" px={10} py={2} style={{ borderRadius: 999 }}>
                {students.length}
              </Text>
            )}
          </Group>
          {enrollButton}
        </Group>

        {studentsQuery.isError ? (
          <ErrorState error={studentsQuery.error} onRetry={() => studentsQuery.refetch()} />
        ) : students && students.length === 0 ? (
          <EmptyState
            icon={<IconUsers size={26} />}
            title="Ningún estudiante inscrito"
            description="Ninguna persona está inscrita en esta clase todavía."
            action={enrollButton}
          />
        ) : (
          <Table.ScrollContainer minWidth={520}>
            <Table className={tableClasses.table} highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Th>Código</Th>
                  <Th>Nombre completo</Th>
                  <Th ta="right">Acciones</Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {!students ? (
                  <TableSkeletonRows rows={3} columns={3} />
                ) : (
                  students.map((student) => (
                    <Table.Tr key={student.id} className={tableClasses.clickableRow} onClick={() => navigate(`/estudiantes/${student.id}`)}>
                      <Table.Td>
                        <CodeBadge code={student.studentCode} />
                      </Table.Td>
                      <Table.Td>
                        <Anchor component={Link} to={`/estudiantes/${student.id}`} c="gray.9" fw={600} onClick={(e) => e.stopPropagation()}>
                          {fullName(student)}
                        </Anchor>
                      </Table.Td>
                      <Table.Td ta="right">
                        <Button
                          variant="subtle"
                          color="red.9"
                          size="xs"
                          leftSection={<IconTrash size={16} />}
                          onClick={(e) => {
                            e.stopPropagation()
                            setToRemove(student)
                          }}
                        >
                          Quitar
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
      </SectionCard>

      {course && (
        <>
          <CourseFormModal opened={editing} course={course} onClose={() => setEditing(false)} />
          <DeleteCourseModal
            course={deleting ? course : null}
            onClose={() => setDeleting(false)}
            onDeleted={() => navigate('/clases', { replace: true })}
          />
          <EnrollStudentPicker opened={enrolling} onClose={() => setEnrolling(false)} target={course} enrolledIds={enrolledIds} />
          <ConfirmModal
            opened={toRemove !== null}
            onClose={() => setToRemove(null)}
            onConfirm={confirmRemove}
            loading={unenroll.isPending}
            title={removing ? `¿Quitar a ${fullName(removing)} de ${course.title}?` : ''}
            message="Se elimina solo la inscripción; el estudiante y la clase se conservan."
            confirmLabel="Quitar"
          />
        </>
      )}
    </>
  )
}
