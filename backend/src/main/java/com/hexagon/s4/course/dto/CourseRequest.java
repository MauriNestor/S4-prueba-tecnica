package com.hexagon.s4.course.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Payload for creating or replacing a class. The description is optional. */
public record CourseRequest(
        @NotBlank(message = "code is required")
        @Size(max = 20, message = "code must have at most 20 characters")
        @Pattern(regexp = "^\\s*[A-Za-z0-9-]+\\s*$", message = "code may only contain letters, digits and '-'")
        String code,

        @NotBlank(message = "title is required")
        @Size(max = 150, message = "title must have at most 150 characters")
        String title,

        @Size(max = 1000, message = "description must have at most 1000 characters")
        String description) {
}
