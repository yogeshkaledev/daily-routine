package com.dailyroutine.service;

import com.dailyroutine.dto.RoutineRequest;
import com.dailyroutine.entity.DailyRoutine;
import com.dailyroutine.entity.Student;
import com.dailyroutine.entity.User;
import com.dailyroutine.repository.DailyRoutineRepository;
import com.dailyroutine.repository.StudentRepository;
import com.dailyroutine.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RoutineService {

    private final DailyRoutineRepository routineRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    public RoutineService(DailyRoutineRepository routineRepository, 
                         StudentRepository studentRepository, 
                         UserRepository userRepository) {
        this.routineRepository = routineRepository;
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
    }

    public List<DailyRoutine> getRoutinesByStudent(Long studentId) {
        return routineRepository.findByStudentIdOrderByRoutineDateDesc(studentId);
    }

    public List<DailyRoutine> getRoutinesByDate(LocalDate date) {
        return routineRepository.findByRoutineDate(date);
    }

    public DailyRoutine saveRoutine(RoutineRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username).orElseThrow();
        Student student = studentRepository.findById(request.getStudentId()).orElseThrow();

        Optional<DailyRoutine> existingRoutine = routineRepository
            .findByStudentIdAndRoutineDate(request.getStudentId(), request.getRoutineDate());

        DailyRoutine routine = existingRoutine.orElse(new DailyRoutine());
        
        routine.setStudent(student);
        routine.setRoutineDate(request.getRoutineDate());
        routine.setWakeUpTime(request.getWakeUpTime());
        routine.setSchoolTime(request.getSchoolTime());
        routine.setBreakfastTime(request.getBreakfastTime());
        routine.setBreakfastItems(request.getBreakfastItems());
        routine.setLunchTime(request.getLunchTime());
        routine.setLunchItems(request.getLunchItems());
        routine.setScreenTimeMinutes(request.getScreenTimeMinutes());
        routine.setNapTime(request.getNapTime());
        routine.setStudyTimeMinutes(request.getStudyTimeMinutes());
        routine.setBeforeClassActivity(request.getBeforeClassActivity());
        routine.setDinnerTime(request.getDinnerTime());
        routine.setDinnerItems(request.getDinnerItems());
        routine.setSleepTime(request.getSleepTime());
        routine.setBehaviorAtHome(request.getBehaviorAtHome());
        routine.setNotes(request.getNotes());
        routine.setCreatedBy(currentUser);

        return routineRepository.save(routine);
    }

    public void deleteRoutine(Long id) {
        routineRepository.deleteById(id);
    }

    public DailyRoutine addFeedback(Long routineId, String feedback) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User admin = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Admin user not found"));
        
        DailyRoutine routine = routineRepository.findById(routineId)
            .orElseThrow(() -> new RuntimeException("Routine not found with id: " + routineId));
        
        routine.setAdminFeedback(feedback);
        routine.setFeedbackDate(LocalDateTime.now());
        routine.setFeedbackBy(admin);
        
        return routineRepository.save(routine);
    }
}