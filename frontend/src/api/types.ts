/** Mirrors the backend DTOs (backend/src/main/java/com/hexagon/s4/.../dto). */

export interface Student {
  id: number
  studentCode: string
  firstName: string
  lastName: string
  createdAt: string
  updatedAt: string
}

export interface StudentInput {
  studentCode: string
  firstName: string
  lastName: string
}

/** A "class" in the domain. Named Course in code, as in the backend. */
export interface Course {
  id: number
  code: string
  title: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface CourseInput {
  code: string
  title: string
  description: string | null
}

export interface Page<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface ListParams {
  search?: string
  /** Zero-based, as the API expects. */
  page: number
  size: number
  /** `field,asc|desc` */
  sort?: string
}
