# Deployment Script Configuration

## 🚀 Quick Start

### Prerequisites
1. **AWS CLI installed and configured**:
   ```bash
   # Install AWS CLI
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install
   
   # Configure AWS CLI
   aws configure
   ```

2. **Node.js 18+ installed locally** (for frontend builds):
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Git repository setup**:
   - Push your code to GitHub/GitLab
   - Update the git clone URL in `deploy.sh`

### Deploy Your Application

```bash
# Make script executable
chmod +x deploy.sh

# Initialize and deploy everything
./deploy.sh init

# Check deployment status
./deploy.sh status

# Deploy updates later
./deploy.sh deploy

# Deploy only backend (Java changes)
./deploy.sh backend

# Deploy only frontend (React changes)
./deploy.sh frontend

# Destroy all resources
./deploy.sh destroy
```

## ⚙️ Configuration Required

### 1. Repository Already Configured
The script is already configured to use:
```bash
GIT_REPO="https://github.com/yogeshkaledev/daily-routine"
```

### 2. Configuration Already Set
The script is pre-configured with:
```bash
AWS_PROFILE="yogesh"              # AWS profile to use
GIT_REPO="https://github.com/yogeshkaledev/daily-routine"
APP_NAME="daily-routine"           # Your app name
REGION="us-east-1"                # AWS region
INSTANCE_TYPE="t2.micro"          # EC2 instance type
JAVA_VERSION="21 (Amazon Corretto)" # Java runtime
```

### 3. Technology Stack
- **Backend**: Spring Boot 3.2.0 with Java 21 (Amazon Corretto)
- **Frontend**: React 18 with Vite (built locally)
- **Database**: H2 in-memory
- **Web Server**: Nginx (reverse proxy)
- **Deployment**: Systemd services

## 🏗️ Available Commands

| Command | Description | Use Case |
|---------|-------------|----------|
| `init` | Full deployment | First-time setup |
| `deploy` | Update everything | Major updates |
| `backend` | Backend only | Java code changes |
| `frontend` | Frontend only | React/UI changes |
| `status` | Show info | Check deployment |
| `destroy` | Delete all | Cleanup resources |

## 🏗️ What the Script Does

### `./deploy.sh init`
1. ✅ Creates EC2 key pair
2. ✅ Sets up security groups (web server)
3. ✅ Launches EC2 instance with auto-setup
4. ✅ Installs Java 21 (Amazon Corretto), Git, Nginx
5. ✅ Clones and builds your Spring Boot application
6. ✅ Configures systemd service with H2 database
7. ✅ Sets up Nginx reverse proxy
8. ✅ Creates S3 bucket for backups
9. ✅ Frontend built locally and uploaded

### `./deploy.sh deploy`
- Updates code from Git
- Rebuilds backend (Java 21 Corretto) and frontend
- Restarts services
- Zero-downtime deployment

### `./deploy.sh backend`
- Updates backend code only
- Rebuilds with Java 21 (Amazon Corretto)
- Restarts Spring Boot service
- Faster for Java-only changes

### `./deploy.sh frontend`
- Builds React frontend locally
- Uploads to server
- Reloads Nginx
- Faster for UI-only changes

### `./deploy.sh status`
- Shows instance details
- Displays URLs
- Checks service status

### `./deploy.sh destroy`
- Terminates all AWS resources
- Cleans up security groups
- Removes S3 buckets
- **⚠️ Irreversible action**

## 🌐 Access Your Application

After successful deployment:
- **Frontend**: `http://YOUR_EC2_IP`
- **API**: `http://YOUR_EC2_IP/api`
- **Login**: admin/password or parent1/password

## 📁 Files Created

The script creates these files locally:
- `daily-routine-key.pem` - SSH key for EC2 access
- `.instance-id` - EC2 instance ID
- `.public-ip` - Public IP address
- `.web-sg-id` - Web security group ID
- `.bucket-name` - S3 bucket name

## 🔧 Troubleshooting

### SSH into EC2 Instance
```bash
ssh -i daily-routine-key.pem ec2-user@YOUR_EC2_IP
```

### Check Application Logs
```bash
# SSH to instance first, then:
sudo journalctl -u daily-routine -f
sudo systemctl status daily-routine
sudo systemctl status nginx
```

### Manual Service Restart
```bash
# SSH to instance first, then:
sudo systemctl restart daily-routine
sudo systemctl restart nginx
```

### Check H2 Database Console
```bash
# Access H2 console at:
http://YOUR_EC2_IP:8080/h2-console
# JDBC URL: jdbc:h2:mem:dailyroutine
# Username: sa
# Password: (empty)
```

## 💰 Cost Estimate

**Free Tier (12 months)**:
- EC2 t2.micro: $0
- S3 storage: $0
- **Total: $0/month**

**After Free Tier**:
- EC2 t2.micro: ~$8.50/month
- S3 + data transfer: ~$1-3/month
- **Total: ~$9-12/month**

## 🔒 Security Features

- ✅ Security groups with minimal required ports
- ✅ H2 in-memory database (no external access needed)
- ✅ Nginx reverse proxy
- ✅ SSH key-based authentication

## 🚨 Important Notes

1. **Backup your SSH key**: Save `daily-routine-key.pem` securely
2. **Node.js required locally**: Frontend builds on your machine, not server
3. **Java 21 Corretto**: Backend uses Amazon Corretto JDK 21
4. **AWS Limits**: Ensure you're within Free Tier limits
5. **Domain Setup**: For production, configure a domain name
6. **SSL Certificate**: Add Let's Encrypt for HTTPS in production
7. **Local builds**: Frontend builds faster locally than on EC2

## 📞 Support

If deployment fails:
1. Check AWS CLI configuration: `aws sts get-caller-identity`
2. Verify Free Tier eligibility in AWS Console
3. Check script logs for specific error messages
4. Ensure Git repository is publicly accessible
5. Verify all prerequisites are installed