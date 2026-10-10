# StudyHub

StudyHub is a web application that helps students organize their academic life in one place. Students register their subjects, create tasks with due dates and priorities, schedule events such as classes and exams, and follow everything from a dashboard that shows pending, completed, and overdue work.

**Live application:** https://studyhub-ten-gamma.vercel.app

BYU-Pathway WDD 430, Team 11.

## Team members

- Paula Jessica Ferreira Lucas Da Silva
- Kishie Bhenyu
- Vegard Amundsen

## Features

- **Accounts:** sign up, log in, and log out with email and password.
- **Dashboard (home):** cards with task counts (total, pending, completed this week, overdue), upcoming events, and the student's subjects.
- **Subjects:** create, view, update, and delete subjects, with search and filter by status. Each subject has a code, instructor, color, status, and progress.
- **Tasks:** create, edit, delete, and mark tasks as completed. Each task belongs to a subject and has a due date and priority.
- **Events:** create, edit, and delete classes, exams, meetings, and deadlines.
- **Private data:** every student sees only their own subjects, tasks, and events.

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Styling | Tailwind CSS 4, lucide-react icons |
| Database | MongoDB with Mongoose |
| Authentication | Auth.js v5 (`next-auth`), Credentials provider, bcryptjs |
| Validation | Zod |
| Hosting | Vercel |

## Getting started

### Prerequisites

- Node.js 20 or later
- A MongoDB database (for example, a free MongoDB Atlas cluster)

### Setup

1. Clone the repository and install the dependencies:

   ```bash
   git clone https://github.com/vamundse/wdd430-team11.git
   cd wdd430-team11
   npm install
   ```

2. Create a file named `.env.local` in the project root:

   ```
   MONGODB_URI=your_mongodb_connection_string
   AUTH_SECRET=your_generated_secret
   ```

   Generate the secret with `npx auth secret`. Without `AUTH_SECRET`, Auth.js fails with a `MissingSecret` error.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open http://localhost:3000 and create an account on the sign-up page.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the development server |
| `npm run build` | Builds the application for production |
| `npm run start` | Runs the production build |
| `npm run lint` | Runs ESLint |
| `npm run seed` | Inserts sample data (one user, subject, task, and event) |

## Deployment

The application is deployed on Vercel from the `main` branch.

1. Import the repository in Vercel.
2. Add `MONGODB_URI` and `AUTH_SECRET` under Project Settings > Environment Variables.
3. In MongoDB Atlas, allow network access from Vercel.
4. Deploy. Every push to `main` triggers a new deployment.

## Project structure

```
app/          Pages and routes (App Router)
components/   Reusable UI components
lib/          Database connection, data queries, and Server Actions
models/       Mongoose models (User, Subject, Task, Event)
scripts/      Seed script
auth.ts       Auth.js configuration (Credentials provider)
auth.config.ts  Route protection rules
proxy.ts      Runs the auth check on every page request
```

### Pages

| Route | Description |
| --- | --- |
| `/login`, `/signup` | Public authentication pages |
| `/` | Dashboard |
| `/subjects`, `/subjects/create`, `/subjects/[id]`, `/subjects/[id]/update` | Subject management |
| `/tasks` | Task list and task form |
| `/events`, `/events/new`, `/events/[id]`, `/events/[id]/edit` | Event management |
| `/calendar` | Calendar view |

All routes except `/login` and `/signup` require a signed-in user. Visitors who are not signed in are redirected to `/login`.

## API notes

StudyHub does not expose REST endpoints. All reads and writes go through Next.js Server Components and Server Actions, which talk to MongoDB through Mongoose.

- **Authentication** (`lib/actions.ts`): `authenticate`, `register`, `logout`.
- **Subjects** (`lib/actions.ts`): `getSubjects`, `getSubjectById`, `searchSubjects`, `filterSubjectsByStatus`, `createSubject`, `updateSubject`, `deleteSubject`.
- **Tasks** (`lib/task-actions.ts`, `lib/tasks.ts`): `createTask`, `updateTask`, `deleteTask`, `toggleTaskCompleted`, `getTasksForUser`.
- **Events** (`app/events/actions.ts`, `lib/events.ts`): `createEventAction`, `updateEventAction`, `deleteEventAction`.
- **Dashboard** (`lib/dashboard.ts`): `getTaskStats`, `getUpcomingEvents`, `getSubjectChips`.

Server code gets the current user with `requireUserId()` (`lib/session.ts`) and filters every query by `userId`.

### Data models

- **User:** name, email (unique), passwordHash (never returned by default), image.
- **Subject:** userId, name, code, instructor, color, status (`in_progress`, `completed`, `dropped`), progress (0-100), start and end dates, notes.
- **Task:** userId, subjectId, title, description, dueDate, status (`pending`, `in_progress`, `completed`, `overdue`), priority (`low`, `medium`, `high`), completedAt.
- **Event:** userId, subjectId (optional), title, type (`class`, `exam`, `meeting`, `deadline`), date, time.

## Known issues and opportunities

- **Time zones:** overdue and "completed this week" counts are calculated from the server's date, which is UTC on Vercel. Near midnight, a task can appear overdue a few hours early or late for students in other time zones. Using the student's own time zone would fix this.
- **Seed user cannot log in:** `npm run seed` creates `test@studyhub.dev` without a password. To test locally, create an account on the sign-up page.
- **No password recovery:** `/forgot-password` is reserved in the route rules, but the page does not exist yet.
- **No profile page:** students cannot yet edit their name, email, or password.
- **Calendar not in the menu:** the `/calendar` page exists but has no link in the sidebar.
- **No automated tests:** adding unit tests for the Server Actions and dashboard counts is a good next step.
- **Dependencies:** `mongoose` is listed under `devDependencies` but is used at runtime; it should move to `dependencies`.
