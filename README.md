# DermaFlow - Medical Cosmetics CRM

DermaFlow is a comprehensive CRM system designed specifically for medical cosmetics practices. It helps practitioners manage clients, appointments, treatment photos, and consent forms in one centralized platform.

## Features

- **Authentication & Security**: Secure login and sign-up functionality
- **Client Management**: Maintain detailed client profiles with treatment history
- **Appointment Scheduling**: Book and manage client appointments
- **Treatment Gallery**: Upload and track before/after treatment photos
- **Notes & Consent Forms**: Document treatment details and store consent forms
- **Email Reminders**: Automated appointment reminders via SendGrid

## Tech Stack

- **Frontend**: Next.js with TypeScript and TailwindCSS
- **Backend & Auth**: Supabase (PostgreSQL database and authentication)
- **Image Storage**: Cloudinary
- **Email Service**: SendGrid
- **Deployment**: Vercel (recommended)

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Supabase account
- Cloudinary account
- SendGrid account

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/dermaflow.git
cd dermaflow
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables

Copy the `.env.local.example` file to `.env.local` and fill in your API keys:

```bash
cp .env.local.example .env.local
```

4. Set up Supabase database

Create the following tables in your Supabase project:

- clients
- appointments
- treatment_photos
- session_notes

SQL schema is available in `database/schema.sql`.

5. Run the development server

```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

The easiest way to deploy DermaFlow is with Vercel:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Set the environment variables in Vercel dashboard
4. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
