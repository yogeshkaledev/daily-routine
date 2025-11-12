-- Insert admin user
INSERT INTO users (username, password, email, role, created_at) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'admin@example.com', 'ADMIN', NOW());

-- Insert parent users
INSERT INTO users (username, password, email, role, created_at) VALUES 
('yogesh', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'yogesh@example.com', 'PARENT', NOW()),
('parent2', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'parent2@example.com', 'PARENT', NOW());

-- Insert students
INSERT INTO students (name, class_grade, parent_id, created_at) VALUES 
('Veerendra Kale', 'Sr KG', (SELECT id FROM users WHERE username = 'yogesh'), NOW()),
('Vaibhavi Phatangare', 'Jr KG', (SELECT id FROM users WHERE username = 'yogesh'), NOW()),
('Mike Johnson', 'Grade 4', (SELECT id FROM users WHERE username = 'parent2'), NOW());