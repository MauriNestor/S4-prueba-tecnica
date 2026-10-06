package com.hexagon.s4.student;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.hexagon.s4.common.exception.ConflictException;
import com.hexagon.s4.common.exception.NotFoundException;
import com.hexagon.s4.student.dto.StudentRequest;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    StudentRepository repository;

    @InjectMocks
    StudentService service;

    @Test
    void createNormalizesCodeAndTrimsNames() {
        when(repository.existsByStudentCode("S-001")).thenReturn(false);
        when(repository.save(any(Student.class))).thenAnswer(inv -> inv.getArgument(0));

        var response = service.create(new StudentRequest("  s-001 ", " Ana ", " Pérez "));

        assertThat(response.studentCode()).isEqualTo("S-001");
        assertThat(response.firstName()).isEqualTo("Ana");
        assertThat(response.lastName()).isEqualTo("Pérez");
    }

    @Test
    void createRejectsDuplicatedCode() {
        when(repository.existsByStudentCode("S-001")).thenReturn(true);

        assertThatThrownBy(() -> service.create(new StudentRequest("s-001", "Ana", "Pérez")))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("S-001");
        verify(repository, never()).save(any());
    }

    @Test
    void updateFailsWhenStudentDoesNotExist() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.update(99L, new StudentRequest("S-001", "Ana", "Pérez")))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void updateRejectsCodeOwnedByAnotherStudent() {
        when(repository.findById(1L)).thenReturn(Optional.of(new Student("S-001", "Ana", "Pérez")));
        when(repository.existsByStudentCodeAndIdNot("S-002", 1L)).thenReturn(true);

        assertThatThrownBy(() -> service.update(1L, new StudentRequest("S-002", "Ana", "Pérez")))
                .isInstanceOf(ConflictException.class);
    }

    @Test
    void updateChangesFields() {
        Student existing = new Student("S-001", "Ana", "Pérez");
        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        when(repository.existsByStudentCodeAndIdNot("S-001", 1L)).thenReturn(false);
        when(repository.saveAndFlush(existing)).thenReturn(existing);

        var response = service.update(1L, new StudentRequest("S-001", "Ana María", "Pérez"));

        assertThat(response.firstName()).isEqualTo("Ana María");
    }

    @Test
    void deleteFailsWhenStudentDoesNotExist() {
        when(repository.existsById(5L)).thenReturn(false);

        assertThatThrownBy(() -> service.delete(5L)).isInstanceOf(NotFoundException.class);
        verify(repository, never()).deleteById(any());
    }

    @Test
    void listWithoutSearchReturnsAll() {
        Pageable pageable = PageRequest.of(0, 20);
        when(repository.findAll(pageable)).thenReturn(new PageImpl<>(List.of(new Student("S-001", "Ana", "Pérez"))));

        var page = service.list("  ", pageable);

        assertThat(page.content()).hasSize(1);
        verify(repository, never()).search(any(), any());
    }

    @Test
    void listWithSearchUsesEscapedPattern() {
        Pageable pageable = PageRequest.of(0, 20);
        ArgumentCaptor<String> pattern = ArgumentCaptor.forClass(String.class);
        when(repository.search(pattern.capture(), any())).thenReturn(new PageImpl<>(List.of()));

        service.list(" 50%_Ana ", pageable);

        assertThat(pattern.getValue()).isEqualTo("%50\\%\\_ana%");
    }
}
