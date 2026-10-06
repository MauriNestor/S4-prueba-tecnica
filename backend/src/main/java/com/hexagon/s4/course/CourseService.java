package com.hexagon.s4.course;

import java.util.Locale;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hexagon.s4.common.exception.ConflictException;
import com.hexagon.s4.common.exception.NotFoundException;
import com.hexagon.s4.common.web.PageResponse;
import com.hexagon.s4.common.web.SearchPatterns;
import com.hexagon.s4.course.dto.CourseRequest;
import com.hexagon.s4.course.dto.CourseResponse;

@Service
@Transactional(readOnly = true)
public class CourseService {

    private final CourseRepository repository;

    public CourseService(CourseRepository repository) {
        this.repository = repository;
    }

    public PageResponse<CourseResponse> list(String search, Pageable pageable) {
        Page<Course> page = SearchPatterns.isBlank(search)
                ? repository.findAll(pageable)
                : repository.search(SearchPatterns.contains(search), pageable);
        return PageResponse.from(page, CourseResponse::from);
    }

    public CourseResponse get(Long id) {
        return CourseResponse.from(findOrThrow(id));
    }

    @Transactional
    public CourseResponse create(CourseRequest request) {
        String code = normalizeCode(request.code());
        if (repository.existsByCode(code)) {
            throw duplicatedCode(code);
        }
        Course course = new Course(code, request.title().trim(), normalizeDescription(request.description()));
        return CourseResponse.from(repository.save(course));
    }

    @Transactional
    public CourseResponse update(Long id, CourseRequest request) {
        Course course = findOrThrow(id);
        String code = normalizeCode(request.code());
        if (repository.existsByCodeAndIdNot(code, id)) {
            throw duplicatedCode(code);
        }
        course.update(code, request.title().trim(), normalizeDescription(request.description()));
        // flush so updatedAt (set by @PreUpdate) is part of the response
        return CourseResponse.from(repository.saveAndFlush(course));
    }

    /** Enrollments in the class are removed by the database (ON DELETE CASCADE). */
    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new NotFoundException("Class", id);
        }
        repository.deleteById(id);
    }

    /** Also used by other modules (e.g. enrollments) that need a managed entity. */
    public Course findOrThrow(Long id) {
        return repository.findById(id).orElseThrow(() -> new NotFoundException("Class", id));
    }

    /** Codes are stored trimmed and upper-cased so "math-101" and "MATH-101" are the same class. */
    private static String normalizeCode(String code) {
        return code.trim().toUpperCase(Locale.ROOT);
    }

    /** An empty description is stored as null rather than "". */
    private static String normalizeDescription(String description) {
        return description == null || description.isBlank() ? null : description.trim();
    }

    private static ConflictException duplicatedCode(String code) {
        return new ConflictException("A class with code %s already exists".formatted(code));
    }
}
