# Everything BJA - Setup & Deployment Guide

This guide will help you finalize the setup for the "Everything BJA" website using Firebase.

## 1. Firebase Project Setup

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Create a new project named `everything-bja`.
3.  Register a **Web App** within the project.
4.  Copy the `firebaseConfig` object and paste the values into your `.env` file (copied from `.env.example`).
5.  **Enable Authentication**: 
    - Go to Build > Authentication.
    - Enable **Google** sign-in.
6.  **Enable Firestore**:
    - Go to Build > Firestore Database.
    - Create a database in **Production Mode** (or test mode, but our rules will secure it).
7.  **Enable Hosting**:
    - Go to Build > Hosting.
    - Follow the "Get Started" steps to initialize (already partially done via `firebase.json`).

## 2. Initializing Firestore Data

To make the site functional immediately, you need to create a few initial documents in Firestore:

### A. Admin Allowlist
- **Collection**: `admin`
- **Document ID**: `allowlist`
- **Fields**: 
  - `emails` (Array): `["your-google-email@gmail.com"]`

### B. Site Configuration
- **Collection**: `config`
- **Document ID**: `site`
- **Fields**:
  - `displayName`: "Brian Jordan Alvarez"
  - `tagline`: "Hello, it is me BJA."
  - `bio`: "Welcome to the official hub..."
  - `heroImage`: "URL_TO_IMAGE"
  - `featuredVideo`: "https://www.youtube.com/embed/..."
  - `shopMode`: "link" (or "iframe")
  - `shopUrl`: "https://bjastore.com"

### C. Example Links
- **Collection**: `links`
- **Fields**: `title`, `url`, `category` (Social/Projects/Support), `priority` (Number), `isFeatured` (Boolean).

## 3. Local Development

```bash
cd everything-bja
npm install
npm run dev
```

## 4. Deployment

```bash
# Install Firebase CLI if you haven't
npm install -g firebase-tools

# Login and Initialize
firebase login
firebase init hosting

# Build and Deploy
npm run build
firebase deploy
```

## 5. SEO Checklist
- [ ] Verify `public/robots.txt` and `public/sitemap.xml` URLs.
- [ ] Replace `https://everythingbja.com` in `SEOManager.jsx` with your actual domain.
- [ ] Add a high-res `og-image.jpg` to the `public` folder.
