# Fixing Firebase Storage CORS errors (e.g. uploads from localhost)

## What the error means

When you see:

```text
Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/...' from origin 'http://localhost:3005'
has been blocked by CORS policy: Response to preflight request doesn't pass access control check
```

the browser is blocking the request because:

1. Your app runs on **http://localhost:3005** (one “origin”).
2. It sends a request to **https://firebasestorage.googleapis.com** (another origin).
3. For that cross-origin request, the browser sends a **preflight** (OPTIONS) request first.
4. The preflight response either returns a non-OK status or doesn’t include CORS headers that allow your origin.
5. So the browser blocks the real request (e.g. POST upload) and reports a CORS error.

So the problem is **not** in your app code; it’s that your **Firebase Storage bucket** is not configured to allow requests from your app’s origin (e.g. localhost).

## Fix: set CORS on your Storage bucket

Firebase Storage is Google Cloud Storage. You must set a **CORS configuration** on the bucket using **gsutil**.

### 1. Install Google Cloud SDK (includes gsutil)

- **macOS (Homebrew):** `brew install google-cloud-sdk`
- Or: https://cloud.google.com/sdk/docs/install

### 2. Authenticate and set project

```bash
gcloud auth login
gcloud config set project portfolio-admin-dashboar-de4bf
```

### 3. Apply the CORS file from this repo

In the project root we provide `storage-cors.json` with origins for localhost (and common dev ports). Apply it to your bucket:

```bash
gsutil cors set storage-cors.json gs://portfolio-admin-dashboar-de4bf.firebasestorage.app
```

This is the bucket for this project. After it runs successfully, CORS is set.

### 4. Add production origin (optional)

When you deploy (e.g. Vercel), add your production URL to `storage-cors.json` in the `"origin"` array, then run the same `gsutil cors set` command again.

Example:

```json
"origin": [
  "http://localhost:3000",
  "http://localhost:3005",
  "https://your-app.vercel.app"
]
```

### 5. Retry the upload

After CORS is set, reload your app at http://localhost:3005 and try the upload again. The preflight should succeed and the upload should go through.

## If you can’t use gsutil

Use **Google Cloud Shell** in the browser:

1. Open [Google Cloud Console](https://console.cloud.google.com/) and select your project.
2. Click the **Cloud Shell** icon (top right).
3. Create `storage-cors.json` (paste the contents from this repo’s `storage-cors.json`).
4. Run: `gsutil cors set storage-cors.json gs://portfolio-admin-dashboar-de4bf.firebasestorage.app`

## Summary

| What                    | Meaning                                                                 |
|-------------------------|-------------------------------------------------------------------------|
| **Error**               | Browser blocks request because of CORS.                                |
| **Cause**               | Storage bucket not allowing your origin (e.g. localhost:3005).         |
| **Fix**                 | Set CORS on the bucket with `gsutil cors set storage-cors.json gs://...` |
| **File in repo**        | `storage-cors.json` (origins + methods for uploads/downloads).        |

---

# Fixing 403 Forbidden / storage/unauthorized (Storage rules)

If uploads pass CORS but you get:

```text
403 (Forbidden)
Firebase Storage: User does not have permission to access 'portfolio/...'. (storage/unauthorized)
```

then **Firebase Storage security rules** are blocking the request.

**Important:** Storage rules are **not** the same as Firestore rules. They are configured in a different place and use different syntax.

| Service   | What it protects     | Where to set rules                          |
|----------|----------------------|---------------------------------------------|
| Firestore| Database documents   | **Firebase Console → Firestore → Rules**    |
| Storage  | Files (uploads/URLs) | **Firebase Console → Storage → Rules**     |

If you only edited Firestore rules, the upload will still get 403. You must set **Storage** rules (see below).

## Fix: allow authenticated uploads in Storage rules

1. Open [Firebase Console](https://console.firebase.google.com/) → your project.
2. In the left sidebar, click **Build** → **Storage** (the “Storage” item with a folder/upload icon, **not** “Firestore Database”).
3. Open the **Rules** tab (next to “Files” in the Storage area).
4. You should see rules that start with `service firebase.storage` (not `service cloud.firestore`). Replace everything there with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /portfolio/{allPaths=**} {
      allow read: if true;           // so portfolio site can show media without auth
      allow write: if request.auth != null;  // only logged-in admin can upload
    }
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

5. Click **Publish**.
6. Try the upload again from the admin dashboard (while signed in).

Only **signed-in** users can upload; **read** is open so the portfolio website can display images/PDFs from Storage URLs without logging in. The repo includes a reference file **`storage.rules`** with this content.
