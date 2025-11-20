# Vercel Deployment Guide

## Frontend (React + Vite) Deployment to Vercel

### 1. Connect Your Repository
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository: `BU-SENG/foss-project-rose-sugar`
- Select the `my-app` folder as the root directory

### 2. Configure Build Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Set Environment Variables in Vercel Dashboard

Go to **Settings → Environment Variables** and add:

```
VITE_API_URL=https://your-backend-domain.com/api
VITE_DJANGO_BACKEND=true
```

Replace `your-backend-domain.com` with your actual backend URL (e.g., `budget-tracker-api.onrender.com`)

### 4. Deploy
Click "Deploy" and Vercel will automatically:
- Build your React app
- Run migrations
- Serve your SPA with proper routing

## Troubleshooting

### 404 on /register page
**Problem**: React Router SPA routes return 404
**Solution**: `vercel.json` is configured with rewrites to route all traffic to `index.html`

Verify:
1. `vercel.json` exists in `/my-app` root
2. Contains proper `rewrites` configuration
3. Deployment includes all JavaScript bundles in `dist/`

### "Cannot find module" errors in build
**Solution**: Ensure all dependencies are in `package.json`
```bash
npm install
npm run build
```

### API calls failing (CORS errors)
**Solution**: Update `VITE_API_URL` environment variable in Vercel to match your backend domain

## Verifying Deployment

1. Visit your Vercel domain (e.g., `your-app.vercel.app`)
2. You should see the Login page
3. Click "Sign In" link to go to Register page
4. Both pages should load without 404 errors

If you get 404 on `/register`:
- Check Vercel deployment logs
- Verify `vercel.json` is included in the build
- Check that `dist/index.html` exists in build output

## Environment Variables Needed

### Frontend (.env in Vercel)
- `VITE_API_URL` = Your backend API URL
- `VITE_DJANGO_BACKEND` = `true`

### Backend (Render or your hosting)
- `DATABASE_URL` = Supabase PostgreSQL URL
- `DEBUG` = `False` (for production)
- `SECRET_KEY` = Strong random string
- `ALLOWED_HOSTS` = Your domain
- `CORS_ALLOWED_ORIGINS` = Your frontend URL (Vercel domain)
