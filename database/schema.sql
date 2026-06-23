-- ==========================================
-- Student Success Platform Database Schema
-- ==========================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- ROLES
-- ==========================================

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- USERS
-- ==========================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    role_id UUID NOT NULL REFERENCES roles(id),

    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,

    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,

    university VARCHAR(255),
    degree_program VARCHAR(255),

    target_gpa NUMERIC(3,2),

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- SEMESTERS
-- ==========================================

CREATE TABLE semesters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    name VARCHAR(100) NOT NULL,

    academic_year INTEGER NOT NULL,

    start_date DATE,
    end_date DATE,

    status VARCHAR(50) DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- SUBJECTS
-- ==========================================

CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    semester_id UUID NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,

    subject_code VARCHAR(50) NOT NULL,

    subject_name VARCHAR(255) NOT NULL,

    credits INTEGER NOT NULL,

    lecturer VARCHAR(255),

    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- ASSIGNMENTS
-- ==========================================

CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,

    title VARCHAR(255) NOT NULL,

    description TEXT,

    due_date DATE,

    total_marks NUMERIC(5,2),

    marks_obtained NUMERIC(5,2),

    status VARCHAR(50) DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- EXAMS
-- ==========================================

CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,

    exam_type VARCHAR(50),

    exam_date DATE,

    total_marks NUMERIC(5,2),

    marks_obtained NUMERIC(5,2),

    grade VARCHAR(10),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- GRADES
-- ==========================================

CREATE TABLE grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,

    grade_letter VARCHAR(5),

    grade_point NUMERIC(3,2),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- GPA RECORDS
-- ==========================================

CREATE TABLE gpa_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    semester_id UUID REFERENCES semesters(id),

    semester_gpa NUMERIC(3,2),

    cumulative_gpa NUMERIC(3,2),

    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- NOTIFICATIONS
-- ==========================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    title VARCHAR(255),

    message TEXT,

    notification_type VARCHAR(50),

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);