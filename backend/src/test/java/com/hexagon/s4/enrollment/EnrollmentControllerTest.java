package com.hexagon.s4.enrollment;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.hexagon.s4.common.exception.NotFoundException;
import com.hexagon.s4.course.dto.CourseResponse;
import com.hexagon.s4.student.dto.StudentResponse;

@WebMvcTest(EnrollmentController.class)
class EnrollmentControllerTest {

    @Autowired
    MockMvc mvc;

    @MockitoBean
    EnrollmentService service;

    @Test
    void enrollReturns204() throws Exception {
        mvc.perform(put("/api/classes/1/students/2")).andExpect(status().isNoContent());
        verify(service).enroll(1L, 2L);
    }

    @Test
    void enrollUnknownStudentReturns404() throws Exception {
        doThrow(new NotFoundException("Student", 2L)).when(service).enroll(1L, 2L);

        mvc.perform(put("/api/classes/1/students/2"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.detail").value("Student with id 2 was not found"));
    }

    @Test
    void unenrollReturns204() throws Exception {
        mvc.perform(delete("/api/classes/1/students/2")).andExpect(status().isNoContent());
        verify(service).unenroll(1L, 2L);
    }

    @Test
    void studentsOfClassReturnsList() throws Exception {
        Instant now = Instant.now();
        when(service.studentsOf(1L)).thenReturn(List.of(new StudentResponse(2L, "S-002", "Luis", "Gómez", now, now)));

        mvc.perform(get("/api/classes/1/students"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].studentCode").value("S-002"));
    }

    @Test
    void classesOfStudentReturnsList() throws Exception {
        Instant now = Instant.now();
        when(service.coursesOf(2L)).thenReturn(List.of(new CourseResponse(1L, "MATH-101", "Cálculo I", null, now, now)));

        mvc.perform(get("/api/students/2/classes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].code").value("MATH-101"));
    }
}
