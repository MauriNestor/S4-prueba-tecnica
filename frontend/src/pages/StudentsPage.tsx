import { ActionIcon, Anchor, Button, Group, Table, Text, Tooltip } from '@mantine/core'
import { IconPencil, IconTrash, IconUserPlus, IconUsers } from '@tabler/icons-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

import type { Student } from '../api/types'
import { CodeBadge } from '../components/CodeBadge'
import tableClasses from '../components/DataTable.module.css'
import { DeleteStudentModal } from '../components/DeleteStudentModal'
import { ListFooter } from '../components/ListFooter'
import { EmptyState, ErrorState, NoResultsState, TableSkeletonRows } from '../components/ListStates'
import { PageHeader } from '../components/PageHeader'
import { SearchInput } from '../components/SearchInput'
import { SectionCard } from '../components/SectionCard'
import { SortableTh, Th } from '../components/SortableTh'
import { StudentFormModal } from '../components/StudentFormModal'
import { useListParams } from '../hooks/useListParams'
import { useStudentList } from '../hooks/useStudents'
import { formatDate, pluralize } from '../lib/format'

const PAGE_SIZE = 20
const COLUMNS = 5

export function StudentsPage() {
  const navigate = useNavigate()
  const list = useListParams({ field: 'lastName', direction: 'asc' })
  const query = useStudentList({
    search: list.search || undefined,
    page: list.page - 1,
    size: PAGE_SIZE,
    sort: list.sortParam,
  })

  const [form, setForm] = useState<{ opened: boolean; student?: Student }>({ opened: false })
  const [toDelete, setToDelete] = useState<Student | null>(null)

  const data = query.data
  const total = data?.totalElements

  const openCreate = () => setForm({ opened: true })
  const createButton = (
    <Button leftSection={<IconUserPlus size={18} />} onClick={openCreate} size="md">
      Nuevo estudiante
    </Button>
  )

  return (
    <>
      <PageHeader
        title="Estudiantes"
        badge={total === undefined ? undefined : list.search ? pluralize(total, 'resultado', 'resultados') : pluralize(total, 'estudiante', 'estudiantes')}
        description="Directorio de estudiantes registrados y sus inscripciones."
        actions={createButton}
      />

      <SectionCard p="md" mb="lg">
        <SearchInput value={list.searchInput} onChange={list.setSearchInput} placeholder="Buscar por código, nombre o apellido…" />
      </SectionCard>

      <SectionCard style={{ overflow: 'hidden', borderColor: 'var(--mantine-color-gray-2)' }}>
        {query.isError && !data ? (
          <ErrorState error={query.error} onRetry={() => query.refetch()} />
        ) : data && data.content.length === 0 ? (
          list.search ? (
            <NoResultsState search={list.search} onClear={list.clearSearch} />
          ) : (
            <EmptyState
              icon={<IconUsers size={26} />}
              title="Aún no hay estudiantes"
              description="Crea el primero para empezar a inscribirlo en clases."
              action={createButton}
            />
          )
        ) : (
          <>
            <Table.ScrollContainer minWidth={720}>
              <Table className={tableClasses.table} highlightOnHover verticalSpacing="sm" style={{ opacity: query.isPlaceholderData ? 0.6 : 1 }}>
                <Table.Thead>
                  <Table.Tr>
                    <SortableTh field="studentCode" sort={list.sort} onSort={list.toggleSort}>
                      Código
                    </SortableTh>
                    <SortableTh field="firstName" sort={list.sort} onSort={list.toggleSort}>
                      Nombre
                    </SortableTh>
                    <SortableTh field="lastName" sort={list.sort} onSort={list.toggleSort}>
                      Apellido
                    </SortableTh>
                    <SortableTh field="updatedAt" sort={list.sort} onSort={list.toggleSort}>
                      Última actualización
                    </SortableTh>
                    <Th ta="right">Acciones</Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {!data ? (
                    <TableSkeletonRows columns={COLUMNS} />
                  ) : (
                    data.content.map((student) => (
                      <Table.Tr
                        key={student.id}
                        className={tableClasses.clickableRow}
                        onClick={() => navigate(`/estudiantes/${student.id}`)}
                      >
                        <Table.Td>
                          <CodeBadge code={student.studentCode} />
                        </Table.Td>
                        <Table.Td>
                          <Anchor component={Link} to={`/estudiantes/${student.id}`} c="gray.9" fw={600} onClick={(e) => e.stopPropagation()}>
                            {student.firstName}
                          </Anchor>
                        </Table.Td>
                        <Table.Td>
                          <Text c="gray.8">{student.lastName}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text c="gray.7" fz="sm">
                            {formatDate(student.updatedAt)}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Group gap={4} justify="flex-end" wrap="nowrap" onClick={(e) => e.stopPropagation()}>
                            <Tooltip label="Editar">
                              <ActionIcon variant="subtle" color="gray" size="lg" aria-label={`Editar ${student.studentCode}`} onClick={() => setForm({ opened: true, student })}>
                                <IconPencil size={18} />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Eliminar">
                              <ActionIcon variant="subtle" color="red.9" size="lg" aria-label={`Eliminar ${student.studentCode}`} onClick={() => setToDelete(student)}>
                                <IconTrash size={18} />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  )}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
            {data && (
              <ListFooter
                page={list.page}
                size={PAGE_SIZE}
                totalElements={data.totalElements}
                totalPages={data.totalPages}
                noun={{ singular: 'estudiante', plural: 'estudiantes' }}
                onPageChange={list.setPage}
              />
            )}
          </>
        )}
      </SectionCard>

      <StudentFormModal opened={form.opened} student={form.student} onClose={() => setForm({ opened: false, student: form.student })} />
      <DeleteStudentModal student={toDelete} onClose={() => setToDelete(null)} />
    </>
  )
}
