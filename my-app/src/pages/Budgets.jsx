import { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const CATEGORY_ICONS = {
  food: "🍔",
  transport: "🚗",
  entertainment: "🎬",
  utilities: "⚡",
  education: "📚",
  health: "⚕️",
  shopping: "🛍️",
  other: "📌",
};

const CATEGORY_COLORS = {
  food: "from-amber-500 to-orange-500",
  transport: "from-green-500 to-emerald-500",
  entertainment: "from-red-500 to-pink-500",
  utilities: "from-blue-500 to-cyan-500",
  education: "from-purple-500 to-indigo-500",
  health: "from-pink-500 to-rose-500",
  shopping: "from-yellow-500 to-amber-500",
  other: "from-slate-500 to-gray-500",
};

const CATEGORY_DISPLAY_NAMES = {
  food: "Food & Groceries",
  transport: "Transport",
  entertainment: "Entertainment",
  utilities: "Utilities",
  education: "Education",
  health: "Health & Medical",
  shopping: "Shopping",
  other: "Other",
};

export default function Budgets() {
  const [budgets, setBudgets] = useState([
    { id: 1, category: "food", limit_amount: 400 },
    { id: 2, category: "transport", limit_amount: 200 },
    { id: 3, category: "entertainment", limit_amount: 150 },
  ]);

  const [spendingData] = useState([
    {
      category: "food",
      spending: 320,
      budget_limit: 400,
      percentage: 80,
      over_budget: false,
    },
    {
      category: "transport",
      spending: 210,
      budget_limit: 200,
      percentage: 105,
      over_budget: true,
    },
    {
      category: "entertainment",
      spending: 90,
      budget_limit: 150,
      percentage: 60,
      over_budget: false,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    category: "food",
    limit_amount: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    category: "",
    limit_amount: "",
  });

  const formatCurrency = (amount) => `$${parseFloat(amount).toFixed(2)}`;

  const handleAddClick = () => {
    setShowAddForm(true);
    setFormData({ category: "food", limit_amount: "" });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.limit_amount || parseFloat(formData.limit_amount) <= 0)
      return;

    const newBudget = {
      id: Date.now(),
      category: formData.category,
      limit_amount: parseFloat(formData.limit_amount),
    };

    setBudgets([...budgets, newBudget]);
    setShowAddForm(false);
    setFormData({ category: "food", limit_amount: "" });
  };

  const handleEditBudget = (id) => {
    const budget = budgets.find((b) => b.id === id);
    setEditingId(id);
    setEditFormData({
      category: budget.category,
      limit_amount: String(budget.limit_amount),
    });
  };

  const handleEditFormSubmit = (e) => {
    e.preventDefault();
    setBudgets(
      budgets.map((b) =>
        b.id === editingId
          ? { ...b, limit_amount: parseFloat(editFormData.limit_amount) }
          : b
      )
    );
    setEditingId(null);
  };

  const handleDeleteBudget = (id) => {
    if (confirm("Delete this budget?")) {
      setBudgets(budgets.filter((b) => b.id !== id));
    }
  };

  const totalLimit = budgets.reduce(
    (sum, b) => sum + parseFloat(b.limit_amount || 0),
    0
  );
  const totalSpent = spendingData.reduce(
    (sum, s) => sum + parseFloat(s.spending || 0),
    0
  );
  const remaining = totalLimit - totalSpent;
  const overallPct =
    totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;

  const getInsights = () => {
    const insights = [];
    spendingData.forEach((item) => {
      if (item.over_budget) {
        insights.push({
          type: "danger",
          icon: AlertTriangle,
          message: `Over budget on ${
            CATEGORY_DISPLAY_NAMES[item.category]
          } by ${formatCurrency(Math.abs(item.budget_limit - item.spending))}`,
          color: "red",
        });
      } else if (item.percentage > 75) {
        insights.push({
          type: "warning",
          icon: TrendingUp,
          message: `${CATEGORY_DISPLAY_NAMES[item.category]} is at ${
            item.percentage
          }% of budget`,
          color: "amber",
        });
      }
    });

    if (totalSpent < totalLimit * 0.75) {
      insights.push({
        type: "success",
        icon: CheckCircle,
        message: `Great job! ${formatCurrency(
          remaining
        )} remaining in total budget`,
        color: "emerald",
      });
    }

    return insights.slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 md:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Budget Planner
          </h1>
          <p className="text-slate-400">
            Track and manage your spending across categories
          </p>
        </div>

        {/* Overall Budget Card */}
        <div className="relative p-8 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 backdrop-blur-xl overflow-hidden mb-8">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-2">
                  Total Budget
                </p>
                <p className="text-4xl font-black text-white">
                  {formatCurrency(totalLimit)}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium mb-2">
                  Total Spent
                </p>
                <p className="text-4xl font-black text-blue-400">
                  {formatCurrency(totalSpent)}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium mb-2">
                  Remaining
                </p>
                <p
                  className={`text-4xl font-black ${
                    remaining >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {formatCurrency(remaining)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 text-sm font-medium">
                  Overall Progress
                </span>
                <span
                  className={`text-sm font-bold ${
                    overallPct > 100
                      ? "text-red-400"
                      : overallPct > 75
                      ? "text-amber-400"
                      : "text-emerald-400"
                  }`}
                >
                  {overallPct}%
                </span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all ${
                    overallPct > 100
                      ? "bg-gradient-to-r from-red-500 to-pink-500"
                      : overallPct > 75
                      ? "bg-gradient-to-r from-amber-500 to-orange-500"
                      : "bg-gradient-to-r from-emerald-500 to-cyan-500"
                  }`}
                  style={{ width: `${Math.min(100, overallPct)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Add Budget Form */}
            {showAddForm && (
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 backdrop-blur-xl overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-white mb-6">
                    Add New Budget
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-200">
                          Category
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-700/30 border border-slate-600/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        >
                          {Object.entries(CATEGORY_DISPLAY_NAMES).map(
                            ([key, name]) => (
                              <option
                                key={key}
                                value={key}
                                className="bg-slate-800"
                              >
                                {name}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-200">
                          Monthly Limit
                        </label>
                        <input
                          type="number"
                          name="limit_amount"
                          value={formData.limit_amount}
                          onChange={handleFormChange}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          required
                          className="w-full px-4 py-3 rounded-xl bg-slate-700/30 border border-slate-600/50 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleFormSubmit}
                        className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 transition-all"
                      >
                        Create Budget
                      </button>
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="px-6 py-2 rounded-lg bg-slate-700/50 text-slate-300 font-semibold hover:bg-slate-700 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Budget Form */}
            {editingId && (
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 backdrop-blur-xl overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-white mb-6">
                    Edit Budget
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-200">
                        Monthly Limit
                      </label>
                      <input
                        type="number"
                        value={editFormData.limit_amount}
                        onChange={(e) =>
                          setEditFormData((prev) => ({
                            ...prev,
                            limit_amount: e.target.value,
                          }))
                        }
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 rounded-xl bg-slate-700/30 border border-slate-600/50 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleEditFormSubmit}
                        className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-6 py-2 rounded-lg bg-slate-700/50 text-slate-300 font-semibold hover:bg-slate-700 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Category Budgets */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-white">
                  Category Budgets
                </h2>
                {!showAddForm && !editingId && (
                  <button
                    onClick={handleAddClick}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    Add Budget
                  </button>
                )}
              </div>

              {budgets.length === 0 ? (
                <div className="relative p-12 rounded-2xl bg-gradient-to-br from-slate-800/40 to-slate-800/20 border border-slate-700/50 backdrop-blur-xl text-center">
                  <p className="text-slate-400 mb-4">No budgets yet</p>
                  <button
                    onClick={handleAddClick}
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold"
                  >
                    <Plus className="w-5 h-5" />
                    Create Your First Budget
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {budgets.map((budget) => {
                    const spending = spendingData.find(
                      (s) => s.category === budget.category
                    );
                    const spent = spending ? parseFloat(spending.spending) : 0;
                    const limit = parseFloat(budget.limit_amount);
                    const pct =
                      limit > 0 ? Math.round((spent / limit) * 100) : 0;
                    const clamped = Math.min(100, pct);
                    const icon = CATEGORY_ICONS[budget.category] || "📌";
                    const gradientClass =
                      CATEGORY_COLORS[budget.category] ||
                      "from-slate-500 to-gray-500";
                    const displayName =
                      CATEGORY_DISPLAY_NAMES[budget.category] ||
                      budget.category;

                    return (
                      <div
                        key={budget.id}
                        className="relative p-6 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 backdrop-blur-xl overflow-hidden group hover:border-slate-600/50 transition-all"
                      >
                        <div
                          className={`absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br ${gradientClass} opacity-10 group-hover:opacity-20 rounded-full blur-3xl pointer-events-none transition-all`}
                        ></div>

                        <div className="relative z-10">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center shadow-lg`}
                              >
                                <span className="text-xl">{icon}</span>
                              </div>
                              <div>
                                <h3 className="text-lg font-black text-white">
                                  {displayName}
                                </h3>
                                <p className="text-slate-400 text-xs">
                                  Monthly budget
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditBudget(budget.id)}
                                className="p-2 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-600 hover:text-white transition-all"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteBudget(budget.id)}
                                className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Amount */}
                          <div className="mb-4 pb-4 border-b border-slate-700/50">
                            <p className="text-slate-400 text-xs font-medium mb-1">
                              SPENDING
                            </p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-black text-white">
                                {formatCurrency(spent)}
                              </span>
                              <span className="text-slate-400 text-sm">
                                of {formatCurrency(limit)}
                              </span>
                            </div>
                          </div>

                          {/* Progress */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400 text-xs font-medium">
                                PROGRESS
                              </span>
                              <span
                                className={`text-sm font-bold px-3 py-1 rounded-full ${
                                  pct > 100
                                    ? "bg-red-500/20 text-red-400"
                                    : pct > 75
                                    ? "bg-amber-500/20 text-amber-400"
                                    : "bg-emerald-500/20 text-emerald-400"
                                }`}
                              >
                                {pct}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-700/50 rounded-full h-2.5 overflow-hidden">
                              <div
                                className={`h-2.5 rounded-full transition-all ${
                                  pct > 100
                                    ? "bg-gradient-to-r from-red-500 to-pink-500"
                                    : pct > 75
                                    ? "bg-gradient-to-r from-amber-500 to-orange-500"
                                    : "bg-gradient-to-r from-emerald-500 to-cyan-500"
                                }`}
                                style={{ width: `${clamped}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Insights */}
          <div className="relative p-6 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 backdrop-blur-xl overflow-hidden h-fit sticky top-24">
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-700/50">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-black text-white">Insights</h3>
              </div>

              <div className="space-y-3">
                {getInsights().length > 0 ? (
                  getInsights().map((insight, idx) => {
                    const Icon = insight.icon;
                    const colorMap = {
                      red: "bg-red-500/10 border-red-500/30 text-red-300",
                      amber:
                        "bg-amber-500/10 border-amber-500/30 text-amber-300",
                      emerald:
                        "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
                    };
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border backdrop-blur-sm ${
                          colorMap[insight.color]
                        }`}
                      >
                        <div className="flex gap-2 text-sm">
                          <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <p>{insight.message}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-3 rounded-lg border bg-blue-500/10 border-blue-500/30 text-blue-300 text-sm">
                    <div className="flex gap-2">
                      <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <p>Create a budget to get started!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
