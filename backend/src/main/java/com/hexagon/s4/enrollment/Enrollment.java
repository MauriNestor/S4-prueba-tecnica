package com.hexagon.s4.enrollment;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.hexagon.s4.course.Course;
import com.hexagon.s4.student.Student;

/** A student taking a class. Unique per (student, course). */
@Entity
@Table(name = "enrollments")
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE) // mirrors the FK defined in V3 migration
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Course course;

    @Column(name = "enrolled_at", nullable = false, updatable = false)
    private Instant enrolledAt;

    protected Enrollment() {
        // required by JPA
    }

    public Enrollment(Student student, Course course) {
        this.student = student;
        this.course = course;
    }

    @PrePersist
    void onCreate() {
        enrolledAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public Student getStudent() {
        return student;
    }

    public Course getCourse() {
        return course;
    }

    public Instant getEnrolledAt() {
        return enrolledAt;
    }
}
