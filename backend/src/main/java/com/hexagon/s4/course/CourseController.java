package com.hexagon.s4.course;

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
import com.hexagon.s4.course.dto.CourseRequest;
import com.hexagon.s4.course.dto.CourseResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Classes", description = "Create, edit, delete, list and search classes")
@RestController
@RequestMapping("/api/classes")
public class CourseController {

    private static final Set<String> SORTABLE = Set.of("code", "title", "createdAt", "updatedAt");

    private final CourseService service;

    public CourseController(CourseService service) {
        this.service = service;
    }

    @Operation(summary = "List classes", description = "Paged list. `search` matches code, title or description (case-insensitive, contains). Sortable: code, title, createdAt, updatedAt")
    @GetMapping
    public PageResponse<CourseResponse> list(
            @Parameter(description = "Free text matched against code, title and description")
            @RequestParam(required = false) String search,
            @ParameterObject @PageableDefault(size = 20, sort = "code", direction = Sort.Direction.ASC) Pageable pageable) {
        SortValidator.requireAllowed(pageable.getSort(), SORTABLE);
        return service.list(search, pageable);
    }

    @Operation(summary = "Get a class by id")
    @GetMapping("/{id}")
    public CourseResponse get(@PathVariable Long id) {
        return service.get(id);
    }

    @Operation(summary = "Create a class", description = "The code is stored upper-cased and must be unique (409 otherwise).")
    @PostMapping
    public ResponseEntity<CourseResponse> create(@Valid @RequestBody CourseRequest request) {
        CourseResponse created = service.create(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.id())
                .toUri();
        return ResponseEntity.created(location).body(created);
    }

    @Operation(summary = "Replace a class")
    @PutMapping("/{id}")
    public CourseResponse update(@PathVariable Long id, @Valid @RequestBody CourseRequest request) {
        return service.update(id, request);
    }

    @Operation(summary = "Delete a class", description = "Also removes its enrollments.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
