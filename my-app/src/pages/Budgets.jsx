import { useState, useEffect } from 'react';
import { budgetsAPI } from '../services/api';
import { formatCurrency, getCurrency } from '../utils/currency';

const CATEGORY_ICONS = {
  'food': '🛒',
  'transport': '🚌',
  'entertainment': '🎬',
  'utilities': '⚡',
  'education': '🎓',
  'health': '⚕️',
  'shopping': '🛍️',
  'other': '🧾',
};

const CATEGORY_COLORS = {
  'food': { bg: 'bg-amber-100', text: 'text-amber-600' },
  'transport': { bg: 'bg-green-100', text: 'text-green-600' },
  'entertainment': { bg: 'bg-red-100', text: 'text-red-600' },
  'utilities': { bg: 'bg-blue-100', text: 'text-blue-600' },
  'education': { bg: 'bg-purple-100', text: 'text-purple-600' },
  'health': { bg: 'bg-pink-100', text: 'text-pink-600' },
  'shopping': { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  'other': { bg: 'bg-gray-100', text: 'text-gray-600' },
};

const CATEGORY_DISPLAY_NAMES = {
  'food': 'Food & Groceries',
  'transport': 'Transport',
  'entertainment': 'Entertainment',
  'utilities': 'Utilities',
  'education': 'Education',
  'health': 'Health & Medical',
  'shopping': 'Shopping',
  'other': 'Other',
};

export default function Budgets() {
  const [currency, setCurrency] = useState(getCurrency());
  const [budgets, setBudgets] = useState([]);
  const [spendingData, setSpendingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ category: 'food', limit_amount: '' });
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ category: '', limit_amount: '' });
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Listen for currency changes
  useEffect(() => {
    const handleStorageChange = () => {
      setCurrency(getCurrency());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [budgetsResult, spendingResult] = await Promise.all([
          budgetsAPI.getAll(),
          budgetsAPI.spending_vs_budget?.() || 
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/budgets/spending_vs_budget/`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          }).then(r => r.json()).then(data => ({ success: true, data }))
        ]);

        if (budgetsResult.success && Array.isArray(budgetsResult.data)) {
          setBudgets(budgetsResult.data);
        } else {
          setError('Failed to load budgets');
        }

        if (spendingResult.success && Array.isArray(spendingResult.data)) {
          setSpendingData(spendingResult.data);
        }
      } catch (err) {
        console.error('Error fetching budget data:', err);
        setError('Error loading budgets');
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetData();
  }, []);

  const handleAddClick = () => {
    setShowAddForm(true);
    setFormData({ category: 'food', limit_amount: '' });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'limit_amount' ? value : value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.limit_amount || parseFloat(formData.limit_amount) <= 0) {
      setError('Please enter a valid budget limit');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const result = await budgetsAPI.create({
        category: formData.category,
        limit_amount: parseFloat(formData.limit_amount)
      });

      if (result.success) {
        setBudgets([...budgets, result.data]);
        setShowAddForm(false);
        setFormData({ category: 'food', limit_amount: '' });
      } else {
        setError(result.error || 'Failed to create budget');
      }
    } catch (err) {
      console.error('Error creating budget:', err);
      setError('Error creating budget');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditBudget = (id, category) => {
    const currentBudget = budgets.find(b => b.id === id);
    if (!currentBudget) return;
    
    setEditingId(id);
    setEditFormData({ 
      category,
      limit_amount: String(currentBudget.limit_amount) 
    });
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!editFormData.limit_amount || parseFloat(editFormData.limit_amount) <= 0) {
      setError('Please enter a valid budget limit');
      return;
    }

    try {
      setEditSubmitting(true);
      setError(null);

      const result = await budgetsAPI.update(editingId, {
        category: editFormData.category,
        limit_amount: parseFloat(editFormData.limit_amount)
      });

      if (result.success) {
        setBudgets(budgets.map(b => b.id === editingId ? result.data : b));
        setEditingId(null);
        setEditFormData({ category: '', limit_amount: '' });
      } else {
        setError(result.error || 'Failed to update budget');
      }
    } catch (err) {
      console.error('Error updating budget:', err);
      setError('Error updating budget');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({ category: '', limit_amount: '' });
  };

  const handleDeleteBudget = async (id) => {
    if (!confirm('Are you sure you want to delete this budget?')) return;

    try {
      const result = await budgetsAPI.delete(id);
      // Delete endpoint returns 204 No Content or empty response
      // We should still remove it from state regardless
      setBudgets(budgets.filter(b => b.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting budget:', err);
      // Still remove from UI even if API response is empty
      setBudgets(budgets.filter(b => b.id !== id));
    }
  };

  // Calculate totals from spending data
  const totalLimit = budgets.reduce((sum, b) => sum + parseFloat(b.limit_amount || 0), 0);
  const totalSpent = spendingData.reduce((sum, s) => sum + parseFloat(s.spending || 0), 0);
  const remaining = totalLimit - totalSpent;
  const overallPct = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;

  // Get insights from spending data
  const getInsights = () => {
    const insights = [];
    
    spendingData.forEach(item => {
      const pct = item.percentage || 0;
      const displayName = CATEGORY_DISPLAY_NAMES[item.category] || item.category;
      const spent = parseFloat(item.spending);
      const limit = parseFloat(item.budget_limit);
      const remaining = limit - spent;

      if (item.over_budget) {
        insights.push({
          type: 'danger',
          icon: '🚨',
          message: `You've gone over your <strong>'${displayName}'</strong> budget by $${Math.abs(remaining).toFixed(2)}.`,
          bgColor: 'bg-red-50 dark:bg-red-900/10',
          textColor: 'text-red-900 dark:text-red-200'
        });
      } else if (pct > 75) {
        insights.push({
          type: 'warning',
          icon: '⚠️',
          message: `You're close to your <strong>'${displayName}'</strong> budget. Only $${remaining.toFixed(2)} left!`,
          bgColor: 'bg-amber-50 dark:bg-amber-900/10',
          textColor: 'text-amber-900 dark:text-amber-200'
        });
      }
    });

    // Add positive insight if under budget
    if (totalSpent < totalLimit * 0.75) {
      insights.push({
        type: 'success',
        icon: '✅',
        message: `Great job! You're well within budget with <strong>$${remaining.toFixed(2)}</strong> remaining.`,
        bgColor: 'bg-green-50 dark:bg-green-900/10',
        textColor: 'text-green-900 dark:text-green-200'
      });
    }

    return insights.slice(0, 3); // Show up to 3 insights
  };

  if (loading) {
    return (
      <main className="flex-1 px-4 sm:px-6 md:px-10 py-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-600 dark:text-gray-300">Loading budgets...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-4 sm:px-6 md:px-10 py-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap justify-between gap-3">
            <p className="text-black dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">Budget Planner</p>
          </div>
        </div>

        {error && (
          <div className="bg-yellow-50 dark:bg-yellow-500/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-500/50">
            <p className="text-yellow-700 dark:text-yellow-300">⚠️ {error}</p>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Overall Budget Summary */}
            <section className="p-6 @container bg-white dark:bg-black/20 rounded-xl shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Overall Budget</p>
                  <p className="text-black dark:text-white text-3xl font-bold">{formatCurrency(remaining, currency)} <span className="text-lg font-medium text-gray-600 dark:text-gray-300">Remaining</span></p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 dark:text-gray-400">You've spent {formatCurrency(totalSpent, currency)} of {formatCurrency(totalLimit, currency)}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between mb-2">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Progress</div>
                  <div className="text-sm font-semibold">{overallPct}%</div>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-3 ${overallPct > 100 ? 'bg-red-500' : overallPct > 75 ? 'bg-amber-500' : 'bg-gradient-to-r from-green-400 to-blue-500'}`}
                    style={{ width: `${Math.min(100, overallPct)}%` }}
                  ></div>
                </div>
              </div>
            </section>

            {/* Add Budget Form */}
            {showAddForm && (
              <section className="p-6 bg-white dark:bg-black/20 rounded-xl shadow-sm border-2 border-primary/30">
                <h3 className="text-lg font-bold text-black dark:text-white mb-4">Add New Budget Category</h3>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        {Object.entries(CATEGORY_DISPLAY_NAMES).map(([key, name]) => (
                          <option key={key} value={key}>{name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Monthly Budget Limit ($)</label>
                      <input
                        type="number"
                        name="limit_amount"
                        value={formData.limit_amount}
                        onChange={handleFormChange}
                        placeholder="e.g., 500"
                        step="0.01"
                        min="0"
                        required
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center justify-center gap-2 h-10 px-6 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      <span>{submitting ? '✨' : '✅'}</span>
                      <span>{submitting ? 'Creating...' : 'Create Budget'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="flex items-center justify-center gap-2 h-10 px-6 rounded-lg bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-bold hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                    >
                      <span>Cancel</span>
                    </button>
                  </div>
                </form>
              </section>
            )}

            {/* Edit Budget Form */}
            {editingId && (
              <section className="p-6 bg-white dark:bg-black/20 rounded-xl shadow-sm border-2 border-blue-500/30">
                <h3 className="text-lg font-bold text-black dark:text-white mb-4">Edit Budget</h3>
                <form onSubmit={handleEditFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Monthly Budget Limit ($)</label>
                    <input
                      type="number"
                      value={editFormData.limit_amount}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, limit_amount: e.target.value }))}
                      placeholder="e.g., 500"
                      step="0.01"
                      min="0"
                      required
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={editSubmitting}
                      className="flex items-center justify-center gap-2 h-10 px-6 rounded-lg bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                      <span>{editSubmitting ? '✨' : '✅'}</span>
                      <span>{editSubmitting ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex items-center justify-center gap-2 h-10 px-6 rounded-lg bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-bold hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                    >
                      <span>Cancel</span>
                    </button>
                  </div>
                </form>
              </section>
            )}

            {/* Category Budgets Section */}
            <section className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-black dark:text-white">Category Budgets</h3>
                {!showAddForm && (
                  <button 
                    onClick={handleAddClick}
                    className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
                  >
                    <span className="text-lg">➕</span>
                    <span>Add Category</span>
                  </button>
                )}
              </div>

              {budgets.length === 0 ? (
                <div className="bg-white dark:bg-black/20 rounded-xl shadow-sm p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No budgets yet. Create your first budget to get started!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {budgets.map((b) => {
                    const spending = spendingData.find(s => s.category === b.category);
                    const spent = spending ? parseFloat(spending.spending) : 0;
                    const limit = parseFloat(b.limit_amount);
                    const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0;
                    const clamped = Math.min(100, pct);
                    const icon = CATEGORY_ICONS[b.category] || '🧾';
                    const colors = CATEGORY_COLORS[b.category] || { bg: 'bg-gray-100', text: 'text-gray-600' };
                    const displayName = CATEGORY_DISPLAY_NAMES[b.category] || b.category;

                    return (
                      <article key={b.id} className="bg-white dark:bg-black/20 rounded-xl shadow-sm p-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`${colors.bg} rounded-lg w-10 h-10 flex items-center justify-center`}>
                              <span className="text-lg">{icon}</span>
                            </div>
                            <span className="font-bold text-black dark:text-white">{displayName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold px-2 py-1 rounded ${
                              pct > 100 ? 'bg-red-100 dark:bg-red-600/20 text-red-700' 
                              : pct > 75 ? 'bg-amber-100 dark:bg-amber-600/20 text-amber-700' 
                              : 'bg-green-100 dark:bg-green-600/20 text-green-700'
                            }`}>
                              {pct}%
                            </span>
                            <button 
                              aria-label={`Edit ${displayName}`}
                              onClick={() => {
                                setEditingId(b.id);
                                setEditFormData({ 
                                  category: b.category,
                                  limit_amount: String(b.limit_amount) 
                                });
                              }}
                              className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-white/10"
                            >
                              <span className="text-sm">✏️</span>
                            </button>
                            <button 
                              aria-label={`Delete ${displayName}`}
                              onClick={() => handleDeleteBudget(b.id)}
                              className="rounded-full p-1 hover:bg-red-100 dark:hover:bg-red-600/20 text-red-600"
                            >
                              <span className="text-sm">🗑️</span>
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-baseline">
                            <p className="text-black dark:text-white text-lg font-semibold">
                              {formatCurrency(spent, currency)} <span className="text-sm text-gray-500 dark:text-gray-400">/ {formatCurrency(limit, currency)}</span>
                            </p>
                          </div>
                          <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                            <div 
                              className={`${
                                pct > 100 ? 'bg-red-500' 
                                : pct > 75 ? 'bg-amber-500' 
                                : 'bg-green-500'
                              } h-2`}
                              style={{ width: `${clamped}%` }}
                            ></div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* AI Insights Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-black/20 rounded-xl shadow-sm p-6 flex flex-col gap-4 sticky top-28">
              <div className="flex items-center gap-3">
                <span className="text-primary">✨</span>
                <h3 className="text-lg font-bold text-black dark:text-white">Insights</h3>
              </div>
              <div className="flex flex-col gap-4">
                {getInsights().length > 0 ? (
                  getInsights().map((insight, idx) => (
                    <div key={idx} className={`${insight.bgColor} p-4 rounded-lg`}>
                      <p className={`text-sm ${insight.textColor}`}>
                        <span className="mr-2">{insight.icon}</span>
                        <span dangerouslySetInnerHTML={{ __html: insight.message }} />
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
                    <p className="text-sm text-blue-900 dark:text-blue-200">
                      <span className="mr-2">💡</span>
                      Create a budget to get started with budget tracking!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
