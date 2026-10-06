package com.hexagon.s4.student.dto;

import java.time.Instant;

import com.hexagon.s4.student.Student;

public record StudentResponse(
        Long id,
        String studentCode,
        String firstName,
        String lastName,
        Instant createdAt,
        Instant updatedAt) {

    public static StudentResponse from(Student student) {
        return new StudentResponse(
                student.getId(),
                student.getStudentCode(),
                student.getFirstName(),
                student.getLastName(),
                student.getCreatedAt(),
                student.getUpdatedAt());
    }
}
