package com.hexagon.s4.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

/** Metadata for the generated OpenAPI document (served at /v3/api-docs, UI at /swagger-ui.html). */
@Configuration
public class OpenApiConfig {

    @Bean
    OpenAPI s4OpenApi() {
        return new OpenAPI().info(new Info()
                .title("S4 – Super Simple Scheduling System API")
                .version("v1")
                .description("""
                        Manage students and classes and the enrollments between them.
                        Errors use RFC 7807 Problem Details (`application/problem+json`); \
                        validation errors include an `errors` map of field -> message."""));
    }
}
