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

2. **Git repository setup**:
   - Push your code to GitHub/GitLab
   - Update the git clone URL in `deploy.sh` (line 95)

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
```

## 🏗️ What the Script Does

### `./deploy.sh init`
1. ✅ Creates EC2 key pair
2. ✅ Sets up security groups (web server)
3. ✅ Launches EC2 instance with auto-setup
4. ✅ Installs Java 21, Git, Nginx
5. ✅ Clones and builds your application
6. ✅ Configures systemd service with H2 database
7. ✅ Sets up Nginx reverse proxy
8. ✅ Builds and deploys React frontend
9. ✅ Creates S3 bucket for backups

### `./deploy.sh deploy`
- Updates code from Git
- Rebuilds backend and frontend
- Restarts services
- Zero-downtime deployment

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
2. **Update Git URL**: Must update repository URL before running
3. **AWS Limits**: Ensure you're within Free Tier limits
4. **Domain Setup**: For production, configure a domain name
5. **SSL Certificate**: Add Let's Encrypt for HTTPS in production

## 📞 Support

If deployment fails:
1. Check AWS CLI configuration: `aws sts get-caller-identity`
2. Verify Free Tier eligibility in AWS Console
3. Check script logs for specific error messages
4. Ensure Git repository is publicly accessible
5. Verify all prerequisites are installed