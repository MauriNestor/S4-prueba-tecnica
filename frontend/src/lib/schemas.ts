import { z } from 'zod'

/**
 * Client-side mirror of the backend Bean Validation rules (StudentRequest, CourseRequest)
 * for instant feedback. The backend stays the source of truth.
 */
const code = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} es obligatorio`)
    .max(20, 'Máximo 20 caracteres')
    .regex(/^[A-Za-z0-9-]+$/, 'Solo letras, números y guiones')

export const studentSchema = z.object({
  studentCode: code('El código'),
  firstName: z.string().trim().min(1, 'El nombre es obligatorio').max(100, 'Máximo 100 caracteres'),
  lastName: z.string().trim().min(1, 'El apellido es obligatorio').max(100, 'Máximo 100 caracteres'),
})

export const courseSchema = z.object({
  code: code('El código'),
  title: z.string().trim().min(1, 'El título es obligatorio').max(150, 'Máximo 150 caracteres'),
  description: z.string().trim().max(1000, 'Máximo 1000 caracteres'),
})

export type StudentFormValues = z.infer<typeof studentSchema>
export type CourseFormValues = z.infer<typeof courseSchema>

export const DESCRIPTION_MAX_LENGTH = 1000
