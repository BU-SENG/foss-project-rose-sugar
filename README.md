[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/tfYzIujW)

# Student Budget Tracker

A full-stack student budgeting application with a React frontend and Django backend, designed to help students manage expenses, track budgets, and gain financial insights.

## 📁 Project Structure

```
foss-project-rose-sugar/
├── my-app/              # React + Vite frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── backend/             # Django REST API
│   ├── api/             # Core API app
│   ├── backend/         # Django project settings
│   ├── manage.py
│   └── requirements.txt
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.10+** (for backend)
- **Node.js 16+** (for frontend)
- **Git**

### Clone the Repository

```bash
git clone https://github.com/BU-SENG/foss-project-rose-sugar.git
cd foss-project-rose-sugar
```

### Backend Setup (Django)

Navigate to the backend directory and set up a Python virtual environment:

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations (initializes database)
python manage.py migrate

# Create superuser (for admin access at /admin/)
python manage.py createsuperuser
# Follow the prompts to create an admin account

# Start development server
python manage.py runserver
```

Backend runs at **http://localhost:8000**

#### Django Project Structure

```
backend/
├── manage.py              # Django management CLI
├── requirements.txt       # Python dependencies
├── db.sqlite3            # Development database
├── backend/              # Project settings package
│   ├── settings.py       # Django configuration
│   ├── urls.py           # URL routing
│   ├── asgi.py           # ASGI server config
│   └── wsgi.py           # WSGI server config
├── api/                  # Core API application
│   ├── models.py         # Database models (Transaction, Budget, Expense)
│   ├── serializers.py    # DRF serializers
│   ├── views.py          # API views (add your viewsets here)
│   ├── urls.py           # API URL patterns
│   ├── admin.py          # Admin interface registration
│   └── migrations/       # Database migrations
└── venv/                 # Python virtual environment
```

#### Useful Django Commands

```bash
# Apply pending migrations
python manage.py migrate

# Create new migrations from model changes
python manage.py makemigrations

# Check migrations status
python manage.py showmigrations

# Create a superuser
python manage.py createsuperuser

# Access Django admin shell
python manage.py shell

# Clear cache
python manage.py clear_cache

# Run tests
python manage.py test

# Collect static files (for production)
python manage.py collectstatic
```

#### Django API Configuration

The Django backend is pre-configured with:
- **REST Framework**: DRF with JWT authentication
- **CORS**: Enabled for frontend at `http://localhost:5173`
- **Database**: SQLite (production: PostgreSQL recommended)
- **Authentication**: JWT tokens + session auth

Edit `backend/settings.py` to customize:
- `INSTALLED_APPS`: Registered Django apps
- `DATABASES`: Database configuration
- `REST_FRAMEWORK`: DRF settings (pagination, auth, permissions)
- `SIMPLE_JWT`: JWT token configuration
- `CORS_ALLOWED_ORIGINS`: Allowed frontend URLs

### Frontend Setup

Navigate to the frontend directory:

```bash
cd my-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at **http://localhost:5173**

## 📚 Features

### Frontend (React + Vite)
- ✅ Dark mode support
- ✅ Dashboard with budget overview
- ✅ Transaction tracking with filtering
- ✅ Budget management by category
- ✅ Financial reports and insights
- ✅ Add expense interface
- ✅ User authentication (Login/Register)
- ✅ Responsive design (mobile & desktop)

### Backend (Django REST)
- ✅ User authentication with JWT tokens
- ✅ Transaction CRUD operations
- ✅ Budget tracking per category
- ✅ Expense logging
- ✅ Dashboard API with spending analytics
- ✅ CORS support for frontend
- ✅ Admin interface for data management

## 🔧 Configuration

### Environment Variables

#### Backend (`.env` in `backend/`)

```bash
DJANGO_SECRET_KEY=your-secret-key-here
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
```

#### Frontend (`.env.local` in `my-app/`)

```bash
VITE_DJANGO_BACKEND=true
VITE_API_URL=http://localhost:8000/api
```

## 📝 API Endpoints

All endpoints are prefixed with `/api/`.

### Authentication
- `POST /auth/login/` - User login (returns JWT tokens)
- `POST /auth/register/` - User registration
- `POST /auth/logout/` - User logout
- `POST /auth/token/refresh/` - Refresh JWT token

### Dashboard
- `GET /dashboard/overview/` - Budget & spending overview
- `GET /dashboard/spending-breakdown/` - Spending by category
- `GET /dashboard/spending-trend/` - Spending over time

### Transactions
- `GET /transactions/` - List transactions (supports filtering)
- `POST /transactions/` - Create transaction
- `PUT /transactions/{id}/` - Update transaction
- `DELETE /transactions/{id}/` - Delete transaction

### Budgets
- `GET /budgets/` - List budgets
- `POST /budgets/` - Create budget
- `PUT /budgets/{id}/` - Update budget
- `DELETE /budgets/{id}/` - Delete budget

## 🤝 Contributing

### Getting Started

1. **Fork the repository** (if applicable)
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** and test thoroughly
4. **Commit with clear messages**: `git commit -m "Add: description of changes"`
5. **Push to your branch**: `git push origin feature/your-feature-name`
6. **Open a pull request** with a description of your changes

### Development Workflow

#### Frontend Development
```bash
cd my-app
npm run dev                 # Start dev server
npm run build              # Build for production
npm run lint               # Check code style
```

#### Backend Development
```bash
cd backend
source venv/bin/activate   # Activate venv

python manage.py runserver # Start dev server
python manage.py migrate   # Apply migrations
python manage.py makemigrations  # Create migrations
python manage.py test      # Run tests
```

### Code Style

- **Frontend**: Follow React and Tailwind CSS conventions
- **Backend**: Follow PEP 8 Python standards
- Use meaningful commit messages
- Add comments for complex logic

### Testing

```bash
# Backend
cd backend
python manage.py test

# Frontend
cd my-app
npm run test  # (when testing is configured)
```

## 🐛 Reporting Issues

If you find a bug or have a suggestion:
1. Check the **Issues** section to see if it's already reported
2. If not, create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Screenshots (if applicable)
   - Environment details (OS, browser, Python/Node version)

## 📖 Documentation

- **Frontend**: See `my-app/` folder for UI structure and component documentation
- **Backend**: See `backend/DJANGO_QUICK_START.md` for API setup details
- **Integration**: See `my-app/INTEGRATION_COMPLETE.md` for frontend-backend integration flow

## 🔐 Security

- Never commit `.env` files with real secrets
- Use `django-cors-headers` to restrict API access
- Enable HTTPS in production
- Use strong SECRET_KEY in production
- Validate all user inputs

## 📦 Deployment

### Backend Deployment (Example: Heroku)

```bash
# Set environment variables in your deployment platform
# Push code to deploy
git push heroku main
```

### Frontend Deployment (Example: Vercel)

```bash
cd my-app
npm run build
# Deploy the `dist/` folder to your hosting service
```

## 📞 Support

- **Questions?** Open a discussion or issue
- **Need help?** Check existing documentation in the project
- **Found a security issue?** Please report it responsibly

## 📄 License

This project is part of an academic course and follows the repository's license terms.

## 👥 Contributors

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Django, Django REST Framework, SimpleJWT
- **Design**: Dark mode UI/UX, responsive layouts

---

**Happy coding! 🚀 Feel free to contribute and make this project better.**

