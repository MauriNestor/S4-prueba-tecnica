package com.hexagon.s4.student;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

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

/** Runs against a real PostgreSQL (Testcontainers) with the Flyway schema. */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(TestcontainersConfiguration.class)
class StudentRepositoryTest {

    @Autowired
    StudentRepository repository;

    @BeforeEach
    void setUp() {
        repository.saveAndFlush(new Student("S-001", "Ana", "Pérez"));
        repository.saveAndFlush(new Student("S-002", "Luis", "Gómez"));
        repository.saveAndFlush(new Student("S-100", "María", "Ana_Torres"));
    }

    @Test
    void searchIsCaseInsensitiveAcrossFields() {
        assertThat(search("ana")).extracting(Student::getStudentCode).containsExactlyInAnyOrder("S-001", "S-100");
        assertThat(search("GÓMEZ")).extracting(Student::getStudentCode).containsExactly("S-002");
        assertThat(search("s-00")).hasSize(2);
    }

    @Test
    void searchMatchesFullName() {
        assertThat(search("ana pérez")).extracting(Student::getStudentCode).containsExactly("S-001");
    }

    @Test
    void searchTreatsWildcardsLiterally() {
        assertThat(search("ana_")).extracting(Student::getStudentCode).containsExactly("S-100");
        assertThat(search("%")).isEmpty();
    }

    @Test
    void databaseRejectsDuplicatedCode() {
        assertThatThrownBy(() -> repository.saveAndFlush(new Student("S-001", "Otra", "Persona")))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    void timestampsAreSetOnCreate() {
        Student saved = repository.saveAndFlush(new Student("S-200", "Eva", "Ruiz"));
        assertThat(saved.getCreatedAt()).isNotNull();
        assertThat(saved.getUpdatedAt()).isEqualTo(saved.getCreatedAt());
    }

    private java.util.List<Student> search(String term) {
        return repository.search(SearchPatterns.contains(term), PageRequest.of(0, 20)).getContent();
    }
}
