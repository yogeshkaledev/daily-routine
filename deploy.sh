#!/bin/bash

# Daily Routine App - AWS Deployment Script
# Usage: ./deploy.sh [init|deploy|destroy]

set -e

# Configuration
APP_NAME="daily-routine"
REGION="us-east-1"
KEY_NAME="daily-routine-key"
INSTANCE_TYPE="t2.micro"
AMI_ID="ami-0c02fb55956c7d316"  # Amazon Linux 2023
DB_PASSWORD="DailyRoutine123!"
JWT_SECRET="mySecretKey1234567890123456789012345678901234567890123456789012345678901234567890"
GIT_REPO="https://github.com/yogeshkaledev/daily-routine"

# Set AWS Profile
export AWS_PROFILE=yogesh

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

check_aws_cli() {
    if ! command -v aws &> /dev/null; then
        error "AWS CLI not found. Please install AWS CLI first."
    fi
    
    if ! aws sts get-caller-identity &> /dev/null; then
        error "AWS CLI not configured. Run 'aws configure' first."
    fi
}

create_key_pair() {
    log "Creating EC2 key pair..."
    if ! aws ec2 describe-key-pairs --key-names $KEY_NAME &> /dev/null; then
        aws ec2 create-key-pair --key-name $KEY_NAME --query 'KeyMaterial' --output text > ${KEY_NAME}.pem
        chmod 400 ${KEY_NAME}.pem
        log "Key pair created: ${KEY_NAME}.pem"
    else
        warn "Key pair $KEY_NAME already exists"
    fi
}

create_security_groups() {
    log "Creating security groups..."
    
    # Web server security group
    WEB_SG_ID=$(aws ec2 create-security-group \
        --group-name ${APP_NAME}-web-sg \
        --description "Security group for ${APP_NAME} web server" \
        --query 'GroupId' --output text 2>/dev/null || \
        aws ec2 describe-security-groups \
        --group-names ${APP_NAME}-web-sg \
        --query 'SecurityGroups[0].GroupId' --output text)
    
    # Configure web security group rules
    aws ec2 authorize-security-group-ingress \
        --group-id $WEB_SG_ID \
        --protocol tcp --port 22 --cidr 0.0.0.0/0 2>/dev/null || true
    
    aws ec2 authorize-security-group-ingress \
        --group-id $WEB_SG_ID \
        --protocol tcp --port 80 --cidr 0.0.0.0/0 2>/dev/null || true
    
    aws ec2 authorize-security-group-ingress \
        --group-id $WEB_SG_ID \
        --protocol tcp --port 443 --cidr 0.0.0.0/0 2>/dev/null || true
    
    aws ec2 authorize-security-group-ingress \
        --group-id $WEB_SG_ID \
        --protocol tcp --port 8080 --cidr 0.0.0.0/0 2>/dev/null || true
    
    echo $WEB_SG_ID > .web-sg-id
    log "Security group created: Web($WEB_SG_ID)"
}

# Skipping RDS creation - using H2 in-memory database

create_user_data() {
    cat > user-data.sh << EOF
#!/bin/bash
yum update -y
yum install -y java-21-amazon-corretto-devel git nginx

# Create app directory
mkdir -p /opt/daily-routine
cd /opt/daily-routine

# Clone repository
git clone ${GIT_REPO} .

# Build backend
cd backend
chmod +x mvnw
./mvnw clean package -DskipTests

# Create systemd service
cat > /etc/systemd/system/daily-routine.service << 'EOL'
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

Environment=DATABASE_URL=jdbc:h2:mem:dailyroutine
Environment=DB_USERNAME=sa
Environment=DB_PASSWORD=
Environment=JWT_SECRET=${JWT_SECRET}
Environment=SERVER_PORT=8080

[Install]
WantedBy=multi-user.target
EOL

# Configure Nginx reverse proxy
cat > /etc/nginx/conf.d/daily-routine.conf << 'EOL'
server {
    listen 80;
    server_name _;
    
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    location / {
        root /var/www/html;
        try_files \$uri \$uri/ /index.html;
    }
}
EOL

# Start services
systemctl daemon-reload
systemctl enable daily-routine nginx
systemctl start nginx
systemctl start daily-routine

# Build and deploy frontend
cd /opt/daily-routine/frontend
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs
npm install
npm run build
cp -r dist/* /var/www/html/

# Update API URL in frontend
sed -i 's|http://localhost:8080/api|/api|g' /var/www/html/assets/*.js

systemctl restart nginx
EOF
}

launch_ec2_instance() {
    log "Launching EC2 instance..."
    
    WEB_SG_ID=$(cat .web-sg-id)
    create_user_data
    
    INSTANCE_ID=$(aws ec2 run-instances \
        --image-id $AMI_ID \
        --count 1 \
        --instance-type $INSTANCE_TYPE \
        --key-name $KEY_NAME \
        --security-group-ids $WEB_SG_ID \
        --user-data file://user-data.sh \
        --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=${APP_NAME}-server}]" \
        --query 'Instances[0].InstanceId' --output text)
    
    echo $INSTANCE_ID > .instance-id
    log "EC2 instance launched: $INSTANCE_ID"
    
    log "Waiting for instance to be running..."
    aws ec2 wait instance-running --instance-ids $INSTANCE_ID
    
    PUBLIC_IP=$(aws ec2 describe-instances \
        --instance-ids $INSTANCE_ID \
        --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)
    
    echo $PUBLIC_IP > .public-ip
    log "Instance is running at: $PUBLIC_IP"
}

create_s3_bucket() {
    log "Creating S3 bucket for backups..."
    
    BUCKET_NAME="${APP_NAME}-backups-$(date +%s)"
    aws s3 mb s3://$BUCKET_NAME 2>/dev/null || warn "Bucket creation failed"
    echo $BUCKET_NAME > .bucket-name
    log "S3 bucket created: $BUCKET_NAME"
}

deploy_application() {
    if [ ! -f .instance-id ]; then
        error "No instance found. Run './deploy.sh init' first."
    fi
    
    INSTANCE_ID=$(cat .instance-id)
    PUBLIC_IP=$(cat .public-ip)
    
    log "Deploying application to $PUBLIC_IP..."
    
    # Wait for SSH to be available
    log "Waiting for SSH access..."
    while ! ssh -i ${KEY_NAME}.pem -o ConnectTimeout=5 -o StrictHostKeyChecking=no ec2-user@$PUBLIC_IP "echo 'SSH Ready'" 2>/dev/null; do
        sleep 10
    done
    
    # Deploy latest code
    ssh -i ${KEY_NAME}.pem -o StrictHostKeyChecking=no ec2-user@$PUBLIC_IP << 'EOF'
cd /opt/daily-routine
sudo git pull origin main 2>/dev/null || echo "Git pull failed - manual update needed"
cd backend
sudo ./mvnw clean package -DskipTests
sudo systemctl restart daily-routine

# Rebuild frontend
cd ../frontend
sudo npm run build
sudo cp -r dist/* /var/www/html/
sudo systemctl restart nginx
EOF
    
    log "Application deployed successfully!"
    log "Access your application at: http://$PUBLIC_IP"
    log "API endpoint: http://$PUBLIC_IP/api"
}

show_status() {
    if [ ! -f .instance-id ]; then
        warn "No deployment found."
        return
    fi
    
    INSTANCE_ID=$(cat .instance-id)
    PUBLIC_IP=$(cat .public-ip)
    
    log "Deployment Status:"
    echo "  Instance ID: $INSTANCE_ID"
    echo "  Public IP: $PUBLIC_IP"
    echo "  Database: H2 In-Memory"
    echo "  Application URL: http://$PUBLIC_IP"
    echo "  API URL: http://$PUBLIC_IP/api"
    
    # Check instance status
    STATUS=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID --query 'Reservations[0].Instances[0].State.Name' --output text)
    echo "  Instance Status: $STATUS"
}

destroy_resources() {
    warn "This will destroy all AWS resources. Are you sure? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        log "Cancelled."
        return
    fi
    
    log "Destroying AWS resources..."
    
    # Terminate EC2 instance
    if [ -f .instance-id ]; then
        INSTANCE_ID=$(cat .instance-id)
        aws ec2 terminate-instances --instance-ids $INSTANCE_ID
        log "EC2 instance terminated: $INSTANCE_ID"
        rm -f .instance-id .public-ip
    fi
    
    # No RDS instance to delete (using H2)
    
    # Delete security groups (after instances are terminated)
    sleep 30
    if [ -f .web-sg-id ]; then
        WEB_SG_ID=$(cat .web-sg-id)
        aws ec2 delete-security-group --group-id $WEB_SG_ID 2>/dev/null || warn "Web SG deletion failed"
        rm -f .web-sg-id
    fi
    
    # No database security group to delete
    
    # Delete S3 bucket
    if [ -f .bucket-name ]; then
        BUCKET_NAME=$(cat .bucket-name)
        aws s3 rb s3://$BUCKET_NAME --force 2>/dev/null || warn "S3 deletion failed"
        rm -f .bucket-name
    fi
    
    rm -f user-data.sh
    log "All resources destroyed."
}

# Main script logic
case "${1:-help}" in
    "init")
        log "Initializing AWS deployment..."
        check_aws_cli
        create_key_pair
        create_security_groups
        launch_ec2_instance
        create_s3_bucket
        
        log "Deployment initialization complete!"
        log "Waiting 5 minutes for application to start..."
        sleep 300
        
        show_status
        log "Setup complete! Your application should be available shortly."
        ;;
    
    "deploy")
        log "Deploying application updates..."
        check_aws_cli
        deploy_application
        ;;
    
    "status")
        show_status
        ;;
    
    "destroy")
        check_aws_cli
        destroy_resources
        ;;
    
    "help"|*)
        echo "Daily Routine App - AWS Deployment Script"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  init     - Initialize and deploy the application"
        echo "  deploy   - Deploy application updates"
        echo "  status   - Show deployment status"
        echo "  destroy  - Destroy all AWS resources"
        echo "  help     - Show this help message"
        echo ""
        echo "Prerequisites:"
        echo "  - AWS CLI installed and configured"
        echo "  - Git repository with your code"
        echo "  - Update the git clone URL in this script"
        ;;
esac