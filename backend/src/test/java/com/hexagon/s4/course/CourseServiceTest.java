package com.hexagon.s4.course;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.hexagon.s4.common.exception.ConflictException;
import com.hexagon.s4.common.exception.NotFoundException;
import com.hexagon.s4.course.dto.CourseRequest;

@ExtendWith(MockitoExtension.class)
class CourseServiceTest {

    @Mock
    CourseRepository repository;

    @InjectMocks
    CourseService service;

    @Test
    void createNormalizesCodeAndBlankDescription() {
        when(repository.existsByCode("MATH-101")).thenReturn(false);
        when(repository.save(any(Course.class))).thenAnswer(inv -> inv.getArgument(0));

        var response = service.create(new CourseRequest(" math-101 ", " Cálculo I ", "   "));

        assertThat(response.code()).isEqualTo("MATH-101");
        assertThat(response.title()).isEqualTo("Cálculo I");
        assertThat(response.description()).isNull();
    }

    @Test
    void createRejectsDuplicatedCode() {
        when(repository.existsByCode("MATH-101")).thenReturn(true);

        assertThatThrownBy(() -> service.create(new CourseRequest("math-101", "Cálculo", null)))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("MATH-101");
        verify(repository, never()).save(any());
    }

    @Test
    void updateRejectsCodeOwnedByAnotherClass() {
        when(repository.findById(1L)).thenReturn(Optional.of(new Course("MATH-101", "Cálculo", null)));
        when(repository.existsByCodeAndIdNot("PHYS-101", 1L)).thenReturn(true);

        assertThatThrownBy(() -> service.update(1L, new CourseRequest("PHYS-101", "Cálculo", null)))
                .isInstanceOf(ConflictException.class);
    }

    @Test
    void getUnknownClassFails() {
        when(repository.findById(3L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.get(3L))
                .isInstanceOf(NotFoundException.class)
                .hasMessage("Class with id 3 was not found");
    }

    @Test
    void deleteFailsWhenClassDoesNotExist() {
        when(repository.existsById(3L)).thenReturn(false);

        assertThatThrownBy(() -> service.delete(3L)).isInstanceOf(NotFoundException.class);
        verify(repository, never()).deleteById(any());
    }
}
