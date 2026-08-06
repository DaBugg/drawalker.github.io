# LGPR Editorial Website

Vercel-ready Next.js source for the LGPR website demo.

## Run locally

Requirements: Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy to Vercel

### From Git

1. Create a new GitHub, GitLab, or Bitbucket repository.
2. Add the contents of this folder to the repository and push it.
3. In Vercel, choose **Add New → Project** and import that repository.
4. Leave the detected framework as **Next.js**.
5. No environment variables or custom build settings are required.
6. Choose **Deploy**.

### From the Vercel CLI

From this folder, run:

```bash
npx vercel
```

Follow the prompts, then use `npx vercel --prod` when you are ready to make the
deployment production.

## Customize

- Main page content and interactions: `app/page.tsx`
- Site styles and responsive behavior: `app/globals.css`
- Metadata and social sharing: `app/layout.tsx`
- Photography, logos, press features, and social image: `public/`

The contact form intentionally opens the visitor's email application with the
form details prefilled. No database, API, or environment variable is required.
