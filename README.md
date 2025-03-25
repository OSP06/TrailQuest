# TrailQuest - Outdoor Adventure Tracker

## Overview
TrailQuest is a Next.js application designed to help outdoor enthusiasts track and share their adventures. The app features hiking tracking, adventure logging, leaderboards, and achievement badges.

## Features
- Real-time adventure tracking
- Social feed of recent adventures
- Achievement system with badges
- Leaderboard rankings
- Specialized side quests (rock climbing, kayaking, etc.)

## Recent Updates
- Added adventure feed preview section to main page
- Integrated Clerk authentication with user avatars
- Implemented like/comment functionality

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Clerk Authentication
- shadcn/ui components

## Technical Details

### Authentication
- Uses Clerk for user authentication
- JWT token handling through middleware
- Protected routes for logged-in users only

### Database
- PostgreSQL for persistent data storage
- Prisma ORM for database operations
- Models include:
  - User profiles
  - Adventure logs
  - Achievements
  - Leaderboard entries

### API Endpoints
- `/api/adventures` - CRUD operations for adventures
- `/api/leaderboard` - GET leaderboard data
- `/api/achievements` - User achievement tracking

### State Management
- React Context for theme preferences
- Server components for data fetching
- Client-side state for UI interactions

### Key Dependencies
- `@clerk/nextjs` - Authentication
- `lucide-react` - Icons
- `tailwind-merge` - Dynamic class handling
- `react-hook-form` - Form management
- `zod` - Data validation

### Performance Optimizations
- Dynamic imports for heavy components
- Lazy loading for images
- Route-based code splitting

## Getting Started

### Prerequisites
- Node.js 18+
- npm/pnpm/yarn
- Clerk account for authentication

### Installation
1. Clone the repository
2. Run `pnpm install`
3. Set up environment variables (see .env.example)
4. Run `pnpm dev`

## Project Structure
Key directories:
- `app/` - Next.js route handlers and pages
- `components/` - Reusable UI components
- `backend/` - Server-side logic and API routes
- `public/` - Static assets
