package com.hexagon.s4.common.exception;

/** The request clashes with existing data (e.g. a duplicated code). Mapped to HTTP 409. */
public class ConflictException extends RuntimeException {

    public ConflictException(String message) {
        super(message);
    }
}
