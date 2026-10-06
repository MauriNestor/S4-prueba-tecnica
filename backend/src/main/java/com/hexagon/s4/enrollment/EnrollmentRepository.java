package com.hexagon.s4.enrollment;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hexagon.s4.course.Course;
import com.hexagon.s4.student.Student;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);

    @Query("""
            select e.student from Enrollment e
            where e.course.id = :courseId
            order by e.student.lastName, e.student.firstName
            """)
    List<Student> findStudentsByCourseId(@Param("courseId") Long courseId);

    @Query("""
            select e.course from Enrollment e
            where e.student.id = :studentId
            order by e.course.code
            """)
    List<Course> findCoursesByStudentId(@Param("studentId") Long studentId);

    /** Returns the number of rows removed (0 when the student was not enrolled). */
    @Modifying
    @Query("delete from Enrollment e where e.student.id = :studentId and e.course.id = :courseId")
    int deleteByStudentIdAndCourseId(@Param("studentId") Long studentId, @Param("courseId") Long courseId);
}
