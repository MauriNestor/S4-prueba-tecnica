package com.hexagon.s4.enrollment;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import jakarta.persistence.EntityManager;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.PageRequest;

import com.hexagon.s4.TestcontainersConfiguration;
import com.hexagon.s4.common.web.SearchPatterns;
import com.hexagon.s4.course.Course;
import com.hexagon.s4.course.CourseRepository;
import com.hexagon.s4.student.Student;
import com.hexagon.s4.student.StudentRepository;

/** Relation queries and referential integrity against a real PostgreSQL. */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(TestcontainersConfiguration.class)
class EnrollmentRepositoryTest {

    @Autowired
    EnrollmentRepository enrollments;

    @Autowired
    StudentRepository students;

    @Autowired
    CourseRepository courses;

    @Autowired
    EntityManager entityManager;

    Student ana;
    Student luis;
    Course math;
    Course physics;

    @BeforeEach
    void setUp() {
        ana = students.save(new Student("S-001", "Ana", "Pérez"));
        luis = students.save(new Student("S-002", "Luis", "Gómez"));
        math = courses.save(new Course("MATH-101", "Cálculo I", "Límites y derivadas"));
        physics = courses.save(new Course("PHYS-101", "Física I", null));
        enrollments.save(new Enrollment(ana, math));
        enrollments.save(new Enrollment(luis, math));
        enrollments.save(new Enrollment(ana, physics));
        flushAndClear();
    }

    @Test
    void findsStudentsOfAClassSortedByName() {
        assertThat(enrollments.findStudentsByCourseId(math.getId()))
                .extracting(Student::getStudentCode)
                .containsExactly("S-002", "S-001"); // Gómez before Pérez
    }

    @Test
    void findsClassesOfAStudentSortedByCode() {
        assertThat(enrollments.findCoursesByStudentId(ana.getId()))
                .extracting(Course::getCode)
                .containsExactly("MATH-101", "PHYS-101");
        assertThat(enrollments.findCoursesByStudentId(luis.getId()))
                .extracting(Course::getCode)
                .containsExactly("MATH-101");
    }

    @Test
    void databaseRejectsDuplicatedEnrollment() {
        assertThatThrownBy(() -> enrollments.saveAndFlush(new Enrollment(
                        students.getReferenceById(ana.getId()), courses.getReferenceById(math.getId()))))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    void deletingAStudentRemovesItsEnrollments() {
        students.deleteById(ana.getId());
        flushAndClear();

        assertThat(enrollments.count()).isEqualTo(1);
        assertThat(enrollments.findStudentsByCourseId(math.getId()))
                .extracting(Student::getStudentCode)
                .containsExactly("S-002");
    }

    @Test
    void deletingAClassRemovesItsEnrollments() {
        courses.deleteById(math.getId());
        flushAndClear();

        assertThat(enrollments.count()).isEqualTo(1);
        assertThat(enrollments.findCoursesByStudentId(ana.getId()))
                .extracting(Course::getCode)
                .containsExactly("PHYS-101");
    }

    @Test
    void unenrollDeletesOnlyThatPair() {
        assertThat(enrollments.deleteByStudentIdAndCourseId(ana.getId(), math.getId())).isEqualTo(1);
        assertThat(enrollments.deleteByStudentIdAndCourseId(ana.getId(), math.getId())).isZero();
        assertThat(enrollments.count()).isEqualTo(2);
    }

    @Test
    void classSearchCoversDescriptionAndToleratesNull() {
        var byDescription = courses.search(SearchPatterns.contains("DERIVADAS"), PageRequest.of(0, 20)).getContent();
        assertThat(byDescription).extracting(Course::getCode).containsExactly("MATH-101");

        var byTitle = courses.search(SearchPatterns.contains("física"), PageRequest.of(0, 20)).getContent();
        assertThat(byTitle).extracting(Course::getCode).containsExactly("PHYS-101");
    }

    private void flushAndClear() {
        entityManager.flush();
        entityManager.clear();
    }
}
