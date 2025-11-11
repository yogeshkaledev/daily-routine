package com.dailyroutine.repository;

import com.dailyroutine.entity.DailyRoutine;
import com.dailyroutine.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyRoutineRepository extends JpaRepository<DailyRoutine, Long> {
    List<DailyRoutine> findByStudent(Student student);
    List<DailyRoutine> findByStudentId(Long studentId);
    List<DailyRoutine> findByRoutineDate(LocalDate date);
    Optional<DailyRoutine> findByStudentIdAndRoutineDate(Long studentId, LocalDate date);
    List<DailyRoutine> findByStudentIdOrderByRoutineDateDesc(Long studentId);
}