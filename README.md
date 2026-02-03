# blog-api-ts

A RESTful Blog API built with TypeScript, Express, and PostgreSQL using Prisma ORM.

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma

## Prerequisites

- Node.js (v18 or higher)
- npm
- Docker (for PostgreSQL)

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/neverovvitalij/blog-api-ts.git
cd blog-api-ts
```

2. Install dependencies

```bash
npm install
```

3. Start PostgreSQL with Docker

```bash
docker run --name postgres-blog \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=blog \
  -p 5432:5432 \
  -d postgres:16
```

4. Create `.env` file in the root directory and add the following:

```bash
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/blog"
```

5. Run database migrations

```bash
npx prisma migrate dev
```

6. Start the development server

```bash
npm run dev
```

The server will be running on `http://localhost:3000`.

## Environment Variables

| Variable     | Description                  |
| ------------ | ---------------------------- |
| DATABASE_URL | PostgreSQL connection string |

## API Endpoints

| Method | Endpoint | Description       |
| ------ | -------- | ----------------- |
| GET    | /users   | Get all users     |
| POST   | /users   | Create a new user |

## Scripts

| Script          | Description                           |
| --------------- | ------------------------------------- |
| `npm run dev`   | Start development server with nodemon |
| `npm run build` | Compile TypeScript to JavaScript      |
| `npm start`     | Start production server               |
