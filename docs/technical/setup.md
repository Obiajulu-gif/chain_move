# Development Setup Guide

This guide will help you set up your local development environment for the ChainMove platform.

## Prerequisites

- Node.js 18.0.0 or later
- npm 9.0.0 or later (comes with Node.js)
- Git
- PostgreSQL 14+
- MetaMask browser extension (for Web3 functionality)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/chain-move.git
   cd chain-move
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add the following variables:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/chainmove?schema=public"
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at http://localhost:3000

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run type-check` - Check TypeScript types

## Development Workflow

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. Push your changes and create a pull request

## Testing

Run the test suite:
```bash
npm test
```

## Debugging

- Use `console.log()` for quick debugging
- For more advanced debugging, use the VS Code debugger configuration provided in `.vscode/launch.json`

## Code Style

- Follow the existing code style
- Use Prettier for code formatting
- Follow TypeScript best practices
- Write meaningful commit messages following Conventional Commits

## Documentation

Update relevant documentation when making changes to:
- Component props and behavior
- API endpoints
- Environment variables
- Database schema
