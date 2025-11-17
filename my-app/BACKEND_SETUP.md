# Student Budget Tracker - Frontend

A modern React-based student budget tracking application with dark mode support, built with Vite and Tailwind CSS.

## Project Structure

```
src/
├── pages/          # Page components (Dashboard, Transactions, Budgets, Reports, etc.)
├── services/       # API service layer for backend integration
├── context/        # React Context providers (AuthContext)
├── App.jsx         # Main app component with routing
└── main.jsx        # Entry point
```

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd my-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file from the template:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your backend API URL:
```
VITE_API_URL=http://localhost:3000/api
```

### Running the Application

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

## Backend Integration

The frontend is designed to work with a Node.js/Express backend. The API service layer (`src/services/api.js`) handles all HTTP requests.

### Expected Backend Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

#### Dashboard
- `GET /api/dashboard/overview` - Get dashboard overview data
- `GET /api/dashboard/spending-breakdown` - Get spending by category
- `GET /api/dashboard/spending-trend` - Get spending trends over time
- `GET /api/dashboard/suggestions` - Get AI-powered suggestions
- `GET /api/dashboard/recent-transactions` - Get recent transactions

#### Transactions
- `GET /api/transactions` - List all transactions (supports filters)
- `POST /api/transactions` - Create a new transaction
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Delete a transaction

#### Budgets
- `GET /api/budgets` - List all budgets
- `GET /api/budgets/:id` - Get a specific budget
- `POST /api/budgets` - Create a new budget
- `PUT /api/budgets/:id` - Update a budget
- `DELETE /api/budgets/:id` - Delete a budget

#### Expenses
- `POST /api/expenses` - Create a new expense
- `GET /api/expenses/categories` - Get available expense categories

#### Reports
- `GET /api/reports/overview?period=30days` - Get report overview
- `GET /api/reports/spending-over-time?period=30days` - Get spending trends
- `GET /api/reports/insights` - Get AI insights
- `GET /api/reports/transactions?limit=5` - Get recent transactions

### Response Format

All API responses should follow this format:

```json
{
  "success": true,
  "data": { /* endpoint-specific data */ },
  "message": "Optional message"
}
```

Errors:
```json
{
  "success": false,
  "error": "Error message",
  "message": "Error description"
}
```

## Using the API Service

### Example: Fetching Dashboard Data

```javascript
import { dashboardAPI } from '../services/api';

const result = await dashboardAPI.getOverview();
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}
```

### Adding Auth Token to Requests

Update `src/services/api.js` to include auth headers:

```javascript
const token = localStorage.getItem('auth_token');
if (token) {
  headers['Authorization'] = `Bearer ${token}`;
}
```

## Features

- 📊 Dashboard with spending overview
- 📋 Transaction tracking with filtering
- 💳 Budget management
- 📈 Financial reports with insights
- 🌙 Dark mode support
- 📱 Responsive design
- ➕ Expense logging

## Environment Variables

- `VITE_API_URL` - Backend API base URL (default: `http://localhost:3000/api`)
- `VITE_DEBUG` - Enable debug logging (default: `false`)

## Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

## Technologies

- React 18
- React Router v6
- Tailwind CSS
- Vite
- Lexend Font Family

## Notes

- The frontend falls back to mock data if the backend is unavailable
- All pages include loading and error states
- Auth context is available for managing user sessions
- CORS should be properly configured on the backend

## License

MIT
