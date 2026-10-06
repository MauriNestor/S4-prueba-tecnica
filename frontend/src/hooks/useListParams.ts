import { useDebouncedValue } from '@mantine/hooks'
import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

export type SortDirection = 'asc' | 'desc'

export interface SortState {
  field: string
  direction: SortDirection
}

/**
 * Search, page and sort live in the URL (?q=&page=&sort=) so the back button,
 * reloads and shared links keep the exact list the user was looking at.
 */
export function useListParams(defaultSort: SortState) {
  const [params, setParams] = useSearchParams()

  const search = params.get('q') ?? ''
  const page = Math.max(1, Number(params.get('page')) || 1)
  const sort = parseSort(params.get('sort')) ?? defaultSort

  // The input updates instantly; the URL (and therefore the request) waits 300 ms.
  const [searchInput, setSearchInput] = useState(search)
  const [debouncedSearch] = useDebouncedValue(searchInput.trim(), 300)

  const update = useCallback(
    (changes: Record<string, string | null>) =>
      setParams(
        (current) => {
          const next = new URLSearchParams(current)
          for (const [key, value] of Object.entries(changes)) {
            if (value === null || value === '') next.delete(key)
            else next.set(key, value)
          }
          return next
        },
        { replace: true },
      ),
    [setParams],
  )

  useEffect(() => {
    if (debouncedSearch !== search) {
      update({ q: debouncedSearch, page: null })
    }
  }, [debouncedSearch, search, update])

  const setPage = (value: number) => update({ page: value > 1 ? String(value) : null })

  /** Clicking the active column flips the direction; a new column starts ascending. */
  const toggleSort = (field: string) => {
    const direction: SortDirection = sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc'
    update({ sort: `${field},${direction}`, page: null })
  }

  const clearSearch = () => {
    setSearchInput('')
    update({ q: null, page: null })
  }

  return {
    searchInput,
    setSearchInput,
    search,
    page,
    setPage,
    sort,
    sortParam: `${sort.field},${sort.direction}`,
    toggleSort,
    clearSearch,
  }
}

function parseSort(value: string | null): SortState | null {
  if (!value) return null
  const [field, direction] = value.split(',')
  if (!field || (direction !== 'asc' && direction !== 'desc')) return null
  return { field, direction }
}
