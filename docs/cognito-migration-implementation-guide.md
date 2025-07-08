# AWS Cognito to Keycloak Migration Guide for FleetOps

> **Document Type**: Implementation Guide
> **Date**: 2025-07-07
> **Purpose**: Step-by-step guide for migrating from AWS Cognito to Keycloak
> **Estimated Timeline**: 2-3 weeks for complete migration

## Overview

This guide provides a practical implementation plan for migrating FleetOps from AWS Cognito to Keycloak, including AWS deployment patterns, code examples, and migration strategies.

## Phase 1: Keycloak Setup on AWS (Week 1)

### 1.1 Infrastructure Setup

**AWS Resources Required**:
- ECS Fargate cluster (or EC2 if preferred)
- RDS PostgreSQL (Multi-AZ for production)
- Application Load Balancer
- ElastiCache Redis (for session clustering)
- S3 bucket (for theme storage)
- Route 53 (for DNS)

**Terraform Configuration Example**:

```hcl
# keycloak-infrastructure.tf

# RDS PostgreSQL for Keycloak
resource "aws_db_instance" "keycloak_db" {
  identifier     = "fleetops-keycloak-db"
  engine         = "postgres"
  engine_version = "14.7"
  instance_class = "db.t3.medium"
  
  allocated_storage     = 20
  max_allocated_storage = 100
  storage_encrypted     = true
  
  db_name  = "keycloak"
  username = "keycloak"
  password = aws_secretsmanager_secret_version.db_password.secret_string
  
  vpc_security_group_ids = [aws_security_group.keycloak_db.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  deletion_protection = true
  skip_final_snapshot = false
  
  tags = {
    Name        = "fleetops-keycloak-db"
    Environment = var.environment
  }
}

# ECS Task Definition for Keycloak
resource "aws_ecs_task_definition" "keycloak" {
  family                   = "fleetops-keycloak"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "2048"
  memory                   = "4096"
  
  execution_role_arn = aws_iam_role.ecs_execution_role.arn
  task_role_arn      = aws_iam_role.ecs_task_role.arn
  
  container_definitions = jsonencode([
    {
      name  = "keycloak"
      image = "quay.io/keycloak/keycloak:23.0"
      
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
          value = "jdbc:postgresql://${aws_db_instance.keycloak_db.endpoint}/${aws_db_instance.keycloak_db.db_name}"
        },
        {
          name  = "KC_HOSTNAME"
          value = var.keycloak_domain
        },
        {
          name  = "KC_PROXY"
          value = "edge"
        },
        {
          name  = "KC_HTTP_ENABLED"
          value = "true"
        },
        {
          name  = "KC_CACHE"
          value = "ispn"
        },
        {
          name  = "KC_CACHE_STACK"
          value = "kubernetes"
        }
      ]
      
      secrets = [
        {
          name      = "KC_DB_USERNAME"
          valueFrom = aws_secretsmanager_secret.db_credentials.arn
        },
        {
          name      = "KC_DB_PASSWORD"
          valueFrom = aws_secretsmanager_secret.db_password.arn
        },
        {
          name      = "KEYCLOAK_ADMIN"
          valueFrom = aws_secretsmanager_secret.admin_credentials.arn
        },
        {
          name      = "KEYCLOAK_ADMIN_PASSWORD"
          valueFrom = aws_secretsmanager_secret.admin_password.arn
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

### 1.2 Keycloak Configuration

**Initial Realm Setup Script**:

```typescript
// scripts/setup-keycloak-realm.ts
import KcAdminClient from '@keycloak/keycloak-admin-client';

async function setupFleetOpsRealm() {
  const kcAdminClient = new KcAdminClient({
    baseUrl: process.env.KEYCLOAK_URL || 'https://auth.fleetops.com',
    realmName: 'master',
  });

  // Authenticate admin
  await kcAdminClient.auth({
    username: process.env.KEYCLOAK_ADMIN_USER!,
    password: process.env.KEYCLOAK_ADMIN_PASSWORD!,
    grantType: 'password',
    clientId: 'admin-cli',
  });

  // Create FleetOps realm
  await kcAdminClient.realms.create({
    realm: 'fleetops',
    enabled: true,
    displayName: 'FleetOps',
    loginTheme: 'fleetops',
    accountTheme: 'fleetops',
    adminTheme: 'fleetops',
    emailTheme: 'fleetops',
    internationalizationEnabled: true,
    supportedLocales: ['en'],
    defaultLocale: 'en',
    sslRequired: 'external',
    bruteForceProtected: true,
    passwordPolicy: 'upperCase(1) and length(8) and forceExpiredPasswordChange(365) and notUsername',
    attributes: {
      frontendUrl: 'https://auth.fleetops.com',
    },
  });

  // Create clients
  const webAppClient = await kcAdminClient.clients.create({
    realm: 'fleetops',
    clientId: 'fleetops-web',
    protocol: 'openid-connect',
    enabled: true,
    publicClient: true,
    standardFlowEnabled: true,
    implicitFlowEnabled: false,
    directAccessGrantsEnabled: true,
    redirectUris: [
      'https://app.fleetops.com/*',
      'http://localhost:3000/*', // Development
    ],
    webOrigins: [
      'https://app.fleetops.com',
      'http://localhost:3000',
    ],
    attributes: {
      'pkce.code.challenge.method': 'S256', // Enable PKCE
    },
  });

  // Create M2M client for IoT devices
  const iotClient = await kcAdminClient.clients.create({
    realm: 'fleetops',
    clientId: 'fleetops-iot',
    protocol: 'openid-connect',
    enabled: true,
    publicClient: false,
    standardFlowEnabled: false,
    implicitFlowEnabled: false,
    directAccessGrantsEnabled: false,
    serviceAccountsEnabled: true, // Enable client credentials flow
    authorizationServicesEnabled: true,
  });

  // Create roles
  const roles = [
    { name: 'fleet-admin', description: 'Full fleet administration access' },
    { name: 'fleet-operator', description: 'Fleet operation and monitoring' },
    { name: 'fleet-viewer', description: 'Read-only fleet access' },
    { name: 'device', description: 'IoT device role' },
  ];

  for (const role of roles) {
    await kcAdminClient.roles.create({
      realm: 'fleetops',
      name: role.name,
      description: role.description,
    });
  }

  // Create groups
  const groups = [
    { name: 'Administrators', realmRoles: ['fleet-admin'] },
    { name: 'Operators', realmRoles: ['fleet-operator'] },
    { name: 'Viewers', realmRoles: ['fleet-viewer'] },
  ];

  for (const group of groups) {
    const createdGroup = await kcAdminClient.groups.create({
      realm: 'fleetops',
      name: group.name,
    });

    // Assign roles to groups
    const roleMappings = await Promise.all(
      group.realmRoles.map(roleName =>
        kcAdminClient.roles.findOneByName({
          realm: 'fleetops',
          name: roleName,
        })
      )
    );

    await kcAdminClient.groups.addRealmRoleMappings({
      realm: 'fleetops',
      id: createdGroup.id,
      roles: roleMappings.filter(role => role !== null),
    });
  }

  console.log('FleetOps realm setup completed successfully!');
}

setupFleetOpsRealm().catch(console.error);
```

## Phase 2: Application Integration (Week 1-2)

### 2.1 Frontend Integration

**Install Keycloak JS Adapter**:
```bash
pnpm add keycloak-js
```

**Create Keycloak Provider**:

```typescript
// apps/cloud/providers/keycloak-provider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Keycloak from 'keycloak-js';

interface KeycloakContextType {
  keycloak: Keycloak | null;
  initialized: boolean;
  authenticated: boolean;
  user: KeycloakUser | null;
  login: () => void;
  logout: () => void;
  token: string | null;
  refreshToken: () => Promise<boolean>;
}

interface KeycloakUser {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
}

const KeycloakContext = createContext<KeycloakContextType | null>(null);

export function KeycloakProvider({ children }: { children: React.ReactNode }) {
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<KeycloakUser | null>(null);

  useEffect(() => {
    const kc = new Keycloak({
      url: process.env.NEXT_PUBLIC_KEYCLOAK_URL!,
      realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM!,
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
    });

    kc.init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      pkceMethod: 'S256',
      checkLoginIframe: false,
    }).then((auth) => {
      setKeycloak(kc);
      setInitialized(true);
      setAuthenticated(auth);

      if (auth && kc.token) {
        loadUserProfile(kc);
        
        // Setup automatic token refresh
        setInterval(() => {
          kc.updateToken(30).then((refreshed) => {
            if (refreshed) {
              console.log('Token refreshed');
            }
          }).catch(() => {
            console.error('Failed to refresh token');
            kc.logout();
          });
        }, 60000); // Check every minute
      }
    });
  }, []);

  const loadUserProfile = async (kc: Keycloak) => {
    try {
      const profile = await kc.loadUserProfile();
      const tokenParsed = kc.tokenParsed;
      
      setUser({
        id: tokenParsed?.sub || '',
        username: profile.username || '',
        email: profile.email || '',
        firstName: profile.firstName,
        lastName: profile.lastName,
        roles: tokenParsed?.realm_access?.roles || [],
      });
    } catch (error) {
      console.error('Failed to load user profile', error);
    }
  };

  const login = () => {
    keycloak?.login();
  };

  const logout = () => {
    keycloak?.logout({
      redirectUri: window.location.origin,
    });
  };

  const refreshToken = async (): Promise<boolean> => {
    if (!keycloak) return false;
    
    try {
      const refreshed = await keycloak.updateToken(5);
      return refreshed;
    } catch {
      return false;
    }
  };

  const value: KeycloakContextType = {
    keycloak,
    initialized,
    authenticated,
    user,
    login,
    logout,
    token: keycloak?.token || null,
    refreshToken,
  };

  return (
    <KeycloakContext.Provider value={value}>
      {children}
    </KeycloakContext.Provider>
  );
}

export const useKeycloak = () => {
  const context = useContext(KeycloakContext);
  if (!context) {
    throw new Error('useKeycloak must be used within KeycloakProvider');
  }
  return context;
};

// Helper hook for role-based access
export const useHasRole = (role: string): boolean => {
  const { user } = useKeycloak();
  return user?.roles.includes(role) || false;
};

// Helper hook for protected resources
export const useAuthHeader = () => {
  const { token } = useKeycloak();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
```

### 2.2 Backend Integration (API Routes)

**JWT Verification Middleware**:

```typescript
// apps/cloud/lib/auth/keycloak-verify.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const client = jwksClient({
  jwksUri: `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/certs`,
  cache: true,
  cacheMaxAge: 86400000, // 24 hours
});

interface DecodedToken {
  sub: string;
  email: string;
  preferred_username: string;
  realm_access: {
    roles: string[];
  };
  exp: number;
  iat: number;
}

export async function verifyKeycloakToken(token: string): Promise<DecodedToken> {
  const getKey = (header: any, callback: any) => {
    client.getSigningKey(header.kid, (err, key) => {
      if (err) {
        callback(err);
        return;
      }
      const signingKey = key?.getPublicKey();
      callback(null, signingKey);
    });
  };

  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        algorithms: ['RS256'],
        issuer: `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}`,
      },
      (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded as DecodedToken);
        }
      }
    );
  });
}

// Middleware for API routes
export async function withAuth(
  request: NextRequest,
  requiredRoles?: string[]
): Promise<NextResponse | null> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Unauthorized - No token provided' },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7);

  try {
    const decoded = await verifyKeycloakToken(token);
    
    // Check token expiration
    if (decoded.exp * 1000 < Date.now()) {
      return NextResponse.json(
        { error: 'Unauthorized - Token expired' },
        { status: 401 }
      );
    }

    // Check required roles
    if (requiredRoles && requiredRoles.length > 0) {
      const userRoles = decoded.realm_access.roles;
      const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
      
      if (!hasRequiredRole) {
        return NextResponse.json(
          { error: 'Forbidden - Insufficient permissions' },
          { status: 403 }
        );
      }
    }

    // Add user info to request
    (request as any).user = decoded;
    
    return null; // Continue processing
  } catch (error) {
    console.error('Token verification failed:', error);
    return NextResponse.json(
      { error: 'Unauthorized - Invalid token' },
      { status: 401 }
    );
  }
}

// Example usage in an API route
export async function GET(request: NextRequest) {
  const authError = await withAuth(request, ['fleet-admin', 'fleet-operator']);
  if (authError) return authError;

  const user = (request as any).user;
  
  // Your API logic here
  return NextResponse.json({
    message: 'Protected resource accessed',
    user: user.preferred_username,
    roles: user.realm_access.roles,
  });
}
```

### 2.3 IoT Device Authentication

**Client Credentials Flow for IoT**:

```typescript
// lib/auth/iot-auth.ts
interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
}

export class IoTAuthClient {
  private tokenEndpoint: string;
  private clientId: string;
  private clientSecret: string;
  private cachedToken: TokenResponse | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.tokenEndpoint = `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`;
    this.clientId = process.env.IOT_CLIENT_ID!;
    this.clientSecret = process.env.IOT_CLIENT_SECRET!;
  }

  async getToken(): Promise<string> {
    // Return cached token if still valid
    if (this.cachedToken && Date.now() < this.tokenExpiry - 60000) {
      return this.cachedToken.access_token;
    }

    // Request new token
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      scope: 'iot-telemetry iot-control', // Custom scopes for IoT
    });

    const response = await fetch(this.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error(`Token request failed: ${response.statusText}`);
    }

    const tokenResponse: TokenResponse = await response.json();
    
    // Cache the token
    this.cachedToken = tokenResponse;
    this.tokenExpiry = Date.now() + (tokenResponse.expires_in * 1000);

    return tokenResponse.access_token;
  }

  async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const token = await this.getToken();
    
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    });
  }
}

// Usage in IoT connection
export async function connectToFleetOpsCloud(deviceId: string) {
  const authClient = new IoTAuthClient();
  
  // Get authentication token
  const token = await authClient.getToken();
  
  // Connect to AWS IoT Core with token
  const connection = new mqtt.MqttClient();
  
  // Configure connection with custom authorizer
  const config = {
    ...iotConfig,
    customAuthorizerName: 'KeycloakAuthorizer',
    customAuthorizerSignature: token,
    customAuthorizerTokenKeyName: 'token',
  };
  
  return connection.connect(config);
}
```

## Phase 3: User Migration (Week 2)

### 3.1 Export Users from Cognito

```typescript
// scripts/export-cognito-users.ts
import { CognitoIdentityProviderClient, ListUsersCommand, AdminGetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import fs from 'fs/promises';

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION!,
});

interface CognitoUser {
  username: string;
  email: string;
  emailVerified: boolean;
  attributes: Record<string, string>;
  groups: string[];
  createdAt: Date;
  updatedAt: Date;
}

async function exportCognitoUsers(): Promise<CognitoUser[]> {
  const userPoolId = process.env.COGNITO_USER_POOL_ID!;
  const users: CognitoUser[] = [];
  let paginationToken: string | undefined;

  do {
    const listResponse = await cognitoClient.send(
      new ListUsersCommand({
        UserPoolId: userPoolId,
        Limit: 60,
        PaginationToken: paginationToken,
      })
    );

    for (const user of listResponse.Users || []) {
      const userDetails = await cognitoClient.send(
        new AdminGetUserCommand({
          UserPoolId: userPoolId,
          Username: user.Username!,
        })
      );

      const attributes = userDetails.UserAttributes?.reduce((acc, attr) => {
        acc[attr.Name!] = attr.Value!;
        return acc;
      }, {} as Record<string, string>) || {};

      users.push({
        username: user.Username!,
        email: attributes.email,
        emailVerified: attributes.email_verified === 'true',
        attributes,
        groups: [], // Need separate API call for groups
        createdAt: user.UserCreateDate!,
        updatedAt: user.UserLastModifiedDate!,
      });
    }

    paginationToken = listResponse.PaginationToken;
  } while (paginationToken);

  // Save to file
  await fs.writeFile(
    'cognito-users-export.json',
    JSON.stringify(users, null, 2)
  );

  console.log(`Exported ${users.length} users from Cognito`);
  return users;
}
```

### 3.2 Import Users to Keycloak

```typescript
// scripts/import-to-keycloak.ts
import KcAdminClient from '@keycloak/keycloak-admin-client';
import fs from 'fs/promises';
import crypto from 'crypto';

async function importUsersToKeycloak() {
  const kcAdminClient = new KcAdminClient({
    baseUrl: process.env.KEYCLOAK_URL!,
    realmName: 'master',
  });

  await kcAdminClient.auth({
    username: process.env.KEYCLOAK_ADMIN_USER!,
    password: process.env.KEYCLOAK_ADMIN_PASSWORD!,
    grantType: 'password',
    clientId: 'admin-cli',
  });

  // Read exported users
  const cognitoUsers = JSON.parse(
    await fs.readFile('cognito-users-export.json', 'utf-8')
  );

  const realm = 'fleetops';
  let importedCount = 0;
  let errorCount = 0;

  for (const cognitoUser of cognitoUsers) {
    try {
      // Create user in Keycloak
      const keycloakUser = await kcAdminClient.users.create({
        realm,
        username: cognitoUser.username,
        email: cognitoUser.email,
        emailVerified: cognitoUser.emailVerified,
        enabled: true,
        attributes: {
          ...cognitoUser.attributes,
          migration_source: 'cognito',
          migration_date: new Date().toISOString(),
        },
        credentials: [
          {
            type: 'password',
            value: crypto.randomBytes(32).toString('hex'), // Temporary password
            temporary: true, // Force password reset on first login
          },
        ],
      });

      // Map Cognito groups to Keycloak groups
      if (cognitoUser.groups && cognitoUser.groups.length > 0) {
        for (const groupName of cognitoUser.groups) {
          const group = await kcAdminClient.groups.find({
            realm,
            search: groupName,
          });

          if (group.length > 0) {
            await kcAdminClient.users.addToGroup({
              realm,
              id: keycloakUser.id,
              groupId: group[0].id!,
            });
          }
        }
      }

      importedCount++;
      console.log(`Imported user: ${cognitoUser.username}`);
    } catch (error) {
      console.error(`Failed to import user ${cognitoUser.username}:`, error);
      errorCount++;
    }
  }

  console.log(`\nMigration completed:`);
  console.log(`- Successfully imported: ${importedCount}`);
  console.log(`- Errors: ${errorCount}`);
}
```

### 3.3 Gradual Migration with Dual Auth

```typescript
// lib/auth/dual-auth-provider.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { KeycloakProvider } from './keycloak-provider';
import { CognitoProvider } from './cognito-provider';

interface DualAuthContextType {
  authProvider: 'keycloak' | 'cognito';
  switchProvider: (provider: 'keycloak' | 'cognito') => void;
  migrationProgress: number;
}

const DualAuthContext = createContext<DualAuthContextType | null>(null);

export function DualAuthProvider({ children }: { children: React.ReactNode }) {
  const [authProvider, setAuthProvider] = useState<'keycloak' | 'cognito'>('cognito');
  const [migrationProgress, setMigrationProgress] = useState(0);

  useEffect(() => {
    // Check migration status from API
    fetch('/api/auth/migration-status')
      .then(res => res.json())
      .then(data => {
        setMigrationProgress(data.percentageMigrated);
        
        // Auto-switch to Keycloak when migration is complete
        if (data.percentageMigrated >= 100) {
          setAuthProvider('keycloak');
        }
      });
  }, []);

  const switchProvider = (provider: 'keycloak' | 'cognito') => {
    setAuthProvider(provider);
    localStorage.setItem('auth-provider', provider);
  };

  const value = {
    authProvider,
    switchProvider,
    migrationProgress,
  };

  return (
    <DualAuthContext.Provider value={value}>
      {authProvider === 'keycloak' ? (
        <KeycloakProvider>{children}</KeycloakProvider>
      ) : (
        <CognitoProvider>{children}</CognitoProvider>
      )}
    </DualAuthContext.Provider>
  );
}

export const useDualAuth = () => {
  const context = useContext(DualAuthContext);
  if (!context) {
    throw new Error('useDualAuth must be used within DualAuthProvider');
  }
  return context;
};
```

## Phase 4: Testing & Validation (Week 2-3)

### 4.1 Integration Tests

```typescript
// __tests__/auth/keycloak-integration.test.ts
import { describe, it, expect, beforeAll } from '@jest/globals';
import Keycloak from 'keycloak-js';

describe('Keycloak Integration', () => {
  let keycloak: Keycloak;

  beforeAll(() => {
    keycloak = new Keycloak({
      url: process.env.KEYCLOAK_URL!,
      realm: 'fleetops',
      clientId: 'fleetops-web',
    });
  });

  it('should initialize Keycloak client', async () => {
    const initialized = await keycloak.init({ onLoad: 'check-sso' });
    expect(initialized).toBeDefined();
  });

  it('should handle login redirect', () => {
    const loginUrl = keycloak.createLoginUrl();
    expect(loginUrl).toContain(process.env.KEYCLOAK_URL);
    expect(loginUrl).toContain('realm=fleetops');
  });

  it('should verify token structure', async () => {
    // Mock a valid token for testing
    const mockToken = 'eyJ...'; // Use a real token from Keycloak for testing
    
    // In a real test, you would verify the token structure
    // and claims match expected format
  });
});

describe('IoT Authentication', () => {
  it('should obtain client credentials token', async () => {
    const tokenEndpoint = `${process.env.KEYCLOAK_URL}/realms/fleetops/protocol/openid-connect/token`;
    
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.IOT_CLIENT_ID!,
        client_secret: process.env.IOT_CLIENT_SECRET!,
      }),
    });

    expect(response.ok).toBe(true);
    
    const token = await response.json();
    expect(token.access_token).toBeDefined();
    expect(token.token_type).toBe('Bearer');
  });
});
```

### 4.2 Performance Testing

```typescript
// scripts/performance-test.ts
import autocannon from 'autocannon';

async function performanceTest() {
  // Test Keycloak token endpoint
  const keycloakResult = await autocannon({
    url: `${process.env.KEYCLOAK_URL}/realms/fleetops/protocol/openid-connect/token`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.PERF_TEST_CLIENT_ID!,
      client_secret: process.env.PERF_TEST_CLIENT_SECRET!,
    }).toString(),
    duration: 30, // 30 seconds
    connections: 100, // 100 concurrent connections
    pipelining: 1,
  });

  console.log('Keycloak Performance Results:');
  console.log(`- Requests/sec: ${keycloakResult.requests.average}`);
  console.log(`- Latency (ms): ${keycloakResult.latency.average}`);
  console.log(`- Errors: ${keycloakResult.errors}`);
}
```

## Phase 5: Cutover & Monitoring (Week 3)

### 5.1 Monitoring Setup

```typescript
// lib/monitoring/auth-metrics.ts
import { CloudWatch } from '@aws-sdk/client-cloudwatch';

const cloudwatch = new CloudWatch({ region: process.env.AWS_REGION });

export async function trackAuthMetrics(
  provider: 'keycloak' | 'cognito',
  action: 'login' | 'logout' | 'token_refresh' | 'error',
  success: boolean,
  latency?: number
) {
  const params = {
    Namespace: 'FleetOps/Auth',
    MetricData: [
      {
        MetricName: `${provider}_${action}`,
        Value: success ? 1 : 0,
        Unit: 'Count',
        Dimensions: [
          { Name: 'Provider', Value: provider },
          { Name: 'Action', Value: action },
          { Name: 'Success', Value: success.toString() },
        ],
      },
    ],
  };

  if (latency) {
    params.MetricData.push({
      MetricName: `${provider}_${action}_latency`,
      Value: latency,
      Unit: 'Milliseconds',
      Dimensions: [
        { Name: 'Provider', Value: provider },
        { Name: 'Action', Value: action },
      ],
    });
  }

  await cloudwatch.putMetricData(params);
}
```

### 5.2 Rollback Plan

```yaml
# rollback-procedures.yaml
rollback_triggers:
  - error_rate > 5%
  - latency_p99 > 2000ms
  - failed_logins > 100/minute

rollback_steps:
  1_immediate:
    - Switch DNS to point back to Cognito
    - Update environment variables to use Cognito endpoints
    - Clear CDN cache
    
  2_validation:
    - Verify all users can login via Cognito
    - Check application functionality
    - Monitor error rates
    
  3_communication:
    - Notify users of temporary auth provider change
    - Update status page
    - Schedule post-mortem

recovery_plan:
  - Analyze failure root cause
  - Fix identified issues
  - Test in staging environment
  - Plan new migration window
```

## Conclusion

This implementation guide provides a comprehensive path for migrating from AWS Cognito to Keycloak. The key benefits include:

1. **Cost Savings**: ~$60,000/year at current scale
2. **No Vendor Lock-in**: Open source with standard protocols
3. **Better IoT Support**: Native client credentials flow without per-request charges
4. **Full Control**: Self-hosted with complete customization options

The migration can be completed in 2-3 weeks with proper planning and testing. The dual-auth approach allows for safe rollback if issues arise during migration.