# Render Deployment Guide

## Backend Deployment on Render

Follow these steps to deploy your Django backend to Render:

### 1. Create a Render Account
- Go to [render.com](https://render.com)
- Sign up and log in

### 2. Connect Your GitHub Repository
- Click "New +" → "Web Service"
- Select "Build and deploy from a Git repository"
- Connect your GitHub account and select the `foss-project-rose-sugar` repository

### 3. Configure the Web Service

**Basic Settings:**
- **Name**: budget-tracker-backend (or your choice)
- **Region**: Select closest to your users
- **Branch**: main
- **Runtime**: Python 3
- **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --no-input && python manage.py migrate`
- **Start Command**: `gunicorn backend.wsgi`

### 4. Set Environment Variables

Click "Environment" and add these variables:

```
DEBUG=False
SECRET_KEY=[Generate a strong secret key]
DATABASE_URL=[Your Supabase PostgreSQL connection string]
ALLOWED_HOSTS=yourdomain.onrender.com
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
```

### 5. Deploy Database

The migrations will run automatically during the build process (see build.sh).

### 6. Verify Deployment

After deployment:
1. Check the live URL: `https://yourdomain.onrender.com`
2. Test the API: `https://yourdomain.onrender.com/api/`
3. Check logs in Render dashboard

### 7. Update Frontend

In your React frontend (my-app/.env.local):
```
VITE_API_URL=https://yourdomain.onrender.com/api
VITE_DJANGO_BACKEND=true
```

Then redeploy your frontend on Vercel.

## Important Notes

- **Static Files**: WhiteNoise middleware serves static files automatically
- **SSL**: Render provides free SSL certificates
- **Database**: Make sure your Supabase database is accessible from Render IP ranges
- **Migrations**: Run automatically during build via build.sh

## Troubleshooting

### 401 Unauthorized Errors
- Verify JWT tokens are being sent in Authorization headers
- Check CORS_ALLOWED_ORIGINS includes your frontend domain

### CORS Errors
- Update CORS_ALLOWED_ORIGINS in Render environment variables
- Ensure frontend domain is exactly matched (https vs http)

### Database Connection Failed
- Verify DATABASE_URL is correct
- Check Supabase allows connections from Render's IP range
- Ensure database credentials are correct

### Static Files Not Loading
- Run: `python manage.py collectstatic --noinput`
- Verify STATICFILES_STORAGE is set to WhiteNoise

## Useful Commands

```bash
# Local testing before deployment
python manage.py runserver

# Create superuser
python manage.py createsuperuser

# Check migrations
python manage.py showmigrations

# Run migrations locally
python manage.py migrate
```
