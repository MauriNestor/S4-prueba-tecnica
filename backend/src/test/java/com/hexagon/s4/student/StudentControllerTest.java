package com.hexagon.s4.student;

import static org.hamcrest.Matchers.endsWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.hexagon.s4.common.exception.ConflictException;
import com.hexagon.s4.common.exception.NotFoundException;
import com.hexagon.s4.student.dto.StudentRequest;
import com.hexagon.s4.student.dto.StudentResponse;

@WebMvcTest(StudentController.class)
class StudentControllerTest {

    @Autowired
    MockMvc mvc;

    @MockitoBean
    StudentService service;

    @Test
    void createReturns201WithLocation() throws Exception {
        Instant now = Instant.now();
        when(service.create(any())).thenReturn(new StudentResponse(7L, "S-007", "Ana", "Pérez", now, now));

        mvc.perform(post("/api/students").contentType(MediaType.APPLICATION_JSON).content("""
                        {"studentCode": "S-007", "firstName": "Ana", "lastName": "Pérez"}
                        """))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", endsWith("/api/students/7")))
                .andExpect(jsonPath("$.id").value(7))
                .andExpect(jsonPath("$.studentCode").value("S-007"));
    }

    @Test
    void createWithInvalidBodyReturns400WithFieldErrors() throws Exception {
        mvc.perform(post("/api/students").contentType(MediaType.APPLICATION_JSON).content("""
                        {"studentCode": "bad code!", "firstName": "", "lastName": null}
                        """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Validation failed"))
                .andExpect(jsonPath("$.errors.studentCode").exists())
                .andExpect(jsonPath("$.errors.firstName").value("firstName is required"))
                .andExpect(jsonPath("$.errors.lastName").value("lastName is required"));
        verifyNoInteractions(service);
    }

    @Test
    void malformedJsonReturns400() throws Exception {
        mvc.perform(post("/api/students").contentType(MediaType.APPLICATION_JSON).content("{not json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getUnknownStudentReturns404Problem() throws Exception {
        when(service.get(42L)).thenThrow(new NotFoundException("Student", 42L));

        mvc.perform(get("/api/students/42"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.detail").value("Student with id 42 was not found"));
    }

    @Test
    void nonNumericIdReturns400() throws Exception {
        mvc.perform(get("/api/students/abc")).andExpect(status().isBadRequest());
    }

    @Test
    void sortingByUnknownFieldReturns400() throws Exception {
        mvc.perform(get("/api/students").param("search", "ana").param("sort", "password,desc"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.detail").value(
                        "Cannot sort by 'password'. Allowed fields: createdAt, firstName, lastName, studentCode, updatedAt"));
        verifyNoInteractions(service);
    }

    @Test
    void duplicatedCodeReturns409() throws Exception {
        when(service.create(any())).thenThrow(new ConflictException("A student with code S-001 already exists"));

        mvc.perform(post("/api/students").contentType(MediaType.APPLICATION_JSON).content("""
                        {"studentCode": "S-001", "firstName": "Ana", "lastName": "Pérez"}
                        """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.title").value("Conflict"));
    }

    @Test
    void deleteReturns204() throws Exception {
        mvc.perform(delete("/api/students/1")).andExpect(status().isNoContent());
    }

    @Test
    void deleteUnknownReturns404() throws Exception {
        doThrow(new NotFoundException("Student", 9L)).when(service).delete(eq(9L));

        mvc.perform(delete("/api/students/9")).andExpect(status().isNotFound());
    }
}
