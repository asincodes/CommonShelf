# CommonShelf 🛠️

[![Next.js](https://img.shields.io/badge/Next.js-16.3.0-000000?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Clerk Auth](https://img.shields.io/badge/Auth-Clerk-6C47FF?style=flat-square&logo=clerk)](https://clerk.com/)
[![Leaflet](https://img.shields.io/badge/Maps-Leaflet-199900?style=flat-square&logo=leaflet)](https://leafletjs.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

> **CommonShelf** is a neighborhood tool-sharing platform that empowers communities to share, discover, lend, and borrow useful tools and equipment locally. Built with Next.js App Router, MongoDB, Clerk Authentication, and Leaflet interactive mapping.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#1-clone-and-install)
  - [Environment Variables](#2-configure-environment-variables)
  - [Clerk Authentication Setup](#3-configure-clerk)
  - [Running the Development Server](#4-run-the-app)
- [Available Scripts](#-available-scripts)
- [API Reference](#-api-reference)
- [Database Models](#-database-models)
  - [Tool Schema](#tool-schema)
  - [Request Schema](#request-schema)
- [Deployment Guide](#-deployment-guide)
- [Roadmap \& Future Enhancements](#-roadmap--future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

Why buy tools you only use once a year? **CommonShelf** makes tool borrowing effortless by placing a community catalogue on an interactive map. Users can explore tools nearby, list their own items with refundable deposits, submit borrowing requests for specific dates, and manage active loans from a centralized dashboard.

---

## ✨ Key Features

- **🗺️ Interactive Map & Geolocation**: Discover nearby tools pin-pointed on OpenStreetMap via Leaflet, complete with custom markers and auto-centering geolocation controls.
- **🔍 Filter & Search**: Search tools by title, location, or filter by categories (*Power Tools, Hand Tools, Gardening, Cleaning, Ladders*).
- **📦 Tool Management**: Add new tool listings with custom images (URL or local upload), refundable deposit rates, and coordinates. Edit or delete your listings at any time.
- **📅 Borrowing Request Workflow**: Select start/end dates to request tools, automatically mark listings as `Booked`, and update status back to `Available` upon return.
- **📊 Activity Dashboard**: Track active borrowing requests, pending lending requests, and completed loans from an integrated modal dashboard.
- **🔒 Authentication & User Profiles**: Powered by Clerk with custom-styled `/sign-in` and `/sign-up` pages, supporting email/password and social login providers.
- **📱 Responsive UI**: Modern glassmorphism interface styled with Tailwind CSS v4 and dynamic Lucide React icons.

---

## 🛠️ Tech Stack

| Area | Technology / Library | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) | Full-stack React framework with server-side rendering & API routes |
| **UI Library** | [React 19](https://react.dev/) | Core UI rendering |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern utility-first CSS engine |
| **Database** | [MongoDB](https://www.mongodb.com/) + [Mongoose 9](https://mongoosejs.com/) | NoSQL database & object modeling |
| **Authentication** | [Clerk](https://clerk.com/) | User management, session handling, and authentication UI |
| **Maps & Location** | [Leaflet](https://leafletjs.com/) + [React Leaflet v5](https://react-leaflet.js.org/) | Interactive map rendering & location markers |
| **Iconography** | [Lucide React](https://lucide.dev/) | Clean, vector UI icon set |

---

## 📁 Project Architecture

```text
commonshelf/
├── public/
│   └── uploads/             # Locally stored tool image uploads
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── requests/    # API routes for borrowing request CRUD (/api/requests)
│   │   │   ├── tools/       # API routes for tool listing CRUD (/api/tools)
│   │   │   └── upload/      # File upload handler endpoint (/api/upload)
│   │   ├── sign-in/         # Clerk sign-in page
│   │   ├── sign-up/         # Clerk sign-up page
│   │   ├── globals.css      # Tailwind & global stylesheet imports
│   │   ├── layout.js        # Root layout with ClerkProvider & metadata
│   │   └── page.js          # Primary marketplace, map & tool catalogue view
│   ├── components/
│   │   ├── dashboard/       # Lending & borrowing activity modal UI
│   │   ├── layout/          # Top navigation bar & category filter bar
│   │   ├── map/             # Dynamic Leaflet map & geolocation controller
│   │   └── tools/           # Tool card, detail modal, add/edit listing forms
│   ├── lib/
│   │   └── db.js            # Cached MongoDB connection helper
│   ├── middleware.js        # Clerk route protection middleware
│   └── models/
│       ├── Request.js       # Mongoose Request model schema
│       └── Tool.js          # Mongoose Tool model schema
├── eslint.config.mjs        # ESLint configuration
├── next.config.mjs          # Next.js configuration
├── package.json             # Dependencies and npm scripts
└── README.md                # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v20.9.0 or higher
- **npm**: v10.0.0 or higher
- **MongoDB**: A running MongoDB Atlas instance or local MongoDB server
- **Clerk Account**: An active account at [clerk.com](https://clerk.com)

---

### 1. Clone and Install

```bash
git clone https://github.com/<your-username>/commonshelf.git
cd commonshelf
npm install
```

---

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory of the project:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/commonshelf?retryWrites=true&w=majority

# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Optional: Custom Clerk Sign-in/Sign-up URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

> ⚠️ **Security Note**: Never commit `.env.local` to version control. It is automatically ignored by `.gitignore`.

---

### 3. Configure Clerk

1. Log into your [Clerk Dashboard](https://dashboard.clerk.com/).
2. Under **User & Authentication → Email, Phone, Username**, enable **Email address** and **Password**.
3. Under **SSO Connections**, enable desired social OAuth providers (e.g., Google, GitHub).
4. Add `http://localhost:3000` to your allowed redirect URIs during local testing.

---

### 4. Run the App

Start the Next.js development server:

```bash
npm run dev
```

Open https://common-shelf.vercel.app/ in your browser.

---

## 📜 Available Scripts

In the project directory, you can run:

| Script | Command | Description |
| :--- | :--- | :--- |
| `dev` | `npm run dev` | Starts the development server with hot-reloading at `localhost:3000`. |
| `build` | `npm run build` | Compiles the production build with Next.js Turbopack. |
| `build:webpack` | `npm run build -- --webpack` | Compiles using Webpack (fallback if Leaflet CSS encounters Turbopack issues). |
| `start` | `npm run start` | Serves the optimized production build. |
| `lint` | `npm run lint` | Executes ESLint to check for code quality and syntax issues. |

---

## 🔌 API Reference

All API routes return JSON responses following the standard format:

```json
{
  "success": true,
  "data": { ... },
  "error": "Error message if success is false"
}
```

### Tool Endpoints (`/api/tools`)

| Method | Endpoint | Description | Payload / Query |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tools` | Retrieve all tool listings (newest first) | None |
| `POST` | `/api/tools` | Create a new tool listing | `{ title, category, deposit, locationName, imageUrl, lat, lng }` |
| `PUT` | `/api/tools/:id` | Update an existing tool listing | `{ title, category, deposit, status, ... }` |
| `DELETE` | `/api/tools/:id` | Delete a tool listing by ID | None |

### Request Endpoints (`/api/requests`)

| Method | Endpoint | Description | Payload / Query |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/requests` | Retrieve all borrowing requests | None |
| `POST` | `/api/requests` | Submit a new borrowing request | `{ toolId, toolTitle, borrowerName, startDate, endDate, deposit }` |
| `PUT` | `/api/requests/:id` | Update request status | `{ status: "Approved" | "Returned" | "Rejected" }` |
| `DELETE` | `/api/requests/:id` | Cancel/remove a request by ID | None |

### File Upload Endpoint (`/api/upload`)

| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/upload` | Upload a local image file (`multipart/form-data`) | `FormData` with `file` key |

---

## 🗄️ Database Models

### Tool Schema

```javascript
{
  title:        { type: String, required: true },
  category:     { type: String, required: true },
  deposit:      { type: Number, required: true },
  distance:     { type: String, default: '0.5 km away' },
  locationName: { type: String, default: 'Koramangala, Bengaluru' },
  status:       { type: String, enum: ['Available', 'Booked'], default: 'Available' },
  imageUrl:     { type: String, default: '...' },
  lat:          { type: Number, required: true },
  lng:          { type: Number, required: true },
  createdAt:    { type: Date, default: Date.now }
}
```

### Request Schema

```javascript
{
  toolId:       { type: String, required: true },
  toolTitle:    { type: String, default: 'Tool Listing' },
  borrowerName: { type: String, default: 'Guest User' },
  startDate:    { type: String, default: '' },
  endDate:      { type: String, default: '' },
  deposit:      { type: Number, default: 0 },
  status:       { type: String, default: 'Pending' },
  createdAt:    { type: Date },
  updatedAt:    { type: Date }
}
```

---

## 🌐 Deployment Guide

### Deploying to Vercel

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Visit [Vercel](https://vercel.com/) and click **Add New → Project**.
3. Import your **CommonShelf** repository.
4. Configure the **Environment Variables** in project settings:
   - `MONGODB_URI`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
5. Click **Deploy**.
6. Update your Clerk instance with the newly generated Vercel production URL under **Allowed Origins / Redirect URLs**.

> 💡 **Production Note for Uploads**: Vercel serverless environments have ephemeral filesystems. For production image storage, configure cloud storage like **Cloudinary**, **AWS S3**, or **UploadThing** instead of saving directly to `public/uploads`.

---

## 🗺️ Roadmap & Future Enhancements

- [ ] **User-Based Ownership**: Associate tool listings and borrowing requests with logged-in Clerk User IDs.
- [ ] **Server Authorization**: Add strict ownership verification checks on write & delete endpoints.
- [ ] **Interactive Location Picker**: Pin tool locations visually on the map during listing creation instead of using defaults.
- [ ] **Cloud Storage Integration**: Direct cloud uploads via Cloudinary / S3 / UploadThing.
- [ ] **In-App Messaging & Notifications**: Real-time chat between tool owners and borrowers.
- [ ] **Payment & Deposit Escrow**: Integrated deposit handling via Stripe.

---

## 🤝 Contributing

Contributions are warmly welcomed! To contribute:

1. Fork the project repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git checkout origin feature/amazing-feature`).
5. Open a Pull Request detailing your changes.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
