# Fullstack Admin Dashboard

A modern admin dashboard built with Next.js 15, Better Auth, Drizzle ORM, and Neon PostgreSQL.

## Features

- 🔐 **Authentication**: Better Auth with email/password + Google OAuth
- 🗃️ **Database**: Neon PostgreSQL with Drizzle ORM
- ✅ **Validation**: Zod v4 with environment variable validation
- 🎨 **UI**: Tailwind CSS + Shadcn UI components
- ⚡ **Performance**: Next.js 15 with Turbopack
- 🔧 **Code Quality**: Biome for linting and formatting
- 📱 **Responsive**: Mobile-first design

## Tech Stack

- **Framework**: Next.js 15
- **Authentication**: Better Auth 1.2.12
- **Database**: Neon PostgreSQL
- **ORM**: Drizzle ORM
- **Validation**: Zod v4
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Code Quality**: Biome

## Quick Start

### Prerequisites

- Node.js 18+ 
- A Neon database (create one at [neon.tech](https://neon.tech))
- Google OAuth credentials (optional, for social login)

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

3. **Push database schema**:
   ```bash
   npm run db:push
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

> **Note**: Environment variables are automatically validated on startup using Zod v4 schema validation. If any required variables are missing or invalid, the application will fail to start with helpful error messages.





## Project Structure

```
src/
├── app/
│   ├── api/auth/[...all]/     # Better Auth API routes
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── components/
│   ├── ui/                    # Shadcn UI components
│   ├── sign-in.tsx           # Sign in component
│   └── sign-up.tsx           # Sign up component
└── lib/
    ├── auth.ts               # Better Auth server config
    ├── auth-client.ts        # Better Auth client config
    ├── db.ts                 # Database connection
    ├── db/schema.ts          # Database schema
    ├── env.ts                # Environment validation with Zod v4
    └── utils.ts              # Utility functions
```

## Better Auth + Drizzle + Neon Setup

This project uses Better Auth with the Drizzle PostgreSQL adapter for Neon database:

**Database Schema**: All required tables (user, session, account, verification) are defined in `src/lib/db/schema.ts`

**Authentication Configuration**: 
- Email/password authentication enabled
- Google OAuth support (optional)
- Session management with Neon PostgreSQL
- TypeScript-safe with Drizzle ORM

**Key Features**:
- ✅ Serverless-ready with Neon
- ✅ Type-safe database operations
- ✅ Automatic schema migrations
- ✅ Production-ready authentication

## Learn More

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Neon Documentation](https://neon.tech/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## License

MIT License
