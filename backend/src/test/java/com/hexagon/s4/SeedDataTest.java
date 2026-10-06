package com.hexagon.s4;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

/** The demo seed (excluded from other tests) applies cleanly on top of the schema. */
@SpringBootTest(properties = "spring.flyway.locations=classpath:db/migration,classpath:db/seed")
@Import(TestcontainersConfiguration.class)
class SeedDataTest {

    @Autowired
    JdbcTemplate jdbc;

    @Test
    void seedLoadsStudentsClassesAndEnrollments() {
        assertThat(count("students")).isEqualTo(12);
        assertThat(count("courses")).isEqualTo(7);
        assertThat(count("enrollments")).isEqualTo(22);
    }

    private Integer count(String table) {
        return jdbc.queryForObject("select count(*) from " + table, Integer.class);
    }
}
