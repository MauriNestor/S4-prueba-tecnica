package com.hexagon.s4.enrollment;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hexagon.s4.course.dto.CourseResponse;
import com.hexagon.s4.student.dto.StudentResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * Relation endpoints live here (not in the student/course controllers) so those
 * modules do not depend on enrollments.
 */
@Tag(name = "Enrollments", description = "Relate students and classes, and query the relation both ways")
@RestController
@RequestMapping("/api")
public class EnrollmentController {

    private final EnrollmentService service;

    public EnrollmentController(EnrollmentService service) {
        this.service = service;
    }

    @Operation(summary = "Students enrolled in a class", description = "Sorted by last name, first name.")
    @GetMapping("/classes/{classId}/students")
    public List<StudentResponse> studentsOfClass(@PathVariable Long classId) {
        return service.studentsOf(classId);
    }

    @Operation(summary = "Classes a student is enrolled in", description = "Sorted by class code.")
    @GetMapping("/students/{studentId}/classes")
    public List<CourseResponse> classesOfStudent(@PathVariable Long studentId) {
        return service.coursesOf(studentId);
    }

    @Operation(summary = "Enroll a student in a class",
            description = "Idempotent: repeating the call keeps a single enrollment. 404 if the student or class does not exist.")
    @PutMapping("/classes/{classId}/students/{studentId}")
    public ResponseEntity<Void> enroll(@PathVariable Long classId, @PathVariable Long studentId) {
        service.enroll(classId, studentId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Remove a student from a class", description = "404 if the student is not enrolled in the class.")
    @DeleteMapping("/classes/{classId}/students/{studentId}")
    public ResponseEntity<Void> unenroll(@PathVariable Long classId, @PathVariable Long studentId) {
        service.unenroll(classId, studentId);
        return ResponseEntity.noContent().build();
    }
}
