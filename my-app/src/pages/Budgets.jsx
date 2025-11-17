import { useState } from 'react';

const INITIAL_BUDGETS = [
  { id: 1, name: 'Groceries', spent: 350.5, limit: 400, icon: '🛒', bgClass: 'bg-amber-100', textClass: 'text-amber-600' },
  { id: 2, name: 'Transport', spent: 45, limit: 100, icon: '🚌', bgClass: 'bg-green-100', textClass: 'text-green-600' },
  { id: 3, name: 'Entertainment', spent: 162, limit: 150, icon: '🎬', bgClass: 'bg-red-100', textClass: 'text-red-600' },
  { id: 4, name: 'Subscriptions', spent: 49.99, limit: 50, icon: '💳', bgClass: 'bg-blue-100', textClass: 'text-blue-600' },
];

export default function Budgets() {
  const [period, setPeriod] = useState('Monthly');
  const [budgets, setBudgets] = useState(INITIAL_BUDGETS);

  function addCategory() {
    const name = prompt('New category name (e.g. Dining)');
    if (!name) return;
    const limitRaw = prompt('Monthly budget limit (number)', '100');
    const limit = Number(limitRaw) || 0;
    const newBudget = {
      id: Date.now(),
      name,
      spent: 0,
      limit,
      icon: '🧾',
      bgClass: 'bg-gray-100',
      textClass: 'text-gray-700',
    };
    setBudgets((s) => [newBudget, ...s]);
  }

  function editBudget(id) {
    const b = budgets.find((x) => x.id === id);
    if (!b) return;
    const limitRaw = prompt(`New limit for ${b.name}`, String(b.limit));
    const limit = Number(limitRaw);
    if (!isNaN(limit)) setBudgets((s) => s.map((x) => (x.id === id ? { ...x, limit } : x)));
  }

  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const remaining = totalLimit - totalSpent;
  const overallPct = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;

  return (
    <main className="flex-1 px-4 sm:px-6 md:px-10 py-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap justify-between gap-3">
            <p className="text-black dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">Budget Planner</p>
          </div>

          <div className="flex h-10 w-full sm:w-auto items-center justify-center rounded-lg bg-gray-200 dark:bg-white/10 p-1">
            <button
              aria-pressed={period === 'Monthly'}
              onClick={() => setPeriod('Monthly')}
              className={`flex cursor-pointer h-full items-center justify-center px-4 rounded-lg text-sm font-medium leading-normal ${
                period === 'Monthly' ? 'bg-white dark:bg-black/20 text-black dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <span className="truncate">Monthly</span>
            </button>
            <button
              aria-pressed={period === 'Weekly'}
              onClick={() => setPeriod('Weekly')}
              className={`flex cursor-pointer h-full items-center justify-center px-4 rounded-lg text-sm font-medium leading-normal ${
                period === 'Weekly' ? 'bg-white dark:bg-black/20 text-black dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <span className="truncate">Weekly</span>
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Overall Budget Summary */}
            <section className="p-6 @container bg-white dark:bg-black/20 rounded-xl shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Overall Budget</p>
                  <p className="text-black dark:text-white text-3xl font-bold">${remaining.toFixed(2)} <span className="text-lg font-medium text-gray-600 dark:text-gray-300">Remaining</span></p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 dark:text-gray-400">You've spent ${totalSpent.toFixed(2)} of ${totalLimit.toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between mb-2">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Progress</div>
                  <div className="text-sm font-semibold">{overallPct}%</div>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-3 bg-gradient-to-r from-green-400 to-blue-500" style={{ width: `${Math.min(100, overallPct)}%` }}></div>
                </div>
              </div>
            </section>

            {/* Category Budgets Section */}
            <section className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-black dark:text-white">Category Budgets</h3>
                <button onClick={addCategory} className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors">
                  <span className="text-lg">➕</span>
                  <span>Add Category</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {budgets.map((b) => {
                  const pct = b.limit > 0 ? Math.round((b.spent / b.limit) * 100) : 0;
                  const clamped = Math.min(100, pct);
                  const pctColor = pct > 100 ? 'bg-red-500 text-red-600' : pct > 75 ? 'bg-amber-500 text-amber-600' : 'bg-green-500 text-green-600';

                  return (
                    <article key={b.id} className="bg-white dark:bg-black/20 rounded-xl shadow-sm p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`${b.bgClass} rounded-lg w-10 h-10 flex items-center justify-center`}> 
                            <span className="text-lg">{b.icon}</span>
                          </div>
                          <span className="font-bold text-black dark:text-white">{b.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold px-2 py-1 rounded ${pct > 100 ? 'bg-red-100 dark:bg-red-600/20 text-red-700' : pct > 75 ? 'bg-amber-100 dark:bg-amber-600/20 text-amber-700' : 'bg-green-100 dark:bg-green-600/20 text-green-700'}`}>{pct}%</span>
                          <button aria-label={`Edit ${b.name}`} onClick={() => editBudget(b.id)} className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-white/10">
                            <span className="text-sm">✏️</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-baseline">
                          <p className="text-black dark:text-white text-lg font-semibold">${b.spent.toFixed(2)} <span className="text-sm text-gray-500 dark:text-gray-400">/ ${b.limit}</span></p>
                        </div>
                        <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                          <div className={`${pct > 100 ? 'bg-red-500' : pct > 75 ? 'bg-amber-500' : 'bg-green-500'} h-2`} style={{ width: `${clamped}%` }}></div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>

          {/* AI Insights Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-black/20 rounded-xl shadow-sm p-6 flex flex-col gap-4 sticky top-28">
              <div className="flex items-center gap-3">
                <span className="text-primary">✨</span>
                <h3 className="text-lg font-bold text-black dark:text-white">AI Insights</h3>
              </div>
              <div className="flex flex-col gap-4">
                <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg">
                  <p className="text-sm text-amber-900 dark:text-amber-200">You're close to your <span className="font-bold">'Groceries'</span> budget for the month. Consider cheaper alternatives for your next shop!</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
                  <p className="text-sm text-green-900 dark:text-green-200">Great job! You saved <span className="font-bold">$20</span> on transport this month compared to your average.</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg">
                  <p className="text-sm text-red-900 dark:text-red-200">You've gone over your <span className="font-bold">'Entertainment'</span> budget. Let's see if we can reallocate funds.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
