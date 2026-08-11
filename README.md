# CommonShelf

**CommonShelf** is a neighborhood tool-sharing app for discovering, lending, and borrowing useful items locally. Browse a map-backed catalogue, list a tool, send a borrowing request, and track activity from one responsive interface.

> Built as a community-sharing prototype with Next.js, MongoDB, Clerk, and Leaflet.

## Features

- Browse tool listings in a searchable, category-filtered catalogue.
- See listings on an interactive Leaflet/OpenStreetMap map.
- Use the browser's geolocation control to center the map on your location.
- Create, edit, and delete tool listings.
- Add a tool image using a URL, with a live preview and fallback image.
- Request a tool for a selected date range and mark booked items as returned.
- View borrowing activity and pending lending requests in a dashboard.
- Sign up and sign in with Clerk using email/password and enabled social providers.
- Dedicated `/sign-in` and `/sign-up` pages with CommonShelf styling.

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) + React 19 |
| Styling | Tailwind CSS 4 |
| Database | MongoDB with Mongoose |
| Authentication UI | Clerk |
| Maps | Leaflet, React Leaflet, OpenStreetMap |
| Icons | Lucide React |
| Deployment | Vercel (recommended) |

## Quick start

### Prerequisites

- Node.js 20.9 or later
- A MongoDB Atlas database (or another reachable MongoDB deployment)
- A Clerk application

### 1. Clone and install

```bash
git clone https://github.com/<your-username>/commonshelf.git
cd commonshelf
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

Never commit `.env.local` or any keys. The repository's `.gitignore` already excludes environment files.

### 3. Configure Clerk

In the Clerk Dashboard:

1. Enable **Email** and **Password** under **Configure → User & authentication**.
2. Enable any social connections you want to offer, such as Google, Apple, or Facebook, under **SSO connections**.
3. If phone sign-in is not needed, leave **Sign-up with phone** and **Sign-in with phone** disabled under **Phone**.

For production, use the keys from your Clerk production instance. Social connections use shared credentials in development; configure your own provider credentials before enabling them in production.

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm run lint` | Run ESLint. |
| `npm run build` | Create a production build with Turbopack. |
| `npm run build -- --webpack` | Create a production build with Webpack. Useful if Turbopack has an environment-specific issue with Leaflet CSS. |
| `npm run start` | Serve a completed production build. |

## How it works

### Tool listings

Tool data is stored in MongoDB. A listing includes a title, category, refundable deposit, image URL, availability status, and map coordinates. The interface currently offers these categories:

- Power Tools
- Hand Tools
- Gardening
- Cleaning
- Ladders

The creation form does not yet include a location picker. New listings therefore default to Bengaluru's map center (`12.9716, 77.5946`) until custom coordinates are supplied.

### Borrowing flow

1. Select an available tool from a card or map marker.
2. Choose a start and end date and submit a borrowing request.
3. A request record is saved and the tool is marked `Booked`.
4. Use **Mark as Returned** to return the tool to `Available` and update the related request.

### Authentication

`ClerkProvider` wraps the app, and the navbar adapts to the signed-in state. Signed-in users see the listing action and a user menu; signed-out users are sent to the dedicated sign-in page.

Authentication methods shown by Clerk are controlled in the Clerk Dashboard—not hard-coded in this repository.

## API reference

All API responses follow the shape `{ success, data?, error? }`.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/tools` | Return all tool listings, newest first. |
| `POST` | `/api/tools` | Create a listing. Missing coordinates use the Bengaluru fallback. |
| `PUT` | `/api/tools/:id` | Update a listing. |
| `DELETE` | `/api/tools/:id` | Delete a listing. |
| `GET` | `/api/requests` | Return all borrowing requests, newest first. |
| `POST` | `/api/requests` | Create a borrowing request. |
| `PUT` | `/api/requests/:id` | Update a borrowing request. |
| `DELETE` | `/api/requests/:id` | Delete a borrowing request. |
| `POST` | `/api/upload` | Save an uploaded file locally and return its public URL. |

## Project structure

```text
src/
├── app/
│   ├── api/                 # Tool, request, and upload route handlers
│   ├── sign-in/             # Clerk sign-in route
│   ├── sign-up/             # Clerk sign-up route
│   ├── layout.js            # Global Clerk provider and metadata
│   └── page.js              # Main catalogue, map, and UI state
├── components/
│   ├── dashboard/           # Borrowing/lending activity modal
│   ├── layout/              # Navigation and category bar
│   ├── map/                 # Leaflet map and location control
│   └── tools/               # Listing, booking, add, and edit UI
├── lib/db.js                # Cached MongoDB connection
├── middleware.js            # Clerk middleware configuration
└── models/                  # Mongoose Tool and Request schemas
```

## Deploy to Vercel

1. Push the project to a GitHub repository.
2. In Vercel, select **Add New → Project** and import that repository.
3. Add these environment variables in **Project Settings → Environment Variables**:
   - `MONGODB_URI`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
4. Deploy.
5. In Clerk, add the Vercel deployment URL to the allowed origins/redirect URLs if your instance requires it.
6. Replace Clerk development keys with production keys when deploying publicly.

Vercel's server filesystem is ephemeral. The current `/api/upload` endpoint writes files to `public/uploads`, so use an object-storage service such as Cloudinary, UploadThing, or Amazon S3 before relying on uploads in production. Image URLs work without any additional storage configuration.

## Current limitations and next steps

CommonShelf is a prototype. Before using it as a real multi-user marketplace, consider implementing:

- Per-user ownership for tools and borrowing requests.
- Server-side authorization checks on every write endpoint.
- A location picker/geocoding flow instead of default coordinates.
- Persistent cloud storage and file validation for uploaded images.
- Request approval, cancellation, notifications, and payments/deposit handling.
- Automated tests and error monitoring.

## Contributing

Contributions and ideas are welcome. For a change, please open an issue describing the problem or feature, create a focused branch, and submit a pull request with a clear explanation and validation notes.

## License

No license has been added yet. Add one before distributing or accepting external contributions.
# CommonShelf
