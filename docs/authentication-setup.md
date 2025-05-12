# Authentication Setup Guide

This guide covers setting up authentication providers for your PrepMate application.

## Overview

PrepMate supports multiple authentication methods:

- 🔐 **Email (Magic Links)** - Passwordless authentication via email
- 🌐 **Google OAuth** - Sign in with Google accounts
- 🎮 **Discord OAuth** - Sign in with Discord accounts

## Email Provider Setup (Recommended)

For passwordless email authentication, you'll need an SMTP server. Here are some popular options:

### SendGrid (Recommended)

1. Create a [SendGrid](https://sendgrid.com/) account
2. Generate an API key from your SendGrid dashboard
3. Use these settings in your `.env` file:

   ```bash
   EMAIL_SERVER_HOST="smtp.sendgrid.net"
   EMAIL_SERVER_PORT="587"
   EMAIL_SERVER_USER="apikey"
   EMAIL_SERVER_PASSWORD="your-sendgrid-api-key"
   EMAIL_FROM="noreply@yourapp.com"
   ```

### Gmail SMTP (Alternative)

1. Enable 2-factor authentication on your Google account
2. Generate an App Password: [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Use these settings in your `.env` file:

   ```bash
   EMAIL_SERVER_HOST="smtp.gmail.com"
   EMAIL_SERVER_PORT="587"
   EMAIL_SERVER_USER="your-email@gmail.com"
   EMAIL_SERVER_PASSWORD="your-app-password"
   EMAIL_FROM="noreply@yourapp.com"
   ```

## Google OAuth Setup

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
10. Add to your `.env` file:

    ```bash
    AUTH_GOOGLE_ID="your-google-client-id"
    AUTH_GOOGLE_SECRET="your-google-client-secret"
    ```

## Discord OAuth Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to "Settings → OAuth2 → General"
4. Copy the "Client ID"
5. Click "Reset Secret" and copy the new secret
6. Add redirect URIs:
   - For development: `http://localhost:3000/api/auth/callback/discord`
   - For production: `https://<your-domain.com>/api/auth/callback/discord`
7. Add to your `.env` file:

   ```bash
   AUTH_DISCORD_ID="your-discord-client-id"
   AUTH_DISCORD_SECRET="your-discord-client-secret"
   ```

## Environment Configuration

### 1. Copy the example environment file

```bash
cp .env.example .env
```

### 2. Edit the `.env` file with your actual values

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/prepmate"

# NextAuth.js
# Generate with: openssl rand -base64 32
AUTH_SECRET="your-auth-secret"

# Google OAuth (optional)
# Get these from: https://console.cloud.google.com/
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Discord OAuth (optional)
# Get these from: https://discord.com/developers/applications
AUTH_DISCORD_ID="your-discord-client-id"
AUTH_DISCORD_SECRET="your-discord-client-secret"

# Email Provider (for passwordless login)
# SMTP server settings
EMAIL_SERVER_HOST="smtp.sendgrid.net"  # or your SMTP provider
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="apikey"  # or your email for Gmail
EMAIL_SERVER_PASSWORD="your-sendgrid-api-key"  # or app password for Gmail
EMAIL_FROM="noreply@yourapp.com"  # sender address
```

### 3. Generate AUTH_SECRET

You can generate a secure AUTH_SECRET using:

```bash
openssl rand -base64 32
```

## Testing Authentication

After setting up your providers:

1. Start your development server: `pnpm dev`
2. Navigate to `http://localhost:3000`
3. Test the sign-in flow with your configured providers
4. Check that emails are being sent correctly (if using email auth)

## Troubleshooting

### Email Not Sending

- Check your SMTP credentials are correct
- Verify your email provider allows SMTP access
- Check spam folder for test emails

### OAuth Provider Issues

- Ensure redirect URIs match exactly (including protocol and port)
- Check that APIs are enabled in provider dashboards
- Verify client secrets are copied correctly

### Environment Variables

- Make sure `.env` file is in the project root
- Restart your development server after changing environment variables
- Check for typos in variable names

## Security Notes

- Never commit your `.env` file to version control
- Use different credentials for development and production
- Regularly rotate API keys and secrets
- Keep your OAuth provider settings secure

---

📚 **Back to:** [Main README](../README.md) | **Next:** [Deployment Guide](deployment.md)
