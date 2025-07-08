# Infrastructure Keycloak PoC Setup Guide

> **Purpose**: Step-by-step guide for setting up the `infra-keycloak-poc` repository  
> **Timeline**: Execute after completing current monorepo work

## Repository Creation

### 1. Create New Repository

```bash
# Create repository on GitHub/GitLab
# Name: infra-keycloak-poc
# Description: Keycloak authentication PoC infrastructure for FleetOps
# Visibility: Private
```

### 2. Initial Repository Structure

```bash
# Clone and set up initial structure
git clone git@github.com:your-org/infra-keycloak-poc.git
cd infra-keycloak-poc

# Create directory structure
mkdir -p modules/{network,database,keycloak,iot-auth}
mkdir -p environments/{dev,poc}
mkdir -p scripts
mkdir -p .github/workflows

# Create initial files
touch README.md
touch .gitignore
touch scripts/export-outputs.sh
chmod +x scripts/export-outputs.sh
```

### 3. Essential Files

#### `.gitignore`
```gitignore
# Terraform
*.tfstate
*.tfstate.*
.terraform/
.terraform.lock.hcl
*.tfvars
!*.example.tfvars

# Environment files
.env
.env.*
!.env.example

# IDE
.idea/
.vscode/
*.swp
*.swo
.DS_Store

# Temporary files
*.tmp
*.bak
```

#### `README.md`
```markdown
# FleetOps Keycloak PoC Infrastructure

## Overview

This repository contains Terraform infrastructure for the FleetOps Keycloak proof-of-concept.

**Timeline**: 4-week PoC (Starting: [DATE])  
**Purpose**: Validate Keycloak as authentication solution for FleetOps

## Success Criteria

- [ ] IoT device authentication via JWT (<500ms latency)
- [ ] Support 200 concurrent operator logins
- [ ] Handle 1M+ device authentications/month
- [ ] RBAC hierarchy: Admin → Manager → Operator → Driver
- [ ] Total infrastructure cost <$1000/month at scale

## Quick Start

### Prerequisites
- Terraform >= 1.5.0
- AWS CLI configured
- Access to FleetOps AWS account

### Developer Setup

1. Clone this repository
2. Copy example variables:
   ```bash
   cp environments/dev/terraform.example.tfvars environments/dev/terraform.tfvars
   ```
3. Edit `terraform.tfvars` with your settings
4. Deploy your personal instance:
   ```bash
   cd environments/dev
   terraform init
   terraform apply
   ```
5. Export outputs to application:
   ```bash
   ../../scripts/export-outputs.sh ../path/to/fleetops-frontend-service/.env.local
   ```

## Architecture

- **Compute**: ECS Fargate (2x 2vCPU/4GB tasks)
- **Database**: RDS PostgreSQL (t3.small for PoC)
- **Network**: Dedicated VPC with public/private subnets
- **Load Balancer**: ALB for Keycloak access
- **Auth Integration**: Lambda authorizer for IoT Core

## Path to Production

If PoC succeeds:
1. Rename repository to `infra-keycloak`
2. Update backend to production state store
3. Scale resources in `environments/prod/terraform.tfvars`
4. Run security review
5. Deploy to production

## Monitoring

- CloudWatch dashboards for auth latency
- RDS performance insights
- ECS task metrics
- Cost tracking via AWS Cost Explorer
```

### 4. Terraform Module Structure

#### `modules/network/main.tf`
```hcl
# VPC for Keycloak infrastructure
resource "aws_vpc" "keycloak" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "${var.environment}-keycloak-vpc"
    Environment = var.environment
    Purpose     = "keycloak-poc"
  }
}

# Public subnets for ALB
resource "aws_subnet" "public" {
  count                   = length(var.availability_zones)
  vpc_id                  = aws_vpc.keycloak.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 8, count.index)
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.environment}-keycloak-public-${count.index + 1}"
    Type = "public"
  }
}

# Private subnets for ECS and RDS
resource "aws_subnet" "private" {
  count             = length(var.availability_zones)
  vpc_id            = aws_vpc.keycloak.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index + 100)
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name = "${var.environment}-keycloak-private-${count.index + 1}"
    Type = "private"
  }
}
```

#### `modules/keycloak/main.tf`
```hcl
# ECS Cluster for Keycloak
resource "aws_ecs_cluster" "keycloak" {
  name = "${var.environment}-keycloak-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# Keycloak task definition
resource "aws_ecs_task_definition" "keycloak" {
  family                   = "${var.environment}-keycloak"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.task_cpu
  memory                   = var.task_memory
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name  = "keycloak"
      image = "quay.io/keycloak/keycloak:${var.keycloak_version}"
      
      portMappings = [
        {
          containerPort = 8080
          protocol      = "tcp"
        }
      ]
      
      environment = [
        {
          name  = "KC_DB"
          value = "postgres"
        },
        {
          name  = "KC_DB_URL"
          value = "jdbc:postgresql://${var.db_endpoint}/${var.db_name}"
        },
        {
          name  = "KC_HOSTNAME"
          value = var.keycloak_hostname
        },
        {
          name  = "KC_PROXY"
          value = "edge"
        },
        {
          name  = "KC_HTTP_ENABLED"
          value = "true"
        }
      ]
      
      secrets = [
        {
          name      = "KC_DB_USERNAME"
          valueFrom = var.db_username_secret_arn
        },
        {
          name      = "KC_DB_PASSWORD"
          valueFrom = var.db_password_secret_arn
        },
        {
          name      = "KEYCLOAK_ADMIN"
          valueFrom = var.admin_username_secret_arn
        },
        {
          name      = "KEYCLOAK_ADMIN_PASSWORD"
          valueFrom = var.admin_password_secret_arn
        }
      ]
      
      command = ["start", "--optimized"]
      
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.keycloak.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "keycloak"
        }
      }
    }
  ])
}
```

### 5. Developer Bridge Script

#### `scripts/export-outputs.sh`
```bash
#!/bin/bash

# Export Terraform outputs to application .env file
# Usage: ./export-outputs.sh [path-to-env-file]

set -e

# Default to .env.local in parent directory
ENV_FILE="${1:-../.env.local}"

# Ensure we're in the right directory
if [ ! -f "terraform.tfstate" ]; then
    echo "Error: terraform.tfstate not found. Run this script from an environment directory after terraform apply."
    exit 1
fi

echo "Exporting Terraform outputs to ${ENV_FILE}..."

# Get outputs as JSON
OUTPUTS=$(terraform output -json)

# Parse and write to env file
{
    echo "# Keycloak Configuration (auto-generated by infra-keycloak-poc)"
    echo "# Generated at: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
    echo ""
    echo "NEXT_PUBLIC_KEYCLOAK_URL=$(echo $OUTPUTS | jq -r '.keycloak_url.value')"
    echo "NEXT_PUBLIC_KEYCLOAK_REALM=$(echo $OUTPUTS | jq -r '.keycloak_realm.value')"
    echo "NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=$(echo $OUTPUTS | jq -r '.keycloak_client_id.value')"
    echo "KEYCLOAK_CLIENT_SECRET=$(echo $OUTPUTS | jq -r '.keycloak_client_secret.value')"
    echo "KEYCLOAK_ADMIN_URL=$(echo $OUTPUTS | jq -r '.keycloak_admin_url.value')"
    echo ""
    echo "# IoT Authentication"
    echo "IOT_KEYCLOAK_CLIENT_ID=$(echo $OUTPUTS | jq -r '.iot_client_id.value')"
    echo "IOT_KEYCLOAK_CLIENT_SECRET=$(echo $OUTPUTS | jq -r '.iot_client_secret.value')"
    echo "IOT_AUTH_LAMBDA_ARN=$(echo $OUTPUTS | jq -r '.iot_auth_lambda_arn.value')"
} > "$ENV_FILE"

echo "✅ Exported $(echo $OUTPUTS | jq 'keys | length') outputs to ${ENV_FILE}"
echo ""
echo "Next steps:"
echo "1. cd to your application directory"
echo "2. Run your development server"
echo "3. Keycloak will be available at: $(echo $OUTPUTS | jq -r '.keycloak_url.value')"
```

### 6. CI/CD Pipeline

#### `.github/workflows/terraform.yml`
```yaml
name: Terraform CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  AWS_REGION: us-east-1
  TF_VERSION: 1.5.0

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: ${{ env.TF_VERSION }}
      
      - name: Terraform Format Check
        run: terraform fmt -check -recursive
      
      - name: Terraform Init
        run: |
          cd environments/poc
          terraform init -backend=false
      
      - name: Terraform Validate
        run: |
          cd environments/poc
          terraform validate

  plan:
    needs: validate
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
      
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: ${{ env.TF_VERSION }}
      
      - name: Terraform Plan
        run: |
          cd environments/poc
          terraform init
          terraform plan -out=tfplan
      
      - name: Upload Plan
        uses: actions/upload-artifact@v3
        with:
          name: tfplan
          path: environments/poc/tfplan

  apply:
    needs: validate
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
      
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: ${{ env.TF_VERSION }}
      
      - name: Terraform Apply
        run: |
          cd environments/poc
          terraform init
          terraform apply -auto-approve
      
      - name: Export Outputs to SSM
        run: |
          cd environments/poc
          
          # Export outputs to SSM for application consumption
          OUTPUTS=$(terraform output -json)
          
          # Store each output in SSM
          echo "$OUTPUTS" | jq -r 'to_entries[] | "/fleetops/keycloak/\(.key) \(.value.value)"' | \
          while read -r param_name param_value; do
            aws ssm put-parameter \
              --name "$param_name" \
              --value "$param_value" \
              --type "String" \
              --overwrite \
              --region ${{ env.AWS_REGION }}
          done
          
          echo "✅ Exported outputs to SSM Parameter Store"
```

## Next Steps

1. When ready, create the `infra-keycloak-poc` repository
2. Copy this setup guide content
3. Initialize with the provided structure
4. Configure AWS credentials and Terraform backend
5. Deploy first developer instance
6. Test integration with application monorepo

## Timeline

- **Week 1**: Infrastructure setup and basic Keycloak deployment
- **Week 2**: IoT authentication integration and RBAC configuration
- **Week 3**: Load testing and performance validation
- **Week 4**: Documentation and go/no-go decision

This approach ensures clean separation while maintaining developer productivity!