package com.hexagon.s4;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
class S4ApplicationTests {

	@Test
	void contextLoads() {
	}

}
