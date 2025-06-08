# Energy Tracking Dashboard Project

## Overview

This project is a full-stack web application for energy consumption monitoring and sustainability tracking. It provides users with visualizations of energy usage, CO2 emissions, and recommendations for energy savings. The application includes features like employee leaderboards, energy analytics, and actionable sustainability recommendations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a client-server architecture with a clear separation of concerns:

1. **Frontend**: React-based SPA using modern React patterns and hooks
2. **Backend**: Express.js server with RESTful API endpoints
3. **Database**: PostgreSQL database with Drizzle ORM for data management
4. **Styling**: TailwindCSS with shadcn/ui components

The application is structured in a monorepo format with clear boundaries between client and server code, while sharing common type definitions through a shared directory.

## Key Components

### Frontend

1. **Component Structure**
   - Organized using a feature-based approach
   - Reusable UI components built with shadcn/ui
   - Page components for different sections of the application

2. **Data Management**
   - TanStack React Query for server state management 
   - Custom hooks for application logic
   - Context providers for global state (e.g., theme)

3. **Routing**
   - Wouter for lightweight client-side routing
   - Dashboard layout wrapper for consistent navigation

### Backend

1. **API Layer**
   - RESTful API endpoints for all data operations
   - Structured route handlers in `server/routes.ts`
   - Request validation using Zod schemas

2. **Data Layer**
   - Storage interface defined in `server/storage.ts`
   - In-memory storage implementation for development
   - Drizzle ORM schemas defined in `shared/schema.ts`

3. **Server Configuration**
   - Express.js server with middleware for logging and error handling
   - Development setup with Vite dev server

### Database 

1. **Schema Design**
   - Users/Employees: Tracking user information and sustainability points
   - Energy Data: Recording consumption metrics
   - Office Zones: Tracking energy usage by area
   - Recommendations: Storing energy-saving recommendations

2. **ORM Integration**
   - Drizzle ORM for type-safe database operations
   - Zod schema validation for input data

## Data Flow

1. **User Interactions**
   - User interacts with the React frontend
   - React Query manages API request state

2. **API Communication**
   - Requests are sent to the Express backend
   - Backend validates requests using Zod schemas

3. **Data Persistence**
   - Backend communicates with the database via Drizzle ORM
   - Data is retrieved/stored in the PostgreSQL database

4. **Response Handling**
   - Backend formats and returns responses
   - Frontend updates UI based on response data

## External Dependencies

### Frontend Dependencies
- React as the UI library
- TanStack React Query for data fetching
- Wouter for client-side routing
- shadcn/ui and Radix UI for component library
- TailwindCSS for styling
- Chart.js for data visualization

### Backend Dependencies
- Express.js for the server framework
- Drizzle ORM for database operations
- Zod for schema validation
- Vite for development server

## Deployment Strategy

The application is configured for deployment on Replit:

1. **Development**
   - `npm run dev` starts both the backend server and frontend dev server

2. **Production Build**
   - `npm run build` creates optimized production bundles
   - Frontend: Vite builds static assets to `dist/public`
   - Backend: esbuild bundles server code to `dist/index.js`

3. **Production Startup**
   - `npm run start` runs the production server
   - Express serves static assets and API endpoints

4. **Database**
   - The Replit includes PostgreSQL module
   - You'll need to configure the `DATABASE_URL` environment variable

## Database Setup Requirements

To set up the PostgreSQL database:

1. Ensure the PostgreSQL-16 module is enabled in your replit
2. Set the `DATABASE_URL` environment variable to connect to your database
3. Run migrations: `npm run db:push` to set up your database schema

## Getting Started

1. The application requires a PostgreSQL database to be properly set up
2. Run `npm install` to install all dependencies
3. Set up the required environment variables, particularly `DATABASE_URL`
4. Run `npm run db:push` to set up the database schema
5. Start the development server with `npm run dev`