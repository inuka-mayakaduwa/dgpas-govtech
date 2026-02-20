# 📄 README: Simple Digital Permit Application System (DPAS) for GovTech Assestment

## 🚀 Project Overview

This is a full-stack Digital Permit Application System built as a technical assessment. It features a Next.js App Router frontend and backend, using Prisma for database orchestration and Zod for robust schema validation.

### Tech Stack

* **Framework:** Next.js (App Router)
* **Database:** PostgreSQL via Prisma ORM
* **Validation:** Zod (Server & Client side)
* **UI Components:** Shadcn/UI (Radix UI) & Tailwind CSS
* **State Management:** React Hook Form

---

## 🛠️ Setup & Installation

### Prerequisites

* Node.js (v18+)
* PostgreSQL instance
* `pnpm` installed (`npm install -g pnpm`)

### 1. Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

```

### 2. Installation

```bash
pnpm install

```

### 3. Database Migration

```bash
# Apply migrations to your database
pnpm prisma migrate deploy

# (Optional) Generate Prisma client if not triggered
pnpm prisma generate

```

### 4. Running the Application

```bash
pnpm dev

```

The application will be available at `http://localhost:3000`.

---


Here is the rewritten **Usage of Tools / AI** section for your README. I’ve polished the language to sound professional while accurately reflecting your specific workflow and the "Anti Gravity" editor choice.

---

### 🧠 Usage of Tools & AI

This project was developed using Anti Gravity as the primary code editor. The architectural design, including the database schema, API payload structures, and expected response models, was designed entirely by me to meet the specific requirements of the Digital Economy initiative.


### Assumtions.

Citiznen knows their CitizenID.
Example permit types are hard coded.



**AI assistance (ChatGPT and Gemini) was utilized in the following areas:**

* **Logic Implementation:** While the business logic and system flow were my original designs, I used AI to generate the boilerplate for specific helper functions and to accelerate the coding process.
* **Troubleshooting:** I encountered specific import and compatibility issues with the latest version of **Prisma (v7.4.1)**. I leveraged AI tools to debug these dependency conflicts and ensure the `@prisma/client` integrated correctly with the Next.js environment.
* **UI Scaffolding:** AI helped in quickly generating the base structures for the Shadcn components to maintain a consistent, mobile-friendly layout.


* **Tech Stack Selection:** I independently chose the tech stack (Next.js, Prisma, Zod, and Tailwind) since they are modern, widely accepted and they are technologies I am famillier with.

---




### 🐳 Docker Deployment (If needed)

You can deploy the application using Docker and Docker Compose.

#### Prerequisites

*   Docker
*   Docker Compose

#### Steps

1.  **Build and Start the Containers**

    ```bash
    docker-compose up -d --build
    ```

    This will start the Next.js application on port `3000` and a PostgreSQL database on port `5432`.

2.  **Run Database Migrations**

    Once the containers are running, you need to apply the database migrations.

    ```bash
    docker-compose exec app npx prisma migrate deploy
    ```

3.  **Access the Application**

    Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Stopping the Containers

```bash
docker-compose down
```
