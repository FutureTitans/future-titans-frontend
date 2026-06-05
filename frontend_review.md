# Future Titans Innovation Challenge - Frontend Review

## 1. Project Overview
Future Titans is an AI-powered innovation challenge platform designed for student entrepreneurs in India (Classes 8 to 12). The platform provides a structured journey for students to learn entrepreneurship, identify real-world problems, build solutions, and compete nationally.

The core framework revolves around "Skill, Challenge, Community," helping students develop their Solution Seeker Index (SSI). The platform includes learning modules (like IDEA DNA™ and S.U.R.G.E.™), an integrated AI mentor named Zunnova, and multi-stage idea evaluations ranging from AI screenings to video pitches.

## 2. Tech Stack & Architecture
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS, Radix UI components, custom `globals.css` with a premium aesthetic (cream/gold/dark themes).
- **State Management:** Zustand (for Auth and other global states)
- **Animations:** Framer Motion
- **Charts & Visualizations:** Recharts
- **Rich Text / Media:** React Quill (WYSIWYG editor), React Markdown
- **Security & Integrity:** `face-api.js` (Implemented via `FaceGuardWrapper` to prevent cheating or monitor presence)
- **API & Requests:** Axios
- **Payments:** Razorpay integration
- **File Uploads/Storage:** `@vercel/blob`
- **PDF Generation:** `jspdf` & `jspdf-autotable`

## 3. Core Features
- **Role-Based Portals:** Dedicated dashboards and functionalities for Students, Admins, School Points of Contact (POC), and Associations.
- **AI Mentorship (Zunnova):** A persistent `GlobalAIChat` component provides guidance and interaction throughout the learning journey.
- **Structured Learning Modules:** Progressive learning chapters spanning beginner, intermediate, and advanced difficulties.
- **Idea Submission & Multi-stage Evaluation:** Students submit ideas which go through AI-based screening, video pitch assessments, and advanced stage selection.
- **Gamification & Progress Tracking:** SSI Scores, achievements/badges, time tracking, and module completion metrics.
- **FaceGuard System:** Anti-cheat and attention tracking using `face-api.js`.
- **Payment Gateway:** Razorpay for unlocking full module access.
- **Dynamic Content:** SEO-optimized blogs and outreach campaigns.

## 4. Pages & Routing (`app/` Directory Structure)
The application utilizes Next.js App Router with the following key sections:

### 4.1 Public & Authentication Pages
- **`/` (page.js):** The main landing page / marketing homepage.
- **`/login` & `/signup`:** User authentication routes.
- **`/forgot-password` & `/reset-password`:** Account recovery flows.
- **`/blog` & `/blog/[slug]`:** Public-facing articles and content.
- **`/outreach/[slug]`:** Dynamic landing pages for specific outreach campaigns or school-specific portals.

### 4.2 Student Portal (`/student`)
- **`/student/dashboard`:** The main hub showing progress, time tracking, badges, SSI score, and recent activity.
- **`/student/modules`:** Access to the learning curriculum (IDEA DNA, S.U.R.G.E., etc.).
- **`/student/submission`:** Interface for students to submit their startup ideas and track evaluation status.
- **`/student/profile`:** User profile settings, achievements, and detailed SSI breakdowns.

### 4.3 Admin Portal (`/admin`)
- **`/admin`:** Executive dashboard with high-level analytics.
- **`/admin/students`:** Student management and progress tracking.
- **`/admin/schools`:** Management of participating schools.
- **`/admin/associations`:** Management of partner associations.
- **`/admin/modules`:** Curriculum builder and content management.
- **`/admin/submissions`:** Review pipeline for student idea submissions.
- **`/admin/analytics`:** Detailed platform usage and performance metrics.
- **`/admin/ai-calling` & `/admin/grant-simulation`:** Specialized admin tools.
- **`/admin/blogs`:** CMS for managing public blog posts.
- **`/admin/settings`:** Global platform configuration.

### 4.4 School POC Portal (`/school-poc`)
- **`/school-poc/login`:** Dedicated login for school points of contact.
- **`/school-poc/dashboard`:** Analytics and tracking for students associated with a specific school.

### 4.5 Association Portal (`/association`)
- **`/association/login` & `/association/dashboard`:** Dedicated views for partner organizations to track their cohorts.

## 5. Summary
The "Future Titans" frontend is a comprehensive, feature-rich Next.js application built with modern web technologies. It effectively balances public marketing, complex stateful learning management, AI integration, and robust administrative tools within a unified monorepo structure.
