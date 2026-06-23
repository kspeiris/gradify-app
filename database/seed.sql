-- ==========================================
-- ROLES
-- ==========================================

INSERT INTO roles(name, description)
VALUES
('ROLE_ADMIN','System Administrator'),
('ROLE_STUDENT','Student User');

-- ==========================================
-- SAMPLE USER
-- ==========================================

INSERT INTO users(
    role_id,
    first_name,
    last_name,
    email,
    password_hash,
    university,
    degree_program,
    target_gpa
)
VALUES(
    (SELECT id FROM roles WHERE name='ROLE_STUDENT'),
    'Kavindu',
    'Peiris',
    'kavindu@student.com',
    '$2a$10$samplepassword',
    'University of Sri Jayewardenepura',
    'Software Engineering',
    3.80
);