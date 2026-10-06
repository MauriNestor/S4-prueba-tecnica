package com.hexagon.s4.enrollment;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.hexagon.s4.common.exception.NotFoundException;
import com.hexagon.s4.course.Course;
import com.hexagon.s4.course.CourseService;
import com.hexagon.s4.student.Student;
import com.hexagon.s4.student.StudentService;

@ExtendWith(MockitoExtension.class)
class EnrollmentServiceTest {

    @Mock
    EnrollmentRepository repository;

    @Mock
    StudentService studentService;

    @Mock
    CourseService courseService;

    @InjectMocks
    EnrollmentService service;

    @Test
    void enrollCreatesEnrollmentWhenMissing() {
        when(courseService.findOrThrow(1L)).thenReturn(new Course("MATH-101", "Cálculo", null));
        when(studentService.findOrThrow(2L)).thenReturn(new Student("S-001", "Ana", "Pérez"));
        when(repository.existsByStudentIdAndCourseId(2L, 1L)).thenReturn(false);

        service.enroll(1L, 2L);

        verify(repository).save(any(Enrollment.class));
    }

    @Test
    void enrollIsIdempotent() {
        when(courseService.findOrThrow(1L)).thenReturn(new Course("MATH-101", "Cálculo", null));
        when(studentService.findOrThrow(2L)).thenReturn(new Student("S-001", "Ana", "Pérez"));
        when(repository.existsByStudentIdAndCourseId(2L, 1L)).thenReturn(true);

        service.enroll(1L, 2L);

        verify(repository, never()).save(any());
    }

    @Test
    void enrollFailsForUnknownClass() {
        when(courseService.findOrThrow(1L)).thenThrow(new NotFoundException("Class", 1L));

        assertThatThrownBy(() -> service.enroll(1L, 2L)).isInstanceOf(NotFoundException.class);
        verify(repository, never()).save(any());
    }

    @Test
    void unenrollFailsWhenNotEnrolled() {
        when(repository.deleteByStudentIdAndCourseId(2L, 1L)).thenReturn(0);

        assertThatThrownBy(() -> service.unenroll(1L, 2L))
                .isInstanceOf(NotFoundException.class)
                .hasMessage("Student 2 is not enrolled in class 1");
    }

    @Test
    void studentsOfUnknownClassFails() {
        when(courseService.findOrThrow(7L)).thenThrow(new NotFoundException("Class", 7L));

        assertThatThrownBy(() -> service.studentsOf(7L)).isInstanceOf(NotFoundException.class);
        verify(repository, never()).findStudentsByCourseId(any());
    }
}
