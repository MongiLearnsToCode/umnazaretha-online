## Relevant Files

- `src/app/page.tsx` - Main entry point for the application, will contain the video player and program guide.
- `src/app/layout.tsx` - Root layout, will be modified to include global providers for state management and internationalization.
- `src/app/(auth)/sign-in/page.tsx` - Component for user sign-in.
- `src/app/(auth)/sign-up/page.tsx` - Component for user registration.
- `src/app/admin/**` - Directory for all admin dashboard components and routes.
- `src/components/player.tsx` - The main video player component.
- `src/components/program-guide.tsx` - Component to display the EPG.
- `src/lib/supabase.ts` - Supabase client initialization and helper functions.
- `src/lib/cloudflare.ts` - Cloudflare Stream/R2 integration helper functions.
- `i18n.js` - Configuration file for `next-i18next`.

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [x] 1.0 Foundational Setup & Configuration
  - [x] 1.1 Initialize Supabase project and define database schema (Programs, Schedules, Users, etc.).
  - [x] 1.2 Create `src/lib/supabase.ts` to instantiate and export the Supabase client.
  - [x] 1.3 Set up Cloudflare R2 for storage and Cloudflare Stream for video processing.
  - [x] 1.4 Create `src/lib/cloudflare.ts` for helper functions interacting with Cloudflare services (e.g., generating signed URLs).
  - [x] 1.5 Integrate `next-i18next` for multi-language support (isiZulu, English) and create initial translation files.
  - [x] 1.6 Set up Zustand for global state management (e.g., user state, language preference).
  - [x] 1.7 Configure and theme Tailwind CSS and `shadcn/ui` according to the design system.
- [x] 2.0 User Authentication & Subscription Flow
  - [x] 2.1 Build the sign-up and sign-in pages using `shadcn/ui` components.
  - [x] 2.2 Implement email/password and social login (Google, Facebook) using Supabase Auth.
  - [x] 2.3 Create middleware to manage protected routes and user sessions.
  - [x] 2.4 Implement logic to check for an active subscription status and restrict access to content.
  - [x] 2.5 Set up basic role-based access control (admin, subscriber).
- [x] 3.0 Core Video Streaming & Program Guide
  - [x] 3.1 Develop the `Player` component to integrate with Cloudflare Stream.
  - [x] 3.2 Implement secure, token-based authentication for video stream URLs.
  - [x] 3.3 Add an audio-only mode toggle to the player.
  - [x] 3.4 Implement DVR-style rewind functionality (no fast-forward).
  - [x] 3.5 Develop the `ProgramGuide` component to fetch and display schedule data from Supabase.
  - [x] 3.6 Display "live" indicators and genre-specific styling for currently playing programs.
  - [x] 3.7 Ensure the guide shows the current program and the next 2-3 upcoming programs.
- [x] 4.0 Content Discovery & PWA Enhancements
  - [x] 4.1 Implement genre-based filtering on the program guide.
  - [x] 4.2 Configure the application to be an installable PWA with a service worker and manifest file.
  - [x] 4.3 Create a basic offline fallback page.
  - [x] 4.4 Add a "Coming Up Next" component to the UI.
  - [x] 4.5 Implement a search functionality to find programs across the library.
  - [ ] 4.6 (Post-MVP) Set up push notifications for program reminders.
- [x] 5.0 Admin Dashboard for Content Management
  - [x] 5.1 Create a secure admin section at `/admin` with its own layout.
  - [x] 5.2 Build a video upload interface that uses pre-signed URLs to upload directly to Cloudflare R2.
  - [x] 5.3 Develop a calendar-based interface for scheduling programs.
  - [x] 5.4 Implement conflict detection to prevent overlapping program schedules.
  - [x] 5.5 Create forms for editing program metadata (title, genre, description, etc.).
  - [x] 5.6 Build a user management interface to view and manage subscribers.
  - [x] 5.7 Implement the two-tier content approval workflow (Executive Producer -> Church Leadership).
  - [x] 5.8 Add audit logging for all critical admin actions.