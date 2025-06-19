### Prerequisites
- PostgreSQL installed and running on your system
- Node.js and npm

### Setup Steps

1. **Install dependencies**
     ```bash
   npm install
   ```

2. **Install PostgreSQL** (if not already installed):
   - macOS: `brew install postgresql` and `brew services start postgresql`
   - Ubuntu: `sudo apt-get install postgresql postgresql-contrib`
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/)

3. **Create the database**:
   ```bash
   # Connect to PostgreSQL
   psql postgres

   # Create database
   CREATE DATABASE band_interview_app;

   # Exit psql
   \q
   ```

4. **Set up DB tables**:
   ```bash
   npx prisma db push
   ```

### Getting Started

First, set up the database (see Database Setup above), then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
