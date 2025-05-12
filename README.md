# prepmate

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## Quick Start

### Prerequisites

1. Install [Docker](https://docs.docker.com/get-docker/)
2. Install [Node.js](https://nodejs.org/) (v18 or higher)
3. Install [pnpm](https://pnpm.io/) package manager

### Setup Commands

```bash
# Clone and navigate to the project
cd prepmate

# Install dependencies
pnpm i

# Copy environment file (see Authentication Setup guide for details)
cp .env.example .env

# Start the database container
./start-database.sh

# Run database migrations/push schema
pnpm db:push

# Start the development server
pnpm dev
```

## 📚 Documentation

### Essential Setup Guides

- **[🔐 Authentication Setup](docs/authentication-setup.md)** - Configure OAuth providers and email authentication
- **[🚀 Deployment Guide](docs/deployment.md)** - Deploy to production (coming soon)
- **[🎨 Customization Guide](docs/customization.md)** - Customize your app (coming soon)

### Key Features

- **🔐 Multiple Auth Providers** - Google, Discord, and Email (magic links)
- **📧 Beautiful Email Templates** - Custom-designed sign-in emails
- **🛡️ Type-Safe APIs** - Full TypeScript support with tRPC
- **🗄️ Database Ready** - PostgreSQL with Prisma ORM
- **🎨 Modern UI** - Tailwind CSS for styling

## Tech Stack

This project uses the powerful [T3 Stack](https://create.t3.gg/):

- **[Next.js](https://nextjs.org)** - React framework for production
- **[NextAuth.js](https://next-auth.js.org)** - Authentication for Next.js
- **[Prisma](https://prisma.io)** - Next-generation ORM
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[tRPC](https://trpc.io)** - End-to-end typesafe APIs

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
