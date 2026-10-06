import { afterEach, describe, expect, it, vi } from 'vitest'

import { jsonResponse } from '../test/render'
import { ApiError, request, toQueryString } from './client'

describe('request', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('returns the parsed JSON body on success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ id: 1 })))

    await expect(request('/students/1')).resolves.toEqual({ id: 1 })
    expect(fetch).toHaveBeenCalledWith('/api/students/1', expect.any(Object))
  })

  it('returns undefined for 204 No Content', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 204 })))

    await expect(request('/students/1', { method: 'DELETE' })).resolves.toBeUndefined()
  })

  it('turns a Problem Detail into an ApiError with field errors', async () => {
    const problem = {
      title: 'Validation failed',
      status: 400,
      detail: 'One or more fields are invalid',
      errors: { studentCode: 'studentCode is required' },
    }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(problem, 400)))

    const error = await request('/students', { method: 'POST', body: '{}' }).catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({
      status: 400,
      message: 'One or more fields are invalid',
      fieldErrors: { studentCode: 'studentCode is required' },
    })
  })

  it('reports an unreachable server as status 0', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

    await expect(request('/students')).rejects.toMatchObject({ status: 0, message: 'No se pudo conectar con el servidor' })
  })

  it('sends JSON content type only when there is a body', async () => {
    const fetchMock = vi.fn().mockImplementation(async () => jsonResponse({}))
    vi.stubGlobal('fetch', fetchMock)

    await request('/students', { method: 'POST', body: '{}' })
    await request('/students')

    const headersOf = (call: number) => fetchMock.mock.calls[call][1].headers as Headers
    expect(headersOf(0).get('Content-Type')).toBe('application/json')
    expect(headersOf(1).get('Content-Type')).toBeNull()
  })
})

describe('toQueryString', () => {
  it('skips empty values', () => {
    expect(toQueryString({ search: '', page: 0, size: 20, sort: undefined })).toBe('?page=0&size=20')
    expect(toQueryString({})).toBe('')
  })
})
