import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI, transactionsAPI } from '../services/api';
import { formatCurrency, getCurrency } from '../utils/currency';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currency, setCurrency] = useState(getCurrency());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overview, setOverview] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);

  // Listen for currency changes
  useEffect(() => {
    const handleStorageChange = () => {
      setCurrency(getCurrency());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all dashboard data in parallel
        const [overviewRes, breakdownRes, transactionsRes] = await Promise.all([
          dashboardAPI.getOverview(),
          dashboardAPI.getSpendingBreakdown(),
          transactionsAPI.getAll({ limit: 10 }),
        ]);

        if (overviewRes.success) {
          setOverview(overviewRes.data);
        }

        if (breakdownRes.success) {
          setBreakdown(breakdownRes.data);
        }

        if (transactionsRes.success) {
          const transactions = Array.isArray(transactionsRes.data) 
            ? transactionsRes.data 
            : transactionsRes.data.results || [];
          setRecentTransactions(transactions.slice(0, 5));
        }
      } catch (err) {
        console.error('Error fetching dashboard:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <p className="text-gray-500 dark:text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  const categoryEmojis = {
    food: '🍴',
    transport: '🚗',
    entertainment: '🎭',
    utilities: '💡',
    education: '📚',
    health: '⚕️',
    shopping: '🛍️',
    other: '📌',
  };

  const currentMonth = overview?.this_month_spending ? parseFloat(overview.this_month_spending) : 0;
  const totalIncome = overview?.total_income ? parseFloat(overview.total_income) : 0;
  const totalExpenses = overview?.total_expenses ? parseFloat(overview.total_expenses) : 0;
  const netBalance = overview?.net_balance ? parseFloat(overview.net_balance) : 0;

  // Calculate budget progress
  const budgetProgress = overview?.budget_progress || [];
  const totalBudget = budgetProgress.reduce((sum, bp) => sum + parseFloat(bp.limit || 0), 0) || 1;
  const totalSpent = budgetProgress.reduce((sum, bp) => sum + parseFloat(bp.spent || 0), 0) || 0;
  const budgetPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  return (
    <div className="p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Page Heading */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div className="flex flex-col gap-1">
            <p className="text-[#111827] dark:text-white text-4xl font-black">
              Hello, {user?.first_name || 'User'}!
            </p>
            <p className="text-[#6b7280] dark:text-[#92b2c9] text-base">Here's your financial overview for this month.</p>
          </div>
          <button
            onClick={() => navigate('/add-expense')}
            className="flex items-center justify-center rounded-lg h-10 px-4 bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 transition-colors"
          >
            <span className="mr-2">➕</span>
            <span>Add Expense</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/20 border border-red-200 dark:border-red-500 rounded-lg">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Monthly Budget Card */}
            <div className="bg-[#fdfdff] dark:bg-[#111b22] rounded-xl p-6 shadow-sm">
              <div className="flex gap-6 justify-between items-center">
                <p className="text-[#111827] dark:text-white text-lg font-bold">Monthly Budget</p>
                <p className="text-[#111827] dark:text-white text-lg font-bold">
                  {formatCurrency(totalSpent, currency)} / {formatCurrency(totalBudget, currency)}
                </p>
              </div>
              <div className="mt-4">
                <div className="w-full bg-[#e5e7eb] dark:bg-[#325167] rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all ${
                      budgetPercentage > 100 ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-[#6b7280] dark:text-[#92b2c9] text-sm mt-2">
                {formatCurrency(Math.max(0, totalBudget - totalSpent), currency)} remaining
              </p>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Spending Breakdown Card */}
              <div className="bg-[#fdfdff] dark:bg-[#111b22] rounded-xl p-6 shadow-sm">
                <div className="flex flex-col gap-4 h-full">
                  <div>
                    <p className="text-[#111827] dark:text-white text-base font-medium">Spending Breakdown</p>
                    <p className="text-[#111827] dark:text-white text-3xl font-bold">{formatCurrency(currentMonth, currency)}</p>
                    <div className="flex gap-1 mt-2">
                      <p className="text-[#6b7280] dark:text-[#92b2c9] text-sm">This Month</p>
                    </div>
                  </div>
                  <div className="flex-grow flex flex-col gap-3">
                    {breakdown && breakdown.length > 0 ? (
                      breakdown.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ 
                              backgroundColor: ['#4ade80', '#facc15', '#60a5fa', '#c084fc', '#f87171'][idx % 5]
                            }}></span>
                            <p className="text-[#4b5563] dark:text-[#92b2c9] text-sm capitalize">
                              {item.category}
                            </p>
                          </div>
                          <p className="text-[#111827] dark:text-white text-sm font-medium">
                            {item.percentage?.toFixed(1)}%
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-[#6b7280] dark:text-[#92b2c9] text-sm">No spending data yet</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Balance Summary Card */}
              <div className="bg-[#fdfdff] dark:bg-[#111b22] rounded-xl p-6 shadow-sm">
                <div className="flex flex-col h-full justify-between gap-4">
                  <div>
                    <p className="text-[#111827] dark:text-white text-base font-medium">Balance Summary</p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[#6b7280] dark:text-[#92b2c9] text-sm">Total Income</span>
                      <p className="text-[#111827] dark:text-white font-bold text-lg">{formatCurrency(totalIncome, currency)}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#6b7280] dark:text-[#92b2c9] text-sm">Total Expenses</span>
                      <p className="text-red-500 font-bold text-lg">{formatCurrency(totalExpenses, currency)}</p>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between items-center">
                      <span className="text-[#111827] dark:text-white text-sm font-medium">Net Balance</span>
                      <p className={`font-bold text-lg ${netBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {formatCurrency(netBalance, currency)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Recent Activity Card */}
            <div className="bg-[#fdfdff] dark:bg-[#111b22] rounded-xl p-6 shadow-sm">
              <h2 className="text-[#111827] dark:text-white text-lg font-bold mb-4">Recent Activity</h2>
              <div className="flex flex-col gap-4">
                {recentTransactions && recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                          <span className="text-lg">
                            {categoryEmojis[transaction.category] || '📌'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm text-[#111827] dark:text-white">
                            {transaction.description || transaction.category}
                          </p>
                          <p className="text-xs text-[#6b7280] dark:text-[#92b2c9]">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className={`font-bold text-sm ${
                        transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(parseFloat(transaction.amount)), currency).substring(1)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-[#6b7280] dark:text-[#92b2c9] text-sm">No transactions yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
