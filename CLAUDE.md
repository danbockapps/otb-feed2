# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OTB Feed 2 is a Next.js 16 application that tracks chess tournament performances and rating changes using the US Chess Ratings API. Users can add players by US Chess ID and view their recent tournament results with rating changes displayed.

## Development Commands

### Running the Application
- **Development server**: `yarn dev` - Runs Next.js dev server and TypeScript watch mode concurrently
- **Production build**: `yarn build` - Creates optimized production build with standalone output
- **Production server**: `yarn start` - Runs production build
- **Linting**: `yarn lint` - Runs ESLint

### Type Checking
The dev command runs TypeScript in watch mode (`tsc --noEmit --watch`) alongside Next.js. Type errors will appear in the terminal during development.

### Development Mode with Sample Data
To use local JSON data instead of the live US Chess API:
1. Create `.env.local` file
2. Add `USE_DEV_DATA=true`
3. Sample data is loaded from `app/lib/sampleData/member.json` and `app/lib/sampleData/sections.json`

In development, the API fetches 5 events; in production, it fetches 30 events.

## Architecture

### State Management
The application uses React's `useReducer` for centralized state management with two main state slices:
- **players**: Array of basic player info (id, firstName, lastName)
- **dtos**: Object mapping player IDs to their full data transfer objects (PlayerDTO)

The reducer (`app/reducer.ts`) handles:
- `ADD_PLAYER`: Add player to players array
- `ADD_PERFORMANCES`: Add player's DTO to dtos object
- `REMOVE_PLAYER`: Remove player from both slices
- `RESET`: Clear all state (used on initial load)

### Data Flow
1. **Player Addition** (`app/page.tsx:26-43`):
   - User submits player ID via AddPlayerDialog
   - `getPlayer()` fetches player data from US Chess API (or sample data)
   - Dispatches `ADD_PLAYER` and `ADD_PERFORMANCES` actions
   - Player ID persisted to localStorage

2. **Event Aggregation** (`app/lib/makeEvents.ts`):
   - The `makeEvents` reducer function combines DTOs from multiple players
   - Groups performances by event ID
   - Deduplicates events when multiple players participated in the same tournament
   - Result is a flat array of events with all players' performances

3. **Display** (`app/page.tsx:54-56`):
   - Events sorted by end date (most recent first)
   - EventDisplay component shows event info and all performances

### Server Actions
`getPlayer()` in `app/lib/getPlayer.ts` is marked `'use server'` and:
- Fetches player member data and tournament sections in parallel using `Promise.allSettled`
- Transforms US Chess API responses to simplified DTOs
- Handles 404 errors for invalid player IDs
- Returns discriminated union: `{ success: true, data }` or `{ success: false, error }`

### Type System
Three type layers:
1. **US Chess API types** (`app/types/uschess.ts`): Raw API responses
2. **DTOs** (`app/types/dto.ts`): Simplified transfer objects from server to client
3. **Internal types** (`app/types/types.ts`): UI-specific types (IEvent, IPerformance)

### localStorage Management
Player IDs are persisted in localStorage (`app/lib/manageLocalStorage.ts`):
- Default players loaded from `app/lib/defaultPlayerIds.ts`
- IDs stored as comma-separated string
- On mount, all stored IDs are fetched and added to state

## Tech Stack Details

- **Next.js 16** with App Router (not Pages Router)
- **React 19** with client components (main page is `'use client'`)
- **TypeScript** with strict mode enabled
- **Tailwind CSS 4** + DaisyUI for UI components
- **Axios** for HTTP requests
- **Standalone output** configured for Docker deployment

## Docker Deployment

The Dockerfile uses multi-stage builds:
- Node.js 20 Alpine base image (required for Next.js 16)
- Standalone output mode (`next.config.ts`) for minimal production image
- Exposes port 3000
- Non-root user (nextjs) for security

## Code Style

Prettier configuration in `package.json`:
- No semicolons
- Single quotes
- 100 character line width

## US Chess API Endpoints

- Player info: `https://ratings-api.uschess.org/api/v1/members/{id}`
- Tournament sections: `https://ratings-api.uschess.org/api/v1/members/{id}/sections?Offset=0&Size={size}`

The app calls the API directly from server actions, which handles CORS since server actions run on the server.
