import React, { useState, useEffect } from 'react';
import { reportsAPI } from '../services/api';
import { formatCurrency, getCurrency } from '../utils/currency';

export default function Reports() {
  const [currency, setCurrency] = useState(getCurrency());
  const [overview, setOverview] = useState(null);
  const [spendingBreakdown, setSpendingBreakdown] = useState([]);
  const [spendingTrend, setSpendingTrend] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('30days');

  const CATEGORY_CHOICES = {
    'food': 'Food & Groceries',
    'transport': 'Transport',
    'entertainment': 'Entertainment',
    'utilities': 'Utilities',
    'education': 'Education',
    'health': 'Health & Medical',
    'shopping': 'Shopping',
    'other': 'Other',
  };

  const CATEGORY_COLORS = {
    'food': 'bg-orange-100 text-orange-600',
    'transport': 'bg-purple-100 text-purple-600',
    'entertainment': 'bg-pink-100 text-pink-600',
    'utilities': 'bg-blue-100 text-blue-600',
    'education': 'bg-green-100 text-green-600',
    'health': 'bg-red-100 text-red-600',
    'shopping': 'bg-yellow-100 text-yellow-600',
    'other': 'bg-gray-100 text-gray-600',
  };

  // Listen for currency changes
  useEffect(() => {
    const handleStorageChange = () => {
      setCurrency(getCurrency());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [overviewResult, breakdownResult, trendResult, transactionsResult] = await Promise.all([
          reportsAPI.getOverview(),
          reportsAPI.getSpendingBreakdown(),
          reportsAPI.getSpendingTrend(),
          reportsAPI.getRecentTransactions(10),
        ]);

        if (overviewResult.success) {
          setOverview(overviewResult.data);
        } else {
          setError('Failed to load overview');
        }

        if (breakdownResult.success && Array.isArray(breakdownResult.data)) {
          setSpendingBreakdown(breakdownResult.data);
        }

        if (trendResult.success && Array.isArray(trendResult.data)) {
          setSpendingTrend(trendResult.data);
        }

        if (transactionsResult.success && Array.isArray(transactionsResult.data)) {
          setRecentTransactions(transactionsResult.data);
        }
      } catch (err) {
        console.error('Error fetching report data:', err);
        setError('Error loading financial reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  if (loading) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-600 dark:text-gray-300">Loading financial reports...</p>
        </div>
      </main>
    );
  }

  const totalSpent = overview ? parseFloat(overview.this_month_spending) : 0;
  const totalIncome = overview ? parseFloat(overview.total_income) : 0;
  const netBalance = overview ? parseFloat(overview.net_balance) : 0;
  const avgDailySpend = totalSpent > 0 ? (totalSpent / 30).toFixed(2) : 0;

  // Find biggest expense category
  const biggestCategory = spendingBreakdown.length > 0 
    ? spendingBreakdown.reduce((max, cat) => 
        parseFloat(cat.amount) > parseFloat(max.amount) ? cat : max
      )
    : null;

  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Heading & Actions */}
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-text-light-headings dark:text-white text-3xl font-bold">Financial Reports</p>
            <p className="text-text-light-body dark:text-text-dark-body text-base">An overview of your spending patterns and financial health.</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button 
              onClick={() => setPeriod('30days')}
              className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg px-3 ${
                period === '30days'
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <p className="text-sm font-medium">Last 30 Days</p>
            </button>
            
          </div>
        </div>

        {error && (
          <div className="bg-yellow-50 dark:bg-yellow-500/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-500/50">
            <p className="text-yellow-700 dark:text-yellow-300">⚠️ {error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Total Spent</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalSpent, currency)}</p>
            <p className="text-red-500 text-sm font-medium flex items-center gap-1">📊 This month</p>
          </div>

          <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Total Income</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalIncome, currency)}</p>
            <p className="text-green-500 text-sm font-medium flex items-center gap-1">💰 All time</p>
          </div>

          <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Biggest Expense</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white truncate">
              {biggestCategory ? CATEGORY_CHOICES[biggestCategory.category] || biggestCategory.category : 'N/A'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              {formatCurrency(biggestCategory ? parseFloat(biggestCategory.amount) : 0, currency)}
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Avg. Daily Spend</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(avgDailySpend, currency)}</p>
            <p className="text-green-500 text-sm font-medium flex items-center gap-1">📉 Per day</p>
          </div>
        </div>

        {/* Charts & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Spending Breakdown (Category Pie Chart) */}
          <div className="flex flex-col gap-4 rounded-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">Spending by Category</p>
            <div className="space-y-3">
              {spendingBreakdown.slice(0, 5).map((item) => {
                const categoryName = CATEGORY_CHOICES[item.category] || item.category;
                const colorClass = CATEGORY_COLORS[item.category] || 'bg-gray-100 text-gray-600';
                return (
                  <div key={item.category} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{categoryName}</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">${parseFloat(item.amount).toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-end">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{item.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Spending Trend */}
          <div className="lg:col-span-2 flex flex-col gap-4 rounded-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">Spending Over Time (Last 30 Days)</p>
            <div className="flex min-h-[260px] items-end justify-around gap-2 px-2">
              {spendingTrend.length > 0 ? (
                spendingTrend.map((item, index) => {
                  const maxAmount = Math.max(...spendingTrend.map(t => parseFloat(t.amount)));
                  const height = (parseFloat(item.amount) / maxAmount) * 200;
                  const date = new Date(item.date);
                  return (
                    <div key={index} className="flex flex-col items-center gap-2 flex-1">
                      <div
                        className="w-full bg-blue-500 rounded-t"
                        style={{ height: `${height}px`, minHeight: '4px' }}
                        title={`$${parseFloat(item.amount).toFixed(2)}`}
                      ></div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{date.getDate()}</p>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No spending data available</p>
              )}
            </div>
          </div>
        </div>

        {/* AI-Powered Insights */}
        <div className="flex flex-col gap-4 rounded-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Insights</h3>
          <div className="flex flex-col gap-4">
            {spendingBreakdown.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-full mt-1">📊</div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Your biggest expense this month is <strong>{CATEGORY_CHOICES[biggestCategory?.category] || 'groceries'}</strong> at <strong>{formatCurrency(parseFloat(biggestCategory?.amount || 0), currency)}</strong> ({biggestCategory?.percentage.toFixed(1)}% of total).
                </p>
              </div>
            )}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-500/20 rounded-full mt-1">✅</div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                You're tracking <strong>{spendingBreakdown.length} spending categories</strong> this month. Keep it up!
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-full mt-1">💡</div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Your average daily spend is <strong>{formatCurrency(avgDailySpend, currency)}</strong>. This helps you stay on track with your budget.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction) => {
                    const categoryName = CATEGORY_CHOICES[transaction.category] || transaction.category;
                    const colorClass = CATEGORY_COLORS[transaction.category] || 'bg-gray-100 text-gray-600';
                    return (
                      <tr key={transaction.id} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {new Date(transaction.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{transaction.description}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${colorClass}`}>
                            {categoryName}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(parseFloat(transaction.amount), currency)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
