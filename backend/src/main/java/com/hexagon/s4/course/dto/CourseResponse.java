package com.hexagon.s4.course.dto;

import java.time.Instant;

import com.hexagon.s4.course.Course;

public record CourseResponse(
        Long id,
        String code,
        String title,
        String description,
        Instant createdAt,
        Instant updatedAt) {

    public static CourseResponse from(Course course) {
        return new CourseResponse(
                course.getId(),
                course.getCode(),
                course.getTitle(),
                course.getDescription(),
                course.getCreatedAt(),
                course.getUpdatedAt());
    }
}
