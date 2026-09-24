# Aqar CRM - Real Estate Marketing Management System

A comprehensive real estate marketing management system with an interactive map, CRM, deal management, and AI-powered features.

## Features

- 🗺️ **Interactive Map** - Google Maps with property pins (Airbnb-style)
- 🏠 **Property Management** - Full CRUD with images, documents, and location
- 👥 **User Management** - 10 roles with admin approval system
- 📊 **Dashboard** - Analytics with charts and KPIs
- 🤝 **CRM** - Client pipeline, follow-ups, and matching
- 💰 **Deals & Commissions** - End-to-end deal management
- 📱 **Campaigns** - Multi-platform marketing campaign tracking
- 🌐 **Bilingual** - Arabic (RTL) and English support
- 🌙 **Dark Mode** - Full dark mode support
- 📱 **Responsive** - Works on all devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js
- **Maps**: Google Maps (@vis.gl/react-google-maps)
- **Charts**: Recharts
- **State**: Zustand
- **Forms**: React Hook Form + Zod

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google Maps API Key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` file with:
   - `DATABASE_URL` - PostgreSQL connection string
   - `NEXTAUTH_SECRET` - Random secret for NextAuth
   - `GOOGLE_MAPS_API_KEY` - Your Google Maps API key
   - Other optional keys (see `.env.example`)

5. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. Seed the database (optional):
   ```bash
   npx prisma db seed
   ```

7. Run the development server:
   ```bash
   npm run dev
   ```

8. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   ├── auth/             # Auth pages (login/register)
│   ├── dashboard/        # Dashboard pages
│   └── page.tsx          # Main map page
├── components/
│   ├── layout/           # Sidebar, Header
│   ├── map/              # Map components
│   ├── property/         # Property cards/details
│   ├── search/           # Search & filters
│   └── ui/               # shadcn/ui components
├── lib/                  # Utilities, auth, prisma
└── types/                # TypeScript types
```

## User Roles

| Role | Description |
|------|-------------|
| System Admin | Full system access |
| General Manager | Full access except system settings |
| Sales Manager | Team and deals management |
| Property Manager | Property and unit management |
| Customer Service | Client and follow-up management |
| Internal Marketer | View and add clients |
| External Marketer | Client referrals only |
| Accountant | Commissions and payments |
| Contracts | Contract management |
| Viewer | Read-only access |

## License

Private - All rights reserved.
