import { auth } from 'aws-iot-device-sdk-v2';

// Temporary credentials provider for development
// In production, this should use Cognito Identity Pool
export function createCredentialsProvider() {
  // For development, we'll use static credentials if available
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    return auth.AwsCredentialsProvider.newStatic(
      process.env.AWS_ACCESS_KEY_ID,
      process.env.AWS_SECRET_ACCESS_KEY,
      process.env.AWS_SESSION_TOKEN
    );
  }

  // For production, use Cognito (to be implemented)
  // This is a placeholder that will need proper Cognito integration
  return auth.AwsCredentialsProvider.newDefault();
}