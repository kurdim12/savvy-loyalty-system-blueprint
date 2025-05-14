
# Raw Smith Coffee - Loyalty System

A comprehensive loyalty system for Raw Smith Coffee built with React, TypeScript, and Supabase.

## Features

- **Customer Loyalty Program**:
  - Points earning and tracking
  - Membership tiers (Bronze, Silver, Gold)
  - Reward redemption system
  - Birthday bonuses

- **Community Features**:
  - Discussion threads
  - Company announcements
  - Real-time chat

- **Admin Dashboard**:
  - Customer management
  - Rewards CRUD
  - Points adjustment
  - Rank management

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite, shadcn/ui (Radix)
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions, Realtime)
- **Testing**: Vitest
- **CI/CD**: GitHub Actions

## Getting Started

1. Clone the repository
2. Install dependencies with `pnpm install`
3. Run the development server with `pnpm dev`
4. Visit `http://localhost:8080` in your browser

## Admin Access

Use the admin login at `/admin/login` to access the admin dashboard.

## Project Structure

- `/src`: Frontend React code
- `/src/components`: Reusable UI components
- `/src/pages`: Page components
- `/src/contexts`: React context providers
- `/src/hooks`: Custom React hooks
- `/src/lib`: Utility functions
- `/src/integrations`: Integration with external services
- `/supabase`: Supabase configurations and functions

## Testing

Run tests with `pnpm test`

## CI Pipeline

The CI pipeline runs on every push and pull request:
1. Install dependencies
2. Run linter
3. Run tests
4. Build the application

## License

© 2025 Raw Smith Coffee - All rights reserved
