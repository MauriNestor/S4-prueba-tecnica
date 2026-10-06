package com.hexagon.s4;

import org.springframework.boot.SpringApplication;

public class TestS4Application {

	public static void main(String[] args) {
		SpringApplication.from(S4Application::main).with(TestcontainersConfiguration.class).run(args);
	}

}
