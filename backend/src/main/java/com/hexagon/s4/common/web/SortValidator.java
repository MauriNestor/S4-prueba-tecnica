package com.hexagon.s4.common.web;

import java.util.Set;
import java.util.TreeSet;

import org.springframework.data.domain.Sort;

import com.hexagon.s4.common.exception.BadRequestException;

/**
 * Whitelists the fields a client may sort by. Checked at the API boundary so an unknown
 * field is a clear 400 instead of a persistence error deep inside the query.
 */
public final class SortValidator {

    private SortValidator() {
    }

    public static void requireAllowed(Sort sort, Set<String> allowed) {
        for (Sort.Order order : sort) {
            if (!allowed.contains(order.getProperty())) {
                throw new BadRequestException("Cannot sort by '%s'. Allowed fields: %s"
                        .formatted(order.getProperty(), String.join(", ", new TreeSet<>(allowed))));
            }
        }
    }
}
