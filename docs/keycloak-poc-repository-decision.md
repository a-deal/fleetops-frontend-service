# Keycloak PoC Repository Decision

> **Decision Date**: 2025-07-08  
> **Decision**: Create separate repository for Keycloak PoC infrastructure  
> **Status**: Approved based on expert analysis

## Executive Summary

After careful analysis with expert consultation, we've decided to create a separate repository (`infra-keycloak-poc`) for the Keycloak proof-of-concept infrastructure rather than including it in the application monorepo. This aligns with our architectural principles while maintaining practical development workflows.

## Context

We face a classic trade-off between:
- **PoC Velocity**: Need for rapid iteration and tight integration testing
- **Architectural Principles**: Infrastructure code should be separate from application code
- **Security Boundaries**: Infrastructure contains sensitive credentials and state

## Options Considered

### Option A: Keep in Current Monorepo
- ❌ **Rejected**: Violates separation principles, creates security risks, sets bad precedent

### Option B: Create Separate PoC Repository
- ✅ **Selected**: Maintains security boundaries, validates operational processes, clean migration path

### Option C: Hybrid (PoC in Monorepo, Production Separate)
- ❌ **Rejected**: "Temporary" violations tend to become permanent, migration often deprioritized

## Key Decision Factors

1. **Security First**: Authentication infrastructure is too critical to compromise on security boundaries
2. **Process Validation**: PoC should validate not just Keycloak technology but also operational processes
3. **Clean Migration Path**: Separate repo makes promotion to production straightforward
4. **No Technical Debt**: Avoid "temporary" solutions that become permanent

## Implementation Plan

### 1. Repository Structure
```
infra-keycloak-poc/
├── README.md                    # PoC goals, timeline, success criteria
├── modules/
│   ├── network/                 # VPC, subnets, security groups
│   ├── database/                # RDS PostgreSQL
│   ├── keycloak/                # ECS Fargate tasks
│   └── iot-auth/                # Lambda authorizer
├── environments/
│   ├── dev/                     # Developer instances
│   └── poc/                     # Shared PoC environment
├── scripts/
│   └── export-outputs.sh        # Bridge script for developers
└── .github/
    └── workflows/               # CI/CD pipelines
```

### 2. Developer Workflow

To minimize friction while maintaining separation:

```bash
# One-time setup per developer
git clone git@github.com:your-org/infra-keycloak-poc.git
cd infra-keycloak-poc
terraform apply -var-file=environments/dev/terraform.tfvars

# Export outputs to application monorepo
./scripts/export-outputs.sh ../fleetops-frontend-service/.env.local

# Application automatically picks up Keycloak configuration
cd ../fleetops-frontend-service
pnpm dev
```

### 3. CI/CD Integration

- Infrastructure pipeline writes outputs to AWS SSM Parameter Store
- Application pipeline reads from SSM for integration tests
- No cross-repo triggers needed - clean separation

### 4. Migration Paths

**If PoC Succeeds:**
1. Rename repo: `infra-keycloak-poc` → `infra-keycloak`
2. Update Terraform backend to production state
3. Adjust variables for production scale
4. Apply - pattern is already proven

**If PoC Fails:**
1. Run `terraform destroy`
2. Archive repository
3. Document lessons learned
4. No cleanup needed in application repo

## Benefits of This Approach

1. **Security**: Clear boundary between application and infrastructure secrets
2. **Clarity**: Infrastructure lifecycle is independent and explicit
3. **Professionalism**: Treats PoC as production-track effort from day one
4. **Learning**: Forces early solution of cross-repo dependencies
5. **Clean Exit**: Easy to archive if PoC fails, easy to promote if succeeds

## Next Steps

1. Create `infra-keycloak-poc` repository
2. Set up initial Terraform structure
3. Implement developer bridge script
4. Configure CI/CD with SSM integration
5. Document setup process for team

## Success Criteria for Repository Approach

- [ ] Developers can spin up personal Keycloak instance in <10 minutes
- [ ] Application can consume Keycloak configuration without manual copy/paste
- [ ] CI/CD pipelines can test integration without cross-repo complexity
- [ ] Clear path to production requires <1 day of work
- [ ] Repository can be cleanly archived if PoC fails

## Expert Rationale

As noted by our senior DevOps consultant:

> "The overhead of setting this up correctly is a one-time cost paid at the beginning of the PoC, and it pays dividends immediately in clarity, security, and a realistic path to production. A PoC should not just validate the technology (Keycloak); it should also validate the *process* of managing that technology."

This approach treats infrastructure as a first-class citizen, which is essential for a security-critical component like authentication.