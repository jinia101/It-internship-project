# Information Services Portal

A full-stack web application for managing and accessing government information services, including certificates, contacts, schemes, and emergency services. Built with React, TypeScript, Tailwind CSS, Vite, Prisma, and Node.js.

## Features

- **User Dashboard**: Browse and apply for certificates, contact departments, view schemes, and access emergency services.
- **Admin Dashboard**: Manage service visibility, activate/deactivate services, view statistics, and control published services.
- **Service Filtering**: Filter contacts by department type (emergency/regular), search certificates, and view only active services.
- **Notifications**: Message-based notifications for actions and status updates.
- **Database**: PostgreSQL with Prisma ORM, supporting service activation and management.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL
- **Deployment**: Netlify (frontend), Node server (backend)

## Project Structure

```
client/           # Frontend React app
server/           # Backend Node.js API
shared/           # Shared types and API client
prisma/           # Prisma schema and migrations
netlify/          # Netlify serverless functions
public/           # Static assets
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL

### Setup

1. **Install dependencies**
   ```sh
   npm install
   ```
2. **Configure environment variables**
   - Create a `.env` file in the root and set your database connection string:
     ```env
     DATABASE_URL=postgresql://user:password@localhost:5432/information_services
     ```
3. **Run database migrations**
   ```sh
   npx prisma migrate deploy
   ```
4. **Start the backend server**
   ```sh
   npm run dev --prefix server
   ```
5. **Start the frontend**
   ```sh
   npm run dev --prefix client
   ```

### Admin Dashboard

- Access the admin dashboard at `http://localhost:8080/admin` to manage services.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

MIT

## Authors

- Udai7 and contributors
