# FleetOps Cloud Service

Cloud-based fleet management platform that connects to AWS IoT Core for real-time telemetry data.

## Architecture

```
Sensors → Edge Gateway → AWS IoT Core → FleetOps Cloud → Users
```

## Setup

### 1. AWS Prerequisites

You'll need:
- AWS Account with IoT Core enabled
- IAM user with appropriate permissions
- Cognito User Pool for authentication
- IoT Core endpoint URL

### 2. Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your AWS credentials:
   - `NEXT_PUBLIC_AWS_REGION`: Your AWS region (e.g., us-east-1)
   - `NEXT_PUBLIC_AWS_IOT_ENDPOINT`: Your IoT Core endpoint
   - `NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID`: Cognito User Pool ID
   - `NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID`: Cognito App Client ID
   - `NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID`: Cognito Identity Pool ID

### 3. Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

## Features

- **Real-time Telemetry Dashboard**: View live sensor data from your fleet
- **AWS IoT Integration**: Secure WebSocket connections to AWS IoT Core
- **Authentication Ready**: Cognito integration for user management
- **Scalable Architecture**: Built for multi-tenant fleet management

## Project Structure

```
apps/cloud/
├── app/                    # Next.js app directory
│   ├── telemetry/         # Telemetry dashboard page
│   └── api/health/        # Health check endpoint
├── components/            # React components
├── hooks/                 # Custom React hooks
├── lib/                   # Core libraries
│   └── aws/              # AWS SDK integrations
└── providers/            # React context providers
```

## Security Notes

- Never commit `.env.local` files
- Use IAM roles with minimal required permissions
- Enable AWS CloudTrail for audit logging
- Implement proper CORS policies for production

## Next Steps

1. Set up AWS Cognito authentication
2. Implement data persistence with DynamoDB
3. Add real-time alerting capabilities
4. Create fleet management UI
5. Implement data analytics dashboard