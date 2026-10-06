package com.hexagon.s4.common.web;

import java.util.List;
import java.util.function.Function;

import org.springframework.data.domain.Page;

/** Stable pagination envelope, so the API contract does not depend on Spring's Page serialization. */
public record PageResponse<T>(List<T> content, int page, int size, long totalElements, int totalPages) {

    public static <E, T> PageResponse<T> from(Page<E> page, Function<E, T> mapper) {
        return new PageResponse<>(
                page.getContent().stream().map(mapper).toList(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages());
    }
}
