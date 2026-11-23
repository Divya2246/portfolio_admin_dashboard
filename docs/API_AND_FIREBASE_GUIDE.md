# API and Firebase setup guide

This guide covers Firebase setup for the **portfolio admin dashboard** and how your **public portfolio website** should read the same data.

---

## 1. Admin dashboard setup

### 1.1 Create a Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project (or use an existing one).
2. Enable **Authentication** → **Sign-in method** → **Email/Password** (and optionally Phone if you use it).
3. Create a **Firestore Database** (start in production mode; we’ll use rules to allow public read).
4. Create **Storage** and leave default rules for now (or use the project’s `storage.rules`).

### 1.2 Environment variables

1. In Firebase Console: **Project settings** → **Your apps** → add a Web app if needed → copy the config.
2. In this repo root, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Fill every `REACT_APP_FIREBASE_*` value in `.env` from the Firebase config.

### 1.3 Deploy Firestore and Storage rules

- **Firestore**: In Firebase Console → **Firestore** → **Rules**, paste the contents of this repo’s `firestore.rules` (or deploy with Firebase CLI: `firebase deploy --only firestore:rules`).
- **Storage**: Use the repo’s `storage.rules` and deploy (e.g. `firebase deploy --only storage`).

After this, the admin dashboard can sign in, save portfolio data to `portfolios/{userId}`, and upload files to Storage.

---

## 2. Public portfolio website (consuming the data)

Your live portfolio site (e.g. on Vercel) must read the **same** Firestore document that the admin saves to.

### 2.1 Firestore collection and document

- **Collection**: `portfolios`
- **Document ID**: the **Firebase Auth UID** of the user who edits the portfolio in the admin dashboard.

So the document path is: `portfolios/{your-auth-uid}`.

### 2.2 How the public site gets the document ID

You have two options:

**Option A – Environment variable (recommended)**  
In the public portfolio project, set:

```env
REACT_APP_PORTFOLIO_USER_ID=your-firebase-auth-uid
```

You can find your UID in Firebase Console → **Authentication** → **Users** → select your user → **User UID**, or log it in the admin dashboard (e.g. `console.log(user.uid)` after sign-in).

**Option B – Config document in Firestore**  
Create a document like `config/public` with a field `portfolioUserId: "your-uid"`. The public site reads this document once (with read-only rules) and then reads `portfolios/{portfolioUserId}`. Firestore rules would need to allow read on `config/public`.

### 2.3 Reading portfolio data on the public site

1. Use the **same** Firebase config (same project) in the public site’s `.env` (at least `apiKey`, `authDomain`, `projectId`, etc.).
2. You do **not** need to sign in on the public site. Use the Firestore SDK to read a single document:

   ```js
   import { getFirestore, doc, getDoc } from 'firebase/firestore';

   const userId = process.env.REACT_APP_PORTFOLIO_USER_ID; // or from config/public
   const docRef = doc(getFirestore(), 'portfolios', userId);
   const snap = await getDoc(docRef);
   const portfolioData = snap.exists() ? { id: snap.id, ...snap.data() } : null;
   ```

3. Remove the Firestore-only fields (`id`, `updatedAt`) if your `PortfolioData` type doesn’t expect them, then pass the rest to your display component (e.g. the same shape as `portfolio-display` in this repo).

### 2.4 Reusing the portfolio display

The admin app’s `src/portfolio-display/` (types + `PortfolioDisplay.tsx`) is built to be reused. You can copy that folder into your public portfolio project, or publish it as a small package, and feed it the `portfolioData` you read from Firestore.

---

## 3. Summary checklist

| Item | Where |
|------|--------|
| Firebase project + Auth (Email/Password) | Firebase Console |
| Firestore database created | Firebase Console |
| Storage created | Firebase Console |
| `.env` with all `REACT_APP_FIREBASE_*` | Admin dashboard repo |
| Firestore rules deployed | `firestore.rules` → Firebase Console or CLI |
| Storage rules deployed | `storage.rules` → Firebase Console or CLI |
| Public site: know portfolio doc ID | `REACT_APP_PORTFOLIO_USER_ID` or `config/public` |
| Public site: same Firebase config | Public site `.env` |
| Public site: read `portfolios/{userId}` | Firestore `getDoc` (no auth required for read) |

Once the rules are deployed, the admin can edit and save, and the public site can read the same document without logging in.
