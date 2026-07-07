# Eli's Birthday RSVP — One Piece Themed RSVP App

A mobile-first, one-page RSVP web app built with Next.js, TypeScript, and Tailwind CSS. Responses are saved directly to a Google Sheet — no database needed.

---

## 1. What's inside this folder

```
eli-rsvp/
├── app/
│   ├── page.tsx                 ← the main landing page (invitation, button, footer)
│   ├── layout.tsx               ← wraps every page (sets the page title)
│   ├── globals.css              ← Tailwind setup + the modal's slide-up animation
│   ├── components/
│   │   ├── Footer.tsx           ← the footer of the application
│   │   ├── RsvpModal.tsx        ← the popup form — all the form logic lives here
│   │   ├── GuestRow.tsx         ← one guest's fields (name + adult/kid) — reused per guest
│   │   └── types.ts             ← shared TypeScript type definitions
│   └── api/
│       └── rsvp/
│           └── route.ts         ← the server code that writes to your Google Sheet
├── public/                      ← put your final images here (eli-invitation.jpg, etc.)
├── .env.local.example           ← template for your secret credentials
├── package.json                 ← list of dependencies
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

You do not need to touch `tailwind.config.ts`, `tsconfig.json`, or `next.config.ts` — they're already configured correctly.

---

## 2. Terminal setup — step by step

### Step 1: Install Node.js
If you don't already have it, download the "LTS" version from [nodejs.org](https://nodejs.org). This gives you both `node` and `npm` (Node Package Manager).

Verify it installed correctly:
```bash
node -v
npm -v
```
You should see version numbers print out (not an error).

### Step 2: Open this project folder in your terminal
```bash
cd path/to/eli-rsvp
```
(Replace `path/to/eli-rsvp` with wherever you saved this folder.)

### Step 3: Install all dependencies
This reads `package.json` and downloads everything the project needs (Next.js, React, Tailwind, the Google Sheets library, etc.) into a `node_modules` folder.
```bash
npm install
```
This may take a minute. It's normal to see some warnings about "deprecated" packages or "vulnerabilities" — these are common and not something to worry about for this project.

### Step 4: Set up your environment variables
Copy the example file:
```bash
cp .env.local.example .env
```
Then open `.env` in your code editor — you'll fill this in during Section 3 below (Google Sheets setup).

### Step 5: Run the app locally
```bash
npm run dev
```
Open your browser to **http://localhost:3000**. You should see the app! (The Google Sheets connection won't work yet until you finish Section 3 — but the page itself will load and the modal will open.)

To stop the server, press `Ctrl + C` in the terminal.

---

## 3. Connecting to Google Sheets (the credentials setup)

This is the part that sounds scary but is just a series of clicks. You're creating a "robot user" (called a Service Account) that's allowed to write to one specific spreadsheet.

### Step 1: Create the Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com) and create a new blank spreadsheet.
2. Name it something like "Eli's Birthday RSVPs".
3. In Row 1, add these exact column headers (this matches what the code expects):
   ```
   Timestamp | Attending | TotalGuests | AdultCount | KidCount | GuestDetails | Message 
   ```
4. Look at the URL in your browser. It looks like:
   ```
   https://docs.google.com/spreadsheets/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/edit
   ```
   The long string between `/d/` and `/edit` is your **Sheet ID**. Copy it — you'll need it soon.

### Step 2: Create a Google Cloud Project
1. Go to [console.cloud.google.com](https://console.cloud.google.com).
2. Click the project dropdown at the top → **New Project**.
3. Name it anything (e.g. "eli-rsvp-app") and click **Create**.

### Step 3: Enable the Google Sheets API
1. With your new project selected, go to **APIs & Services → Library**.
2. Search for "Google Sheets API".
3. Click it, then click **Enable**.

### Step 4: Create a Service Account
1. Go to **APIs & Services → Credentials**.
2. Click **+ Create Credentials → Service Account**.
3. Give it a name (e.g. "rsvp-sheet-writer"). Click **Create and Continue**, then **Done** (you can skip the optional permission steps).
4. You'll now see your service account listed. Click on it.
5. Go to the **Keys** tab → **Add Key → Create New Key** → choose **JSON** → **Create**.
6. A `.json` file will download to your computer. **Keep this file safe and never share it publicly.**

### Step 5: Get your credentials from the JSON file
Open the downloaded `.json` file in a text editor. You'll see something like:
```json
{
  "client_email": "rsvp-sheet-writer@eli-rsvp-app.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgk...\n-----END PRIVATE KEY-----\n",
  ...
}
```
You need two values from this file: `client_email` and `private_key`.

### Step 6: Share your Google Sheet with the service account
1. Go back to your Google Sheet.
2. Click **Share** (top right).
3. Paste in the `client_email` value (the long address ending in `.iam.gserviceaccount.com`).
4. Set its permission to **Editor**.
5. Click **Send** (it won't actually email anyone — it's a robot account).

This step is the one people most often forget. Without it, the API will reject every request.

### Step 7: Fill in your `.env` file
Open `.env` and fill it in like this:
```
GOOGLE_SERVICE_ACCOUNT_EMAIL=rsvp-sheet-writer@eli-rsvp-app.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgk...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=1AbCdEfGhIjKlMnOpQrStUvWxYz
```
Important: keep the `private_key` value wrapped in double quotes, exactly as it appeared in the JSON file (including the `\n` characters — don't replace them with real line breaks).

### Step 8: Restart your dev server and test it
```bash
npm run dev
```
Open the app, click "RSVP to the Crew", fill out the form, and submit. Check your Google Sheet — a new row should appear!

---

## 4. Deploying to Vercel

1. Push this project to a GitHub repository (create one at [github.com/new](https://github.com/new), then follow GitHub's instructions to push your local folder).
2. Go to [vercel.com](https://vercel.com) and sign up/log in with your GitHub account.
3. Click **Add New → Project**, and select your repository.
4. Before clicking deploy, expand **Environment Variables** and add the same three values from your `.env` file:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `GOOGLE_SHEET_ID`
5. Click **Deploy**. After a minute, you'll get a live URL you can share with guests.

Your `.env` file never gets uploaded to GitHub (it's listed in `.gitignore`), so this environment variable step in Vercel is the only way your live site learns the credentials.

---

Made with ❤️ by Jan Carlo M. Cardama
