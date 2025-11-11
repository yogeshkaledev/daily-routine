# Daily Routine App - Public Deployment Guide

## Overview
This guide covers minimal-cost deployment options for the Daily Routine Tracking application with Spring Boot backend and React frontend.

## 🚀 Recommended Deployment Solutions

### Option 1: Railway (Recommended - Easiest)
**Cost**: $5/month per service
**Total**: ~$10/month (Backend + Frontend)

#### Backend Deployment
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway new
railway add --database postgresql
railway deploy
```

#### Frontend Deployment
```bash
# Build and deploy
npm run build
railway deploy
```

**Pros**: 
- Zero configuration
- Automatic HTTPS
- Built-in database
- Git-based deployments

---

### Option 2: Render (Free Tier Available)
**Cost**: Free tier available, $7/month for paid
**Total**: $0-14/month

#### Backend (Spring Boot)
1. Connect GitHub repository
2. Set build command: `./mvnw clean package -DskipTests`
3. Set start command: `java -jar target/daily-routine-backend-1.0.0.jar`
4. Add PostgreSQL database (free tier)

#### Frontend (React)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

**Pros**:
- Free tier available
- Automatic deployments
- Free SSL certificates

---

### Option 3: Vercel + Railway
**Cost**: $0 + $5/month
**Total**: $5/month

#### Frontend on Vercel (Free)
```bash
npm install -g vercel
vercel --prod
```

#### Backend on Railway ($5/month)
```bash
railway deploy
```

**Pros**:
- Frontend completely free
- Excellent performance
- Global CDN

---

### Option 4: Netlify + Heroku
**Cost**: $0 + $7/month
**Total**: $7/month

#### Frontend on Netlify (Free)
```bash
# Build and deploy
npm run build
# Drag and drop dist folder to Netlify
```

#### Backend on Heroku
```bash
# Install Heroku CLI
heroku create daily-routine-api
git push heroku main
```

**Pros**:
- Simple deployment
- Good documentation
- Reliable hosting

---

### Option 5: AWS Free Tier (Most Complex)
**Cost**: $0-5/month (within free tier limits)
**Total**: $0-5/month

#### Services Used:
- **EC2 t2.micro** (Free tier) - Backend
- **S3 + CloudFront** (Free tier) - Frontend
- **RDS t3.micro** (Free tier) - Database

#### Deployment Steps:
1. Launch EC2 instance
2. Install Java 21 and deploy JAR
3. Build React app and upload to S3
4. Configure CloudFront distribution
5. Set up RDS PostgreSQL instance

**Pros**:
- Completely free for 12 months
- Highly scalable
- Professional setup

**Cons**:
- Complex setup
- Requires AWS knowledge

---

## 🗄️ Database Options

### Free/Low-Cost Databases:
1. **Railway PostgreSQL**: $5/month
2. **Render PostgreSQL**: Free tier available
3. **Supabase**: Free tier with 500MB
4. **PlanetScale**: Free tier with 1GB
5. **AWS RDS**: Free tier t3.micro

---

## 📋 Pre-Deployment Checklist

### Backend Configuration Updates:

#### 1. Update application.yml for Production:
```yaml
spring:
  profiles:
    active: prod
  datasource:
    url: ${DATABASE_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
server:
  port: ${PORT:8080}
  address: 0.0.0.0
jwt:
  secret: ${JWT_SECRET}
  expiration: 86400000
```

#### 2. Add Dockerfile (Optional):
```dockerfile
FROM openjdk:21-jdk-slim
COPY target/daily-routine-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Frontend Configuration Updates:

#### 1. Update API Base URL:
```javascript
// src/services/api.js
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com/api'
  : `http://${window.location.hostname}:8080/api`;
```

#### 2. Add Environment Variables:
```bash
# .env.production
VITE_API_URL=https://your-backend-url.com/api
```

---

## 🔧 Environment Variables Setup

### Backend Environment Variables:
```bash
DATABASE_URL=postgresql://username:password@host:port/database
DB_USERNAME=your_username
DB_PASSWORD=your_password
JWT_SECRET=your-super-secret-jwt-key-minimum-256-bits
PORT=8080
```

### Frontend Environment Variables:
```bash
VITE_API_URL=https://your-backend-url.com/api
```

---

## 💰 Cost Comparison

| Solution | Frontend | Backend | Database | Total/Month |
|----------|----------|---------|----------|-------------|
| Railway | $5 | $5 | Included | $10 |
| Render | Free | $7 | Free | $7 |
| Vercel + Railway | Free | $5 | Included | $5 |
| Netlify + Heroku | Free | $7 | $9 | $16 |
| AWS Free Tier | Free | Free | Free | $0* |

*AWS Free Tier is free for first 12 months only

---

## 🚀 Quick Start Deployment (Railway - Recommended)

### 1. Prepare Repository:
```bash
# Ensure your code is in GitHub
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Deploy Backend:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and create project
railway login
railway new daily-routine-backend

# Add PostgreSQL database
railway add postgresql

# Deploy
railway up
```

### 3. Deploy Frontend:
```bash
# Create new Railway project for frontend
railway new daily-routine-frontend

# Update API URL in code
# Deploy
railway up
```

### 4. Configure Environment Variables:
```bash
# Set backend environment variables
railway variables set JWT_SECRET=your-secret-key
railway variables set DATABASE_URL=postgresql://...

# Set frontend environment variables
railway variables set VITE_API_URL=https://your-backend.railway.app/api
```

---

## 🔒 Security Considerations

### Production Security Updates:

1. **Strong JWT Secret**: Use a 256-bit random key
2. **HTTPS Only**: Ensure all communications use HTTPS
3. **CORS Configuration**: Restrict to your frontend domain
4. **Database Security**: Use strong passwords and SSL connections
5. **Environment Variables**: Never commit secrets to Git

### Backend Security Config:
```java
@CrossOrigin(origins = "https://your-frontend-domain.com")
```

---

## 📊 Monitoring & Maintenance

### Free Monitoring Tools:
1. **Railway Dashboard**: Built-in metrics
2. **Render Dashboard**: Application logs and metrics
3. **Vercel Analytics**: Frontend performance
4. **UptimeRobot**: Free uptime monitoring

### Backup Strategy:
1. **Database Backups**: Most platforms provide automatic backups
2. **Code Backups**: Keep code in GitHub
3. **Environment Variables**: Document all required variables

---

## 🎯 Recommendation

**For beginners**: Start with **Railway** ($10/month)
- Easiest setup
- Includes database
- Automatic deployments
- Good documentation

**For budget-conscious**: Use **Vercel + Railway** ($5/month)
- Frontend completely free
- Only pay for backend
- Excellent performance

**For learning**: Try **AWS Free Tier** ($0/month)
- Learn cloud deployment
- Professional setup
- Free for 12 months

Choose based on your budget, technical expertise, and long-term needs.