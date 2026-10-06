package com.hexagon.s4.common.exception;

/** The request is syntactically valid but its parameters are not acceptable. Mapped to HTTP 400. */
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}
