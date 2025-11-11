package com.dailyroutine.repository;

import com.dailyroutine.entity.Student;
import com.dailyroutine.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByParent(User parent);
    List<Student> findByParentId(Long parentId);
}