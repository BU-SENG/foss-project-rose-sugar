import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import AddExpense from './pages/AddExpense';

function AppLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';

  if (isLoginPage || isRegisterPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  return (
    <div className="dark">
      <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display text-[#111827] dark:text-white">
        {/* Sidebar Navigation */}
        <aside className="w-64 flex-shrink-0 bg-[#fdfdff] dark:bg-[#111b22] p-4 flex flex-col justify-between shadow-sm">
          <div className="flex flex-col gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3 p-2">
              <span className="text-primary text-3xl">💼</span>
              <h1 className="text-xl font-bold text-[#111827] dark:text-white">FinStudent</h1>
            </div>

            {/* User Profile */}
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex gap-3 items-center">
                <img
                  src="https://ui-avatars.com/api/?name=Alex+Doe&background=1392ec&color=fff"
                  alt="User profile"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex flex-col">
                  <h1 className="text-[#111827] dark:text-white text-base font-medium">Alex Doe</h1>
                  <p className="text-[#6b7280] dark:text-[#92b2c9] text-sm">alex.doe@university.edu</p>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-2 mt-4">
                <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-500/30 transition">
                  <span>📊</span>
                  <p className="text-sm font-medium">Dashboard</p>
                </Link>
                <Link to="/transactions" className="flex items-center gap-3 px-3 py-2 text-[#4b5563] dark:text-[#92b2c9] hover:bg-gray-100 dark:hover:bg-[#233948] rounded-lg transition">
                  <span>📋</span>
                  <p className="text-sm font-medium">Transactions</p>
                </Link>
                <Link to="/reports" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${location.pathname === '/reports' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'text-[#4b5563] dark:text-[#92b2c9] hover:bg-gray-100 dark:hover:bg-[#233948]'}`}>
                  <span>📈</span>
                  <p className="text-sm font-medium">Reports</p>
                </Link>
                <Link to="/budgets" className="flex items-center gap-3 px-3 py-2 text-[#4b5563] dark:text-[#92b2c9] hover:bg-gray-100 dark:hover:bg-[#233948] rounded-lg transition">
                  <span>💳</span>
                  <p className="text-sm font-medium">Budgets</p>
                </Link>
                <Link to="/add-expense" className="flex items-center gap-3 px-3 py-2 text-[#4b5563] dark:text-[#92b2c9] hover:bg-gray-100 dark:hover:bg-[#233948] rounded-lg transition">
                  <span>💳</span>
                  <p className="text-sm font-medium">Add Expense</p>
                </Link>
                <Link to="/settings" className="flex items-center gap-3 px-3 py-2 text-[#4b5563] dark:text-[#92b2c9] hover:bg-gray-100 dark:hover:bg-[#233948] rounded-lg transition">
                  <span>⚙️</span>
                  <p className="text-sm font-medium">Settings</p>
                </Link>
              </nav>
            </div>
          </div>

          {/* Logout */}
          <div className="flex flex-col gap-1">
            <Link to="/add-expense" className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition mb-2">
              <span className="truncate">➕ Log Expense</span>
            </Link>
            <Link to="/login" className="flex items-center gap-3 px-3 py-2 text-[#4b5563] dark:text-[#92b2c9] hover:bg-gray-100 dark:hover:bg-[#233948] rounded-lg transition">
              <span>🚪</span>
              <p className="text-sm font-medium">Log Out</p>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/add-expense" element={<AddExpense />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
          </main>
        </div>
      </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
