import { ActionIcon, Anchor, Button, Group, Table, Text, Tooltip } from '@mantine/core'
import { IconPencil, IconPlus, IconStack2, IconTrash } from '@tabler/icons-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

import type { Course } from '../api/types'
import { CodeBadge } from '../components/CodeBadge'
import { CourseFormModal } from '../components/CourseFormModal'
import tableClasses from '../components/DataTable.module.css'
import { DeleteCourseModal } from '../components/DeleteCourseModal'
import { ListFooter } from '../components/ListFooter'
import { EmptyState, ErrorState, NoResultsState, TableSkeletonRows } from '../components/ListStates'
import { PageHeader } from '../components/PageHeader'
import { SearchInput } from '../components/SearchInput'
import { SectionCard } from '../components/SectionCard'
import { SortableTh, Th } from '../components/SortableTh'
import { useCourseList } from '../hooks/useCourses'
import { useListParams } from '../hooks/useListParams'
import { formatDate, pluralize } from '../lib/format'

const PAGE_SIZE = 20
const COLUMNS = 5

export function CoursesPage() {
  const navigate = useNavigate()
  const list = useListParams({ field: 'code', direction: 'asc' })
  const query = useCourseList({
    search: list.search || undefined,
    page: list.page - 1,
    size: PAGE_SIZE,
    sort: list.sortParam,
  })

  const [form, setForm] = useState<{ opened: boolean; course?: Course }>({ opened: false })
  const [toDelete, setToDelete] = useState<Course | null>(null)

  const data = query.data
  const total = data?.totalElements

  const createButton = (
    <Button leftSection={<IconPlus size={18} />} onClick={() => setForm({ opened: true })} size="md">
      Nueva clase
    </Button>
  )

  return (
    <>
      <PageHeader
        title="Clases"
        badge={total === undefined ? undefined : list.search ? pluralize(total, 'resultado', 'resultados') : pluralize(total, 'clase', 'clases')}
        description="Catálogo de clases con su código, título y descripción."
        actions={createButton}
      />

      <SectionCard p="md" mb="lg">
        <SearchInput value={list.searchInput} onChange={list.setSearchInput} placeholder="Buscar por código, título o descripción…" />
      </SectionCard>

      <SectionCard style={{ overflow: 'hidden' }}>
        {query.isError && !data ? (
          <ErrorState error={query.error} onRetry={() => query.refetch()} />
        ) : data && data.content.length === 0 ? (
          list.search ? (
            <NoResultsState search={list.search} onClear={list.clearSearch} />
          ) : (
            <EmptyState
              icon={<IconStack2 size={26} />}
              title="Aún no hay clases"
              description="Crea la primera para empezar a inscribir estudiantes."
              action={createButton}
            />
          )
        ) : (
          <>
            <Table.ScrollContainer minWidth={820}>
              <Table className={tableClasses.table} highlightOnHover style={{ opacity: query.isPlaceholderData ? 0.6 : 1 }}>
                <Table.Thead>
                  <Table.Tr>
                    <SortableTh field="code" sort={list.sort} onSort={list.toggleSort}>
                      Código
                    </SortableTh>
                    <SortableTh field="title" sort={list.sort} onSort={list.toggleSort}>
                      Título
                    </SortableTh>
                    <Th>Descripción</Th>
                    <SortableTh field="updatedAt" sort={list.sort} onSort={list.toggleSort}>
                      Actualizado
                    </SortableTh>
                    <Th ta="right">Acciones</Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {!data ? (
                    <TableSkeletonRows columns={COLUMNS} />
                  ) : (
                    data.content.map((course) => (
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
                          {course.description ? (
                            <Text c="gray.7" fz="sm" lineClamp={2}>
                              {course.description}
                            </Text>
                          ) : (
                            <Text c="gray.5">—</Text>
                          )}
                        </Table.Td>
                        <Table.Td>
                          <Text c="gray.7" fz="sm">
                            {formatDate(course.updatedAt)}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Group gap={4} justify="flex-end" wrap="nowrap" onClick={(e) => e.stopPropagation()}>
                            <Tooltip label="Editar">
                              <ActionIcon variant="subtle" color="gray" size="lg" aria-label={`Editar ${course.code}`} onClick={() => setForm({ opened: true, course })}>
                                <IconPencil size={18} />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Eliminar">
                              <ActionIcon variant="subtle" color="red.9" size="lg" aria-label={`Eliminar ${course.code}`} onClick={() => setToDelete(course)}>
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
                noun={{ singular: 'clase', plural: 'clases' }}
                onPageChange={list.setPage}
              />
            )}
          </>
        )}
      </SectionCard>

      <CourseFormModal opened={form.opened} course={form.course} onClose={() => setForm({ opened: false, course: form.course })} />
      <DeleteCourseModal course={toDelete} onClose={() => setToDelete(null)} />
    </>
  )
}
