# RoleForge

RoleForge is an AI-powered chat platform that allows users to create and interact with custom AI agents. Built with a modern full-stack architecture using React, Node.js, GraphQL, and powered by Google's Gemini AI.

## Features

- **Custom AI Agents**: Create personalized AI agents with unique personalities and capabilities
- **Real-time Chat**: Streamlined chat interface with real-time responses
- **Authentication**: Secure login via Google and GitHub OAuth
- **GraphQL API**: Efficient data fetching with Apollo GraphQL
- **Modern UI**: Built with React, Tailwind CSS, and Radix UI components
- **Database**: Serverless PostgreSQL with Neon and Drizzle ORM

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Radix UI for accessible components
- TanStack Query for data fetching
- Apollo Client for GraphQL

### Backend
- Node.js with Express
- TypeScript
- Apollo Server for GraphQL
- Drizzle ORM with PostgreSQL
- Google's Generative AI (Gemini)
- JWT authentication
- OAuth integration

### Database
- Neon (Serverless PostgreSQL)
- Drizzle ORM for schema management

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [pnpm](https://pnpm.io/) (package manager)
- [Git](https://git-scm.com/)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sumanth639/Role-Forge
   cd roleforge
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

## Setup

### 1. Neon Database Setup

RoleForge uses Neon for its database. Follow these steps to set up your database:

1. Go to [Neon Console](https://console.neon.tech/)
2. Sign up or log in to your account
3. Create a new project
4. Copy the connection string from the dashboard (it looks like: `postgresql://username:password@hostname/database?sslmode=require`)

### 2. Environment Variables

Create environment files for both backend and frontend:

#### Backend (.env in apps/backend/)
Create `apps/backend/.env` file:

```env
PORT=4000
DATABASE_URL=your_neon_connection_string_here
JWT_SECRET=your_jwt_secret_here

GEMINI_API_KEY=your_gemini_api_key_here

GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:4000
```

#### Frontend (.env in apps/frontend/)
Create `apps/frontend/.env` file:

```env
VITE_API_URL=http://localhost:4000
```

### 3. API Keys Setup

#### Google Gemini API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your backend `.env` as `GEMINI_API_KEY`

#### OAuth Setup

**Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs: `http://localhost:4000/auth/google/callback`
6. Add client ID and secret to backend `.env`

**GitHub OAuth:**
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:4000/auth/github/callback`
4. Add client ID and secret to backend `.env`

### 4. Database Migration

After setting up the database URL, run the database migrations:

```bash
# Generate migration files (if needed)
pnpm --filter backend db:generate

# Push schema to database
pnpm --filter backend db:push
```

## Running the Project

### Development Mode (Recommended)

Run both frontend and backend simultaneously:

```bash
pnpm dev
```

This will start:
- Backend server on `http://localhost:4000`
- Frontend dev server on `http://localhost:3000`

### Run Services Separately

**Backend only:**
```bash
pnpm dev:backend
```

**Frontend only:**
```bash
pnpm dev:frontend
```

### Production Build

**Build both services:**
```bash
pnpm build
```

**Build services separately:**
```bash
pnpm build:backend
pnpm build:frontend
```

**Start production backend:**
```bash
pnpm --filter backend start
```

## How It Works

### Architecture Overview

RoleForge follows a monorepo structure with separate frontend and backend applications:

1. **Frontend**: React SPA that provides the user interface for creating agents, managing chats, and interacting with AI
2. **Backend**: Node.js/Express server with GraphQL API that handles authentication, database operations, and AI interactions
3. **Database**: PostgreSQL database hosted on Neon for storing users, agents, chats, and messages

### Key Workflows

1. **User Authentication**: Users authenticate via OAuth providers (Google/GitHub), receiving JWT tokens for API access
2. **Agent Creation**: Users create custom AI agents with defined personalities and prompts
3. **Chat Interaction**: Users initiate chats with agents, sending messages that are processed by Gemini AI
4. **Real-time Streaming**: AI responses are streamed back to the frontend for real-time display
5. **Rate Limiting**: The system implements usage limits to manage API costs and prevent abuse

### API Structure

- **GraphQL Endpoint**: `/graphql` for all data operations
- **Authentication Routes**: `/auth/*` for OAuth flows
- **Streaming Endpoint**: `/stream` for real-time AI responses

## Project Structure

```
roleforge/
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── ai/          # Gemini AI integration
│   │   │   ├── auth/        # Authentication logic
│   │   │   ├── config/      # Environment configuration
│   │   │   ├── db/          # Database client and schema
│   │   │   ├── graphql/     # GraphQL resolvers and schema
│   │   │   ├── limits/      # Rate limiting and usage tracking
│   │   │   └── routes/      # API routes
│   │   └── drizzle/         # Database migrations
│   └── frontend/
│       ├── src/
│       │   ├── api/         # API client functions
│       │   ├── components/  # React components
│       │   ├── pages/       # Page components
│       │   ├── hooks/       # Custom React hooks
│       │   └── contexts/    # React contexts
│       └── public/          # Static assets
├── package.json              # Root package configuration
└── pnpm-workspace.yaml       # Workspace configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and commit: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## License

This project is licensed under the MIT License.