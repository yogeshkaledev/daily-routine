# Daily Routine Tracking App

A full-stack web application for tracking daily routines of students with two user personas: Institute Admin and Parent.

## Technology Stack

- **Backend**: Java Spring Boot 3.2.0 with JDK 21
- **Database**: H2 In-Memory Database with JPA
- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Authentication**: JWT

## Quick Start

### Prerequisites
- JDK 21
- Node.js 18+
- Maven 3.6+

### Backend Setup
```bash
cd backend
./mvnw spring-boot:run
```
Backend will run on http://localhost:8080

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on http://localhost:3000

## Default Login Credentials

### Admin
- Username: `admin`
- Password: `password`

### Parent
- Username: `parent1` or `parent2`
- Password: `password`

## Features

### Admin Dashboard
- View all students and their routine completion status
- Monitor daily routine statistics
- Date-based filtering of routines

### Parent Dashboard
- Add daily routines for children
- View routine history
- Track child's behavior and activities

### Daily Routine Fields
- Wake up time, school time, breakfast details
- Lunch, screen time, nap time, study time
- Before class activities, dinner, sleep time
- Behavior rating and notes

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Students
- `GET /api/students` - Get students (filtered by role)
- `POST /api/students` - Create student (Admin only)
- `PUT /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Delete student (Admin only)

### Routines
- `GET /api/routines/student/{studentId}` - Get student routines
- `GET /api/routines/date/{date}` - Get routines by date
- `POST /api/routines` - Save routine
- `DELETE /api/routines/{id}` - Delete routine

## Database Access

H2 Console: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:dailyroutine`
- Username: `sa`
- Password: (empty)

## Project Structure

```
├── backend/                 # Spring Boot application
│   ├── src/main/java/
│   │   └── com/dailyroutine/
│   │       ├── config/      # Security & JWT configuration
│   │       ├── controller/  # REST controllers
│   │       ├── entity/      # JPA entities
│   │       ├── repository/  # Data repositories
│   │       ├── service/     # Business logic
│   │       └── dto/         # Data transfer objects
│   └── src/main/resources/
│       ├── application.yml  # Configuration
│       └── data.sql        # Sample data
└── frontend/               # React application
    ├── src/
    │   ├── components/     # React components
    │   ├── services/       # API services
    │   ├── context/        # React context
    │   └── utils/          # Utilities
    ├── package.json
    └── vite.config.js
```