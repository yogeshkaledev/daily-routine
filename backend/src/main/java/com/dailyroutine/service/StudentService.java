package com.dailyroutine.service;

import com.dailyroutine.entity.Student;
import com.dailyroutine.entity.User;
import com.dailyroutine.repository.StudentRepository;
import com.dailyroutine.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    public StudentService(StudentRepository studentRepository, UserRepository userRepository) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
    }

    public List<Student> getAllStudents() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username).orElseThrow();
        
        if (currentUser.getRole() == User.Role.ADMIN) {
            return studentRepository.findAll();
        } else {
            return studentRepository.findByParent(currentUser);
        }
    }

    public Student createStudent(String name, String classGrade, Long parentId) {
        User parent = userRepository.findById(parentId).orElseThrow();
        Student student = new Student(name, classGrade, parent);
        return studentRepository.save(student);
    }

    public Student updateStudent(Long id, String name, String classGrade) {
        Student student = studentRepository.findById(id).orElseThrow();
        student.setName(name);
        student.setClassGrade(classGrade);
        return studentRepository.save(student);
    }

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id).orElseThrow();
    }
}