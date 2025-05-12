# prepmate

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## First Installation Guide (for development)

For more detailed information, refer to the [T3 Stack First Steps guide](https://create.t3.gg/en/usage/first-steps).

### Prerequisites

1. Install [Docker](https://docs.docker.com/get-docker/)

### Authentication Setup

This project supports multiple authentication providers. You'll need to set up the OAuth applications for each provider you want to use.

#### Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (or Google Identity API)
4. Go to "Credentials" in the left sidebar
5. Click "Create Credentials" → "OAuth 2.0 Client IDs"
6. Configure the OAuth consent screen if prompted
7. Set application type to "Web application"
8. Add authorized redirect URIs:
   - For development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://<your-domain.com>/api/auth/callback/google`
9. Copy the Client ID and Client Secret

#### Discord OAuth Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to "Settings → OAuth2 → General"
4. Copy the "Client ID"
5. Click "Reset Secret" and copy the new secret
6. Add redirect URI: `http://localhost:3000/api/auth/callback/discord`

### Environment Configuration

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Then edit the `.env` file with your actual values:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/prepmate"

# NextAuth.js
# Generate with: openssl rand -base64 32
AUTH_SECRET="your-auth-secret"

# Google OAuth
# Get these from: https://console.cloud.google.com/
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Discord OAuth
# Get these from: https://discord.com/developers/applications
AUTH_DISCORD_ID="your-discord-client-id"
AUTH_DISCORD_SECRET="your-discord-client-secret"
```

### Setup Commands

```bash
# Install dependencies
pnpm i

# Start the database container
./start-database.sh

# Run database migrations/push schema
pnpm db:push

# Start the development server
pnpm dev
```

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
