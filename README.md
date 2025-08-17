# Shinecruze Car Detailing

This is a full-stack web application for a car detailing company named Shinecruze.

## Features

- Customer-facing website to book car detailing services.
- Admin panel to manage bookings, services, and content.
- Secure authentication for the admin panel.
- Transactional emails for booking confirmations.

## Tech Stack

- **Frontend:** Next.js (React), Tailwind CSS, TypeScript
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js
- **Emails:** Resend

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm
- PostgreSQL

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/shinecruze.git
    cd shinecruze
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root of the project by copying the example file:

    ```bash
    cp .env.example .env
    ```

    Then, fill in the required values in the `.env` file.

4.  **Set up the database:**

    Make sure your PostgreSQL server is running. Then, apply the database schema:

    ```bash
    npx prisma migrate dev
    ```

5.  **Run the development server:**

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:3000`.

## Deployment

The application is configured for deployment on Vercel. You will need to set up a PostgreSQL database (e.g., on Supabase or Neon) and configure the environment variables in your Vercel project settings.
