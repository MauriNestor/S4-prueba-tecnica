import { Navigate, Route, Routes } from 'react-router'

import { AppLayout } from './components/AppLayout'
import { CourseDetailPage } from './pages/CourseDetailPage'
import { CoursesPage } from './pages/CoursesPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { StudentDetailPage } from './pages/StudentDetailPage'
import { StudentsPage } from './pages/StudentsPage'

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/estudiantes" replace />} />
        <Route path="estudiantes" element={<StudentsPage />} />
        <Route path="estudiantes/:id" element={<StudentDetailPage />} />
        <Route path="clases" element={<CoursesPage />} />
        <Route path="clases/:id" element={<CourseDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
