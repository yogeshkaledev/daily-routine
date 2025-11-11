package com.dailyroutine.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @Column(name = "class_grade")
    private String classGrade;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private User parent;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<DailyRoutine> routines;

    // Constructors
    public Student() {}

    public Student(String name, String classGrade, User parent) {
        this.name = name;
        this.classGrade = classGrade;
        this.parent = parent;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getClassGrade() { return classGrade; }
    public void setClassGrade(String classGrade) { this.classGrade = classGrade; }

    public User getParent() { return parent; }
    public void setParent(User parent) { this.parent = parent; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<DailyRoutine> getRoutines() { return routines; }
    public void setRoutines(List<DailyRoutine> routines) { this.routines = routines; }
}