# NC News

## Setup Instructions

### 1. Install dependencies:

```bash
npm install
```

### 2. Create the databases:

```bash
npm run setup-dbs
```

### 3. Create environment variable files:

`.env.development`

```
PGDATABASE=nc_news
```

`.env.test`

```
PGDATABASE=nc_news_test
```

Ensure `.env.*` is included in `.gitignore`.

### 4. Verify setup:

```bash
npm run test-seed
npm run seed-dev
```
