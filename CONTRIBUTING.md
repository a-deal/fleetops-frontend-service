# Contributing to FleetOps Frontend

Welcome to the FleetOps Frontend Service! This document provides guidelines for contributing to the project and maintaining code quality standards.

## Table of Contents

- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Code Style](#code-style)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## Development Setup

**Important: This project uses pnpm exclusively. Never use npm or yarn.**

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Run development server: `pnpm dev`
4. Build for production: `pnpm build`

### Package Manager

This project is configured to use **pnpm** as the package manager. The reasons for this choice:
- Faster installation times
- Efficient disk space usage through content-addressable storage
- Strict dependency resolution preventing phantom dependencies
- Better monorepo support

**Do not use npm or yarn** - the project has a `packageManager` field in package.json that enforces pnpm usage.

## Project Structure

This project follows Next.js 13+ app directory conventions. Here are the key principles:

### All Application Code Lives in `/src`

When a `/src` directory exists, **all application source code must be placed inside it**. Avoid placing code at the project root level (e.g., `/lib`, `/components`). This keeps the project root clean and follows Next.js conventions.

### Public Assets Must Stay in `/public`

Static assets that need to be served as-is must remain in the `/public` directory. This includes:
- PWA manifest (`/public/manifest.json`)
- Icons and images (`/public/icons/`)
- Fonts (`/public/fonts/`)
- Other static files that need direct URL access

These files are served at the root URL path (e.g., `/public/icon.png` is accessible at `/icon.png`).

### Cross-Cutting Concerns Belong in `/src/lib`

Shared utilities and cross-cutting concerns should be placed in `/src/lib/`. This includes:
- Authentication logic (`/src/lib/auth/`)
- API utilities (`/src/lib/api/`)
- PWA functionality (`/src/lib/pwa/`)
- Analytics (`/src/lib/analytics/`)
- Common utilities (`/src/lib/utils/`)

These are application-wide concerns that aren't tied to specific routes or components.

### Directory Structure Example

```
fleetops-frontend-service/
├── src/
│   ├── app/                    # App directory (routes, layouts)
│   │   ├── (routes)/          # Route groups
│   │   ├── _components/       # Private components (underscore prevents routing)
│   │   └── api/               # API routes
│   ├── lib/                   # Shared utilities and logic
│   │   ├── pwa/              # PWA-related utilities
│   │   ├── auth/             # Authentication logic
│   │   └── utils/            # Common utilities
│   ├── components/            # Shared React components
│   └── styles/               # Global styles and design tokens
├── public/                    # Static assets served as-is
│   ├── manifest.json         # PWA manifest
│   ├── icons/                # App icons
│   └── fonts/                # Font files
├── .env.local                # Local environment variables
├── next.config.ts            # Next.js configuration
└── package.json              # Dependencies and scripts
```

## Code Style

- Use TypeScript for all new code
- Follow the existing code patterns and conventions
- Run `pnpm lint` before committing
- Add meaningful comments for complex logic
- Include user context comments for field operator features

## Commit Guidelines

- Use clear, descriptive commit messages
- Include the scope when relevant: `feat(pwa): add offline support`
- Reference issues when applicable: `fixes #123`
- Keep commits focused and atomic

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes following the guidelines above
3. Ensure all tests pass and linting is clean
4. Update documentation if needed
5. Submit a pull request with a clear description
6. Wait for code review and address feedback

## Questions?

If you have questions about contributing, please open an issue for discussion.