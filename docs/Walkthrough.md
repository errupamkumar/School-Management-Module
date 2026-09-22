# Step-by-Step Walkthrough to Run School Management System

Welcome to the **Vidyalaya - School Management System** project. Below are the steps to set up, configure, and run this application locally.

## Setup Prerequisites
Before starting, ensure that you have the following installed on your system:
- **Node.js** (v18.x or higher)
- **PostgreSQL Database Server**
- **Git** (optional, if cloning)

## Step 1: Clone or Open the Project
If not already open in your IDE, navigate to the project root directory: `d:\demoProject\school-ms`.

## Step 2: Configure Environment Variables
1. A `.env.example` file is provided in the root directory.
2. Duplicate this file and rename the new copy to `.env`.
3. Open the `.env` file and update your credentials, primarily `DATABASE_URL` for PostgreSQL:
   ```env
   DATABASE_URL="postgresql://<username>:<password>@localhost:5432/school_management"
   ```
   *Replace `<username>` and `<password>` with your PostgreSQL user details.*
4. Ensure `NEXTAUTH_SECRET` is set (it requires a random string). 

## Step 3: Install Dependencies
Open a terminal in the root directory and install node modules by running:
```bash
npm install
```

## Step 4: Database Setup (Prisma)
With PostgreSQL running and the `.env` configured, you need to prepare the database structure:
1. Generate the Prisma Client to align with your schema:
   ```bash
   npm run db:generate
   ```
2. Push the schema state to your database:
   ```bash
   npm run db:push
   ```
   *(Note: For production, you can use `npm run db:migrate` instead).*
3. Optional: Seed the database with sample or default initial data:
   ```bash
   npm run db:seed
   ```

## Step 5: Start Development Server
Once all the above steps are completed successfully, start your local Next.js development server:
```bash
npm run dev
```

## Step 6: Accessing the Application
- Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)**.
- You should now see the School Management System UI!

---
> **Note**: For resolving Prisma Schema errors related to connections, please check if your PostgreSQL service is running globally (`services.msc` on Windows or via your active DB Manager).
