package com.dailyroutine.controller;

import com.dailyroutine.dto.FeedbackRequest;
import com.dailyroutine.dto.RoutineRequest;
import com.dailyroutine.entity.DailyRoutine;
import com.dailyroutine.service.RoutineService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/routines")
@CrossOrigin(origins = "http://localhost:3000")
public class RoutineController {

    private final RoutineService routineService;

    public RoutineController(RoutineService routineService) {
        this.routineService = routineService;
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<DailyRoutine>> getRoutinesByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(routineService.getRoutinesByStudent(studentId));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<DailyRoutine>> getRoutinesByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(routineService.getRoutinesByDate(date));
    }

    @PostMapping
    public ResponseEntity<DailyRoutine> saveRoutine(@Valid @RequestBody RoutineRequest request) {
        DailyRoutine routine = routineService.saveRoutine(request);
        return ResponseEntity.ok(routine);
    }

    @PutMapping("/{id}/feedback")
    public ResponseEntity<DailyRoutine> addFeedback(@PathVariable Long id, @Valid @RequestBody FeedbackRequest request) {
        DailyRoutine routine = routineService.addFeedback(id, request.getFeedback());
        return ResponseEntity.ok(routine);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoutine(@PathVariable Long id) {
        routineService.deleteRoutine(id);
        return ResponseEntity.ok(Map.of("message", "Routine deleted successfully"));
    }
}