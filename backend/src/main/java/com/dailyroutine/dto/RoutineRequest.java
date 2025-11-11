package com.dailyroutine.dto;

import com.dailyroutine.entity.DailyRoutine;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public class RoutineRequest {
    @NotNull
    private Long studentId;
    
    @NotNull
    private LocalDate routineDate;
    
    private LocalTime wakeUpTime;
    private LocalTime schoolTime;
    private LocalTime breakfastTime;
    private String breakfastItems;
    private LocalTime lunchTime;
    private String lunchItems;
    private Integer screenTimeMinutes;
    private LocalTime napTime;
    private Integer studyTimeMinutes;
    private String beforeClassActivity;
    private LocalTime dinnerTime;
    private String dinnerItems;
    private LocalTime sleepTime;
    private DailyRoutine.Behavior behaviorAtHome;
    private String notes;

    // Constructors
    public RoutineRequest() {}

    // Getters and Setters
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

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

    public DailyRoutine.Behavior getBehaviorAtHome() { return behaviorAtHome; }
    public void setBehaviorAtHome(DailyRoutine.Behavior behaviorAtHome) { this.behaviorAtHome = behaviorAtHome; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}