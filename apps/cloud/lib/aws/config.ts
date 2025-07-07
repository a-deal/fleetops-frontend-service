export const awsConfig = {
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  iot: {
    endpoint: process.env.NEXT_PUBLIC_AWS_IOT_ENDPOINT || '',
  },
  cognito: {
    userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID || '',
    clientId: process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID || '',
    identityPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID || '',
  },
} as const;

export function validateAwsConfig(): void {
  const requiredEnvVars = [
    'NEXT_PUBLIC_AWS_REGION',
    'NEXT_PUBLIC_AWS_IOT_ENDPOINT',
    'NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID',
    'NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID',
    'NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID',
  ];

  const missing = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missing.length > 0) {
    // In development, we allow missing credentials
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn(
        `Missing required AWS environment variables: ${missing.join(', ')}`
      );
      // eslint-disable-next-line no-console
      console.warn(
        'Please copy .env.local.example to .env.local and fill in your AWS credentials'
      );
    }
  }
}