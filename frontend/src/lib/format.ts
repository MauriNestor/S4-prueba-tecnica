const dateFormat = new Intl.DateTimeFormat('es', { day: '2-digit', month: '2-digit', year: 'numeric' })
const dateTimeFormat = new Intl.DateTimeFormat('es', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

/** 14/03/2025 */
export const formatDate = (iso: string) => dateFormat.format(new Date(iso))

/** 14/03/2025, 10:24 */
export const formatDateTime = (iso: string) => dateTimeFormat.format(new Date(iso))

export const fullName = (person: { firstName: string; lastName: string }) =>
  `${person.firstName} ${person.lastName}`

/** pluralize(3, 'inscripción', 'inscripciones') -> "3 inscripciones" */
export const pluralize = (count: number, singular: string, plural: string) =>
  `${count} ${count === 1 ? singular : plural}`
