# Project: umNazaretha Streaming App

## Project Overview

This project is a Next.js 14+ Progressive Web App (PWA) designed to provide a linear, TV-style streaming service for the Nazareth Baptist Church of Ebuhleni (NBCE). The application will stream scheduled, pre-recorded content, including church services, events, and original programming.

**Key Technologies:**
- **Frontend:** Next.js 14+ (App Router)
- **UI:** Tailwind CSS with shadcn/ui components
- **Backend & Auth:** Supabase (PostgreSQL, Authentication)
- **Video:** Cloudflare Stream (Processing) & R2 (Storage)
- **State Management:** Zustand
- **Internationalization:** next-i18next
- **Deployment:** Cloudflare Pages

**Architecture:**
The application follows a modern web architecture with a Next.js frontend responsible for server-side rendering (SSR) and the user interface. Supabase serves as the backend-as-a-service (BaaS) for database and user authentication. Video content is managed through a Cloudflare pipeline, where admins upload to R2, and Cloudflare Stream handles encoding and delivery.

## Building and Running

- **Run development server:** `npm run dev`
- **Create a production build:** `npm run build`
- **Run production server:** `npm run start`
- **Lint the code:** `npm run lint`

## Development Conventions

- **Styling:** Use Tailwind CSS utility classes. All UI components should be built using the pre-configured `shadcn/ui` library where possible.
- **Components:** Create reusable components and place them in the `src/components` directory.
- **State Management:** Use Zustand for simple, lightweight global state.
- **Internationalization:** Use `next-i18next` for all user-facing strings to support English and isiZulu.
- **Code Quality:** Run `npm run lint` to check for linting errors before committing.
- **Task Management:** A detailed task list for the initial implementation is available in `tasks/tasks-prd-umnazaretha-streaming-app.md`. Follow the tasks in order to build the application.
