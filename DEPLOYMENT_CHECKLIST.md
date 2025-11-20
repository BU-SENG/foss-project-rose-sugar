# Production Deployment Checklist

## ✅ Frontend (React + Vite) - Vercel

### Build Requirements
- [x] Terser installed (`npm install terser --save-dev`)
- [x] All dependencies in `package.json`
- [x] `vite.config.js` configured with build options
- [x] `vercel.json` configured with SPA routing
- [x] `.env.production` created with environment variables

### Vercel Configuration
```
Root Directory: /my-app
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Environment Variables in Vercel Dashboard
```
VITE_API_URL=https://your-backend-domain.com/api
VITE_DJANGO_BACKEND=true
```

### Pre-Deployment Check
```bash
cd my-app
npm install
npm run build
npm run preview
```

## ✅ Backend (Django) - Render

### Installation Requirements
- [x] Django 5.2.8
- [x] djangorestframework 3.16.1
- [x] djangorestframework-simplejwt 5.5.1
- [x] django-cors-headers 4.9.0
- [x] psycopg2-binary 2.9.11
- [x] whitenoise 6.11.0
- [x] gunicorn 23.0.0
- [x] dj-database-url 3.0.1

### Django Settings Configuration
- [x] `rest_framework_simplejwt` in INSTALLED_APPS
- [x] JWT authentication configured
- [x] CORS properly configured
- [x] WhiteNoise middleware enabled
- [x] Database using Supabase PostgreSQL
- [x] Security settings for production (SSL redirect, secure cookies)

### Environment Variables for Render
```
DEBUG=False
SECRET_KEY=<generate-strong-key>
DATABASE_URL=postgresql://user:pass@host:port/db
ALLOWED_HOSTS=your-domain.onrender.com
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### Render Deployment
```
Repository: GitHub (BU-SENG/foss-project-rose-sugar)
Root Directory: /backend
Build Command: pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
Start Command: gunicorn backend.wsgi
```

## 🔧 Common Deployment Issues & Fixes

### Frontend: Build Failed - "terser not found"
**Fix**: `npm install terser --save-dev`

### Frontend: 404 on /register
**Fix**: Verify `vercel.json` has proper rewrites configuration

### Backend: 403 Forbidden on API calls
**Fix**: Ensure `rest_framework_simplejwt` is in INSTALLED_APPS

### Backend: 401 Unauthorized
**Fix**: Check that Authorization header is being sent with JWT token

### Database: Connection Failed
**Fix**: Verify DATABASE_URL is correct in environment variables

### CORS Errors
**Fix**: Update CORS_ALLOWED_ORIGINS to match frontend domain

## 📋 Pre-Production Checklist

### Code Quality
- [ ] No console.error() statements in production code
- [ ] API endpoints tested locally
- [ ] Register and Login pages working
- [ ] Dashboard loads after authentication
- [ ] Transaction CRUD operations work

### Security
- [ ] `.env` files not committed to Git
- [ ] `.gitignore` properly configured
- [ ] `DEBUG=False` in production Django
- [ ] Strong SECRET_KEY generated
- [ ] CORS_ALLOWED_ORIGINS set correctly

### Configuration
- [ ] Frontend environment variables set in Vercel
- [ ] Backend environment variables set in Render
- [ ] Database migrations run successfully
- [ ] Static files collected

### Testing
- [ ] Test user registration
- [ ] Test user login
- [ ] Test API calls from frontend
- [ ] Test logout
- [ ] Check browser console for errors
- [ ] Check server logs for errors

## 🚀 Deployment Steps

### 1. Frontend (Vercel)
```
1. Commit all changes: git add -A && git commit -m "message"
2. Push to GitHub: git push origin main
3. Vercel auto-deploys on push
4. Check deployment logs in Vercel dashboard
5. Visit your-app.vercel.app
```

### 2. Backend (Render)
```
1. Connect GitHub repository to Render
2. Set environment variables in Render dashboard
3. Click Deploy
4. Wait for migrations to complete
5. Test API at your-backend.onrender.com/api/
```

## ✨ Post-Deployment Verification

### Frontend
- [ ] Visit frontend URL
- [ ] Navigate to /login (should work)
- [ ] Navigate to /register (should work)
- [ ] Check browser console for errors
- [ ] Verify Network tab shows API calls going to correct backend

### Backend
- [ ] Visit `/api/` endpoint
- [ ] Check API documentation
- [ ] Test login endpoint with curl:
  ```bash
  curl -X POST https://your-backend.com/api/auth/login/ \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"password123"}'
  ```

### Integration
- [ ] Register a new account on Vercel frontend
- [ ] Login with credentials
- [ ] View Dashboard
- [ ] Create a budget
- [ ] Add a transaction
- [ ] Check Reports

## 📞 Support & Troubleshooting

If deployment fails:
1. Check deployment logs in Vercel/Render dashboard
2. Verify all environment variables are set
3. Test locally: `npm run dev` (frontend) and `python manage.py runserver` (backend)
4. Check Git history for recent changes
5. Review error messages carefully

For 5xx errors on backend:
- Check Render logs
- Verify database connection
- Run migrations: `python manage.py migrate`
- Check SECRET_KEY is set

For frontend not connecting to backend:
- Verify VITE_API_URL is correct
- Check CORS_ALLOWED_ORIGINS in Django settings
- Ensure Authorization header is sent with requests
