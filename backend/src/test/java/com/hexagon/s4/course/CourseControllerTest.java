package com.hexagon.s4.course;

import static org.hamcrest.Matchers.endsWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.hexagon.s4.common.exception.NotFoundException;
import com.hexagon.s4.common.web.PageResponse;
import com.hexagon.s4.course.dto.CourseResponse;

@WebMvcTest(CourseController.class)
class CourseControllerTest {

    @Autowired
    MockMvc mvc;

    @MockitoBean
    CourseService service;

    @Test
    void listReturnsPageEnvelope() throws Exception {
        Instant now = Instant.now();
        var course = new CourseResponse(1L, "MATH-101", "Cálculo I", "Límites y derivadas", now, now);
        when(service.list(eq("calc"), any(Pageable.class))).thenReturn(new PageResponse<>(List.of(course), 0, 20, 1, 1));

        mvc.perform(get("/api/classes").param("search", "calc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].code").value("MATH-101"))
                .andExpect(jsonPath("$.content[0].description").value("Límites y derivadas"))
                .andExpect(jsonPath("$.totalElements").value(1));
    }

    @Test
    void listWithoutSearchPassesNull() throws Exception {
        when(service.list(isNull(), any(Pageable.class))).thenReturn(new PageResponse<>(List.of(), 0, 20, 0, 0));

        mvc.perform(get("/api/classes")).andExpect(status().isOk()).andExpect(jsonPath("$.content").isEmpty());
    }

    @Test
    void sortingByUnknownFieldReturns400() throws Exception {
        mvc.perform(get("/api/classes").param("sort", "description"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Invalid request"));
        verifyNoInteractions(service);
    }

    @Test
    void createReturns201WithLocation() throws Exception {
        Instant now = Instant.now();
        when(service.create(any())).thenReturn(new CourseResponse(3L, "CS-101", "Programación", null, now, now));

        mvc.perform(post("/api/classes").contentType(MediaType.APPLICATION_JSON).content("""
                        {"code": "cs-101", "title": "Programación"}
                        """))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", endsWith("/api/classes/3")));
    }

    @Test
    void createWithInvalidBodyReturns400() throws Exception {
        String longDescription = "x".repeat(1001);
        mvc.perform(post("/api/classes").contentType(MediaType.APPLICATION_JSON).content("""
                        {"code": "", "title": " ", "description": "%s"}
                        """.formatted(longDescription)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.code").exists())
                .andExpect(jsonPath("$.errors.title").value("title is required"))
                .andExpect(jsonPath("$.errors.description").value("description must have at most 1000 characters"));
        verifyNoInteractions(service);
    }

    @Test
    void updateUnknownClassReturns404() throws Exception {
        when(service.update(eq(9L), any())).thenThrow(new NotFoundException("Class", 9L));

        mvc.perform(put("/api/classes/9").contentType(MediaType.APPLICATION_JSON).content("""
                        {"code": "CS-101", "title": "Programación"}
                        """))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.detail").value("Class with id 9 was not found"));
    }
}
