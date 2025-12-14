# Portfolio Website

A personal portfolio site showcasing projects, experience, and interactive components (mode toggle, theme toggle, API-driven cards).

---

## Overview

Use this section as your high-level summary 

- **Purpose:** 
- **What it includes:** 
- **Who it’s for:** 
- **Status:** << ACTIVE >>

---

## Key Features

- **Mode aware content** (e.g., Personal vs Business) driven by a single mode state
- **Theme toggle** (Dark/Light) with consistent design tokens
- **API widgets**
  - Spotify “Now Playing” card (polling + progress animation)
  - Quote-of-the-day (API/DB-driven, not hardcoded)
- **Contact / Quote flow** (serverless `/api` endpoint + email delivery)
- **Reusable sections** (Hero, Projects, Services/Tiers, About, Contact)
- **Background effects** (particles/animated visuals) that don’t break mode/theme switching

---

## Tech Stack

Fill this in based on what you actually used.

- **Frontend:** HTML / CSS / JavaScript
- **Backend/API:** Node.js serverless functions (Vercel)
- **Deployment:** Vercel (or equivalent)
- **Other:** <<< e.g., Spotify Web API, nodemailer, dotenv >>>

---

## Project Structure

/
├─ index.html
├─ /css
│  └─ styles.css
├─ /js
│  ├─ main.js
│  ├─ mode-toggle.js
│  ├─ theme-toggle.js
│  ├─ spotify-card.js
│  └─ effects.js
├─ /api
│  ├─ spotify.js
│  └─ send-quote.js
├─ /images
└─ README.md

---

## Environment Variables

Create a `.env` file (only if your project uses server/API routes).

### Spotify (if using “Now Playing”)

```env
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REFRESH_TOKEN=
```

### Email (Using nodemailer)

```env
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
MAIL_TO=
MAIL_FROM=
```



## Known Issues / TODO
* [ ] Ensure background effects don’t r on every mode switch
* [ ] Improve lighthouse performance (reduce blocking JS, compress media)
* [ ] Add caching for quote + spotify responses
* [ ] Harden form endpoint (rate limit + validation)
* [ ] Add SQL database to Quotes section to change from manuall quote changes.

---

## Contact
* Site: https://www.networksandnodes.org
* Email: david@networksandnodes.org
* LinkedIn: https://www.linkedin.com/in/david-w-3621bb272/

If you paste your repo structure (top-level folders + what framework you’re using), I can tighten this README so every path/command matches your project exactly.
```
