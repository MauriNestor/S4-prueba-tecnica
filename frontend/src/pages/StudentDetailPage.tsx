import { Anchor, Breadcrumbs, Button, Group, SimpleGrid, Skeleton, Table, Text, Title } from '@mantine/core'
import { IconInfoCircle, IconPencil, IconPlus, IconStack2, IconTrash } from '@tabler/icons-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import { ApiError } from '../api/client'
import type { Course } from '../api/types'
import { CodeBadge } from '../components/CodeBadge'
import { ConfirmModal } from '../components/ConfirmModal'
import tableClasses from '../components/DataTable.module.css'
import { DeleteStudentModal } from '../components/DeleteStudentModal'
import { EnrollInCoursePicker } from '../components/EnrollPickers'
import { InfoField } from '../components/InfoField'
import { EmptyState, ErrorState, TableSkeletonRows } from '../components/ListStates'
import { NotFoundState } from '../components/NotFoundState'
import { SectionCard } from '../components/SectionCard'
import { Th } from '../components/SortableTh'
import { StudentFormModal } from '../components/StudentFormModal'
import { useUnenroll } from '../hooks/useEnrollments'
import { useLastDefined } from '../hooks/useLastDefined'
import { useStudent, useStudentClasses } from '../hooks/useStudents'
import { formatDateTime, fullName } from '../lib/format'
import { notifyError, notifySuccess } from '../lib/notify'

export function StudentDetailPage() {
  const id = Number(useParams().id)
  if (!Number.isInteger(id) || id <= 0) {
    return <NotFoundState message="El estudiante no existe." backTo="/estudiantes" backLabel="Volver a estudiantes" />
  }
  return <StudentDetail id={id} />
}

function StudentDetail({ id }: { id: number }) {
  const navigate = useNavigate()
  const studentQuery = useStudent(id)
  const classesQuery = useStudentClasses(id)
  const unenroll = useUnenroll()

  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [enrolling, setEnrolling] = useState(false)
  const [toRemove, setToRemove] = useState<Course | null>(null)
  const removing = useLastDefined(toRemove)

  const enrolledIds = useMemo(() => new Set(classesQuery.data?.map((course) => course.id)), [classesQuery.data])

  if (studentQuery.error instanceof ApiError && studentQuery.error.status === 404) {
    return <NotFoundState message="El estudiante pudo haber sido eliminado." backTo="/estudiantes" backLabel="Volver a estudiantes" />
  }
  if (studentQuery.isError) {
    return <ErrorState error={studentQuery.error} onRetry={() => studentQuery.refetch()} />
  }

  const student = studentQuery.data
  const classes = classesQuery.data

  const confirmRemove = () => {
    if (!student || !removing) return
    unenroll.mutate(
      { courseId: removing.id, studentId: student.id },
      {
        onSuccess: () => {
          notifySuccess('Inscripción eliminada', `${fullName(student)} ya no está en ${removing.title}`)
          setToRemove(null)
        },
        onError: (error) => notifyError(error),
      },
    )
  }

  return (
    <>
      <Breadcrumbs mb="md" separatorMargin={6} fz="sm">
        <Anchor component={Link} to="/estudiantes" c="gray.7">
          Estudiantes
        </Anchor>
        <Text fz="sm" fw={500}>
          {student ? fullName(student) : '…'}
        </Text>
      </Breadcrumbs>

      <Group justify="space-between" align="center" mb="xl" gap="md">
        {student ? (
          <Group gap="sm">
            <Title order={1}>{fullName(student)}</Title>
            <CodeBadge code={student.studentCode} radius="xl" />
          </Group>
        ) : (
          <Skeleton height={40} width={280} />
        )}
        <Group gap="sm">
          <Button variant="default" size="md" leftSection={<IconPencil size={18} />} onClick={() => setEditing(true)} disabled={!student}>
            Editar
          </Button>
          <Button variant="outline" color="red.9" size="md" leftSection={<IconTrash size={18} />} onClick={() => setDeleting(true)} disabled={!student}>
            Eliminar
          </Button>
        </Group>
      </Group>

      <SectionCard p="xl" mb="lg">
        <Title order={3} mb="lg" pb="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
          Información
        </Title>
        {student ? (
          <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing="xl" verticalSpacing="lg">
            <InfoField label="Código">
              <CodeBadge code={student.studentCode} color="gray" variant="outline" />
            </InfoField>
            <InfoField label="Nombre">{student.firstName}</InfoField>
            <InfoField label="Apellido">{student.lastName}</InfoField>
            <InfoField label="Creado el">{formatDateTime(student.createdAt)}</InfoField>
            <InfoField label="Actualizado el">{formatDateTime(student.updatedAt)}</InfoField>
          </SimpleGrid>
        ) : (
          <Skeleton height={96} />
        )}
      </SectionCard>

      <SectionCard>
        <Group justify="space-between" p="xl" pb="lg">
          <Group gap="xs">
            <Title order={3}>Clases inscritas</Title>
            {classes && (
              <Text fz="sm" fw={600} c="gray.7" bg="gray.1" px={10} py={2} style={{ borderRadius: 999 }}>
                {classes.length}
              </Text>
            )}
          </Group>
          <Button leftSection={<IconPlus size={18} />} onClick={() => setEnrolling(true)} disabled={!student}>
            Inscribir en clase
          </Button>
        </Group>

        {classesQuery.isError ? (
          <ErrorState error={classesQuery.error} onRetry={() => classesQuery.refetch()} />
        ) : classes && classes.length === 0 ? (
          <EmptyState
            icon={<IconStack2 size={26} />}
            title="Sin clases inscritas"
            description="Este estudiante no está inscrito en ninguna clase."
            action={
              <Button leftSection={<IconPlus size={18} />} onClick={() => setEnrolling(true)}>
                Inscribir en clase
              </Button>
            }
          />
        ) : (
          <Table.ScrollContainer minWidth={640}>
            <Table className={tableClasses.table} highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Th>Código</Th>
                  <Th>Título</Th>
                  <Th>Descripción</Th>
                  <Th ta="right">Acciones</Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {!classes ? (
                  <TableSkeletonRows rows={3} columns={4} />
                ) : (
                  classes.map((course) => (
                    <Table.Tr key={course.id} className={tableClasses.clickableRow} onClick={() => navigate(`/clases/${course.id}`)}>
                      <Table.Td>
                        <CodeBadge code={course.code} />
                      </Table.Td>
                      <Table.Td>
                        <Anchor component={Link} to={`/clases/${course.id}`} c="gray.9" fw={600} onClick={(e) => e.stopPropagation()}>
                          {course.title}
                        </Anchor>
                      </Table.Td>
                      <Table.Td className={tableClasses.description}>
                        <Text c="gray.7" fz="sm" truncate>
                          {course.description ?? '—'}
                        </Text>
                      </Table.Td>
                      <Table.Td ta="right">
                        <Button
                          variant="subtle"
                          color="red.9"
                          size="xs"
                          leftSection={<IconTrash size={16} />}
                          onClick={(e) => {
                            e.stopPropagation()
                            setToRemove(course)
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

      <Group gap={6} mt="md" c="dimmed">
        <IconInfoCircle size={16} />
        <Text fz="sm">Al eliminar un estudiante también se eliminan sus inscripciones.</Text>
      </Group>

      {student && (
        <>
          <StudentFormModal opened={editing} student={student} onClose={() => setEditing(false)} />
          <DeleteStudentModal
            student={deleting ? student : null}
            onClose={() => setDeleting(false)}
            onDeleted={() => navigate('/estudiantes', { replace: true })}
          />
          <EnrollInCoursePicker opened={enrolling} onClose={() => setEnrolling(false)} target={student} enrolledIds={enrolledIds} />
          <ConfirmModal
            opened={toRemove !== null}
            onClose={() => setToRemove(null)}
            onConfirm={confirmRemove}
            loading={unenroll.isPending}
            title={removing ? `¿Quitar a ${fullName(student)} de ${removing.title}?` : ''}
            message="Se elimina solo la inscripción; el estudiante y la clase se conservan."
            confirmLabel="Quitar"
          />
        </>
      )}
    </>
  )
}
