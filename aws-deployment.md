# AWS Deployment Guide - Daily Routine App

## 🎯 Recommended Approach: EC2 + RDS + S3/CloudFront

**Why EC2 over ECS for this app:**
- ✅ Simpler setup for small applications
- ✅ Free tier eligible (t2.micro)
- ✅ Direct control over environment
- ✅ Lower learning curve
- ✅ Cost-effective for single instance

**ECS is better for:**
- Large-scale applications
- Microservices architecture
- Auto-scaling requirements
- Container orchestration needs

---

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CloudFront    │    │   EC2 Instance  │    │   RDS MySQL     │
│   (Frontend)    │    │   (Backend)     │    │   (Database)    │
│                 │    │                 │    │                 │
│   S3 Bucket     │◄──►│  Spring Boot    │◄──►│   PostgreSQL    │
│   React Build   │    │  Port 8080      │    │   Port 5432     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🚀 Step-by-Step Deployment

### Phase 1: Setup RDS Database

#### 1. Create RDS Instance
```bash
# Using AWS CLI
aws rds create-db-instance \
    --db-instance-identifier daily-routine-db \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --master-username admin \
    --master-user-password YourSecurePassword123 \
    --allocated-storage 20 \
    --vpc-security-group-ids sg-xxxxxxxxx \
    --db-name dailyroutine \
    --backup-retention-period 7 \
    --storage-encrypted
```

#### 2. Configure Security Group for RDS
```bash
# Create security group for database
aws ec2 create-security-group \
    --group-name daily-routine-db-sg \
    --description "Security group for Daily Routine database"

# Allow PostgreSQL access from EC2
aws ec2 authorize-security-group-ingress \
    --group-id sg-xxxxxxxxx \
    --protocol tcp \
    --port 5432 \
    --source-group sg-yyyyyyyyyy
```

### Phase 2: Setup EC2 Instance

#### 1. Launch EC2 Instance
```bash
# Launch t2.micro instance (Free Tier)
aws ec2 run-instances \
    --image-id ami-0c02fb55956c7d316 \
    --count 1 \
    --instance-type t2.micro \
    --key-name your-key-pair \
    --security-group-ids sg-yyyyyyyyyy \
    --user-data file://user-data.sh
```

#### 2. Create user-data.sh Script
```bash
#!/bin/bash
# Update system
yum update -y

# Install Java 21
yum install -y java-21-amazon-corretto-devel

# Install Git
yum install -y git

# Create application directory
mkdir -p /opt/daily-routine
cd /opt/daily-routine

# Clone repository (replace with your repo)
git clone https://github.com/yourusername/daily-routine.git .

# Build application
cd backend
chmod +x mvnw
./mvnw clean package -DskipTests

# Create systemd service
cat > /etc/systemd/system/daily-routine.service << EOF
[Unit]
Description=Daily Routine Spring Boot Application
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/opt/daily-routine/backend
ExecStart=/usr/bin/java -jar target/daily-routine-backend-1.0.0.jar
Restart=always
RestartSec=10

Environment=DATABASE_URL=jdbc:postgresql://your-rds-endpoint:5432/dailyroutine
Environment=DB_USERNAME=admin
Environment=DB_PASSWORD=YourSecurePassword123
Environment=JWT_SECRET=your-256-bit-secret-key
Environment=SERVER_PORT=8080

[Install]
WantedBy=multi-user.target
EOF

# Start and enable service
systemctl daemon-reload
systemctl enable daily-routine
systemctl start daily-routine
```

#### 3. Configure Security Group for EC2
```bash
# Create security group for web server
aws ec2 create-security-group \
    --group-name daily-routine-web-sg \
    --description "Security group for Daily Routine web server"

# Allow HTTP traffic
aws ec2 authorize-security-group-ingress \
    --group-id sg-yyyyyyyyyy \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0

# Allow HTTPS traffic
aws ec2 authorize-security-group-ingress \
    --group-id sg-yyyyyyyyyy \
    --protocol tcp \
    --port 443 \
    --cidr 0.0.0.0/0

# Allow Spring Boot port
aws ec2 authorize-security-group-ingress \
    --group-id sg-yyyyyyyyyy \
    --protocol tcp \
    --port 8080 \
    --cidr 0.0.0.0/0

# Allow SSH
aws ec2 authorize-security-group-ingress \
    --group-id sg-yyyyyyyyyy \
    --protocol tcp \
    --port 22 \
    --cidr 0.0.0.0/0
```

### Phase 3: Setup Frontend (S3 + CloudFront)

#### 1. Create S3 Bucket
```bash
# Create bucket for static website
aws s3 mb s3://daily-routine-frontend-bucket

# Enable static website hosting
aws s3 website s3://daily-routine-frontend-bucket \
    --index-document index.html \
    --error-document index.html
```

#### 2. Build and Upload Frontend
```bash
# Build React application
cd frontend
npm install
npm run build

# Upload to S3
aws s3 sync dist/ s3://daily-routine-frontend-bucket --delete

# Set public read permissions
aws s3api put-bucket-policy \
    --bucket daily-routine-frontend-bucket \
    --policy file://bucket-policy.json
```

#### 3. Create bucket-policy.json
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::daily-routine-frontend-bucket/*"
        }
    ]
}
```

#### 4. Setup CloudFront Distribution
```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
    --distribution-config file://cloudfront-config.json
```

#### 5. Create cloudfront-config.json
```json
{
    "CallerReference": "daily-routine-$(date +%s)",
    "Comment": "Daily Routine App Distribution",
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-daily-routine-frontend-bucket",
        "ViewerProtocolPolicy": "redirect-to-https",
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0
        },
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {
                "Forward": "none"
            }
        },
        "MinTTL": 0
    },
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-daily-routine-frontend-bucket",
                "DomainName": "daily-routine-frontend-bucket.s3.amazonaws.com",
                "S3OriginConfig": {
                    "OriginAccessIdentity": ""
                }
            }
        ]
    },
    "Enabled": true,
    "PriceClass": "PriceClass_100"
}
```

---

## 🔧 Production Configuration Updates

### Backend Configuration (application-prod.yml)
```yaml
spring:
  profiles:
    active: prod
  datasource:
    url: ${DATABASE_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
  sql:
    init:
      mode: never

server:
  port: ${SERVER_PORT:8080}
  address: 0.0.0.0

jwt:
  secret: ${JWT_SECRET}
  expiration: 86400000

logging:
  level:
    com.dailyroutine: INFO
    org.springframework.security: INFO
```

### Frontend Configuration
```javascript
// src/services/api.js
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'http://your-ec2-public-ip:8080/api'
  : `http://${window.location.hostname}:8080/api`;
```

### Environment Variables (.env.production)
```bash
VITE_API_URL=http://your-ec2-public-ip:8080/api
```

---

## 🔒 Security Best Practices

### 1. EC2 Security
```bash
# Update system regularly
sudo yum update -y

# Configure firewall
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload

# Disable root login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart sshd
```

### 2. RDS Security
- Enable encryption at rest
- Use SSL connections
- Regular automated backups
- Strong password policy

### 3. Application Security
```java
// Update CORS configuration
@CrossOrigin(origins = "https://your-cloudfront-domain.cloudfront.net")
```

---

## 📊 Cost Estimation (Free Tier)

| Service | Free Tier Limit | Monthly Cost |
|---------|----------------|--------------|
| EC2 t2.micro | 750 hours | $0 |
| RDS db.t3.micro | 750 hours | $0 |
| S3 Storage | 5 GB | $0 |
| CloudFront | 50 GB transfer | $0 |
| **Total** | | **$0/month** |

**After Free Tier (12 months):**
- EC2 t2.micro: ~$8.50/month
- RDS db.t3.micro: ~$12.60/month
- S3 + CloudFront: ~$1-3/month
- **Total**: ~$22-24/month

---

## 🚀 Deployment Commands Summary

### Quick Deployment Script
```bash
#!/bin/bash
# deploy.sh

# 1. Deploy backend to EC2
ssh -i your-key.pem ec2-user@your-ec2-ip << 'EOF'
cd /opt/daily-routine
git pull origin main
cd backend
./mvnw clean package -DskipTests
sudo systemctl restart daily-routine
EOF

# 2. Deploy frontend to S3
cd frontend
npm run build
aws s3 sync dist/ s3://daily-routine-frontend-bucket --delete

# 3. Invalidate CloudFront cache
aws cloudfront create-invalidation \
    --distribution-id YOUR_DISTRIBUTION_ID \
    --paths "/*"

echo "Deployment completed!"
```

---

## 🔍 Monitoring & Troubleshooting

### Check Application Status
```bash
# SSH to EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-ip

# Check service status
sudo systemctl status daily-routine

# View logs
sudo journalctl -u daily-routine -f

# Check if port is listening
sudo netstat -tlnp | grep 8080
```

### CloudWatch Monitoring
```bash
# Enable detailed monitoring for EC2
aws ec2 monitor-instances --instance-ids i-xxxxxxxxx

# Create CloudWatch alarm for high CPU
aws cloudwatch put-metric-alarm \
    --alarm-name "High-CPU-Usage" \
    --alarm-description "Alarm when CPU exceeds 80%" \
    --metric-name CPUUtilization \
    --namespace AWS/EC2 \
    --statistic Average \
    --period 300 \
    --threshold 80 \
    --comparison-operator GreaterThanThreshold
```

---

## 🎯 Alternative: ECS Deployment (Advanced)

### When to Use ECS:
- Need container orchestration
- Auto-scaling requirements
- Multiple environments (dev/staging/prod)
- Microservices architecture

### ECS Setup (Brief Overview):
```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name daily-routine-cluster

# Create task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create service
aws ecs create-service \
    --cluster daily-routine-cluster \
    --service-name daily-routine-service \
    --task-definition daily-routine-task \
    --desired-count 1
```

---

## 📋 Pre-Deployment Checklist

- [ ] AWS account with Free Tier eligibility
- [ ] Key pair created for EC2 access
- [ ] Security groups configured
- [ ] RDS instance created and accessible
- [ ] S3 bucket created with proper permissions
- [ ] CloudFront distribution configured
- [ ] Environment variables set
- [ ] Application built and tested locally
- [ ] Domain name configured (optional)
- [ ] SSL certificate obtained (optional)

---

## 🎉 Conclusion

**Recommended for beginners**: Start with EC2 deployment as outlined above. It's simpler, uses Free Tier effectively, and provides good learning experience with AWS services.

**For production scale**: Consider ECS with Application Load Balancer, Auto Scaling Groups, and multi-AZ deployment for high availability.

The EC2 approach will serve your Daily Routine app well for small to medium user bases while keeping costs minimal.