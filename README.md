<div align="center">
  <br/>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/%20-HealthRec-6366f1?style=for-the-badge&logo=heart&logoColor=white">
    <img src="https://img.shields.io/badge/%20-HealthRec-6366f1?style=for-the-badge&logo=heart&logoColor=white" height="36">
  </picture>

  <h1 align="center">HealthRec — Frontend</h1>

  <p align="center">
    <strong>AI-Powered Health Recommendation Interface</strong>
    <br/>
    Modern React SPA with Clerk authentication, TanStack Query, and Zustand state management
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React 19"/>
    <img src="https://img.shields.io/badge/Clerk-Auth-6C47FF?style=flat-square&logo=clerk&logoColor=white" alt="Clerk Auth"/>
    <img src="https://img.shields.io/badge/TanStack_Query-5-FF4154?style=flat-square&logo=reactquery&logoColor=white" alt="TanStack Query"/>
    <img src="https://img.shields.io/badge/Zustand-State-443E38?style=flat-square&logo=react&logoColor=white" alt="Zustand"/>
    <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 8"/>
    <img src="https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
  </p>

  <br/>
</div>

---

## Overview

**HealthRec Frontend** is a modern React single-page application that provides an intuitive interface for AI-powered health consultations. Users describe their symptoms and receive intelligent analysis, possible conditions, health tips, and curated medical resources — all through a beautiful, responsive dark-themed UI.

```
┌─────────────────────────────────────────────────┐
│  HealthRec UI                                    │
│  ┌─────────────────────────────────────────────┐ │
│  │  Navbar (Home · About · Sign In)            │ │
│  ├─────────────────────────────────────────────┤ │
│  │  Home Page                                  │ │
│  │  ┌──────────────────┐ ┌──────────────────┐  │ │
│  │  │ Hero: Title,     │ │ Animated Image   │  │ │
│  │  │ Description, CTA │ │ + Floating Cards │  │ │
│  │  └──────────────────┘ └──────────────────┘  │ │
│  ├─────────────────────────────────────────────┤ │
│  │  Chat Page (Protected)                      │ │
│  │  ┌──────────────────────────────────────┐   │ │
│  │  │  Message bubbles · Types · Resources │   │ │
│  │  └──────────────────────────────────────┘   │ │
│  ├─────────────────────────────────────────────┤ │
│  │  Footer                                     │ │
│  └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

---

## Pages

| Route | Page | Auth Required | Description |
|-------|------|:---:|-------------|
| `/` | **Home** | — | Animated hero with stats, features grid, CTA |
| `/about` | **About** | — | Mission, privacy, how-it-works cards |
| `/sign-in` | **Sign In** | — | Clerk-hosted sign-in form |
| `/sign-up` | **Sign Up** | — | Clerk-hosted sign-up form |
| `/chat` | **Chat** | ✅ | Full consultation interface |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 with TypeScript |
| **Bundler** | Vite 8 |
| **Auth** | Clerk (via `@clerk/react` v6) |
| **State** | Zustand 5 |
| **API Data** | TanStack Query 5 |
| **Routing** | React Router DOM |
| **Styling** | Custom CSS with dark theme |
| **Backend** | HealthAgent API (.NET 8) |

---

## Project Structure

```
src/
├── main.tsx                          # Bootstrap: ClerkProvider + QueryClient + BrowserRouter
├── App.tsx                           # Routes + protected route wrapper
├── index.css                         # Global dark theme + all component styles
├── app/
│   ├── store/
│   │   ├── authStore.ts             # Zustand — user authentication state
│   │   └── chatStore.ts             # Zustand — chat messages & conversation
│   ├── services/
│   │   └── api.ts                   # Fetch-based API client with JWT
│   ├── hooks/
│   │   └── useApi.ts                # TanStack Query hooks (get/post/put/delete)
│   ├── components/
│   │   └── layout/
│   │       ├── Navbar.tsx            # Fixed nav with Clerk UserButton/SignInButton
│   │       ├── Footer.tsx            # 3-column footer
│   │       └── Layout.tsx            # Navbar + Outlet + Footer
│   └── pages/
│       ├── Home.tsx                  # Animated landing page
│       ├── About.tsx                 # About/info page
│       ├── ChatPage.tsx              # Protected chat interface
│       ├── SignInPage.tsx            # Clerk SignIn component
│       └── SignUpPage.tsx            # Clerk SignUp component
```

---

## Key Features

### Hero Section
- Animated gradient text, fade-in content, floating cards
- Stats display (10K+ users, 98% accuracy, 24/7 support)
- Responsive grid layout (content left, image right)

### Chat Interface
- Protected route — redirects to sign-in if unauthenticated
- Real-time message threading with smooth scrolling
- Loading animation with bouncing dots
- Displays: possible conditions (with confidence levels), recommended actions, follow-up questions, health tips, curated medical resources, urgency badges, disclaimer

### State Management
- **Zustand**: Auth store (user session) + Chat store (messages, conversationId)
- **TanStack Query**: Automatic caching, retry, invalidation for all API calls
- **Clerk**: Session management via `useAuth`, `useUser`, `getToken()`

---

## Getting Started

### Prerequisites

- Node.js >= 20.9.0
- Running HealthAgent API backend (see [backend README](../HealthAgent.Api/README.md))

### Environment

Create a `.env` file in the project root:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxx
VITE_API_URL=http://localhost:5000/api
```

### Install & Run

```bash
npm install
npm run dev
```

The app starts at `http://localhost:5173`.

### Build

```bash
npm run build
npm run preview
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | TypeScript check + Vite production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## Design

- **Dark theme** with indigo/cyan gradient accents
- **Glassmorphism** navbar with backdrop blur
- **Smooth animations**: fadeInUp, slideInRight, float, pulse
- **Fully responsive**: mobile-first with adaptive breakpoints
- **Consistent spacing** and typography via CSS custom properties

<br/>
<hr/>

<div align="center">
  <sub>Built with React · Clerk · TanStack Query · Zustand · Vite</sub>
</div>
