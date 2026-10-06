package com.hexagon.s4.student;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface StudentRepository extends JpaRepository<Student, Long> {

    boolean existsByStudentCode(String studentCode);

    boolean existsByStudentCodeAndIdNot(String studentCode, Long id);

    /**
     * Case-insensitive "contains" search over code, first name, last name and full name.
     * {@code pattern} must come from {@link com.hexagon.s4.common.web.SearchPatterns#contains}.
     */
    @Query("""
            select s from Student s
            where lower(s.studentCode) like :pattern escape '\\'
               or lower(s.firstName) like :pattern escape '\\'
               or lower(s.lastName) like :pattern escape '\\'
               or lower(concat(s.firstName, ' ', s.lastName)) like :pattern escape '\\'
            """)
    Page<Student> search(@Param("pattern") String pattern, Pageable pageable);
}
