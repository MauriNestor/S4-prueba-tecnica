package com.hexagon.s4.common.exception;

/** A requested resource does not exist. Mapped to HTTP 404. */
public class NotFoundException extends RuntimeException {

    public NotFoundException(String resource, Object id) {
        super("%s with id %s was not found".formatted(resource, id));
    }

    public NotFoundException(String message) {
        super(message);
    }
}
