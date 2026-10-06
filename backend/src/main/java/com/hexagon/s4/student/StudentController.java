package com.hexagon.s4.student;

import java.net.URI;
import java.util.Set;

import jakarta.validation.Valid;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.hexagon.s4.common.web.PageResponse;
import com.hexagon.s4.common.web.SortValidator;
import com.hexagon.s4.student.dto.StudentRequest;
import com.hexagon.s4.student.dto.StudentResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Students", description = "Create, edit, delete, list and search students")
@RestController
@RequestMapping("/api/students")
public class StudentController {

    private static final Set<String> SORTABLE = Set.of("studentCode", "firstName", "lastName", "createdAt", "updatedAt");

    private final StudentService service;

    public StudentController(StudentService service) {
        this.service = service;
    }

    @Operation(summary = "List students", description = "Paged list. `search` matches code, first name, last name or full name (case-insensitive, contains). Sortable: studentCode, firstName, lastName, createdAt, updatedAt")
    @GetMapping
    public PageResponse<StudentResponse> list(
            @Parameter(description = "Free text matched against code, first name, last name and full name")
            @RequestParam(required = false) String search,
            @ParameterObject @PageableDefault(size = 20, sort = {"lastName", "firstName"}, direction = Sort.Direction.ASC) Pageable pageable) {
        SortValidator.requireAllowed(pageable.getSort(), SORTABLE);
        return service.list(search, pageable);
    }

    @Operation(summary = "Get a student by id")
    @GetMapping("/{id}")
    public StudentResponse get(@PathVariable Long id) {
        return service.get(id);
    }

    @Operation(summary = "Create a student", description = "The code is stored upper-cased and must be unique (409 otherwise).")
    @PostMapping
    public ResponseEntity<StudentResponse> create(@Valid @RequestBody StudentRequest request) {
        StudentResponse created = service.create(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.id())
                .toUri();
        return ResponseEntity.created(location).body(created);
    }

    @Operation(summary = "Replace a student")
    @PutMapping("/{id}")
    public StudentResponse update(@PathVariable Long id, @Valid @RequestBody StudentRequest request) {
        return service.update(id, request);
    }

    @Operation(summary = "Delete a student", description = "Also removes the student's enrollments.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
