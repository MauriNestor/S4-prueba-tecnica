package com.hexagon.s4.enrollment;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hexagon.s4.common.exception.NotFoundException;
import com.hexagon.s4.course.Course;
import com.hexagon.s4.course.CourseService;
import com.hexagon.s4.course.dto.CourseResponse;
import com.hexagon.s4.student.Student;
import com.hexagon.s4.student.StudentService;
import com.hexagon.s4.student.dto.StudentResponse;

/**
 * Manages the student <-> class relation. Existence checks go through the other
 * modules' services, so this module never touches their repositories directly.
 */
@Service
@Transactional(readOnly = true)
public class EnrollmentService {

    private final EnrollmentRepository repository;
    private final StudentService studentService;
    private final CourseService courseService;

    public EnrollmentService(EnrollmentRepository repository, StudentService studentService, CourseService courseService) {
        this.repository = repository;
        this.studentService = studentService;
        this.courseService = courseService;
    }

    public List<StudentResponse> studentsOf(Long courseId) {
        courseService.findOrThrow(courseId);
        return repository.findStudentsByCourseId(courseId).stream().map(StudentResponse::from).toList();
    }

    public List<CourseResponse> coursesOf(Long studentId) {
        studentService.findOrThrow(studentId);
        return repository.findCoursesByStudentId(studentId).stream().map(CourseResponse::from).toList();
    }

    /**
     * Idempotent: enrolling a student who is already in the class changes nothing.
     * The unique constraint still protects against two concurrent requests.
     */
    @Transactional
    public void enroll(Long courseId, Long studentId) {
        Course course = courseService.findOrThrow(courseId);
        Student student = studentService.findOrThrow(studentId);
        if (!repository.existsByStudentIdAndCourseId(studentId, courseId)) {
            repository.save(new Enrollment(student, course));
        }
    }

    @Transactional
    public void unenroll(Long courseId, Long studentId) {
        courseService.findOrThrow(courseId);
        studentService.findOrThrow(studentId);
        if (repository.deleteByStudentIdAndCourseId(studentId, courseId) == 0) {
            throw new NotFoundException("Student %d is not enrolled in class %d".formatted(studentId, courseId));
        }
    }
}
