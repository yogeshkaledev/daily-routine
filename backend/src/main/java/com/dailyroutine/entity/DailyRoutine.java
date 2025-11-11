package com.dailyroutine.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "daily_routines", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "routine_date"})
})
public class DailyRoutine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "routine_date", nullable = false)
    private LocalDate routineDate;

    @Column(name = "wake_up_time")
    private LocalTime wakeUpTime;

    @Column(name = "school_time")
    private LocalTime schoolTime;

    @Column(name = "breakfast_time")
    private LocalTime breakfastTime;

    @Column(name = "breakfast_items", columnDefinition = "TEXT")
    private String breakfastItems;

    @Column(name = "lunch_time")
    private LocalTime lunchTime;

    @Column(name = "lunch_items", columnDefinition = "TEXT")
    private String lunchItems;

    @Column(name = "screen_time_minutes")
    private Integer screenTimeMinutes;

    @Column(name = "nap_time")
    private LocalTime napTime;

    @Column(name = "study_time_minutes")
    private Integer studyTimeMinutes;

    @Column(name = "before_class_activity", columnDefinition = "TEXT")
    private String beforeClassActivity;

    @Column(name = "dinner_time")
    private LocalTime dinnerTime;

    @Column(name = "dinner_items", columnDefinition = "TEXT")
    private String dinnerItems;

    @Column(name = "sleep_time")
    private LocalTime sleepTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "behavior_at_home")
    private Behavior behaviorAtHome;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "admin_feedback", columnDefinition = "TEXT")
    private String adminFeedback;

    @Column(name = "feedback_date")
    private LocalDateTime feedbackDate;

    @ManyToOne
    @JoinColumn(name = "feedback_by")
    private User feedbackBy;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Behavior {
        EXCELLENT, GOOD, AVERAGE, NEEDS_IMPROVEMENT
    }

    // Constructors
    public DailyRoutine() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public LocalDate getRoutineDate() { return routineDate; }
    public void setRoutineDate(LocalDate routineDate) { this.routineDate = routineDate; }

    public LocalTime getWakeUpTime() { return wakeUpTime; }
    public void setWakeUpTime(LocalTime wakeUpTime) { this.wakeUpTime = wakeUpTime; }

    public LocalTime getSchoolTime() { return schoolTime; }
    public void setSchoolTime(LocalTime schoolTime) { this.schoolTime = schoolTime; }

    public LocalTime getBreakfastTime() { return breakfastTime; }
    public void setBreakfastTime(LocalTime breakfastTime) { this.breakfastTime = breakfastTime; }

    public String getBreakfastItems() { return breakfastItems; }
    public void setBreakfastItems(String breakfastItems) { this.breakfastItems = breakfastItems; }

    public LocalTime getLunchTime() { return lunchTime; }
    public void setLunchTime(LocalTime lunchTime) { this.lunchTime = lunchTime; }

    public String getLunchItems() { return lunchItems; }
    public void setLunchItems(String lunchItems) { this.lunchItems = lunchItems; }

    public Integer getScreenTimeMinutes() { return screenTimeMinutes; }
    public void setScreenTimeMinutes(Integer screenTimeMinutes) { this.screenTimeMinutes = screenTimeMinutes; }

    public LocalTime getNapTime() { return napTime; }
    public void setNapTime(LocalTime napTime) { this.napTime = napTime; }

    public Integer getStudyTimeMinutes() { return studyTimeMinutes; }
    public void setStudyTimeMinutes(Integer studyTimeMinutes) { this.studyTimeMinutes = studyTimeMinutes; }

    public String getBeforeClassActivity() { return beforeClassActivity; }
    public void setBeforeClassActivity(String beforeClassActivity) { this.beforeClassActivity = beforeClassActivity; }

    public LocalTime getDinnerTime() { return dinnerTime; }
    public void setDinnerTime(LocalTime dinnerTime) { this.dinnerTime = dinnerTime; }

    public String getDinnerItems() { return dinnerItems; }
    public void setDinnerItems(String dinnerItems) { this.dinnerItems = dinnerItems; }

    public LocalTime getSleepTime() { return sleepTime; }
    public void setSleepTime(LocalTime sleepTime) { this.sleepTime = sleepTime; }

    public Behavior getBehaviorAtHome() { return behaviorAtHome; }
    public void setBehaviorAtHome(Behavior behaviorAtHome) { this.behaviorAtHome = behaviorAtHome; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getAdminFeedback() { return adminFeedback; }
    public void setAdminFeedback(String adminFeedback) { this.adminFeedback = adminFeedback; }

    public LocalDateTime getFeedbackDate() { return feedbackDate; }
    public void setFeedbackDate(LocalDateTime feedbackDate) { this.feedbackDate = feedbackDate; }

    public User getFeedbackBy() { return feedbackBy; }
    public void setFeedbackBy(User feedbackBy) { this.feedbackBy = feedbackBy; }
}