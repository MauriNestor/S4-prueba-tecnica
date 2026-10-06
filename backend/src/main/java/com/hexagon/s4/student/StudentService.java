package com.hexagon.s4.student;

import java.util.Locale;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hexagon.s4.common.exception.ConflictException;
import com.hexagon.s4.common.exception.NotFoundException;
import com.hexagon.s4.common.web.PageResponse;
import com.hexagon.s4.common.web.SearchPatterns;
import com.hexagon.s4.student.dto.StudentRequest;
import com.hexagon.s4.student.dto.StudentResponse;

@Service
@Transactional(readOnly = true)
public class StudentService {

    private final StudentRepository repository;

    public StudentService(StudentRepository repository) {
        this.repository = repository;
    }

    public PageResponse<StudentResponse> list(String search, Pageable pageable) {
        Page<Student> page = SearchPatterns.isBlank(search)
                ? repository.findAll(pageable)
                : repository.search(SearchPatterns.contains(search), pageable);
        return PageResponse.from(page, StudentResponse::from);
    }

    public StudentResponse get(Long id) {
        return StudentResponse.from(findOrThrow(id));
    }

    @Transactional
    public StudentResponse create(StudentRequest request) {
        String code = normalizeCode(request.studentCode());
        if (repository.existsByStudentCode(code)) {
            throw duplicatedCode(code);
        }
        Student student = new Student(code, request.firstName().trim(), request.lastName().trim());
        return StudentResponse.from(repository.save(student));
    }

    @Transactional
    public StudentResponse update(Long id, StudentRequest request) {
        Student student = findOrThrow(id);
        String code = normalizeCode(request.studentCode());
        if (repository.existsByStudentCodeAndIdNot(code, id)) {
            throw duplicatedCode(code);
        }
        student.update(code, request.firstName().trim(), request.lastName().trim());
        // flush so updatedAt (set by @PreUpdate) is part of the response
        return StudentResponse.from(repository.saveAndFlush(student));
    }

    /** Enrollments of the student are removed by the database (ON DELETE CASCADE). */
    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new NotFoundException("Student", id);
        }
        repository.deleteById(id);
    }

    /** Also used by other modules (e.g. enrollments) that need a managed entity. */
    public Student findOrThrow(Long id) {
        return repository.findById(id).orElseThrow(() -> new NotFoundException("Student", id));
    }

    /** Codes are stored trimmed and upper-cased so "s-001" and "S-001" are the same student. */
    private static String normalizeCode(String code) {
        return code.trim().toUpperCase(Locale.ROOT);
    }

    private static ConflictException duplicatedCode(String code) {
        return new ConflictException("A student with code %s already exists".formatted(code));
    }
}
