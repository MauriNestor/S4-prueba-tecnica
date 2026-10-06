package com.hexagon.s4.student.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Payload for creating or replacing a student. */
public record StudentRequest(
        @NotBlank(message = "studentCode is required")
        @Size(max = 20, message = "studentCode must have at most 20 characters")
        @Pattern(regexp = "^\\s*[A-Za-z0-9-]+\\s*$", message = "studentCode may only contain letters, digits and '-'")
        String studentCode,

        @NotBlank(message = "firstName is required")
        @Size(max = 100, message = "firstName must have at most 100 characters")
        String firstName,

        @NotBlank(message = "lastName is required")
        @Size(max = 100, message = "lastName must have at most 100 characters")
        String lastName) {
}
