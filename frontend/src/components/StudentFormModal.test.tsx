import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { jsonResponse, renderWithProviders } from '../test/render'
import { StudentFormModal } from './StudentFormModal'

function fillForm(user: ReturnType<typeof userEvent.setup>, values: { code: string; first: string; last: string }) {
  return (async () => {
    await user.type(screen.getByLabelText(/código/i), values.code)
    await user.type(screen.getByLabelText(/nombre/i), values.first)
    await user.type(screen.getByLabelText(/apellido/i), values.last)
  })()
}

describe('StudentFormModal', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('validates on the client without calling the API', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const user = userEvent.setup()
    renderWithProviders(<StudentFormModal opened onClose={() => {}} />)

    await user.type(screen.getByLabelText(/código/i), 'bad code!')
    await user.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(await screen.findByText('Solo letras, números y guiones')).toBeInTheDocument()
    expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument()
    expect(screen.getByText('El apellido es obligatorio')).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('shows a duplicated code (409) on the code field', async () => {
    const conflict = { title: 'Conflict', status: 409, detail: 'A student with code S-0001 already exists' }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(conflict, 409)))
    const onClose = vi.fn()
    const user = userEvent.setup()
    renderWithProviders(<StudentFormModal opened onClose={onClose} />)

    await fillForm(user, { code: 's-0001', first: 'Ana', last: 'Pérez' })
    await user.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(await screen.findByText('Ya existe un estudiante con el código S-0001')).toBeInTheDocument()
    expect(screen.getByLabelText(/código/i)).toHaveAttribute('aria-invalid', 'true')
    expect(onClose).not.toHaveBeenCalled()
  })

  it('creates the student with trimmed values and closes', async () => {
    const now = new Date().toISOString()
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({ id: 7, studentCode: 'S-0100', firstName: 'Ana', lastName: 'Pérez', createdAt: now, updatedAt: now }, 201),
    )
    vi.stubGlobal('fetch', fetchMock)
    const onClose = vi.fn()
    const user = userEvent.setup()
    renderWithProviders(<StudentFormModal opened onClose={onClose} />)

    await fillForm(user, { code: 'S-0100', first: '  Ana ', last: 'Pérez' })
    await user.click(screen.getByRole('button', { name: 'Guardar' }))

    await waitFor(() => expect(onClose).toHaveBeenCalled())
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/students')
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body)).toEqual({ studentCode: 'S-0100', firstName: 'Ana', lastName: 'Pérez' })
  })

  it('prefills the form when editing', () => {
    const now = new Date().toISOString()
    const student = { id: 1, studentCode: 'S-0001', firstName: 'Ana', lastName: 'Pérez', createdAt: now, updatedAt: now }
    renderWithProviders(<StudentFormModal opened onClose={() => {}} student={student} />)

    expect(screen.getByText('Editar estudiante')).toBeInTheDocument()
    expect(screen.getByLabelText(/código/i)).toHaveValue('S-0001')
    expect(screen.getByRole('button', { name: 'Guardar cambios' })).toBeInTheDocument()
  })
})
