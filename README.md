# PrepMate

**AI-Powered Resume Builder** - Transform your career with intelligent resume creation, beautiful templates, and online hosting.

## 🚀 About PrepMate

PrepMate is an innovative AI-powered platform that simplifies and elevates the resume creation process. Whether you're a student, job seeker, or career changer, our platform helps you craft compelling resumes using proven techniques like the XYZ formula, while offering stunning templates and seamless online sharing.

### ✨ Key Features

- **🤖 AI-Enhanced Content** - Transform bullet points using the proven XYZ formula ("Accomplished X by doing Y, resulting in Z")
- **🎨 Beautiful Templates** - Choose from multiple professionally designed, ATS-friendly templates
- **⚡ Quick Setup** - Upload existing resumes or fill out smart forms for instant setup
- **📱 Live Preview** - See changes in real-time as you edit your resume
- **🔗 Online Hosting** - Get a unique shareable link (e.g., prepmate.studio/yourname)
- **📄 Multiple Formats** - Download in PDF and other popular formats
- **🔐 Secure Authentication** - Multiple sign-in options including Google, Discord, and email

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

### User Journey

1. **Sign Up** - Quick registration with email or social login
2. **Onboarding** - Fill out personal information or upload existing resume
3. **Template Selection** - Choose from professional, modern templates
4. **AI Enhancement** - Let AI improve your content using the XYZ formula
5. **Live Editing** - Real-time preview as you customize your resume
6. **Export & Share** - Download PDF and get shareable online link

## Tech Stack

This project uses the powerful [T3 Stack](https://create.t3.gg/) with modern enhancements:

- **[Next.js](https://nextjs.org)** - React framework for production
- **[NextAuth.js](https://next-auth.js.org)** - Authentication for Next.js
- **[Prisma](https://prisma.io)** - Next-generation ORM
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com)** - Beautiful, accessible UI components
- **[tRPC](https://trpc.io)** - End-to-end typesafe APIs

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
