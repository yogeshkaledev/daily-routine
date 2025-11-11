# Daily Routine Tracking App - Solution Architecture

## Overview
A full-stack web application for tracking daily routines of students with two user personas: Institute Admin and Parent.

## Technology Stack

### Backend
- **Framework**: Java Spring Boot 3.x
- **Database**: H2 In-Memory Database
- **ORM**: Spring Data JPA
- **Security**: Spring Security
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router DOM

## System Architecture

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│   React Frontend│ ◄──────────────► │ Spring Boot API │
│   (Port 3000)   │                 │   (Port 8080)   │
└─────────────────┘                 └─────────────────┘
                                            │
                                            ▼
                                    ┌─────────────────┐
                                    │  H2 In-Memory   │
                                    │    Database     │
                                    └─────────────────┘
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('ADMIN', 'PARENT') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Students Table
```sql
CREATE TABLE students (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    class_grade VARCHAR(20),
    parent_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES users(id)
);
```

### Daily Routines Table
```sql
CREATE TABLE daily_routines (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    routine_date DATE NOT NULL,
    wake_up_time TIME,
    school_time TIME,
    breakfast_time TIME,
    breakfast_items TEXT,
    lunch_time TIME,
    lunch_items TEXT,
    screen_time_minutes INTEGER,
    nap_time TIME,
    study_time_minutes INTEGER,
    before_class_activity TEXT,
    dinner_time TIME,
    dinner_items TEXT,
    sleep_time TIME,
    behavior_at_home ENUM('EXCELLENT', 'GOOD', 'AVERAGE', 'NEEDS_IMPROVEMENT'),
    notes TEXT,
    admin_feedback TEXT,
    feedback_date TIMESTAMP,
    feedback_by BIGINT,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (feedback_by) REFERENCES users(id),
    UNIQUE KEY unique_student_date (student_id, routine_date)
);
```

## Backend Implementation

### Project Structure
```
src/main/java/com/dailyroutine/
├── DailyRoutineApplication.java
├── config/
│   ├── SecurityConfig.java
│   └── CorsConfig.java
├── controller/
│   ├── AuthController.java
│   ├── StudentController.java
│   └── RoutineController.java
├── entity/
│   ├── User.java
│   ├── Student.java
│   └── DailyRoutine.java
├── repository/
│   ├── UserRepository.java
│   ├── StudentRepository.java
│   └── DailyRoutineRepository.java
├── service/
│   ├── AuthService.java
│   ├── StudentService.java
│   └── RoutineService.java
└── dto/
    ├── LoginRequest.java
    ├── RoutineRequest.java
    └── RoutineResponse.java
```

### Key API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

#### Students Management
- `GET /api/students` - Get all students (Admin: all, Parent: own children)
- `POST /api/students` - Create new student (Admin only)
- `PUT /api/students/{id}` - Update student details
- `DELETE /api/students/{id}` - Delete student (Admin only)

#### Daily Routines
- `GET /api/routines/student/{studentId}` - Get routines for a student
- `GET /api/routines/date/{date}` - Get routines for a specific date
- `POST /api/routines` - Create/Update daily routine
- `PUT /api/routines/{id}/feedback` - Add admin feedback to routine (Admin only)
- `DELETE /api/routines/{id}` - Delete routine entry

### Maven Dependencies (pom.xml)
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
</dependencies>
```

## Frontend Implementation

### Project Structure
```
src/
├── components/
│   ├── common/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── Layout.jsx
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── admin/
│   │   ├── Dashboard.jsx
│   │   ├── StudentList.jsx
│   │   └── RoutineOverview.jsx
│   └── parent/
│       ├── Dashboard.jsx
│       ├── ChildRoutine.jsx
│       └── RoutineForm.jsx
├── services/
│   ├── api.js
│   ├── authService.js
│   └── routineService.js
├── context/
│   └── AuthContext.jsx
├── utils/
│   └── constants.js
└── App.jsx
```

### Key Features by Persona

#### Institute Admin
- **Dashboard**: Overview of all students' routines
- **Student Management**: Add, edit, delete students
- **Routine Analytics**: View patterns and statistics
- **Feedback System**: Provide feedback on submitted routines
- **Reports**: Generate routine reports for parents

#### Parent
- **Child Dashboard**: View own children's routines
- **Routine Entry**: Add/edit daily routine entries
- **Progress Tracking**: View child's routine history
- **Feedback Viewing**: View admin feedback on routines
- **Notifications**: Alerts for missing entries

### Package.json Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "axios": "^1.3.0",
    "tailwindcss": "^3.2.0",
    "react-hook-form": "^7.43.0",
    "date-fns": "^2.29.0",
    "react-hot-toast": "^2.4.0"
  }
}
```

## Daily Routine Data Fields

### Time-based Fields
- **Wake Up Time**: Time student woke up
- **School Time**: Time student left for/started school
- **Breakfast Time**: When breakfast was consumed
- **Lunch Time**: When lunch was consumed
- **Nap Time**: Afternoon rest time
- **Study Time**: Duration of study/homework
- **Dinner Time**: When dinner was consumed
- **Sleep Time**: Bedtime

### Activity Fields
- **Breakfast Items**: What was eaten for breakfast
- **Lunch Items**: What was eaten for lunch
- **Dinner Items**: What was eaten for dinner
- **Screen Time**: Minutes spent on devices/TV
- **Before Class Activity**: Activities before school
- **Behavior at Home**: Rating scale (Excellent/Good/Average/Needs Improvement)
- **Admin Feedback**: Comments and suggestions from institute admin
- **Feedback Date**: When feedback was provided

## Security Implementation

### Authentication Flow
1. User logs in with username/password
2. Backend validates credentials
3. JWT token generated and returned
4. Frontend stores token in localStorage
5. Token included in subsequent API requests

### Authorization Rules
- **Admin**: Full access to all students and routines
- **Parent**: Access only to their own children's data
- **Data Isolation**: Strict parent-child relationship enforcement

## Deployment Configuration

### Backend (application.yml)
```yaml
spring:
  datasource:
    url: jdbc:h2:mem:dailyroutine
    driver-class-name: org.h2.Driver
    username: sa
    password: 
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true
  h2:
    console:
      enabled: true
server:
  port: 8080
```

### Frontend Build
```bash
npm run build
# Serves static files from build/ directory
```

## Development Setup

### Backend Setup
```bash
# Clone repository
git clone <repository-url>
cd daily-routine-backend

# Run Spring Boot application
./mvnw spring-boot:run
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd daily-routine-frontend

# Install dependencies
npm install

# Start development server
npm start
```

## Testing Strategy

### Backend Testing
- Unit tests for services and repositories
- Integration tests for API endpoints
- Security tests for authentication/authorization

### Frontend Testing
- Component unit tests with Jest/React Testing Library
- Integration tests for user workflows
- E2E tests with Cypress

## Admin Feedback System

### Feedback Workflow
1. **Parent Submission**: Parent submits daily routine for child
2. **Admin Review**: Admin views routine in dashboard
3. **Feedback Provision**: Admin can add constructive feedback
4. **Parent Notification**: Parent sees feedback in routine history
5. **Continuous Improvement**: Feedback helps improve child's routine

### Feedback Features
- **Rich Text Feedback**: Detailed comments and suggestions
- **Feedback History**: Track all feedback over time
- **Feedback Status**: Visual indicators for routines with/without feedback
- **Feedback Analytics**: Insights on feedback patterns

## Future Enhancements

1. **Mobile App**: React Native implementation
2. **Notifications**: Email/SMS reminders for feedback
3. **Analytics**: Advanced reporting and insights
4. **Export**: PDF reports with feedback included
5. **Multi-language**: Internationalization support
6. **Offline Mode**: PWA capabilities
7. **Feedback Templates**: Pre-defined feedback suggestions
8. **Rating System**: Star ratings alongside text feedback

## Performance Considerations

- **Backend**: Connection pooling, query optimization
- **Frontend**: Code splitting, lazy loading, memoization
- **Database**: Proper indexing on frequently queried fields
- **Caching**: Redis for session management (future enhancement)

This solution provides a complete foundation for the daily routine tracking application with clear separation of concerns, proper security implementation, and scalable architecture.