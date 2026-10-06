package com.hexagon.s4.common.web;

/** Builds case-insensitive "contains" patterns for JPQL LIKE queries. */
public final class SearchPatterns {

    private SearchPatterns() {
    }

    /**
     * Returns {@code %term%} in lower case, escaping LIKE wildcards so a user typing
     * "%" or "_" searches for that literal character. Queries must declare {@code escape '\'}.
     */
    public static String contains(String term) {
        String escaped = term.trim().toLowerCase()
                .replace("\\", "\\\\")
                .replace("%", "\\%")
                .replace("_", "\\_");
        return "%" + escaped + "%";
    }

    public static boolean isBlank(String term) {
        return term == null || term.isBlank();
    }
}
