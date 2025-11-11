package com.dailyroutine.config;

import com.dailyroutine.entity.Student;
import com.dailyroutine.entity.User;
import com.dailyroutine.repository.StudentRepository;
import com.dailyroutine.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, 
                          StudentRepository studentRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Create admin user
            User admin = new User("admin", passwordEncoder.encode("password"), 
                                "admin@example.com", User.Role.ADMIN);
            userRepository.save(admin);

            // Create parent users
            User parent1 = new User("parent1", passwordEncoder.encode("password"), 
                                  "parent1@example.com", User.Role.PARENT);
            User parent2 = new User("parent2", passwordEncoder.encode("password"), 
                                  "parent2@example.com", User.Role.PARENT);
            
            parent1 = userRepository.save(parent1);
            parent2 = userRepository.save(parent2);

            // Create students
            studentRepository.save(new Student("John Doe", "Grade 5", parent1));
            studentRepository.save(new Student("Jane Smith", "Grade 3", parent1));
            studentRepository.save(new Student("Mike Johnson", "Grade 4", parent2));
        }
    }
}