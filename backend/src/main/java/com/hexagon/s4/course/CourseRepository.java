package com.hexagon.s4.course;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CourseRepository extends JpaRepository<Course, Long> {

    boolean existsByCode(String code);

    boolean existsByCodeAndIdNot(String code, Long id);

    /**
     * Case-insensitive "contains" search over code, title and description.
     * {@code pattern} must come from {@link com.hexagon.s4.common.web.SearchPatterns#contains}.
     */
    @Query("""
            select c from Course c
            where lower(c.code) like :pattern escape '\\'
               or lower(c.title) like :pattern escape '\\'
               or lower(c.description) like :pattern escape '\\'
            """)
    Page<Course> search(@Param("pattern") String pattern, Pageable pageable);
}
