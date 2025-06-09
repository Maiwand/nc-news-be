# NC News

## Project Summary

NC News is a RESTful API built with Node.js, Express, and PostgreSQL. It serves as the backend for a Reddit-style news site. Users can fetch, post, update, and delete articles, topics, users, and comments.

## Hosted Version

You can find the hosted API here: [Hosted Version](https://nc-news-be-ltni.onrender.com/api)

## Setup Instructions

### 1. Clone the repository:

```bash
git clone https://github.com/Maiwand/nc-news-be
cd nc-news
```

### 2. Install dependencies:

```bash
npm install
```

### 3. Create the databases:

```bash
npm run setup-dbs
```

### 4. Create environment variable files:

`.env.development`

```
PGDATABASE=nc_news
```

`.env.test`

```
PGDATABASE=nc_news_test
```

Ensure `.env.*` is included in `.gitignore`.

### 5. Seed the development database:

```bash
npm run test-seed
npm run seed-dev
```

## Running Tests

To run all tests:

```bash
npm test
```

## Environment Variables for Production

Create a `.env.production` file for seeding and connecting to a hosted database. It should contain:

```
DATABASE_URL=your_production_database_url
```

## Minimum Requirements

- Node.js: v23.11.0 or higher
- PostgreSQL: v17 or higher
