# Fast Cups 💧

Count how many cups of water you and your family drink before a fast. Anyone
can start an event (a name plus a start/end time), share the link, and
everyone who opens it signs in with Google, taps "drank a cup", and watches a
live leaderboard for that event.

Backend is Firebase: Google Sign-In via Firebase Auth, cup counts stored in
Firestore. No server code to run.

## One-time Firebase setup

You've already created the project at
https://console.firebase.google.com/project/fast-cups/overview — a few more
clicks there:

### 1. Enable Google sign-in

1. In the console, go to **Build → Authentication → Get started** (if not already done).
2. Under **Sign-in method**, enable **Google** as a provider.

### 2. Create Firestore

1. Go to **Build → Firestore Database → Create database**.
2. Start in **production mode** (the security rules below lock it down anyway).
3. Pick any region.
4. Once created, go to the **Rules** tab and replace the contents with what's
   in `firestore.rules` in this repo, then **Publish**:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{uid} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }

       match /events/{eventId} {
         allow read: if request.auth != null;
         allow create: if request.auth != null
           && request.resource.data.adminUid == request.auth.uid;
         allow update, delete: if false;

         match /cups/{userId} {
           allow read: if request.auth != null;
           allow write: if request.auth != null
             && (request.auth.uid == userId
                 || get(/databases/$(database)/documents/events/$(eventId)).data.adminUid == request.auth.uid);
         }
       }
     }
   }
   ```

   Any signed-in user can create an event (only as themselves — you can't set
   someone else as admin) and read any event's leaderboard. A user can always
   write their own cup count; the event's admin can additionally write anyone's
   cup count in their own event, which is what powers the reset-everyone
   button. The `users/{uid}` doc is a small personal record (just a list of
   event IDs you've joined, for the Past tab) that only you can read or write —
   no Firestore indexes needed for any of this.

### 3. Register a web app

1. Go to **Project settings** (gear icon) → scroll to **Your apps** → click
   the **web** (`</>`) icon to add a web app (any nickname is fine, no
   hosting setup needed).
2. Copy the `firebaseConfig` values shown.

### 4. Configure the app

Edit `.env` (already created for you, copied from `.env.example`) and fill in
the values from the config you just copied:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## Running locally (phase 1)

```
npm install
npm run dev
```

Open the printed `http://localhost:5173` URL. `localhost` is an authorized
domain for Firebase Auth by default, so Google Sign-In works out of the box
here — no extra config needed, unlike a raw Google OAuth client. For a real
phone, use your browser's mobile device emulation on your laptop for now;
full real-phone testing is easiest once deployed (phase 2).

## Data model

```
events/{eventId}
  name, adminUid, adminName, startTime, endTime, createdAt

events/{eventId}/cups/{uid}
  uid, name, email, count

users/{uid}
  joinedEventIds: string[]
```

Tapping "drank a cup" atomically increments your own `cups` doc under the
current event (creating it on first use). Since everyone only ever writes
their own document, there's no conflict between family members hitting the
button at the same time. The leaderboard listens for live updates, so
everyone's counts refresh in real time without needing to refresh the page —
if a family member's tab isn't open, they'll just see the latest count next
time they open it (no push notifications, by design, to keep the backend
serverless).

Undoing a cup ("oops, remove one") uses a transaction rather than a plain
decrement, so it clamps at zero instead of going negative.

## Using it: events, invites, and admin reset

- **Starting a fast**: the first person signs in and fills in an event name
  plus start/end time. This makes them that event's **admin** and puts an
  `?event=<id>` on the URL.
- **Inviting others**: share that URL (there's also a "🔗 Invite" button in
  the app that copies the current link). Anyone who opens it and signs in
  joins the same event and leaderboard.
- **The drink button** is only enabled between the event's start and end
  time; outside that window it shows when the event starts, or that it's
  ended.
- **Resetting**: only the event's admin sees a "⟳ Reset all" button, which
  zeroes out everyone's count in that event (with a confirmation prompt) —
  useful for restarting mid-fast without recreating the whole event.
- **📜 Past tab**: lists every event you created or drank at least one cup
  in — works from any device, not just the one you started on, since it's
  backed by your `users/{uid}` doc rather than device storage. Ended events
  show grayed out with the winner and their cup count; tapping any event
  jumps into it.

## Deploying to GitHub Pages

This is a static site (Firebase Auth/Firestore run entirely from the browser),
so GitHub Pages works fine — no server needed. A GitHub Actions workflow
(`.github/workflows/deploy.yml`) is already set up to build and deploy on
every push to `main`.

This folder currently lives inside a bigger personal monorepo with no GitHub
remote. Rather than pushing that whole repo, give `fast-cups` its own
dedicated GitHub repo:

### 1. Create the GitHub repo

Create a new **empty** repo (no README/gitignore/license) at
https://github.com/new named `fast-cups` under your account. `vite.config.js`
already assumes this exact name for its `base` path — if you name it
something else, update `base: '/fast-cups/'` there to match.

### 2. Push this folder to it

```
cd fast-cups
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/fast-cups.git
git push -u origin main
```

### 3. Add your Firebase config as repo secrets

The workflow needs the same values from your `.env` file, since `.env` itself
is gitignored and never gets pushed. In the new repo, go to **Settings →
Secrets and variables → Actions → New repository secret** and add each of:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

### 4. Turn on Pages

In the repo, go to **Settings → Pages** and set **Source** to **GitHub
Actions**. Pushing to `main` (or re-running the workflow from the Actions tab)
will now build and publish the site.

### 5. Authorize the domain in Firebase

Your site will be live at `https://<your-username>.github.io/fast-cups/`. In
the Firebase console, go to **Authentication → Settings → Authorized
domains → Add domain** and add `<your-username>.github.io` (just the domain,
no path) — otherwise Google Sign-In will fail with an "unauthorized domain"
error.
