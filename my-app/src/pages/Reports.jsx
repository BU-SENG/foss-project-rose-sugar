import { useState } from "react";
import { BarChart3, TrendingUp, PieChart, AlertCircle } from "lucide-react";

export default function Reports() {
  const [period, setPeriod] = useState("30days");

  const formatCurrency = (amount) => `$${parseFloat(amount).toFixed(2)}`;

  const CATEGORY_CHOICES = {
    food: "Food & Groceries",
    transport: "Transport",
    entertainment: "Entertainment",
    utilities: "Utilities",
    education: "Education",
    health: "Health & Medical",
    shopping: "Shopping",
    other: "Other",
  };

  // Mock data
  const overview = {
    this_month_spending: 2850.5,
    total_income: 5200.0,
    net_balance: 1750.0,
  };

  const spendingBreakdown = [
    { category: "food", amount: 680.5, percentage: 23.8 },
    { category: "shopping", amount: 520.0, percentage: 18.2 },
    { category: "entertainment", amount: 450.75, percentage: 15.8 },
    { category: "utilities", amount: 380.0, percentage: 13.3 },
    { category: "transport", amount: 350.0, percentage: 12.3 },
    { category: "health", amount: 250.0, percentage: 8.8 },
    { category: "education", amount: 150.0, percentage: 5.3 },
    { category: "other", amount: 68.25, percentage: 2.4 },
  ];

  const spendingTrend = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
    amount: (Math.random() * 150 + 80).toFixed(2),
  }));

  const recentTransactions = [
    {
      id: 1,
      date: "2024-01-15",
      description: "Whole Foods Market",
      category: "food",
      amount: 85.5,
    },
    {
      id: 2,
      date: "2024-01-14",
      description: "Salary Deposit",
      category: "other",
      amount: 2500.0,
    },
    {
      id: 3,
      date: "2024-01-13",
      description: "AMC Theaters",
      category: "entertainment",
      amount: 32.0,
    },
    {
      id: 4,
      date: "2024-01-12",
      description: "Shell Gas Station",
      category: "transport",
      amount: 45.2,
    },
    {
      id: 5,
      date: "2024-01-11",
      description: "Amazon",
      category: "shopping",
      amount: 125.75,
    },
    {
      id: 6,
      date: "2024-01-10",
      description: "Spotify Premium",
      category: "entertainment",
      amount: 14.99,
    },
    {
      id: 7,
      date: "2024-01-09",
      description: "CVS Pharmacy",
      category: "health",
      amount: 28.5,
    },
    {
      id: 8,
      date: "2024-01-08",
      description: "Target",
      category: "shopping",
      amount: 67.3,
    },
  ];

  const totalSpent = parseFloat(overview.this_month_spending);
  const totalIncome = parseFloat(overview.total_income);
  const netBalance = parseFloat(overview.net_balance);
  const avgDailySpend = (totalSpent / 30).toFixed(2);
  const biggestCategory = spendingBreakdown[0];

  const CATEGORY_COLORS = {
    food: "from-amber-500 to-orange-500",
    transport: "from-green-500 to-emerald-500",
    entertainment: "from-red-500 to-pink-500",
    utilities: "from-blue-500 to-cyan-500",
    education: "from-purple-500 to-indigo-500",
    health: "from-rose-500 to-pink-500",
    shopping: "from-yellow-500 to-amber-500",
    other: "from-slate-500 to-gray-500",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 md:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Financial Reports
            </h1>
            <p className="text-slate-400">
              Insights into your spending patterns and financial health
            </p>
          </div>

          <button
            onClick={() => setPeriod("30days")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 w-fit"
          >
            Last 30 Days
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Spent */}
          <div className="group relative p-6 rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-800/30 border border-slate-700/50 backdrop-blur-xl hover:border-slate-600/50 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-500/0 to-red-500/0 group-hover:from-red-500/5 group-hover:to-red-500/10 transition-all duration-300 pointer-events-none"></div>
            <p className="text-slate-400 text-sm font-medium mb-2">
              Total Spent
            </p>
            <p className="text-3xl font-black text-red-400 mb-1">
              {formatCurrency(totalSpent)}
            </p>
            <p className="text-xs text-slate-500">This month</p>
          </div>

          {/* Total Income */}
          <div className="group relative p-6 rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-800/30 border border-slate-700/50 backdrop-blur-xl hover:border-slate-600/50 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:to-emerald-500/10 transition-all duration-300 pointer-events-none"></div>
            <p className="text-slate-400 text-sm font-medium mb-2">
              Total Income
            </p>
            <p className="text-3xl font-black text-emerald-400 mb-1">
              {formatCurrency(totalIncome)}
            </p>
            <p className="text-xs text-slate-500">All time</p>
          </div>

          {/* Biggest Expense */}
          <div className="group relative p-6 rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-800/30 border border-slate-700/50 backdrop-blur-xl hover:border-slate-600/50 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-purple-500/10 transition-all duration-300 pointer-events-none"></div>
            <p className="text-slate-400 text-sm font-medium mb-2">
              Top Category
            </p>
            <p className="text-xl font-black text-purple-400 mb-1 truncate">
              {CATEGORY_CHOICES[biggestCategory?.category]}
            </p>
            <p className="text-xs text-slate-500">
              {formatCurrency(biggestCategory?.amount)}
            </p>
          </div>

          {/* Avg Daily Spend */}
          <div className="group relative p-6 rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-800/30 border border-slate-700/50 backdrop-blur-xl hover:border-slate-600/50 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/10 transition-all duration-300 pointer-events-none"></div>
            <p className="text-slate-400 text-sm font-medium mb-2">
              Avg Daily Spend
            </p>
            <p className="text-3xl font-black text-blue-400 mb-1">
              {formatCurrency(avgDailySpend)}
            </p>
            <p className="text-xs text-slate-500">Per day</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Spending Breakdown */}
          <div className="relative p-8 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 backdrop-blur-xl overflow-hidden">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/50">
                <PieChart className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-black text-white">
                  Spending by Category
                </h3>
              </div>

              <div className="space-y-4">
                {spendingBreakdown.slice(0, 6).map((item, idx) => {
                  const categoryName = CATEGORY_CHOICES[item.category];
                  const gradientClass = CATEGORY_COLORS[item.category];
                  return (
                    <div key={item.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className={`w-3 h-3 rounded-full bg-gradient-to-r ${gradientClass}`}
                          ></div>
                          <span className="text-sm font-medium text-slate-300">
                            {categoryName}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-white">
                          {item.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${gradientClass}`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Spending Trend */}
          <div className="lg:col-span-2 relative p-8 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 backdrop-blur-xl overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/50">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-black text-white">
                  Spending Trend (Last 30 Days)
                </h3>
              </div>

              <div className="flex items-end justify-between gap-1 h-48 px-2">
                {spendingTrend.map((item, index) => {
                  const maxAmount = Math.max(
                    ...spendingTrend.map((t) => parseFloat(t.amount))
                  );
                  const height = (parseFloat(item.amount) / maxAmount) * 100;
                  return (
                    <div key={index} className="flex-1 group relative">
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-lg transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/50 group-hover:from-blue-400 group-hover:to-cyan-400 cursor-pointer"
                        style={{ height: `${Math.max(height, 5)}%` }}
                        title={`Day ${index + 1}: ${formatCurrency(
                          item.amount
                        )}`}
                      ></div>
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-slate-500 mt-4 text-center">
                Hover over bars to see daily amounts
              </p>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="relative p-8 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 backdrop-blur-xl overflow-hidden mb-8">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <h3 className="text-lg font-black text-white mb-6 pb-4 border-b border-slate-700/50">
              Key Insights
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Insight 1 */}
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                <div className="flex gap-3">
                  <div className="text-2xl">📊</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300">
                      Your top spending is{" "}
                      <span className="text-purple-300 font-semibold">
                        {CATEGORY_CHOICES[biggestCategory?.category]}
                      </span>{" "}
                      at{" "}
                      <span className="text-purple-300 font-semibold">
                        {biggestCategory?.percentage.toFixed(1)}%
                      </span>{" "}
                      of total
                    </p>
                  </div>
                </div>
              </div>

              {/* Insight 2 */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="flex gap-3">
                  <div className="text-2xl">✅</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300">
                      You're tracking{" "}
                      <span className="text-emerald-300 font-semibold">
                        {spendingBreakdown.length} categories
                      </span>{" "}
                      this month. Great organization!
                    </p>
                  </div>
                </div>
              </div>

              {/* Insight 3 */}
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <div className="flex gap-3">
                  <div className="text-2xl">💡</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300">
                      Daily average of{" "}
                      <span className="text-blue-300 font-semibold">
                        {formatCurrency(avgDailySpend)}
                      </span>{" "}
                      keeps you on track with budget goals
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="relative rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 backdrop-blur-xl overflow-hidden">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/50">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-black text-white">
                Recent Transactions
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((transaction) => {
                    const categoryName = CATEGORY_CHOICES[transaction.category];
                    const gradientClass = CATEGORY_COLORS[transaction.category];
                    return (
                      <tr
                        key={transaction.id}
                        className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
                      >
                        <td className="px-4 py-4 text-slate-300">
                          {new Date(transaction.date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td className="px-4 py-4 font-medium text-white">
                          {transaction.description}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${gradientClass} text-white`}
                          >
                            {categoryName}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right font-bold text-white">
                          {formatCurrency(transaction.amount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
