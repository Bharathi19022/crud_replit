# CRM Pro - Replit Documentation

## Overview

CRM Pro is a full-stack customer relationship management application built with modern web technologies. The application allows users to manage customer data, track leads, and organize customer relationships through an intuitive dashboard interface. Users authenticate via Replit Auth, and all customer data is scoped to individual user accounts, ensuring complete data isolation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tool**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server for fast hot module replacement
- Wouter for lightweight client-side routing

**UI Component System**
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Class Variance Authority (CVA) for variant-based component styling
- Design philosophy follows modern SaaS patterns (Linear, Notion, Stripe) prioritizing clarity and efficiency

**State Management**
- TanStack Query (React Query) for server state management, caching, and data synchronization
- React Hook Form with Zod validation for form state and validation
- Local component state via React hooks

**Styling System**
- Custom CSS variables for theming (light/dark mode support)
- Inter font family from Google Fonts for consistent typography
- Standardized spacing scale using Tailwind units (2, 3, 4, 6, 8, 12, 16)
- Card-based layout system with consistent padding and borders

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for type-safe server-side code
- HTTP server created with Node.js built-in `http` module
- Middleware-based request processing pipeline

**Authentication Strategy**
- Replit Auth via OpenID Connect (OIDC) protocol
- Passport.js for authentication middleware integration
- Session management using express-session with PostgreSQL session store
- Session cookies with configurable security settings (httpOnly, secure, sameSite)
- User data stored in database upon first login (upsert pattern)

**API Design**
- RESTful API endpoints following resource-based URL patterns
- Authentication middleware protecting all customer routes
- User ID extracted from authenticated session claims for data scoping
- JSON request/response format with proper error handling
- Request logging middleware tracking method, path, status, and duration

**Route Protection**
- `isAuthenticated` middleware ensures valid user session before route access
- All customer CRUD operations validate user ownership of resources
- Automatic user creation/update on authentication

### Data Storage

**Database**
- PostgreSQL via Neon serverless database
- Connection pooling for efficient database connections
- WebSocket support for serverless PostgreSQL connectivity

**ORM & Schema Management**
- Drizzle ORM for type-safe database queries and schema definition
- Drizzle Kit for schema migrations and database pushes
- Zod integration via drizzle-zod for runtime validation from database schema

**Database Schema**
- `sessions` table: Stores user session data (required for Replit Auth)
- `users` table: Stores authenticated user profiles with email, name, and profile image
- `customers` table: Stores customer records with fields for name, email, phone, company, status, and user relationship
- Enum type for customer status: Lead, Active, Inactive
- Unique constraint on (userId, email) to prevent duplicate emails per user
- Foreign key relationships with cascade delete for data integrity

**Data Access Layer**
- Storage interface pattern for abstracting database operations
- DatabaseStorage class implementing CRUD operations for users and customers
- Query helpers using Drizzle ORM's query builder with type safety

### External Dependencies

**Third-Party Services**
- Replit Auth (OIDC): User authentication and identity management
- Neon Database: Serverless PostgreSQL database hosting
- Google Fonts CDN: Inter font family delivery

**Key NPM Packages**
- `@neondatabase/serverless`: PostgreSQL client for Neon with WebSocket support
- `drizzle-orm`: TypeScript ORM for database interactions
- `passport` & `openid-client`: OIDC authentication flow
- `express-session` & `connect-pg-simple`: Session management and PostgreSQL session store
- `@tanstack/react-query`: Client-side data fetching and caching
- `react-hook-form` & `@hookform/resolvers`: Form management with Zod validation
- `@radix-ui/*`: Unstyled, accessible UI component primitives
- `tailwindcss`: Utility-first CSS framework
- `zod`: Schema validation for forms and API payloads
- `wouter`: Minimalist routing library for React

**Development Tools**
- `tsx`: TypeScript execution for development
- `esbuild`: Fast JavaScript bundler for server code
- `vite`: Frontend build tool with HMR support
- Replit-specific plugins for development environment integration