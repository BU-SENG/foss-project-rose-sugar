import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Plus } from "lucide-react";

export default function Dashboard() {
  const [currentMonth] = useState(2850.5);
  const [totalIncome] = useState(5200.0);
  const [totalExpenses] = useState(3450.0);
  const [netBalance] = useState(1750.0);
  const [budgetPercentage] = useState(65);
  const [totalBudget] = useState(4000.0);
  const [totalSpent] = useState(2600.0);

  const categoryEmojis = {
    food: "🍴",
    transport: "🚗",
    entertainment: "🎭",
    utilities: "💡",
    education: "📚",
    health: "⚕️",
    shopping: "🛍️",
    other: "📌",
  };

  const breakdown = [
    { category: "shopping", percentage: 35.2 },
    { category: "food", percentage: 28.5 },
    { category: "entertainment", percentage: 18.3 },
    { category: "utilities", percentage: 12.1 },
    { category: "transport", percentage: 5.9 },
  ];

  const recentTransactions = [
    {
      id: 1,
      description: "Grocery Store",
      category: "food",
      amount: 85.5,
      type: "expense",
      date: "2024-01-15",
    },
    {
      id: 2,
      description: "Salary Deposit",
      category: "other",
      amount: 2500,
      type: "income",
      date: "2024-01-14",
    },
    {
      id: 3,
      description: "Movie Tickets",
      category: "entertainment",
      amount: 32.0,
      type: "expense",
      date: "2024-01-13",
    },
    {
      id: 4,
      description: "Gas Station",
      category: "transport",
      amount: 45.2,
      type: "expense",
      date: "2024-01-12",
    },
    {
      id: 5,
      description: "Online Shopping",
      category: "shopping",
      amount: 125.75,
      type: "expense",
      date: "2024-01-11",
    },
  ];

  const chartColors = [
    "#10b981",
    "#f59e0b",
    "#3b82f6",
    "#8b5cf6",
    "#ef4444",
    "#06b6d4",
  ];

  const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 md:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex-1">
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">
              Welcome back
            </p>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Hey, Alex! 👋
            </h1>
            <p className="text-slate-400 text-base mt-2">
              Here's your financial snapshot for this month
            </p>
          </div>
          <button className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 hover:-translate-y-0.5">
            <span className="text-lg">➕</span>
            <span>Add Expense</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="group relative p-6 rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-800/30 border border-slate-700/50 backdrop-blur-xl hover:border-slate-600/50 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:to-emerald-500/10 transition-all duration-300 pointer-events-none"></div>
            <p className="text-slate-400 text-sm font-medium mb-2">
              Total Income
            </p>
            <p className="text-3xl font-black text-emerald-400">
              {formatCurrency(totalIncome)}
            </p>
          </div>

          <div className="group relative p-6 rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-800/30 border border-slate-700/50 backdrop-blur-xl hover:border-slate-600/50 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-500/0 to-red-500/0 group-hover:from-red-500/5 group-hover:to-red-500/10 transition-all duration-300 pointer-events-none"></div>
            <p className="text-slate-400 text-sm font-medium mb-2">
              Total Expenses
            </p>
            <p className="text-3xl font-black text-red-400">
              {formatCurrency(totalExpenses)}
            </p>
          </div>

          <div className="group relative p-6 rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-800/30 border border-slate-700/50 backdrop-blur-xl hover:border-slate-600/50 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/10 transition-all duration-300 pointer-events-none"></div>
            <p className="text-slate-400 text-sm font-medium mb-2">
              Net Balance
            </p>
            <p className="text-3xl font-black text-blue-400">
              {formatCurrency(netBalance)}
            </p>
          </div>

          <div className="group relative p-6 rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-800/30 border border-slate-700/50 backdrop-blur-xl hover:border-slate-600/50 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-purple-500/10 transition-all duration-300 pointer-events-none"></div>
            <p className="text-slate-400 text-sm font-medium mb-2">
              Budget Progress
            </p>
            <p className="text-3xl font-black text-purple-400">
              {budgetPercentage}%
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Budget Card */}
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 backdrop-blur-xl overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">
                      Monthly Budget
                    </p>
                    <p className="text-3xl font-black text-white">
                      {formatCurrency(totalSpent)}
                    </p>
                  </div>
                  <p className="text-slate-400 text-sm">
                    of {formatCurrency(totalBudget)}
                  </p>
                </div>

                <div className="relative w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <p className="text-slate-400 text-sm">
                    {formatCurrency(totalBudget - totalSpent)} remaining
                  </p>
                  <p className="text-sm font-semibold text-emerald-400">
                    ✓ On track
                  </p>
                </div>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Spending Breakdown */}
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 backdrop-blur-xl overflow-hidden">
                <div className="absolute -top-16 -left-16 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10">
                  <p className="text-slate-400 text-sm font-medium mb-1">
                    Spending Breakdown
                  </p>
                  <p className="text-3xl font-black text-white mb-4">
                    {formatCurrency(currentMonth)}
                  </p>

                  <div className="space-y-3">
                    {breakdown.map((item, idx) => (
                      <div
                        key={idx}
                        className="group flex items-center justify-between p-3 rounded-lg bg-slate-700/20 hover:bg-slate-700/40 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full ring-2 ring-offset-2 ring-offset-slate-800"
                            style={{
                              backgroundColor:
                                chartColors[idx % chartColors.length],
                              borderColor: "transparent",
                            }}
                          ></div>
                          <p className="text-slate-300 text-sm font-medium capitalize group-hover:text-white transition-colors">
                            {item.category}
                          </p>
                        </div>
                        <p className="text-slate-200 text-sm font-bold">
                          {item.percentage?.toFixed(1)}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Balance Summary */}
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 backdrop-blur-xl overflow-hidden">
                <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10">
                  <p className="text-slate-400 text-sm font-medium mb-6">
                    Balance Summary
                  </p>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-slate-300 text-sm">
                        Total Income
                      </span>
                      <p className="text-emerald-400 font-bold">
                        {formatCurrency(totalIncome)}
                      </p>
                    </div>

                    <div className="flex justify-between items-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <span className="text-slate-300 text-sm">
                        Total Expenses
                      </span>
                      <p className="text-red-400 font-bold">
                        {formatCurrency(totalExpenses)}
                      </p>
                    </div>

                    <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                      <span className="text-slate-200 text-sm font-medium">
                        Net Balance
                      </span>
                      <p className="text-blue-300 font-bold">
                        {formatCurrency(netBalance)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="relative p-6 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 backdrop-blur-xl overflow-hidden h-fit">
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <h2 className="text-lg font-black text-white mb-6">
                Recent Activity
              </h2>

              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="group flex items-center justify-between p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-700/60 group-hover:bg-slate-600 transition-colors flex-shrink-0">
                        <span className="text-lg">
                          {categoryEmojis[transaction.category] || "📌"}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-white truncate">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`font-bold text-sm ml-2 flex-shrink-0 ${
                        transaction.type === "income"
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(Math.abs(transaction.amount)).substring(
                        1
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
